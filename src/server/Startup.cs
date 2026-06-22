using System;
using System.Collections.Generic;
using System.IO;
using Cms360.Common;
using Cms360.Contract;
using Cms360.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
using StructureMap;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Server.Kestrel.Transport;
using common.Crypto;
// using Alachisoft.NCache.Web.SessionState;
namespace Cms360.Server
{
    public partial class Startup
    {
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IBackgroundJobClient backgroundJobs)
        {
            AppConfig config = WebApp.Configuration.Get<Cms360.Server.AppConfig>();
            IConfigurationSection logging = WebApp.Configuration.GetSection("Logging");

            if (logging.GetSection("Debug").Exists())
                loggerFactory.AddDebug();

            if (logging.GetSection("Console").Exists())
                loggerFactory.AddConsole(logging.GetSection("Console"));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions()
                {
                    HotModuleReplacement = true,
                    ProjectPath = Path.Combine(Directory.GetCurrentDirectory(), @"..\ui")
                });
            }

            app.UseDefaultFiles();
            app.UseAuthentication();
            app.UseResponseCompression();

            string webRoot = new DirectoryInfo(config.Server.Webroot).FullName;

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(webRoot),
                OnPrepareResponse = (content) =>
                {
                    var cultureService = content.Context.RequestServices.GetRequiredService<CultureService>();
                    cultureService.EnsureCookie(content.Context);
                }
            });

            app.UseMiddleware<NoCacheMiddleware>();
            app.UseMiddleware<FixDetectionMiddleware>();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            app.UseAntiforgeryMiddleware(config.Server.AntiForgery.ClientName);
            app.UseRequestLocalization();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ems 360 V2");
                c.RoutePrefix = "swagger/ui";
                c.DocExpansion(DocExpansion.None);
            });

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseCors("AllowPolicy");

            app.UseMvc();
            app.UseHistoryModeMiddleware(webRoot, config.Server.Areas);

            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                using (var dbContext = serviceScope.ServiceProvider.GetService<DbContextBase>())
                {
                    ICryptoService crypto = app.ApplicationServices.GetRequiredService<ICryptoService>();
                    // dbContext.Database.Migrate();
                    // dbContext.EnsureSeedData(crypto);
                }
            }

            app.UseHangfireServer();
            app.UseFileServer();
        }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {

            var config = WebApp.Configuration.Get<Cms360.Server.AppConfig>();

            // Read from appsettings.json
            var allowedOrigins = WebApp.Configuration.GetSection("AllowedOrigins").Get<string[]>();

            services.AddCors(options =>
    {
        options.AddPolicy("AllowPolicy", builder =>
        {
            if (allowedOrigins != null && allowedOrigins.Length > 0)
            {
                builder.WithOrigins(allowedOrigins)
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
            }
            else
            {
                // fallback if not defined
                builder.AllowAnyOrigin()
                       .AllowAnyHeader()
                       .AllowAnyMethod();
            }
        });
    });

            services.AddSingleton(new EncryptionService("RArKI$B_RUhp2V7S"));


            services.AddMvc();

            services.AddHangfire(configuration => configuration
                    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                    .UseSimpleAssemblyNameTypeSerializer()
                    .UseRecommendedSerializerSettings()
                    .UseMemoryStorage())
                    .AddHangfireServer();

            services.AddOptions();

            services.Configure<AppConfig>(WebApp.Configuration); // root web configuration
            services.Configure<Cms360.Service.Config>(WebApp.Configuration.GetSection("service")); // services configuration
            services.Configure<Cms360.Service.TokenProviderConfig>(WebApp.Configuration.GetSection("service:tokenProvider")); // token provider configuration
            services.Configure<Cms360.Data.Config>(WebApp.Configuration.GetSection("data")); // configuration
            services.Configure<Cms360.Server.Config>(WebApp.Configuration.GetSection("server"));
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = System.IO.Compression.CompressionLevel.Optimal);
            services.AddResponseCompression(options =>
            {
                options.MimeTypes = new[] {
                // Default
                "text/plain",
                "text/css",
                "application/javascript",
                "text/html",
                "application/xml",
                "text/xml",
                "application/json",
                "text/json",
                // Custom
                "image/svg+xml"
                };
            });

            services.AddMemoryCache();
            services.AddDetection();
            services.ConfigureAuthentication(config.Service.TokenProvider, new string[] { "admin" });
            services.ConfigureMvc(config.Server.AntiForgery);

            services.AddDbContext<NpgSqlContext>(options =>
            {
                string assemblyName = typeof(Cms360.Data.Config).GetAssemblyName();
                options.UseLazyLoadingProxies()
                    .UseNpgsql(config.Data.ConnectionString, s => s.MigrationsAssembly(assemblyName));
            });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Title = "Ems 360 Api",
                    Version = "v1",
                    Description = "Campus Management System for Campus Managment System",
                    Contact = new Contact
                    {
                        Name = "Bilal Anwar (TL), Umer Khan, Muhammad Salman Tariq, Zaheer Afzal, Haider Ali, Fahad Sattar, Rao Bilal, Ehtesham Abad",
                        Email = string.Empty,
                    }
                });

                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    In = "header",
                    Name = "Authorization",
                    Type = "apiKey"
                });

                c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>> { { "Bearer", new string[] { } } });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            services.ConfigureSwaggerGen(options =>
            {
                options.CustomSchemaIds(x => x.FullName);
            });

            var container = new Container(c =>
            {
                var registry = new Registry();

                registry.IncludeRegistry<Cms360.Common.ContainerRegistry>();
                registry.IncludeRegistry<Cms360.Data.ContainerRegistry>();
                registry.IncludeRegistry<Cms360.Service.ContainerRegistry>();
                registry.IncludeRegistry<Cms360.Server.ContainerRegistry>();

                c.AddRegistry(registry);
                c.Populate(services);
            });

            return container.GetInstance<IServiceProvider>();
        }
    }
}