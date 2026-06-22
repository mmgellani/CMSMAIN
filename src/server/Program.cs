using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Cms360.Server
{
    public class WebApp
    {
        internal static IConfigurationRoot Configuration;

        public static void Main(string[] args)
        {
            var root = Directory.GetCurrentDirectory();

            Configuration = new ConfigurationBuilder()
                .SetBasePath(root)
                .AddCms360()
                .Build();

            var host = new WebHostBuilder()
                .UseConfiguration(Configuration)
                .UseKestrel()
                .UseContentRoot(root)
                .UseLibuv()
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}