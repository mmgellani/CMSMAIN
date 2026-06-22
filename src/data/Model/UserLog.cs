/*
*   Author: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("UserLog", Schema = "Role")]
    public partial class UserLog
    {
        [Key]
        [Required]
        public Guid AuditId { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        public long? UserId { get; set; }

        [Required]
        public string LocalIpPort { get; set; }
        [Required]
        public string PublicIpPort { get; set; }
        public string User { get; set; }
        [Required]
        public string ControllerAction { get; set; }
        public string Operation { get; set; }

    }

    [Table("UserLogEx", Schema = "Role")]
    public partial class UserLogEx
    {
        [Key]
        [Required]
        public Guid AuditId { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        public String DisplayName { get; set; }

        [Required]
        public string LocalIpPort { get; set; }
        [Required]
        public string PublicIpPort { get; set; }
        public string User { get; set; }
        [Required]
        public string ControllerAction { get; set; }
        public string Operation { get; set; }

    }
}