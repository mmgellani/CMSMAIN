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
    [Table("AssessmentSchemeMaster", Schema = "Assessment")]
    public partial class AssessmentSchemeMaster
    {
		[Key]
		[Required]
		public Guid AssessmentSchemeMasterId { get; set; }

        public string FullName { get; set; }	
        public Guid GradingMasterId { get; set; }
        public Guid FailMasterId { get; set; }
        public int TotalWeightage { get; set; }
		public int StatusId { get; set; }

    }
	  [Table("VWAssessmentMaterDataList", Schema = "Assessment")]
    public partial class AssessmentSchemeMasterVM
    {
		[Key]
		[Required]
	public Guid AssessmentSchemeMasterId { get; set; }
        public string FailMasterName { get; set; }
        public Guid GradingMasterId { get; set; }
        public string Name { get; set; }
         public Guid FailMasterId { get; set; }
        public string FullName { get; set; }
        public int TotalWeightage { get; set; }
        public int StatusId { get; set; }

    }

   

}