using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

using System.ComponentModel.DataAnnotations;

namespace Cms360.Data.Model
{
    [Table("RoleSecurityClaim", Schema = "Role")]
    public partial class RoleSecurityClaim
    {
        public RoleSecurityClaim()
        {

        }

        // [Key]
        public string RoleId { get; set; }
        public virtual Role Role { get; set; }
        public string SecurityClaimId { get; set; }
        public virtual SecurityClaim SecurityClaim { get; set; }
        public string Value { get; set; }
    }
}