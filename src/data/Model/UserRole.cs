using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("UserRole", Schema = "Role")]
    public partial class UserRole
    {
        public UserRole()
        {

        }

        // [Key]
        public string RoleId { get; set; }

        public long UserId { get; set; }

        public virtual Role Role { get; set; }

        public virtual User User { get; set; }
    }


   
    public class UserRoles
    {
        
        [Key]
        public string Id { get; set; }
        public long UserId { get; set; }



    }



}
