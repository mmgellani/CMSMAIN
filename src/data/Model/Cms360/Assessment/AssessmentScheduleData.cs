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
     public class AssessmentScheduleData
    { 
        [Key]
		[Required]
		public Guid AssessmentSchedulingDetailId { get; set; } 
        public Guid AssessmentSchemeDetailId { get; set; } 
        [Required]
        public string AssessmentCategoryName { get; set; }
        public string Month { get; set; }
        public decimal Weightage { get; set; }
	    public int Order { get; set; }
        public int StatusId { get; set; } 
        public Guid AssessmentSchemeMasterId { get; set; } 
 

    }      

       public class StudentProfileApproved
    { 
        [Key]
		[Required]
		public Guid Ide { get; set; }         
        public Guid AdmissionFormId { get; set; }  
        public Guid ClassId { get; set; }   
        public Guid AssessmentScheduleId { get; set; }  
        public string Month { get; set; }
        public string AssessmentName { get; set; }
        public decimal Weightage { get; set; }
	    public decimal TotalMarks { get; set; }
        public decimal ObtainMarks { get; set; }
        public decimal WeightedScore { get; set; }
        public decimal WeightedPercentage { get; set; }
        public decimal AggregatePercentage { get; set; }
    }   

    public class StudentProfileUnApproved
    { 
        [Key]
		[Required]
		public Guid Ide { get; set; }       
        public Guid AdmissionFormId { get; set; }  
        public Guid ClassId { get; set; }   
        public Guid AssessmentScheduleId { get; set; }  
        public string Month { get; set; }
        public string AssessmentName { get; set; }
        public decimal Weightage { get; set; }
	    public decimal TotalMarks { get; set; }
        public decimal ObtainMarks { get; set; }
        public decimal WeightedScore { get; set; }
        public decimal WeightedPercentage { get; set; } 
    }    
      public class StudentProfileCourseView
    { 
        [Key]
		[Required]
		public Guid Ide { get; set; }       
        public Guid AdmissionFormId { get; set; }  
        public Guid ClassId { get; set; }   
        public Guid CourseId { get; set; }  
        public string Course { get; set; }
        public string Month { get; set; }
        public string AssessmentName { get; set; }
	    public decimal Weightage { get; set; }
        public decimal TotalMarks { get; set; }
        public decimal ObtainMarks { get; set; }
        public decimal MarkesPercentage { get; set; } 
        public string Grade { get; set; } 
        public string OverAllRemark { get; set; }

    }      
}