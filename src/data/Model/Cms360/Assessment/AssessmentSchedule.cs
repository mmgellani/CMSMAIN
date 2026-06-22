using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("AssessmentSchedule", Schema = "Assessment")]
    public partial class AssessmentSchedule
    {
       [Key]
        [Column("AssessmentScheduleId")]
        public Guid AssessmentScheduleId { get; set; }

        [Column("ScheduleDate")]
        [Required]
        public DateTime ScheduleDate { get; set; }

        [Column("TotalMarks")]
        public int? TotalMarks { get; set; }

        [Column("AssessmentSchedulingDetailId")]
        public Guid? AssessmentSchedulingDetailId { get; set; }

        [Column("AssessmentSectionMapId")]
        public Guid? AssessmentSectionMapId { get; set; }

        [Column("AssessmentStatus")]
        public int? AssessmentStatus { get; set; }

        [Column("StatusId")]
        [Required]
        public int StatusId { get; set; }

        [Column("ProgramCourseLinkId")]
        public Guid? ProgramCourseLinkId { get; set; }


        

    }


    public class AssessmentViewList
{
    [Key]
    public Guid AssessmentScheduleId { get; set; }
    public DateTime ScheduleDate { get; set; }
    public int TotalMarks { get; set; }
    public int AssessmentStatus { get; set; }
    public string AssessmentName { get; set; }
    public string Month { get; set; }
    public int Weightage { get; set; }
    public string SectionName { get; set; }
    public Guid SectionId { get; set; }
    public Guid GradingMasterId { get; set; }
    public Guid FailMasterId { get; set; }
    public string GradingCriteria { get; set; }
    public string FailCriteria { get; set; }
    public Guid AssessmentSchedulingDetailId { get; set; }
    public Guid AssessmentSectionMapId { get; set; }
    public Guid ProgramCourseLinkId { get; set; }
    public int StatusId { get; set; }
}

    public class AssessmentScedileViewList
{
    [Key]
    public Guid AssessmentScheduleId { get; set; }
    public DateTime ScheduleDate { get; set; }
    public int TotalMarks { get; set; }
    
    public Guid AssessmentSchedulingDetailId { get; set; }
    public Guid CourseId { get; set; }

    public string CourseName { get; set; }

    public Guid ProgramCourseLinkId { get; set; }
    public Guid AssessmentSectionMapId { get; set; }

        public int StatusId { get; set; }

    public int AssessmentStatus { get; set; }

}

public class GetAssessmentView
{
    [Key]
    public Guid AssessmentSchedulingDetailId { get; set; }

    public string AssessmentType { get; set; }
    public string AssessmentName { get; set; }
    public string Month { get; set; }
    public string FailMasterCriteria { get; set; }
    public string GradingCriteria { get; set; }
    public decimal Weightage { get; set; }
   
}

public class deleteAssessmentSchedule
{
    [Key]
    public int Response { get; set; }
   
}



 public partial class AssessmentLevelClass
    {
		[Key]
		[Required]
         public Guid ClassId { get; set; }
        public Guid ProgramId { get; set; }

		public string ProgramName { get; set; }

		public Guid LevelId { get; set; }

		public Guid ProgramDetailId { get; set; }

		public Guid CampusProgramId { get; set; }

        public string ClassName { get; set; }
        
		public int StatusId { get; set; }

    }




}