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
    [Table("Class", Schema = "Setup")]
    public partial class SetupClass
    {
		[Key]
		[Required]
		public Guid ClassId { get; set; }
		[Required]
		public string FullName { get; set; }
		public string Description { get; set; }
		[Required]
		public string ClassCode { get; set; }
		[Required]
		public short IsAdmissionTest { get; set; }
		public short IsInterview { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}