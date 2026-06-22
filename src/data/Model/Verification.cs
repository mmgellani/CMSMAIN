using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace Cms360.Data.Model
{
    [Table("Verification", Schema = "Role")]
    public partial class Verification
    {
        public Verification()
        {

        }

        // [Key]
        public string Code { get; set; }
        public string Fingerprint { get; set; }
        public string ProviderKey { get; set; }
        public DateTime IssuedAt { get; set; }
        public DateTime? RedeemedAt { get; set; }
        public long UserId { get; set; }
        public virtual User User { get; set; }
    }
}
