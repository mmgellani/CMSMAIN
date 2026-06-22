using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Cms360.Data.Model
{
    [Table("Provider", Schema = "Role")]
    public partial class Provider
    {
        public Provider()
        {
            Users = new HashSet<UserProvider>();
        }

        // [Key]
        public string ProviderId { get; set; }
        public string Description { get; set; }
        public bool Enabled { get; set; }
        public string Name { get; set; }

        public virtual ICollection<UserProvider> Users { get; set; }
    }
}
