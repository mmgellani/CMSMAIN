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
    [Table("AssessmentSchemeDetail", Schema = "Assessment")]
    public partial class AssessmentSchemeDetail
    {
		[Key]
		[Required]
		public Guid AssessmentSchemeDetailId { get; set; }
        public Guid AssessmentSchemeMasterId { get; set; }
        public Guid AssessmentTypeId { get; set; }
         public int ExamCount { get; set; }
        public int Weightage { get; set; }
		public int StatusId { get; set; }

    }

    
    public  class AssessmentSchemeExamType
    {
		[Key]
		[Required]
        public Guid AssessmentTypeId { get; set; }
        public Guid AssessmentCategoryId { get; set; }

        public Guid ExamTypeId { get; set; }
         public string FullName { get; set; }
      

    }

     public partial class AssessmentSchemeMasterData
    {
		[Key]
		[Required]
        public Guid AssessmentSchemeMasterId { get; set; }
        public string AssessmentSchemeName { get; set; }
        public Guid GradingMasterId { get; set; }
        public string Name { get; set; }
         public Guid FailMasterId { get; set; }
        public string FullName { get; set; }
        public int TotalWeightage { get; set; }
        public int StatusId { get; set; }


    }


    public partial class AssessmentSchemeDetailData
    {
		[Key]
		[Required]
        public Guid AssessmentSchemeDetailId { get; set; }
        public Guid AssessmentSchemeMasterId { get; set; }
        public int ExamCount { get; set; }
        public int Weightage { get; set; }
        public Guid AssessmentTypeId { get; set; }
         public Guid AssessmentCategoryId { get; set; }
        public string FullName { get; set; }
         public Guid ExamTypeId { get; set; }
          public string ExamName { get; set; }
          public int StatusId { get; set; }


      

    }
}