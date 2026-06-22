/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using Newtonsoft.Json;
namespace Cms360.Data.Model
{

    public class TeacherSection
    {
        [Key]
        public Guid SectionCourseLinkId { get; set; }
        public string SectionName { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid SectionId { get; set; }
    }

    public class TeacherCourse
    {
        [Key]
        public Guid ProgramCourseLinkId { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
    }
    [Table("ExamDetail", Schema = "Examination")]
    public partial class ExaminationExamDetail
    {
        [Key]
        [Required]
        public Guid ExamDetailId { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public decimal ObtainMarks { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }

    }

    [Table("VWExamDetailVM", Schema = "Examination")]
    public partial class ExaminationExamDetailVM
    {
        [Key]
        [Required]
        public Guid ExamDetailId { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public int ObtainMarks { get; set; }
        public int StatusId { get; set; }
        public string StudentName { get; set; }
        public string ExammasterName { get; set; }

        public string SectionName { get; set; }

        public string ClassName { get; set; }

        public string Code { get; set; }
        public int TotalMarks { get; set; }
        public DateTime Dated { get; set; }
        public Guid LoggerId { get; set; }

    }

    [Table("VWExamCourse", Schema = "Examination")]
    public partial class ExamCourseVM
    {
        [Key]
        public Guid SectionCourseLinkId { get; set; }
        public string Course { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }

    }

    [Table("VWExamData", Schema = "Examination")]
    public partial class ExamDataVM
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public Guid ExamMasterId { get; set; }

        public Guid AttendanceStatusId { get; set; }

        public int ObtainMarks { get; set; }

        public int StatusId { get; set; }
        public string Code { get; set; }

        public DateTime Dated { get; set; }

        public int TotalMarks { get; set; }

        public Guid ClassId { get; set; }

        public string ClassName { get; set; }

        public string SectionName { get; set; }

        public Guid SectionId { get; set; }

        public Guid CourseId { get; set; }

        public string CourseName { get; set; }

        public Guid CampusProgramId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public Guid SessionId { get; set; }
    }
    [Table("VWExamBulk", Schema = "Examination")]
    public partial class ExamBulkVM
    {
        [Key]
        public int SerialId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }

        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ShiftId { get; set; }
        public Guid ClassId { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public int StatusId { get; set; }


        public int ObtainMarks { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public Guid SectionId { get; set; }
        public bool IsApproved { get; set; }
        public bool? ShouldAbsent { get; set; }


    }

    //[Table("VWExamBulk", Schema = "Examination")]
    public partial class ExamBulkVM1
    {
        [Key]
        public int SerialId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public int TotalMarks { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ShiftId { get; set; }
        public Guid ClassId { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public int StatusId { get; set; }


        public int ObtainMarks { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public Guid SectionId { get; set; }
        public bool IsApproved { get; set; }
        public bool? ShouldAbsent { get; set; }


    }

    public partial class ExamBulkUpdateVM
    {
        [Key]
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public Guid ExamMasterId { get; set; }
        public int TotalMarks { get; set; }
        public DateTime Dated { get; set; }
        public bool IsApproved { get; set; }
        public Guid ExamDetailId { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public decimal ObtainMarks { get; set; }
        public bool? ShouldAbsent { get; set; }


    }

    public class SubjectExamReportEx2
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public int MatricObtainMarks { get; set; }

        public decimal MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

    }

    public class SubjectExamReportExam2
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public int MatricObtainMarks { get; set; }

        public decimal MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

    }
    public class AcademicPerformaceStudentWise
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string StudentName { get; set; }

        public string FatherName { get; set; }

        public int? MatricObtainMarks { get; set; }

        public decimal? MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

    }

    public class AcademicPerformaceStudentWiseEx
    {
        [Key]

        public Guid AdmissionFormId { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string StudentName { get; set; }

        public string FatherName { get; set; }

        [Column(TypeName = "json")]
        public string Result { get; set; }

    }
    public partial class SubjectExamReport
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

    }
    public partial class SubjectExamReportExm2
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

    }
    public partial class SubjectExamReportEx
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

        public int PassStats { get; set; }

        public string GradesStat { get; set; }

        public int Val { get; set; }

    }




