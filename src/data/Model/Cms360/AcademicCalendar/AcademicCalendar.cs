using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{
    [Table("AcademicCalendar", Schema = "AcademicCalendar")]
    public class AcademicCalendar
    {
        [Key]

        public Guid AcademicCalendarId { get; set; }
        public Guid AcademicCalendarTypeId { get; set; }
        public Guid TopicId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Description { get; set; }
        public Guid HolidayTypeId { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string TopicIds { get; set; }
        public string TopicValue { get; set; }
        public Guid CourseId { get; set; }
        public string ChapterName { get; set; }



    }

    public class MonthlyPlannerReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public bool? IsHoliday { get; set; }
        public string Day { get; set; }
        public string Day1 { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public string TopicDescription { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string CourseName { get; set; }

    }
    public class SubWiseCalendarReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public bool? IsHoliday { get; set; }
        public string Day { get; set; }
        public string Day1 { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string Description { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string CourseName { get; set; }

    }

    public class AcademicCalendarView
    {

        [Key]

        public Guid AcademicCalendarId { get; set; }

        public string CalendarName { get; set; }

        public string SubCity { get; set; }

        public string Topic { get; set; }

        public Guid? TopicId { get; set; }
        public Guid? CourseId { get; set; }

        public Guid? ChapterId { get; set; }

        public Guid? BoardId { get; set; }


        public Guid? HolidayTypeId { get; set; }

        public Guid? AcademicCalendarTypeId { get; set; }







        public string Course { get; set; }

        public string Chapter { get; set; }


        public string Session { get; set; }


        public string Board { get; set; }


        public string Class { get; set; }

        public string HolidayType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public Guid AcademicCalendarMasterId { get; set; }

    }

    public class GetRandomQuestionByCourse
    {

        [Key]
        public string QuestionId { get; set; }

    }
    public class SubmitQuizResponse
    {

        [Key]
        public string Result { get; set; }

    }
    public class GetRandomQuestionByCourseResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<QuestionData> Data { get; set; }
    }

    public class QuestionData
    {
        public int Id { get; set; }
        public string Statement { get; set; }
        public int QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public int QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; }
        public string AnswerExplanation { get; set; }
        public List<McqOption> McqOptions { get; set; }
    }

    public class McqOption
    {
        public int Id { get; set; }
        public string OptionName { get; set; }
        public string OptionValue { get; set; }
        public bool CorrectAnswer { get; set; }
        public bool IsSelected { get; set; }
    }
    public class GetQuizConfigrationDataResponse
    {
        public Guid AcademicCalendarMasterId { get; set; }
        [Key]
        public Guid ConfigurationId { get; set; }
        public Guid CityId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ClassId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int TestFrequency { get; set; }
        public string ProcessedOn { get; set; }
        public string QuizName { get; set; }
        public bool IsEnable { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsEbook { get; set; }
        public string CalendarFromDate { get; set; }
        public string CalendarToDate { get; set; }
        public string TimePerQuestion { get; set; }


    }
    public class GetQuizConfigrationDataResponseEx
    {
        public Guid AcademicCalendarMasterId { get; set; }
        [Key]
        public Guid ConfigurationId { get; set; }
        public Guid CityId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ClassId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int TestFrequency { get; set; }
        public string ProcessedOn { get; set; }
        public string QuizName { get; set; }
        public bool IsEnable { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsStart { get; set; }
        public bool IsEbook { get; set; }
        public string CalendarFromDate { get; set; }
        public string CalendarToDate { get; set; }
        public string TimePerQuestion { get; set; }


    }
    public class GetQuizConfigrationDataResponseExNew
    {
        public Guid AcademicCalendarMasterId { get; set; }
        [Key]
        public Guid ConfigurationId { get; set; }
        public Guid CityId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ClassId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int TestFrequency { get; set; }
        public string ProcessedOn { get; set; }
        public string QuizName { get; set; }
        public bool IsEnable { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsStart { get; set; }
        public bool IsEbook { get; set; }
        public string CalendarFromDate { get; set; }
        public string CalendarToDate { get; set; }
        public string TimePerQuestion { get; set; }
        public string League { get; set; }



    }

    public class GetQuizCourseList
    {
        public Guid ConfigurationId { get; set; }
        [Key]
        public Guid CourseId { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string Title { get; set; }
        public string FullName { get; set; }
        public decimal TestFrequency { get; set; }
        public decimal TimePerQuestion { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public bool? IsAllow { get; set; }
        public string TimeTaken { get; set; }


    }
    public class League
    {
        [Key]
        public Guid LeagueId { get; set; }
        public string FullName { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsActive { get; set; }
        public int StatusId { get; set; }
        public string ConfigurationId { get; set; }
        public string Session { get; set; }
        public string City { get; set; }
        public string Class { get; set; }


    }


    public class ConfigurationApiResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public ConfigurationData Data { get; set; }
    }

    public class ConfigurationData
    {
        public string Title { get; set; }
        public string OrganizationCode { get; set; }
        public string Subject { get; set; }
        public int PerSubjectQuestions { get; set; }
        public string PerQuestionTime { get; set; }
        public int PerQuestionMarks { get; set; }
        public List<ComplexityDetail> ComplexityDetails { get; set; }
    }

    public class ComplexityDetail
    {
        public string Complexity { get; set; }
        public int MinQuestions { get; set; }
    }

    public class QuizSummeryData
    {
        [Key]
        public Guid Id { get; set; }
        public decimal TotalStudent { get; set; }
        public decimal TotalPush { get; set; }
        public decimal TotalSubmmited { get; set; }
        public decimal ResponseRate { get; set; }

    }
    public class QuizSummeryDataCityWise
    {
        [Key]
        public Guid Id { get; set; }
        public string CityName { get; set; }
        public decimal TotalStudent { get; set; }
        public decimal TotalPush { get; set; }
        public decimal TotalSubmmited { get; set; }
        public decimal ResponseRate { get; set; }

    }
    public class QuizSummeryDataQuizWise
    {
        [Key]
        public Guid Id { get; set; }
        public string QuizName { get; set; }
        public decimal TotalStudent { get; set; }
        public decimal TotalPush { get; set; }
        public decimal TotalSubmmited { get; set; }
        public decimal ResponseRate { get; set; }

    }
    public class GetArvoSubjectList
    {
        [Key]
        public string SubjectName { get; set; }

    }
    public class QuizTopStudentSession
    {
        [Key]
        public Guid Id { get; set; }
        public int SerialNumber { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string City { get; set; }
        public Guid? ConfigurationId { get; set; }
        public Guid? LeagueId { get; set; }
        public string TimeDifference { get; set; }
        public string Percentage { get; set; }
        public decimal CourseQuestionCounte { get; set; }
        public decimal ResponseRate { get; set; }


    }
    public class QuizTopStudentSessionCourse
    {
        [Key]
        public Guid Id { get; set; }
        public int SerialNumber { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string City { get; set; }
        public Guid? ConfigurationId { get; set; }
        public Guid? LeagueId { get; set; }
        public string TimeDifference { get; set; }
        public string Percentage { get; set; }
        public decimal CourseQuestionCounte { get; set; }
        public decimal ResponseRate { get; set; }
        public string Course { get; set; }


    }

    public class QuizTopStudentSessionEx
    {
        [Key]
        public Guid Id { get; set; }
        public int SerialNumber { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string City { get; set; }
        public Guid? ConfigurationId { get; set; }
        public Guid? LeagueId { get; set; }
        public string TimeDifference { get; set; }
        public string Percentage { get; set; }
        public decimal CourseQuestionCounte { get; set; }
        public decimal ResponseRate { get; set; }
        public string AverageTime { get; set; }


    }
    public class QuizTopStudentSessionCourseEx
    {
        [Key]
        public Guid Id { get; set; }
        public int SerialNumber { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string City { get; set; }
        public Guid? ConfigurationId { get; set; }
        public Guid? LeagueId { get; set; }
        public string TimeDifference { get; set; }
        public string Percentage { get; set; }
        public decimal CourseQuestionCounte { get; set; }
        public decimal ResponseRate { get; set; }
        public string Course { get; set; }
        public string AverageTime { get; set; }

    }
    public class QuizWeeklyPerformanceResponse
    {
        [Key]
        public Guid Id { get; set; }
        public string QuizName { get; set; }
        public decimal TotalStudent { get; set; }
        public decimal TotalPush { get; set; }
        public decimal TotalSubmmited { get; set; }
        public decimal ResponseRate { get; set; }
        public decimal Percentage { get; set; }


    }
    public class QuizSubjectWisePerformance
    {
        [Key]
        public Guid Id { get; set; }
        public string Percentage { get; set; }
        public string Course { get; set; }

    }
    public class QuizCityWisePerformance
    {
        [Key]
        public Guid Id { get; set; }
        public string Percentage { get; set; }
        public string City { get; set; }

    }
    public class QuizTimeWiseOverAllPerformance
    {
        [Key]
        public Guid Id { get; set; }
        public string Percentage { get; set; }
        public string City { get; set; }
        public string Time { get; set; }



    }
    public class QuizTimeWiseOverAllPerformanceSessionBased
    {
        [Key]
        public Guid Id { get; set; }
        public string Percentage { get; set; }
        public string Time { get; set; }



    }
    public class QuizSubCityOverAllPerformance
    {
        [Key]
        public Guid Id { get; set; }
        public string SubCity { get; set; }
        public decimal TotalMarks { get; set; }
        public decimal ObtainedMarks { get; set; }
        public string Percentage { get; set; }



    }



}










