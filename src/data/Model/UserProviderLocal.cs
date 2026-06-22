using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("UserProviderLocal", Schema = "Role")]
    public partial class UserProviderLocal : UserProvider
    {
        public UserProviderLocal()
        {
            
        }
        
        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }
    }
}