    public partial class SubjectExamAttenReport
    {
        [Key]
        public Guid ExamDetailId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string ExamName { get; set; }

        public string Code { get; set; }

        public string SectionName { get; set; }
        public string CampusName { get; set; }


        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamMasterId { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string PassStatus { get; set; }
        public string CourseName { get; set; }
        public string CourseTitle { get; set; }
        public Guid CourseId { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string StaffName { get; set; }

    }

    public partial class ExamTypeWiseReport
    {
        [Key]
        public Guid Id { get; set; }
        public string RollNo { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string FullName { get; set; }
        public string ExamType { get; set; }

        public string CampusName { get; set; }

        public string Section { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string Class_ { get; set; }
        public Guid ExamTypeId { get; set; }
        public DateTime Dated { get; set; }


    }

    public partial class ExamTypeWiseReportEx
    {
        [Key]
        public Guid Id { get; set; }
        public string RollNo { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string FullName { get; set; }
        public string ExamType { get; set; }

        public string CampusName { get; set; }

        public string Section { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string Class_ { get; set; }
        public Guid ExamTypeId { get; set; }


    }

    public class ExamTypeWiseReportExam2
    {
        [Key]
        public Guid ExamDetailId { get; set; }
        public Guid ExamScheduleId { get; set; }
        public string ExamScheduleName { get; set; }

        public int Strength { get; set; }
        public DateTime ExamDate { get; set; }
        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public int TotalMarks { get; set; }
        public string ObtainedMarks { get; set; }
        public string Percentage { get; set; }
        public string FullName { get; set; }
        public string ExamType { get; set; }

        public string CampusName { get; set; }

        public string Section { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }

        public string Class_ { get; set; }
        public Guid ExamTypeId { get; set; }
        public int? MatricPerc { get; set; }
        public int? firstyearPerc { get; set; }



        public string Grade { get; set; }

        public string FirstGrade { get; set; }

        public string CourseName { get; set; }
        public string ClassName { get; set; }
        public string StaffName { get; set; }
        public int FailMarks { get; set; }

    }

    public class SectionWiseExam2
    {
        [Key]
        public Guid ExamDetailId { get; set; }
        public string Grade { get; set; }

        public string MatricGrade { get; set; }
        public int Strength { get; set; }

        public DateTime ExamDate { get; set; }
        public string SessionName { get; set; }

        public string RollNo { get; set; }

        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public string pre_perc { get; set; }

        public string FullName { get; set; }
        public string ExamType { get; set; }

        public string CampusName { get; set; }

        public string Section { get; set; }

        public int MatricObtainMarks { get; set; }

        public int MatricTotalMarks { get; set; }
        public string MatricPerc { get; set; }
        public string Class_ { get; set; }
        public Guid ExamTypeId { get; set; }
        public string CourseName { get; set; }
        public string ClassName { get; set; }
        public string StaffName { get; set; }
        public string ExamScheduleName { get; set; }


    }
    public class ExamTypeWiseExam2Agrr
    {
        [Key]
        public string ExamScheduleId { get; set; }
        public string ExamType { get; set; }
        public int TotalMarks { get; set; }

        public string ExamScheduleName { get; set; }
        public int AttendedStudentsCount { get; set; }

        public int PassStudentCount { get; set; }

        public decimal PasPercentage { get; set; }

        public DateTime ExamDate { get; set; }


    }

    public class AttendanceExamPercentage
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string RollNo { get; set; }

        public string Description { get; set; }
        public string CampusName { get; set; }

        public string SessionName { get; set; }

        public string ProgramName { get; set; }


        public string ClassName { get; set; }

        public string SectionName { get; set; }


        // These fields are JSON strings in the data, so we'll bind them as lists
        // public List<AttendanceDetail> AttendanceDetail { get; set; }
        // public List<AttendanceDetailOverAll> AttendanceDetailOverAll { get; set; }
        // public List<ExamPercentageExamwise> ExamPercentageExamwise { get; set; }

        // public List<ExamPercentageOverAll> ExamPercentageOverAll { get; set; }

        // public   string AttendanceDetail { get; set; }

        // public  string AttendanceDetailOverAll { get; set; }
        // public   string ExamPercentageExamwise { get; set; }
        //     public   string ExamPercentageOverAll { get; set; }
public string AttendanceDetail { get; set; }
    public string AttendanceDetailOverAll { get; set; }
    public string ExamPercentageExamwise { get; set; }
    public string ExamPercentageOverAll { get; set; }

    // Deserialized properties
    [NotMapped]
    public List<AttendanceDetail> AttendanceDetailJsonString { get; set; }
    
    [NotMapped]
    public List<AttendanceDetailOverAll> AttendanceDetailOverAllJsonString { get; set; }
    
    [NotMapped]
    public List<ExamPercentageExamwise> ExamPercentageExamwiseJsonString { get; set; }
    
    [NotMapped]
    public List<ExamPercentageOverAll> ExamPercentageOverAllJsonString { get; set; }

    }
    public class ExamPercentageOverAll
    {
        [Key]

        public string AdmissionFormId { get; set; }
        public double Percentage { get; set; }
        public string Month { get; set; }
        public string ExamType { get; set; }
        public double OverAllPercentage { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
    }
    public class AttendanceDetail
    {
        [Key]

        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string ProgramName { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Scheduled { get; set; }
        public double Percentage { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
        public string CourseName { get; set; }
        public double OverAllPercentage { get; set; }

    }

    public class AttendanceDetailOverAll
    {

        public string MonthName { get; set; }
        public double Percentage { get; set; }
    }

    public class ExamPercentageExamwise
    {
        [Key]

        public Guid AdmissionFormId { get; set; }

        public int TotalMarks { get; set; }

        public int Sr { get; set; }
        public int ObtainMarks { get; set; }
        public string Grade { get; set; }
        public string ExamType { get; set; }
        public double OverAllPercentage { get; set; }
        public string CourseName { get; set; }
        public string Month { get; set; }
        public bool IsAbsent { get; set; }



    }
    public class studentResetPassword
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }

        public string RollNo { get; set; }
        public string StudentName { get; set; }

        public string FatherName { get; set; }
        public string ParentContactNo { get; set; }
        public string StudentContactNo { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }

        public Guid SectionId { get; set; }
        public string SectionName { get; set; }
        public string StudentCNIC { get; set; }
        public string Password { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }

    }

    public class SectionWiseAssesmentStudent
    {
        [Key]
        public Guid NewId { get; set; }
        public string Session { get; set; }
        public string CampusName { get; set; }
        public string Section { get; set; }
        public string ClassName { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }

        public Guid SectionCourseLinkId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string Month { get; set; }
        public string RollNo { get; set; }
        public string MatricGrade { get; set; }

        public string AssessmentName { get; set; }
        public decimal Weightage { get; set; }
        public int TotalMarks { get; set; }
        public decimal ObtainMarks { get; set; }
        public decimal AssmentPerctange { get; set; }
        public decimal WeightedScore { get; set; }
        public decimal MarksPercentage { get; set; }
        public int MatricObtainMarks { get; set; }
        public int MatricTotalMarks { get; set; }
        public decimal MatricPercentage { get; set; }
        public decimal AllAssesmentPercentage { get; set; }
        public decimal AllAssesmentWeitage { get; set; }
        public decimal AllWeightedScore { get; set; }
        public decimal AllMarkpercentage { get; set; }

    }

    public class SectionWiseAssesmentStudentAll
    {
        [Key]
        public Guid NewId { get; set; }

        public string SchemeName { get; set; }

        public string ExamName { get; set; }
        public int TotalExamCount { get; set; }
        public int TotalWeightagePercentage { get; set; }
    }


    public class StepEnrollmentData
    {
        [Key]
       public Guid AdmissionFormId { get; set; } // UUID
        public string ProgramDetail { get; set; }
        public string CmsRollNo { get; set; }
         public string CampusName { get; set; }
         public string SessionName { get; set; }
 
       
        public string CmsSection { get; set; }
        public string StepRoll { get; set; }
        public string StepSection { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string Gender { get; set; }
        public string Degree { get; set; }
        public string FatherCNIC { get; set; }
        public string StudentContactNo { get; set; }
        public string ParentContactNo { get; set; }
        public string Marks { get; set; }
        public string StudentType { get; set; }
 
    }
}