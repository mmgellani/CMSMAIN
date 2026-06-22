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
    [Table("ExamType", Schema = "Examination")]
    public partial class ExaminationExamType
    {
		[Key]
		[Required]
		public Guid ExamTypeId { get; set; }
		[Required]
		public string Code { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
	 public partial class ExaminationExamTypeEx
    {
		[Key]
		[Required]
		public Guid ExamTypeId { get; set; }
		public string Code { get; set; }
		public string FullName { get; set; }
		public int StatusId { get; set; }
		public Guid LoggerId { get; set; }

    }
}