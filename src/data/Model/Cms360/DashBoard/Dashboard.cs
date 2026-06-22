//using System.Reflection.Metadata.Ecma335;
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("VWDashBoard", Schema = "public")]
    public partial class VWDashBoardVM
    {
        [Key]
        public Guid CityId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramId { get; set; }
        public string CityName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string SubCityName { get; set; }
        public int TotalAdmission { get; set; }
        public string CampusName { get; set; }
        public string ProgramName { get; set; }
        public string Description { get; set; }


    }

    [Table("VWDashBoardA", Schema = "public")]
    public partial class VWDashBoardVMA
    {
        [Key]
        public Guid DrillDownId { get; set; }

        public Guid CityId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramId { get; set; }
        public string CityName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string SubCityName { get; set; }
        public int TotalAdmission { get; set; }
        public int TotalFeeConfirmed { get; set; }

        public int TotalEnrolled { get; set; }

        public string CampusName { get; set; }
        public string ProgramName { get; set; }
        public string Description { get; set; }


    }

    public class AdmissionOnlineDashboard
    {
        [Key]

        public int OnlineCount { get; set; }

    }

    public class AdmissionGenderDashboard
    {
        [Key]
        public string Description { get; set; }
        public int GenderCount { get; set; }

    }

    public class AdmissionComparisonTotalAverage
    {
        [Key]
        public Guid AdmissionAverageId { get; set; }
        public int Session { get; set; }

        public string Possession { get; set; }

        public int TotalCampus { get; set; }

        public int Average { get; set; }

        public int TotalAdmission { get; set; }
    }

    public class VWCityDateEXCity
    {
        [Key]
        public Guid ProgramDetailId { get; set; }
        public string CityName { get; set; }
        public int FormCollection { get; set; }
        public int FeePaid { get; set; }

    }

    [Table("VWStudentFeeCount", Schema = "public")]
    public partial class StudentFeeCountVM
    {
        [Key]
        public Guid FeeCountId { get; set; }
        public string Shift { get; set; }
        public int TotalStudents { get; set; }
        public int PaidAmount { get; set; }
        public int Average { get; set; }
        public int Discount { get; set; }

    }

    public class AdmissionSessionWiseDataEx
    {
        [Key]
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public int? FormSubmition { get; set; }
        public int? FeePaidCount { get; set; }
        public int? NDateAdmission { get; set; }
        public int? FeePaidCountToday { get; set; }
        public int? FormSubmitionPrevious { get; set; }
        public int? Conversion { get; set; }

    }

    public class AdmissionSessionWiseDataEx2
    {
        [Key]
        public Guid? Id { get; set; }
        public string FullName { get; set; }
        public int? CurrentFormSubmission { get; set; }
        public int? CurrentAdmission { get; set; }
        public int? CurrentFormConversion { get; set; }
        public int? PreviousFormSubmission { get; set; }
        public int? PreviousAdmission { get; set; }
        public int? PreviousAdmissionEx { get; set; }
        public int? PreviousFormConversion { get; set; }
        public int? CurrentNDateAdmission { get; set; }
        public int? PreviousNDateAdmission { get; set; }
        public int? DifferenceValue { get; set; }
        public decimal? DifferencePercentage { get; set; }
    }

    public class AdmissionSessionWiseDataExx2
    {
        [Key]
        public Guid? Id { get; set; }
        public string FullName { get; set; }
        public int? CurrentFormSubmission { get; set; }
        public int? CurrentAdmission { get; set; }
        public int? CurrentFormConversion { get; set; }
        public int? PreviousFormSubmission { get; set; }
        public int? PreviousAdmission { get; set; }
        public int? PreviousAdmissionEx { get; set; }
        public int? PreviousFormConversion { get; set; }
        public int? CurrentNDateAdmission { get; set; }
        public int? PreviousNDateAdmission { get; set; }
        public int? DifferenceValue { get; set; }
        public decimal? DifferencePercentage { get; set; }
        public int? AdmissionDay { get; set; }
        public DateTime? LastAdmissionDate { get; set; }
    }

    public partial class NotificationDashboardList
    {
        [Key]
        public Guid NewID { get; set; }
        public string CourseId { get; set; }
        public string CourseName { get; set; }
        public string TeacherName { get; set; }
        public float Average { get; set; }
        public float CurrentAverage { get; set; }
        public float PreviousAverage { get; set; }
    }

    public partial class NotificationDashboardListEx
    {
        [Key]
        public Guid NewID { get; set; }
        public string SubCity { get; set; }
        public string CourseId { get; set; }
        public string CourseName { get; set; }
        public string TeacherName { get; set; }
        public string TeacherId { get; set; }
        public float? Average { get; set; }
        public float? CurrentAverage { get; set; }
        public float? PreviousAverage { get; set; }
    }

    public partial class SurveyRatingList
    {
        [Key]
        public Guid NewID { get; set; }
        public string Question { get; set; }
        public int Order { get; set; }
        public string Course { get; set; }
        public string SubCity { get; set; }
        public decimal Rating { get; set; }
        public string SubCity1 { get; set; }
        public decimal SubCity1Rating { get; set; }
        public string SubCity2 { get; set; }
        public decimal SubCity2Rating { get; set; }
        public string SubCity3 { get; set; }
        public decimal SubCity4Rating { get; set; }

    }
    public partial class SurveyRatingListExx2
    {
        [Key]
        public Guid NewID { get; set; }
        public string Question { get; set; }
        public int Order { get; set; }
        public string Course { get; set; }
        public string SubCity { get; set; }
        public string Rating { get; set; }
        public string SubCity1 { get; set; }
        public string SubCity1Rating { get; set; }
        public string SubCity2 { get; set; }
        public string SubCity2Rating { get; set; }
        public string SubCity3 { get; set; }
        public string SubCity4Rating { get; set; }

    }

    public partial class TeacherRatingOverAllList
    {
        [Key]
        public Guid NewID { get; set; }
        public string TeacherName { get; set; }
        public decimal Rating { get; set; }
        public float? Total { get; set; }

    }
    public partial class TeacherRatingOverAllListwithid
    {
        [Key]
        public Guid NewID { get; set; }
        public string TeacherName { get; set; }

        public Guid Staffid { get; set; }
        public decimal Rating { get; set; }
        public float? Total { get; set; }

    }
    public partial class TeacherRatingOverAllListpre
    {
        [Key]
        public Guid NewID { get; set; }
        public string TeacherName { get; set; }
        public decimal Rating { get; set; }
        public float? Total { get; set; }
    }
    public partial class SurveyRatingListEx
    {
        [Key]
        public Guid NewID { get; set; }
        public string Question { get; set; }
        public int Order { get; set; }
        public string Course { get; set; }
        public string SubCity { get; set; }
        public decimal Rating { get; set; }
        public string SubCity1 { get; set; }
        public decimal SubCity1Rating { get; set; }
        public string SubCity2 { get; set; }
        public decimal SubCity2Rating { get; set; }

    }
    public partial class SurveyRatingListEx2
    {
        [Key]
        public Guid NewID { get; set; }
        public string Question { get; set; }
        public int Order { get; set; }
        public string Course { get; set; }
        public string SubCity { get; set; }
        public string Rating { get; set; }
        public string SubCity1 { get; set; }
        public string SubCity1Rating { get; set; }
        public string SubCity2 { get; set; }
        public string SubCity2Rating { get; set; }

    }
    public partial class SurveyOverAllResult
    {
        [Key]
        public Guid NewID { get; set; }
        public int Order { get; set; }
        public string Question { get; set; }
        public string Course { get; set; }
        public decimal OverAllRating { get; set; }
        public decimal Rating { get; set; }
    }
    //survey Dec 2021 
    public partial class Dec2021SurveyOverAllResult
    {
        [Key]
        public Guid NewID { get; set; }
        public int Order { get; set; }
        public string Question { get; set; }
        public string Course { get; set; }
        public string OverAllRating { get; set; }
        public string Rating { get; set; }
        public float? Total { get; set; }

    }
    public partial class April2022SurveyOverAllResult
    {
        [Key]
        public Guid NewID { get; set; }
        public int Order { get; set; }
        public string Question { get; set; }
        public string Course { get; set; }
        public string OverAllRating { get; set; }
        public string Rating { get; set; }
        public float? Total { get; set; }

    }
    public partial class Dec2021SurveyOverAllResultpre
    {
        [Key]
        public Guid NewID { get; set; }
        public int Order { get; set; }
        public string Question { get; set; }
        public string Course { get; set; }
        public decimal OverAllRating { get; set; }
        public decimal Rating { get; set; }
        public float? Total { get; set; }
    }
    public partial class Dec2021SurveyOverAllResultpreB
    {
        [Key]
        public Guid NewID { get; set; }
        public int Order { get; set; }
        public string Question { get; set; }
        public string Course { get; set; }
        public string OverAllRating { get; set; }
        public string Rating { get; set; }
        public float? Total { get; set; }
    }
    public partial class NotificationRatingGraph
    {
        [Key]
        public Guid NewID { get; set; }
        public string SectionId { get; set; }
        public string SectionName { get; set; }
        public float? Average { get; set; }
    }


    public partial class TeacherRatingGraph
    {
        [Key]
        public Guid NewID { get; set; }
        public string SectionId { get; set; }
        public string SectionName { get; set; }
        public float? Average { get; set; }
        public float? TotalSubmitted { get; set; }
    }
    //December Survey 2021
    public partial class TeacherRatingGraphEX
    {
        [Key]
        public Guid NewID { get; set; }
        public string TeacherName { get; set; }
        public string CourseName { get; set; }
        public float? Rating { get; set; }
        public float? TotalSubmitted { get; set; }
    }
    //December Survey Teachert Search Section Wise Data 
    public partial class TeacherRatingGraphEXSection
    {
        [Key]
        public Guid NewID { get; set; }
        public string CourseName { get; set; }
        public string SectionName { get; set; }
        public float? Rating { get; set; }
    }
    public partial class TeacherRatingGraphEXSectionwithtotal
    {
        [Key]
        public Guid NewID { get; set; }
        public string CourseName { get; set; }
        public string SectionName { get; set; }
        public float? Rating { get; set; }
        public float? Total { get; set; }

    }
    public partial class TeacherRatingGraphMonth
    {
        [Key]
        public Guid NewID { get; set; }
        public string Month { get; set; }
        public float? Average { get; set; }
    }

    public partial class DashboardComment
    {
        [Key]
        public Guid NewID { get; set; }
        public DateTime Dated { get; set; }
        public string SubCity { get; set; }
        public string Category{get;set;}
        public string Comment { get; set; }
        public string SectionName { get; set; }
        public string CampusCode { get; set; }
    }
    public partial class StudentFeedback
    {
        [Key]
        public Guid NewID { get; set; }
        public string AdmissionFormId { get; set; }
        public string SubCity { get; set; }
        public string RollNo { get; set; }
        public string Name { get; set; }
        public string Program { get; set; }
        public string Date { get; set; }
        public string PlateForm { get; set; }
        public string FeedBack { get; set; }
        public string ParentNo { get; set; }
        public string StudentNo { get; set; }
    }
    public partial class StudentFeedbackAgainstStudent
    {
        [Key]
        public Guid NewID { get; set; }
        public string SubCity { get; set; }
        public string RollNo { get; set; }
        public string Name { get; set; }
        public string Program { get; set; }
        public string Date { get; set; }
        public string PlateForm { get; set; }
        public string FeedBack { get; set; }
        public string ParentNo { get; set; }
        public string StudentNo { get; set; }
    }
    public partial class BuildingSectionData
    {
        [Key]
        public string BuildingName { get; set; }
        public bool IsBuilding { get; set; }
    }
    public partial class TeacherSearch
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; }
        public Guid SubCityId { get; set; }
        public string Subcity { get; set; }
        public string CampusName { get; set; }
        public string CourseName { get; set; }
    }

    public partial class TeacherSurvey
    {
        [Key]
        public Guid NewID { get; set; }
        public float? TotalSurvey { get; set; }
        public float? TotalSubmitted { get; set; }
        public float? Average { get; set; }
        public float? GroupAverage { get; set; }
    }
    public partial class TeacherSurveyEX
    {
        [Key]
        public Guid NewID { get; set; }
        public string TeacherName { get; set; }
        public float? Rating { get; set; }
    }


    public partial class Survey2
    {
        [Key]
        public float? TotalSubmitted { get; set; }
        public float? Average { get; set; }
    }
    
    public partial class Survey26
    {
        [Key]
        public float? TotalSubmitted { get; set; }
        public float? Average { get; set; }
        public float? TotalStudents { get; set; }
    }
    public partial class TotalSurveyJanuary2024
    {
        [Key]
        public float? TotalCount { get; set; }
        public float? TotalSubmitted { get; set; }
        public float? Average { get; set; }
    }
    public partial class Survey3
    {
        [Key]
        public float? TotalSubmitted { get; set; }
        public float? Average { get; set; }
    }

    public partial class CalculateMonthAverageList
    {
        [Key]
        public Guid NewID { get; set; }
        public string CourseName { get; set; }
        public string TeacherName { get; set; }
        public float? Average { get; set; }
        public string Month { get; set; }

    }

    public partial class AdmissionCount
    {
        [Key]
        public int AdmissionCountWiz { get; set; }
    }

    public partial class AdmissionFeeCount
    {
        [Key]
        public int AdmissionCountFeeWise { get; set; }
    }

    public partial class QuizResponseCms
    {
        [Key]
        public string QuizData { get; set; }
    }

    public partial class QuizQuestion
    {
        [Key]
        public Guid QuestionId { get; set; }
        public int Order { get; set; } // Use Guid type for UUIDs
        public Guid AdmissionFormId { get; set; } // Use Guid type for UUIDs
        public string Question { get; set; }
        public List<string> Options { get; set; }
        public string Answer { get; set; }
        public string Explanation { get; set; }
        public string SubmittedAnswer { get; set; }
        public bool IsSubmitted { get; set; }
        public string AttemptedTime { get; set; }
        public string Type { get; set; }
        public bool IsCorrect { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
    }



    public class GetSurveyDetail
    {


        [Key]

        public Int64 Id { get; set; }
        public Guid SurveyDetailId { get; set; }
        [Column(TypeName = "jsonb")]

        public string Option { get; set; }



        public string Query { get; set; }

        public string Question { get; set; }

        public string Description { get; set; }

        public string ControlType { get; set; }

        public int StatusId { get; set; }


        public string CoursesName { get; set; }

        public int Order { get; set; }


        public string UserName { get; set; }



    }
    public partial class SurveyStatistics
    {
        [Key]
        public Guid Iddd { get; set; }
        public string FullName { get; set; }
        public float? Total { get; set; }
        public float? Submitted { get; set; }
        public float? Response { get; set; }
        public string Next { get; set; }

    }
    public partial class SurveyCommentDash
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string Comment { get; set; }
        public string SurveyDetailId { get; set; }

    }
     public partial class SurveyCommentDash26
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string Comment { get; set; }
        public string SurveyDetailId { get; set; }
         public string Category { get; set; }

    }

    public partial class Checkconsessionvalidity
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid ConcessionId { get; set; }
        public string ConcessionName { get; set; }
        public int InstallmentNo { get; set; }
        public DateTime? PaidDate { get; set; }
        public Guid? ScholarshipCriteriaId { get; set; }

    }

    public partial class Checkconsessionvalidity2
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public int InstallmentNo { get; set; }
        public DateTime PaidDate { get; set; }

    }

    public class CheckStudentInstallment
    {

        [Key]

        public Guid CheckInstallementId { get; set; }



        public string CheckInstallment { get; set; }




    }
}