using Cms360.Contract.Security;

namespace Cms360.Service.Model
{
    public class ExternalLogin : IExternalLogin
    {
        public string AccessToken { get; set; }
        public string ExternalId { get; set; }
        public string Nonce { get; set; }
        public string Username { get; set; }
        public string ProviderId { get; set; }
    }
}