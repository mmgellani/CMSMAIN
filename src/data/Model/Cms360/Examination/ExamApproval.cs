using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("VWExamApproval", Schema = "Examination")]
    public partial class ExamApproval
    {

        
        [Key]
        [Required]
        public Guid ExamMasterId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public int TotalMarks { get; set; }
        //  public DateTime   Dated  { get; set; }
        public DateTime ExamDate { get; set; }
        public string dayname { get; set; }
        public int StatusId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public bool IsApproved { get; set; }
        public Guid ExamTypeId { get; set; }




    }


    public partial class ExamScheduleName
    {
        public Guid ExamTypeId { get; set; }

        [Key]
        public string ExamName { get; set; }


    }

        public partial class ExamScheduleNameEx
    {
        public Guid ExamTypeId { get; set; }

        [Key]
        public string ExamName { get; set; }
        public string FullName { get; set; }



    }
    public partial class ExamApprovalNew
    {

        [Key]
        [Required]
        public Guid ExamScheduleId { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public int TotalMarks { get; set; }
        //  public DateTime   Dated  { get; set; }
        public DateTime ExamDate { get; set; }
        public string Month { get; set; }
        public int StatusId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public bool IsApproved { get; set; }
        public Guid ExamTypeId { get; set; }
        public string ExamName { get; set; }
        public int PassCount { get; set; }
        public int FailCount { get; set; }
        public int Absent {get;set;}
        public string Status { get; set; }
        public bool IsEnabled {get;set;}
        public bool Action {get;set;}
    }

    public partial class ExamSmsApprovalNew
    {

        [Key]
        [Required]
        public Guid NewID { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
                public Guid SectionCourseLinkId { get; set; }

        public string ProgramDetail { get; set; }
        public string Section { get; set; }
        public Guid SectionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public int TotalScheduledExams { get; set; }
        public int ApprovedExams { get; set; }
        public string Status { get; set; }
    public string Month { get; set; }
    public bool IsSend { get; set; }


    
    }

       public partial class ExamSmsApprovalNewPopup
    {

        [Key]
        [Required]
        public Guid NewID { get; set; }
        public Guid CampusProgramId { get; set; }
                public Guid SectionCourseLinkId { get; set; }

        public Guid ClassId { get; set; }
        public string ProgramDetail { get; set; }
        public string Section { get; set; }
                public string ExamName { get; set; }

        public Guid SectionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public int TotalScheduledExams { get; set; }
        public int ApprovedExams { get; set; }
        public string Status { get; set; }
                public string ClassName { get; set; }
                        public string Month { get; set; }
                        public string ApprovalDate { get; set; }


    
    }

    public partial class GetStudentExamDetail
    {
        [Key]
        public Guid NewID { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string Attendence { get; set; }
         public int ObtainMarks { get; set; }

    }

}