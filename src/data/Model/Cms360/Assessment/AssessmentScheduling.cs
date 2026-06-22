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
    [Table("AssessmentSchedulingDetail", Schema = "Assessment")]
    public partial class AssessmentSchedulingDetail
    {
		[Key]
		[Required]
		public Guid AssessmentSchedulingDetailId { get; set; }
		public Guid AssessmentDetailId { get; set; } 
		public Guid AssessmentSchedulingMasterId { get; set; }  		
		public string FullName { get; set; }
		public string Month { get; set; }
		public decimal Weightage { get; set; }
		public int Order { get; set; }
		public int StatusId { get; set; }

    }
	  public   class AssessmentSchedulingList
    {
		[Key]
		[Required]
		public Guid AssessmentSchedulingMasterId { get; set; }
		public string AssessmentName { get; set; } 
		public decimal TotalWeightage { get; set; }
		public string GradingPolicy { get; set; }
		public string FailCriteris { get; set; }
		public int StatusId { get; set; }
		public Guid AssessmentSchemeMasterId { get; set; }


    }
	public   class MonthList
    {
		[Key]
		[Required]
		public string Key { get; set; }
		public string Value { get; set; } 
	}
}