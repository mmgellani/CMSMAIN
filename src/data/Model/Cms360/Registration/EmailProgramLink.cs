/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("EmailProgramLink", Schema = "Registration")]
    public partial class EmailProgramLink
    {
		[Key]
		[Required]
		public Guid EmailProgramLinkId { get; set; }
		[Required]
		public Guid EmailTemplateId { get; set; }
		[Required]
		public Guid ProgramId { get; set; }
		[Required]
		public string OperationName { get; set; }
		[Required]
		public int StatusId { get; set; }

    }
	 
}