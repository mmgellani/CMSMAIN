namespace Cms360.Server
{
    public class AppConfig
    {
        public AppConfig()
        {
        }

        public Cms360.Data.Config Data { get; set; }
        public Cms360.Server.Config Server { get; set; }
        public Cms360.Service.Config Service { get; set; }
    }
}
