using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

using System.ComponentModel.DataAnnotations;
namespace Cms360.Data.Model
{
    [Table("UserProvider", Schema = "Role")]
    public partial class UserProvider
    {
        // [Key]
        public string ProviderId { get; set; }
        public long UserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ExternalId { get; set; }

        public virtual Provider Provider { get; set; }
        public virtual User User { get; set; }
    }
}
