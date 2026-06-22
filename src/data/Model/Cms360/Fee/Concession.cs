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
    [Table("Concession", Schema = "Fee")]
    public partial class FeeConcession
    {
		[Key]
		[Required]
		public Guid ConcessionId { get; set; }
		[Required]
		public Guid ZoneId { get; set; }
		[Required]
		public Guid SessionId { get; set; }
		[Required]
		public Guid ProgramId { get; set; }
		[Required]
		public Guid ShiftId { get; set; }
		[Required]
		public Guid ChallanTypeId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
	  [Table("VW_Concession", Schema = "Fee")]
    public partial class FeeConcessionVM
    {
		[Key]
		[Required]
		public Guid ConcessionId { get; set; }
		[Required]
		public Guid ZoneId { get; set; }
		[Required]
		public Guid SessionId { get; set; }
		[Required]
		public Guid ProgramId { get; set; }
		[Required]
		public Guid ShiftId { get; set; }
		[Required]
		public String ShiftName { get; set; }
		[Required]
		public String ZoneName { get; set; }
		[Required]
		public String ProgramName { get; set; }
		[Required]
		public String SessionName { get; set; }
		[Required]
		public String ChallanTypeName { get; set; }
		[Required]
		public Guid ChallanTypeId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}