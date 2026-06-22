using System.IO;
using Microsoft.Extensions.Options;
using Cms360.Server.Model;

namespace Cms360.Server
{
    public class LocalizationResolverOptions : IConfigureOptions<LocalizationOptions>
    {
        private readonly Config config;

        public LocalizationResolverOptions(IOptions<Cms360.Server.Config> config)
        {
            this.config = config.Value;
        }

        public void Configure(LocalizationOptions options)
        {
            options.Directory = new DirectoryInfo("./resources");
            options.Pattern = "{0}.json";
        }
    }
}