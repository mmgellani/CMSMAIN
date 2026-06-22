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
    [Table("ModelPapers", Schema = "EL")]
    public partial class ELModelPapers
    {
		[Key]
		[Required]
		public Guid ModelPaperId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int TotalMarks { get; set; }
		[Required]
		public int CorrectCredit { get; set; }
		[Required]
		public int IncorrectCredit { get; set; }
		[Required]
		public int SkippedCredit { get; set; }
		[Required]
		public int TestTime { get; set; }
	[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}