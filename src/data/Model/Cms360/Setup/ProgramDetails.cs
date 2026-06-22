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
    [Table("ProgramDetails", Schema = "Setup")]
    public partial class SetupProgramDetails
    {
		[Key]
		[Required]
		public Guid ProgramDetailId { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public string Code { get; set; }
		[Required]
		public Guid ProgramId { get; set; }
		[Required]
		public Guid ShiftId { get; set; }
		[Required]
		public Guid MediumId { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }

	[Table("VW-ProgramDetail", Schema = "Setup")]
    public partial class SetupProgramDetailsVM
    {
		[Key]
		[Required]
		public Guid ProgramDetailId { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public string Code { get; set; }
		[Required]
		public Guid ProgramId { get; set; }
		[Required]
		public Guid ShiftId { get; set; }
		[Required]
		public Guid MediumId { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		public string ShiftName { get; set; }
		public string MediumName { get; set; }
		public string FullName { get; set; }

    }
}