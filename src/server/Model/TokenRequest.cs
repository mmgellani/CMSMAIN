namespace Cms360.Server.Model
{
    public class TokenRequest
    {
        public string Username { get; set; }
        public string password { get; set; }
    }
    public class TokenRequestEx
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserEmail { get; set; }
        public string DeviceId { get; set; }
        public string DeviceIP { get; set; }
        public string LoginWith { get; set; } 
    }
}