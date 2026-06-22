using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("VWAttendanceReport", Schema = "Attendance")]
    public partial class AttendanceReports {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }

        public string RefferenceNo { get; set; }

        public Guid StudentId { get; set; }

        public string FullName { get; set; }

        public Guid CourseId { get; set; }

        public string CourseName { get; set; }

        public Guid AttendanceStatusId { get; set; }

        public string AttendanceStatus { get; set; }
        
        public string Dated { get; set; }
        
        public string DayName { get; set; }

        public string SectionName { get; set; }

        public Guid SectionId { get; set; }

        public Guid SessionId { get; set; }

        public Guid? CampusId { get; set; }

        public Guid? ProgramDetailId { get; set; }

        public Guid ClassId { get; set; }
    }
   public partial class AttendanceReportStatus {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }

        public int Leave { get; set; }

        public int Percentage { get; set; }

        public string StudentName { get; set; }

        public string RefferenceNo { get; set; }

        public string ParentContactNo { get; set; }

        public string CampusName  { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string Description { get; set; }
        
        public string ProgramName { get; set; }
        
        public string SectionName { get; set; }

        public string ClassName { get; set; }
        
    }
public partial class AttendanceReportResult {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }

        public int Leave { get; set; }

        public int Percentage { get; set; }

        public string StudentName { get; set; }

        public string RefferenceNo { get; set; }

        public string ParentContactNo { get; set; }

        public string CampusName  { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string Description { get; set; }
        
        public string ProgramName { get; set; }
        
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string Month { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
      
        
    }
    public partial class AttendanceReportResult2 {
        [Key]
              public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public int OverAllPercentage { get; set; }
        public string StudentName { get; set; }
        public string ParentContactNo { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
    }
     public partial class AttendanceReportStatusSubjectWise {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }

        public int Leave { get; set; }

        public int Percentage { get; set; }

        public string StudentName { get; set; }

        public string RefferenceNo { get; set; }

        public string ParentContactNo { get; set; }

        public string CampusName  { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string Description { get; set; }
        
        public string ProgramName { get; set; }
        
        public string SectionName { get; set; }

        public string ClassName { get; set; }

        public string CourseName { get; set; }
    }

    public partial class AttendanceReportStatusEl {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }


        public int Percentage { get; set; }

        public string StudentName { get; set; }

        public string RefferenceNo { get; set; }

        public string ParentContactNo { get; set; }

        public string CampusName  { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string Description { get; set; }
        
        public string ProgramName { get; set; }
        
        public string SectionName { get; set; }

        public string ClassName { get; set; }
    }
    
    public partial class AttendanceRegister {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }

        public string StudentName { get; set; }

        public string RollNo { get; set; }

        public string Description { get; set; }

        public string SessionName  { get; set; }

        public string ProgramName { get; set; }

        public string Code { get; set; }

        public DateTime Dated { get; set; }
        
        public string StartEndTime { get; set; }

        public string ClassName { get; set; }

        public string SectionName { get; set; }

        public string CourseTitle { get; set; }
    }

    
    public partial class AttendanceReportStatusExx {
        [Key]
        public Guid NewID { get; set; }

        public string Description { get; set; }

        public string CampusName  { get; set; }

        public string SessionName { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }

        public int Leave { get; set; }

        public int Percentage { get; set; }

        public int Strength { get; set; }
        
        public string ProgramName { get; set; }
        
        public string SectionName { get; set; }

        public string ClassName { get; set; }
    }
}