using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{

    public partial class ExaminationReports
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string FullName { get; set; }
        public string CampusName { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
    }
    public partial class ExaminationRemarks
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }
        public string CampusName { get; set; }
        public string OverAllRemark { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
    }
    public partial class ExaminationStruckOffSt
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string RollNo { get; set; }
        public string StruckoffReason { get; set; }
        public DateTime StruckoffDate { get; set; }
        public string Description { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
    }
    public partial class ExamIndividualSummary
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string Marks { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamType { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public string Remarks { get; set; }
        public string RollNo { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
        public DateTime Dated { get; set; }
    }


    public partial class ExamIndividualSummaryAx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string Marks { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamType { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public string Remarks { get; set; }
        public string RollNo { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
    }

    public partial class ExamIndividualSummaryAxEx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string Marks { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamType { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public string Remarks { get; set; }
        public string RollNo { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
        public string Month { get; set; }
        public int MonthNumber { get; set; }
        public int Order { get; set; }

    }
    public partial class ExamIndividualSummaryAxExExm2
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string Marks { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamType { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public string Remarks { get; set; }
        public string RollNo { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
        public string Month { get; set; }
        public int MonthNumber { get; set; }
        public int Order { get; set; }

    }


    public partial class ExamIndividualSummaryEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }

        [Column(TypeName = "json")]
        public string Result { get; set; }
    }
    public partial class ExamIndividualSummaryExm2
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }

        [Column(TypeName = "json")]
        public string Result { get; set; }
    }
    public partial class ExamResultReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string AttendanceStatus { get; set; }
        public Guid GradingMasterId { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public int? MatricPerc { get; set; }
        public string Remarks { get; set; }
        public string Grade { get; set; }
        public int TotalObtained { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string ExamSchedule { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string SectionName { get; set; }
        public string CourseName { get; set; }
        public string Month { get; set; }
    }

    public partial class ExamSecWiseIndivid
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string AttendanceStatus { get; set; }
        public Guid GradingMasterId { get; set; }
        public string ExamType { get; set; }
        public string Shift { get; set; }
        public string OverAllRemark { get; set; }
        
        // public int? TotalPass { get; set; }
         public int? MatricPerc { get; set; }
        // public int? TotalFail { get; set; }
         // public int? TotalProvesional { get; set; }
        public int? SubjectPerc { get; set; }
        public string Remarks { get; set; }
        public string Grade { get; set; }
        public int TotalObtained { get; set; }
        public int OverAllTotal { get; set; }
        public int OverAllPerc { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamSchedule { get; set; }
        public string RollNo { get; set; }
        public int? TotalAppeared { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
        public string CourseName { get; set; }
        public string Month { get; set; }
    }
    public partial class ExamMonthlyReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamType { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public string Remarks { get; set; }
        public string RollNo { get; set; }
        public string ParentContactNo { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
    }
    public partial class ExamMonthlyReportExx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ExamType { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllRemark { get; set; }
        public string Remarks { get; set; }
        public string RollNo { get; set; }
        public string ParentContactNo { get; set; }
        public string Grade { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public int Percentage { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
    }

    public partial class TransportData
    {


        public Guid NEWID { get; set; }
        [Key]
        public Guid AdmissionFormId { get; set; }
        public int FeeAmount { get; set; }
        public string SectionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string FullName { get; set; }

        public string Gender { get; set; }


        public string StopName { get; set; }

        public string StartingPoint { get; set; }
        public string EndingPoint { get; set; }



    }

    public partial class ExamMonthlySectionReport
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string ParentContactNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string Month { get; set; }
        public int PresentCnt { get; set; }

        public int TotalLectures { get; set; }

        [Column(TypeName = "json")]
        public string Result { get; set; }

    }

    public partial class ExamMonthlySectionReportExam2
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string ParentContactNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string Month { get; set; }
        public int? PresentCnt { get; set; }

        public int? TotalLectures { get; set; }

        [Column(TypeName = "json")]
        public string Result { get; set; }
        public decimal? MatricPercentage { get; set; }
        public int? MatricMarks { get; set; }

    }

    public partial class ExamGazetteReport
    {
        [Key]
        public Guid Ide { get; set; }
        public string Code { get; set; }

        public string ExamName { get; set; }

        public string Dated { get; set; }

        public string FullName { get; set; }

        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string OverAllGrades { get; set; }
        public string OverAllResult { get; set; }

        public string RollNo { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string ACode { get; set; }
        public string PassStatus { get; set; }
        public string Description { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string CourseName { get; set; }
        public Guid? SectionCourseLinkId { get; set; }
        public Guid? ExamTypeId { get; set; }
        public DateTime? Dte { get; set; }

        public Guid? AdmissionFormId { get; set; }
        public Guid? ExamMasterId { get; set; }

    }
    public partial class ExamSectiontestwiseReport
    {
        [Key]
        public Guid Ide { get; set; }
        public string RollNo { get; set; }
        public string stdname { get; set; }

        public string mGrade { get; set; }
        public double mp { get; set; }
        public int Exampercentage { get; set; }
        public string ExamGrade { get; set; }
        public string ExamName { get; set; }
        public DateTime Dt { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public string SessionName { get; set; }
        public string SectionName { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ExamTypeId { get; set; }
        public string ClassIncharge { get; set; }


    }

    public class ExamStudentResult
    {
        [Key]
        public Guid Ide { get; set; }
        public string Dated { get; set; }

        public string FullName { get; set; }

        public string RollNo { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public Guid? SectionCourseLinkId { get; set; }
        public Guid? ExamTypeId { get; set; }
        public DateTime? Dte { get; set; }

        public Guid? AdmissionFormId { get; set; }
        public Guid? ExamMasterId { get; set; }

        public Guid? ExamDetailId { get; set; }

        public string CourseName { get; set; }

        public Guid ProgramCourseLinkId { get; set; }
        public string Code { get; set; }

        public Guid AttendenceStatusId { get; set; }

    }

    public class EnrolledViewEx
    {
        [Key]
        public Guid PId { get; set; }
        public string Grade { get; set; }

        public string CourseTypeName { get; set; }

        public int Count { get; set; }

        public string RollNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public string StaffName { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string SectionName { get; set; }
        public string Range { get; set; }
        public int Flag { get; set; }

    }
    public class HodEnrolledViewEx
    {
        [Key]
        public Guid PId { get; set; }
        public string Grade { get; set; }
        //public Guid? CourseTypeId { get; set; }

        public string CourseTypeName { get; set; }

        public int Count { get; set; }

        public string RollNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        //public Guid? CourseId { get; set; }
        public string CourseName { get; set; }
        public string StaffName { get; set; }
       // public Guid? SectionCourseLinkId { get; set; }
        public string SectionName { get; set; }
        public string Range { get; set; }
        //public int? Flag { get; set; }
        //public Guid? HodId { get; set; }
        public string HodName { get; set; }
        public DateTime? Dated { get; set; }
       // public Guid? SessionId { get; set; }
       // public Guid? CampusId { get; set; }
       // public Guid? ProgramDetailId { get; set; }

        public int? SectionStrength { get; set; }

    }

     

     public class HodGradePoint
    {
        [Key]
        public Guid NewID { get; set; }
        public string SessionName { get; set; }
        //public Guid? CourseTypeId { get; set; }

        public string CampusName { get; set; }
         public string Description { get; set; }
          public string StaffName { get; set; }

        public Guid SectionCourseLinkId { get; set; }

       
        public Guid ProgramCourseLinkId { get; set; }
        public string ExamName { get; set; }
        public string SectionName { get; set; }
        public string Course { get; set; }
        public string ClassName { get; set; }

        public string Program { get; set; }

        //public Guid? CourseId { get; set; }
     
        public string HodName { get; set; }
       // public Guid? SectionCourseLinkId { get; set; }
        public decimal SectionStrenth { get; set; }
        public Guid CourseId1 { get; set; }
        public string Grade { get; set; }
        public decimal  GradeCount { get; set; }
       // public Guid? SessionId { get; set; }
       // public Guid? CampusId { get; set; }
       // public Guid? ProgramDetailId { get; set; }

        //public string RollNo { get; set; }
        public decimal GradePercentage { get; set; }
        public decimal TotalAppear { get; set; }
        public decimal ToptalAbsent { get; set; }
        public decimal FailCount { get; set; }
        public string DegreeName { get; set; }
        public decimal TotalPass { get; set; }

      public decimal PassPercentage { get; set; }

       public decimal GPA { get; set; }






    }

}