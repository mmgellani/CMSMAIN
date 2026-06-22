using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("CampusEmailLink", Schema = "Registration")]

    public partial class CampusEmailMapping
    {
		[Key]
		[Required]
		public Guid CampusEmailLinkId { get; set; }
        public Guid CampusId { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public int StatusId { get; set; }
		public string OperationName { get; set; }
		public string MailBox { get; set; }
    }
}