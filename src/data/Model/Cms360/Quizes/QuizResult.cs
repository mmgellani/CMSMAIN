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
    [Table("QuizResult", Schema = "Quiz")]
    public partial class QuizResult
    {
        [Key]
        [Required]
        public Guid QuizResultId { get; set; }
        [Required]
        public Guid ConfigurationId { get; set; }
        [Required]
        public Guid AcademicCalendarMasterId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        public string QuestionId { get; set; }
        public string AnswerId { get; set; }
        public bool IsCorrect { get; set; }
        public int StatusId { get; set; }
        public DateTime CreatedOn { get; set; }

    }
    [Table("CourseConfiguration", Schema = "Quiz")]
    public class CourseConfiguration
    {
        [Key]
        public Guid CourseConfigurationId { get; set; }

        [Required]
        public Guid ConfigurationId { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        public string Subject { get; set; }

        public int TestFrequency { get; set; }

        public decimal TimePerQuestion { get; set; }

        public decimal MarksPerQuestion { get; set; }

        public decimal Easy { get; set; }

        public decimal Medium { get; set; }

        public decimal Hard { get; set; }
    }
    public partial class QuizTimeUpdate
    {
        [Key]
        [Required]
        public Guid QuizTimeId { get; set; }
        [Required]
        public Guid ConfigurationId { get; set; }
        [Required]
        public Guid AcademicCalendarMasterId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        public string StartTime { get; set; }
        public int StatusId { get; set; }
        public string CreatedOn { get; set; }

        public bool? IsSubmitted { get; set; }
        public string CurrentTime { get; set; }

    }

    public partial class GetLastTime
    {
        [Key]
        [Required]
        public Guid QuizTimeId { get; set; }
        [Required]
        public Guid ConfigurationId { get; set; }
        [Required]
        public Guid AcademicCalendarMasterId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        public string StartTime { get; set; }
        public int StatusId { get; set; }
        public string CreatedOn { get; set; }

        public bool? IsSubmitted { get; set; }

        public string CurrentTime { get; set; }
    }
    public class QuizStatusRequest
    {
        public Guid ConfigurationId { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid? CourseId { get; set; } // NULL means student has not selected a course yet
        public string Module { get; set; }
        public string UserEmail { get; set; }
        public string Device { get; set; }
    }

    public class QuizStatusResponse
    {
        public bool QuizStarted { get; set; }
        public bool QuizEnded { get; set; }
        public int CurrentPointer { get; set; }
        public int TotalCourses { get; set; }

        public List<GetQuizCourseList> CourseList { get; set; }         // when quiz NOT started
        public GetRandomQuestionByCourseResponse QuestionData { get; set; } // when quiz started

        public int? RemainingTime { get; set; }
        public Guid? CurrentCourseId { get; set; }
    }


    public partial class TotalMarksQuizWize
    {

        [Key]
        [Required]
        public Guid CourseId { get; set; }
        public string Course { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainedMarks { get; set; }
        public decimal Percentage { get; set; }
        public string TotalTime { get; set; }
    }


    public partial class QuizFinishedList
    {
        [Key]
        [Required]
        public Guid ConfigurationId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string CalendarFromDate { get; set; }
        public string CalendarToDate { get; set; }
        public string QuizName { get; set; }
        public string TestFrequency { get; set; }
    }


    public partial class QuizFinishedListEx
    {
        [Key]
        [Required]
        public Guid ConfigurationId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string CalendarFromDate { get; set; }
        public string CalendarToDate { get; set; }
        public string QuizName { get; set; }
        public string TestFrequency { get; set; }
        public string League { get; set; }

    }
    public partial class LeaderBoard
    {
        [Key]
        [Required]
        public Guid LeagueId { get; set; }
        public string LeagueName { get; set; }
        public string Month { get; set; }
        public string CourseDetail { get; set; }
    }
    public partial class LeaderBoardEx
    {
        [Key]
        [Required]
        public Guid LeagueId { get; set; }
        public string LeagueName { get; set; }
        public string City { get; set; }

        public string Month { get; set; }
        public string CourseDetail { get; set; }
        public bool IsEnable { get; set; }
    }
    public partial class Top10Leaguestudentdata
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }
        public int Rank { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public Guid ConfigurationId { get; set; }
        public Guid LeagueId { get; set; }
        public string TimeDifference { get; set; }
        public string AverageTime { get; set; }

        public string Percentage { get; set; }
        [Column(TypeName = "jsonb")]
        public string LogedSelfData { get; set; }



    }
    public partial class quizBreakdownofstudent
    {
        [Key]
        [Required]
        public Guid ConfigurationId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Rank { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public Guid LeagueId { get; set; }
        public string TimeDifference { get; set; }
        public string QuizName { get; set; }
        public bool IsRoutine { get; set; }

        public string Marks { get; set; }
        public string Percentage { get; set; }
        [Column(TypeName = "jsonb")]
        public string LogedSelfData { get; set; }



    }
    public partial class StudentPerformnce
    {
        [Key]
        [Required]
        public Guid CourseId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Rank { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string CourseName { get; set; }
        public decimal ObtainedMarks { get; set; }
        public int TotalSubjectMarks { get; set; }
        public string TimeDifference { get; set; }
        public string AverageTime { get; set; }

        public bool IsTop10 { get; set; }
        public decimal Percentage { get; set; }




    }
    public partial class QuizAllDoneOverAll
    {
        [Key]
        [Required]
        public Guid ConfigurationId { get; set; }
        public string TotalTime { get; set; }
        public decimal TotalMarks { get; set; }
        public decimal ObtainedMarks { get; set; }
        public int Correct { get; set; }
        public int InCorrect { get; set; }
        public int Skipped { get; set; }
        public int TotalQuestion { get; set; }
        public string Detail { get; set; }

    }
    public partial class GetLeagueList
    {

        public Guid SessionId { get; set; }
        public Guid CityId { get; set; }
        public Guid ClassId { get; set; }
        [Key]
        [Required]
        public Guid LeagueId { get; set; }
        public string FullName { get; set; }
        public int StatusId { get; set; }

    }

    public partial class GetLeagueListData
    {

        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public Guid CityId { get; set; }
        public string CityName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        [Key]
        [Required]
        public Guid LeagueId { get; set; }
        public string LeagueName { get; set; }
        public Guid ConfigurationId { get; set; }
        public string QuizName { get; set; }
        public int StatusId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }


    }



    public partial class GetCityConfigrationData
    {

        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public Guid CityId { get; set; }
        public string CityName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }

        [Key]
        [Required]
        public Guid ConfigurationId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int TestFrequency { get; set; }
        public string CalendarFromDate { get; set; }
        public string CalendarToDate { get; set; }
        public int StatusId { get; set; }
        public int IsProcessed { get; set; }
        public int IsActive { get; set; }
        public string ProcessedOn { get; set; }
        public string QuizName { get; set; }
        public decimal TimePerQuestion { get; set; }
        public decimal MarksPerQuestion { get; set; }

    }

    [Table("CityConfiguration", Schema = "Quiz")]
    public partial class CityConfiguration
    {
        [Key]
        [Required]
        public Guid ConfigurationId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int TestFrequency { get; set; }
        public DateTime? CalendarFromDate { get; set; }
        public DateTime? CalendarToDate { get; set; }
        public int StatusId { get; set; }
        public int IsProcessed { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int IsActive { get; set; }
        public DateTime? ProcessedOn { get; set; }
        public string QuizName { get; set; }
        public decimal TimePerQuestion { get; set; }
        public decimal MarksPerQuestion { get; set; }
        public string NotificationDescription { get; set; }

    }
}
