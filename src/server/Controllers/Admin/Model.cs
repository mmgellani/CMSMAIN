using System;

namespace Cms360.Server.Model
{
    public class UpdateUserStatusOptions
    {
        public string UserName { get; set; }
        public bool Enabled { get; set; }
        public bool Verified { get; set; }
    }
}
