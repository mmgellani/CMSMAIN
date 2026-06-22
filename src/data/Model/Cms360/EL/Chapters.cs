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
    [Table("Chapters", Schema = "EL")]
    public partial class ELChapters
    {
        [Key]
        [Required]
        public Guid ChapterId { get; set; }

        [Required]
        public string Abbreviation { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public int OrderNo { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int StatusId { get; set; }

        public Guid CourseId { get; set; }

        public Guid? BoardId { get; set; }

        public Guid? ClassId { get; set; }


    }
    // [Table("Chapters", Schema = "ELearning")]
    // public partial class ELChapters
    // {
    //     [Key]
    //     [Required]
    //     public Guid ChapterId { get; set; }
    //     public string FullName { get; set; }
    //     public string Description { get; set; }


    //     public int StatusId { get; set; }

    // }

    [Table("McqAttempted", Schema = "EL")]
    public class McqAttempted
    {
        [Key]
        public Guid McqAttemptId { get; set; }
        public Guid UserId { get; set; }
        public string TopicId { get; set; }
        public DateTime OperationOn { get; set; }
        public int Duration { get; set; }
        public int Percentage { get; set; }
    }

    [Table("UserMcqResponse", Schema = "EL")]
    public class UserMcqResponse
    {
        [Key]
        public Guid UserMcqResponseId { get; set; }
        public Guid UserId { get; set; }
        public string TopicId { get; set; }
        [Column(TypeName = "jsonb")]
        public String Operations { get; set; }
        public int StatusId { get; set; }
    }

    public class McqOperation
    {
        public bool Answer { get; set; }
        public string AnswerId { get; set; }
        public string QuestionId { get; set; }
        public bool IsPastPaper { get; set; }
    }
    public class ChaptersTopicData
    {
        [Key]
        public string Id { get; set; }
        public string Model { get; set; }
    }
    public class GenericResponse<T>
    {
        public string Code { get; set; }

        public string Message { get; set; }

        public List<T> data { get; set; }

    }
    public class Chapter
    {
        public int chapterId { get; set; }
        public string chapterTitle { get; set; }
        public List<Topic> topics { get; set; }
    }
    public class ChapterTest
    {
        public int chapterId { get; set; }
        public string chapterTitle { get; set; }
        public string organizationSubject { get; set; }
        public List<TopicTest> topics { get; set; }
    }

    public class ChapterTestNew
    {
        [Key]
        public Guid ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public string Topics { get; set; }
    }

    public class ChapterTestLatest
    {
        [Key]
        public Guid ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public List<TopicEms> Topics { get; set; }
    }

    public class TopicTest
    {
        public int id { get; set; }
        public string name { get; set; }
        public int subjectGroupId { get; set; }
        public List<TopicTest> topics { get; set; }

    }
    public class Topic
    {
        public int id { get; set; }
        public string name { get; set; }
        public int subjectGroupId { get; set; }
        public List<Topic> topics { get; set; }

    }
    public class slTopic
    {
        public string TopicId { get; set; }
        public string Code { get; set; }
        public string FullName { get; set; }
        public string VideoLink { get; set; }
        public string TVideoLink { get; set; }
    }
    public class TopicEms
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public int subjectGroupId { get; set; }
        public List<TopicEms> topics { get; set; }

    }
    public class ChapAndTopicsResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public Data Data { get; set; }
    }
    public class Data
    {
        public List<ProgramCombo> ProgramCombos { get; set; }
        public List<Subject> Subjects { get; set; }
    }
    public class ProgramCombo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public LanguageMedium LanguageMedium { get; set; }
        public ProgramLevel ProgramLevel { get; set; }
        public StudentClass StudentClass { get; set; }
        public StudentBoard StudentBoard { get; set; }
    }
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool? IsBiteSizedVideoInclude { get; set; }
    }
    public class LanguageMedium
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class ProgramLevel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class StudentClass
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }

    public class StudentBoard
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class SlSubjectList
    {
        public string Id { get; set; } // Assuming the ID is now an integer
        public string FullName { get; set; }
        public int? MaxWatched { get; set; }
        public int? Remaining { get; set; }
        public int? OrderNumber { get; set; }
    }
    public class EMSSlSubjectList
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public int? MaxWatched { get; set; }
        public int? Remaining { get; set; }
        public int? OrderNumber { get; set; }
    }
    public class TopicListResponseTest
    {
        public bool succeeded { get; set; }
        public string message { get; set; }
        public int httpStatusCode { get; set; }
        public int totalCounts { get; set; }
        public List<ChapterTest> data { get; set; }
    }
    public class GTSLChapeters
    {
        [Key]

        public Guid Id { get; set; }

        public String FullName { get; set; }

        public int MaxWatched { get; set; }

        public int Remaining { get; set; }

        public int OrderNumber { get; set; }
        public string Topics { get; set; }

    }
    public class SlTopic
    {
        public string TopicId { get; set; }
        public string Code { get; set; }
        public string FullName { get; set; }
        public string VideoLink { get; set; }
        public string TVideoLink { get; set; }
    }


    public class TopicListResponse
    {
        public bool succeeded { get; set; }
        public string message { get; set; }
        public int httpStatusCode { get; set; }
        public int totalCounts { get; set; }
        public List<Chapter> data { get; set; }
    }


    //_________________New Model_____________________________________

    //public class McqData
    //{
    //    public List<McqResponse> Data { get; set; }
    //}

    //public class McqResponse
    //{
    //    public string Qid { get; set; }
    //    public string FullQuestion { get; set; }
    //    public int QuestionType { get; set; }
    //    public int DifficultyLevel { get; set; }
    //    public List<McqOption> Answers { get; set; }
    //}

    //public class McqOption
    //{
    //    public string AnswerId { get; set; }
    //    public string FullAnswer { get; set; }
    //    public string Reason { get; set; }
    //    public int IsCorrect { get; set; }
    //    public int OrderNumber { get; set; }
    //}







    //___________________________________________________________OLD MODEL______________________________________//

    public class McqResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public McqData Data { get; set; }
    }

    public class McqData
    {
        public string ContentType { get; set; }
        public List<McqItem> Data { get; set; }
    }

    public class McqItem
    {

        public int id { get; set; }

        public String statement { get; set; }

        public Int32 questionNatureId { get; set; }

        public Int32 questionDifficultyId { get; set; }
        public String questionLanguageName { get; set; }
        public string answerExplanation { get; set; }

        public List<McqOptionNew> mcqoptions { get; set; }
        public string TopicName { get; set; }
        public string QuestionDifficultyName { get; set; }
        public string QuestionSourceName { get; set; }
        public string QuestionNatureName { get; set; }
        public List<GeneralContentPastPaper> GeneralContentPastPapers { get; set; }
        public string subjectName { get; set; }

    }

    public class McqOptionNew
    {
        public int Id { get; set; }
        public string OptionName { get; set; }
        public string OptionValue { get; set; }
        public bool CorrectAnswer { get; set; }
        public object VideoURL { get; set; }
        public object AnswerExplanation { get; set; }
        public int McqId { get; set; }
    }


    public class GeneralContentPastPaper
    {
        public int Id { get; set; }
        public int YearId { get; set; }
        public int BoardId { get; set; }
        public int McqId { get; set; }
        public string YearName { get; set; }
        public string BoardName { get; set; }
        public string PastPaper { get; set; }


    }
    public class TopicContent
    {
        public int FrontEndTopicId { get; set; }
        public string TopicName { get; set; }
        public int? BookId { get; set; }
        public string BookName { get; set; }
        public string Language { get; set; }
        public int? Sequence { get; set; }
        public int? ParentId { get; set; }
        public List<TopicContent> FrontendTopicContents { get; set; }
        public int TotalMcqsCount { get; set; }
        public int TotalShortQuestionCount { get; set; }
        public int TotalLongQuestionCount { get; set; }
        public int TotalVideosCount { get; set; }
        public int TotalExamCount { get; set; }
    }

    public class ApiResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<TopicContent> Data { get; set; }
    }
    public class LongQuestData
    {
        public string ContentType { get; set; }
        public List<DataNum> Data { get; set; }
    }

    public class DataNum
    {
        public object FetSequence { get; set; }
        public int FrontendTopicId { get; set; }
        public int Id { get; set; }
        public string Question { get; set; }
        public string VideoURL { get; set; }
        public string Answer { get; set; }
        public int? ContentTagId { get; set; }
        public int? QuestionSourceId { get; set; }
        public string QuestionSourceName { get; set; }
        public int? QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public int QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; }
        public int? QuestionNatureId { get; set; }
        public string QuestionNatureName { get; set; }
        public int? Sequence { get; set; }
        public int? BookId { get; set; }
        public string BookTitle { get; set; }
        public int ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public object BoardId { get; set; }
        public object BoardName { get; set; }
        public object YearId { get; set; }
        public object YearName { get; set; }
        public int? TopicId { get; set; }
        public string TopicName { get; set; }
        public List<GeneralContentPastPapersLongQuestion> GeneralContentPastPapersLongQuestion { get; set; }
    }

    public class GeneralContentPastPapersLongQuestion
    {
        public int? Id { get; set; }
        public int? YearId { get; set; }
        public int? BoardId { get; set; }
        public int? LongQuestionId { get; set; }
        public string BoardName { get; set; }
        public string YearName { get; set; }
        public string PastPaper { get; set; }
    }
    public class ShortQuesResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public ShortData Data { get; set; }
    }

    public class ShortData
    {
        public string ContentType { get; set; }
        public List<Datavalue> Data { get; set; }
    }

    public class DatavalueLq
    {
        public object FetSequence { get; set; }
        public int? FrontendTopicId { get; set; }
        public int? Id { get; set; }
        public string Question { get; set; }
        public string VideoUrl { get; set; }
        public string Answer { get; set; }
        public int? ContentTagId { get; set; }
        public int? QuestionSourceId { get; set; }
        public string QuestionSourceName { get; set; }
        public int? QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public int? QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; }
        public int? QuestionNatureId { get; set; }
        public string QuestionNatureName { get; set; }
        public int? Sequence { get; set; }
        public int? BookId { get; set; }
        public string BookTitle { get; set; }
        public int? ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public object BoardId { get; set; }
        public object BoardName { get; set; }
        public object YearId { get; set; }
        public object YearName { get; set; }
        public List<GeneralContentPastPapersLongQuestion> GeneralContentPastPapersLongQuestion { get; set; }
        public int? TopicId { get; set; }
        public string TopicName { get; set; }
    }




    public class Datavalue
    {
        public object FetSequence { get; set; }
        public int? FrontendTopicId { get; set; }
        public int? Id { get; set; }
        public string Question { get; set; }
        public string VideoUrl { get; set; }
        public string Answer { get; set; }
        public int? ContentTagId { get; set; }
        public int? QuestionSourceId { get; set; }
        public string QuestionSourceName { get; set; }
        public int? QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public int? QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; }
        public int? QuestionNatureId { get; set; }
        public string QuestionNatureName { get; set; }
        public int? Sequence { get; set; }
        public int? BookId { get; set; }
        public string BookTitle { get; set; }
        public int? ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public object BoardId { get; set; }
        public object BoardName { get; set; }
        public object YearId { get; set; }
        public object YearName { get; set; }
        public List<GeneralContentPastPapersShortQuestion> GeneralContentPastPapersShortQuestion { get; set; }
        public int? TopicId { get; set; }
        public string TopicName { get; set; }
        public string subjectName { get; set; }
    }


    public class GeneralContentPastPapersShortQuestion
    {
        public int? Id { get; set; }
        public int? YearId { get; set; }
        public int? BoardId { get; set; }
        public int? ShortQuestionId { get; set; }
        public string BoardName { get; set; }
        public string YearName { get; set; }
        public string PastPaper { get; set; }
    }

    public class QuestionResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public LongQuestData Data { get; set; }
    }




    public class McqSecondaryTopic
    {
        public int Id { get; set; }
        public int McqId { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }
    }


    public class QuestionMcQEx
    {

        public string qid { get; set; }
        public string topicName { get; set; }
        public string SubjectName { get; set; }
        public string fullquestion { get; set; }
        public int questiontype { get; set; }
        public int difficultylevel { get; set; }


        public string QuestionDifficultyName { get; set; }
        public string QuestionSourceName { get; set; }
        public string QuestionNatureName { get; set; }
        public string boards { get; set; }
        public string subject { get; set; }
        public string answers { get; set; }
    }


    public class AnswerQuiz
    {
        public string AnswerId { get; set; }
        public string FullAnswer { get; set; }
        public string Reason { get; set; }
        public int IsCorrect { get; set; }
        public int? OrderNumber { get; set; }
    }



    public class Content
    {
        public string ContentType { get; set; }
        public List<int> ContentIds { get; set; }
    }

    public class ContentTopic
    {
        public string ContentType { get; set; }
        public List<ContentDetail> contentDetail { get; set; }
    }

    public class ContentDetail
    {
        public int ContentId { get; set; }
        public List<ContentTopicDetail> TopicDetails { get; set; }
    }



    public class ContentTopicDetail
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }


    public class Attachments
    {
        public int AttachmentTypeId { get; set; }
        public List<int> AttachmentIds { get; set; }
    }

    public class Subjects
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class SLContent
    {
        public string TopicId { get; set; }
        public string Code { get; set; }
        public string FullName { get; set; }
        public string VideoLink { get; set; }
        public string TVideoLink { get; set; }
        public string ContentType { get; set; } // New Property
        public int BiteSize { get; set; } // New Property
        public string InContentId { get; set; } // New Property
    }
    public class QRData
    {
        public Guid QrCodeId { get; set; }
        public string Title { get; set; }
        public bool isFaulty { get; set; }
        public List<Subjects> Subjects { get; set; }
        public List<Content> Content { get; set; }
        public List<Attachments> Attachments { get; set; }
    }

    public class QRResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public QRData Data { get; set; }
    }





    public class ContentResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public ContentData Data { get; set; }
    }

    public class ContentData
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<Datavalue> Data { get; set; }
    }

    public class ContentDataLq
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<DatavalueLq> Data { get; set; }
    }

    public class QuestionContent
    {
        public int Id { get; set; }
        public string Statement { get; set; }
        public int? QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public int? QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; }
        public string AnswerExplanation { get; set; }
        public List<McqContent> McqOptions { get; set; }
    }

    public class McqContent
    {
        public int? Id { get; set; }
        public string OptionName { get; set; }
        public string OptionValue { get; set; }
        public bool CorrectAnswer { get; set; }
    }

    public class VideoDataResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<VideoData> Data { get; set; }
    }

    public class VideoData
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string AccessURL { get; set; }
        public int? Sequence { get; set; }
        public int? ContentTagId { get; set; }
        public int? BookId { get; set; }
        public string BookTitle { get; set; }
        public int? ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public string SecureVideoURL { get; set; }
        public int? QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public string VimeoURL { get; set; }
        public int? VideoCategoryId { get; set; }
        public string VideoCategoryName { get; set; }
        public List<VideoIntervals> VideoIntervals { get; set; }
        public string topicName { get; set; }
        public string subjectName { get; set; }
    }

    public class VideoIntervals
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string StartAt { get; set; }
        public string EndAt { get; set; }
        public int? Sequence { get; set; }
    }

    public class VideoDataResponseEx
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public VideoDataContainer Data { get; set; }
    }
    public class VideoDataContainer
    {
        public string ContentType { get; set; }
        public List<VideoDataEX> Data { get; set; }
    }
    public class VideoDataEX
    {

        public string EnforceTimeStamp { get; set; }
        public string FetSequence { get; set; }
        public int FrontendTopicId { get; set; }
        public int Id { get; set; }
        public string Title { get; set; }
        public string AccessURL { get; set; }
        public int? Sequence { get; set; }
        public int ContentTagId { get; set; }
        public int? BookId { get; set; }
        public string BookTitle { get; set; }
        public int? ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public string SecureVideoURL { get; set; }
        public int QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public string VimeoURL { get; set; }
        public int VideoCategoryId { get; set; }
        public string VideoCategoryName { get; set; }
        public string topicName { get; set; }
        public string SubjectName { get; set; }
        public List<object> VideoIntervals { get; set; }
    }

    public class MapVideoData
    {
        public string topicId { get; set; }
        public string topicName { get; set; }
        public string SubjectName { get; set; }

        public string chapterId { get; set; }
        public string tCode { get; set; }
        public string fullName { get; set; }
        public string description { get; set; }
        public string videoLink { get; set; }
        public int? orderNumber { get; set; }
        public int isEnable { get; set; } = 1;
        public int maxWatched { get; set; } = 0;
        public string subject { get; set; }
    }
    public class MapCMSVideoData
    {
        [Key]
        public string topicId { get; set; }
        public string chapterId { get; set; }
        public string tCode { get; set; }
        public string fullName { get; set; }
        public string description { get; set; }
        public string videoLink { get; set; }
        public int? orderNumber { get; set; }
        public int isEnable { get; set; } = 1;
    }

    public class StudentCourseList
    {
        [Key]
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public int MaxWatched { get; set; }
        public int Remaining { get; set; }
        public int OrderNumber { get; set; }

    }

    public class GetBoardList

    {
        [Key]

        public Guid boardid { get; set; }
        public string boardname { get; set; }
    }
    public class GifDataResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<GifData> Data { get; set; }
    }
    public class GifData
    {
        public int id { get; set; }
        public string title { get; set; }
        public string value { get; set; }
    }



    public class EbookApiResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public EbooksData Data { get; set; }
    }

    public class EbooksData
    {
        public string OrganizationCode { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public List<SubjectBook> SubjectBooks { get; set; }
    }
    public class StudentCourses
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string OrganizationCode { get; set; }
        public string SessionCode { get; set; }
        public string ProgramLevel { get; set; }
        public string Class { get; set; }
        public string Board { get; set; }
        public string Medium { get; set; }
        public string Course { get; set; }
        public bool? IsEbook { get; set; }
        public string Email { get; set; }
    }
    public class ResponseDataBookBind
    {
        public string Email { get; set; }

        public List<SubjectBook> SubjectBooks { get; set; }
    }
    public class SubjectBook
    {
        public string Subject { get; set; }
        public List<BookHash> BookHashes { get; set; }
    }

    public class BookHash
    {
        public string BookCode { get; set; }
        public string Hash { get; set; }
        public string Title { get; set; }
        public string CoverURL { get; set; }
        public string ProgramCombo { get; set; }
        public string Session { get; set; }
    }


    public class GameData
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
        public bool? IsPortrait { get; set; }
        public bool? IsRotation { get; set; }
        public bool? IsSpeedControl { get; set; }
        public bool? IsZoom { get; set; }
        public string SkyboxUrl { get; set; }
        public int? TotalAnimations { get; set; }
    }

    public class GameDataResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<GameData> Data { get; set; }
    }


    public class ResponsProgramConboChaptere
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<ProgramCoboContent> Data { get; set; }
    }


    public class ProgramCoboContent
    {
        public int ChapterId { get; set; }
        public int ChapterNumber { get; set; }
        public string ChapterName { get; set; }
        public string organizationSubjectCode { get; set; }
        public bool? sloBased { get; set; }
        public List<Content> Content { get; set; }
        public List<ContentTopic> TopicContent { get; set; }
    }

    public class CreatTestLimit
    {
        public int QCount { get; set; }
        public int? Year { get; set; }
        public List<MapChapterData> Data { get; set; }
        public string Module { get; set; }
        public string UserEmail { get; set; }
        public string Device { get; set; }

    }

    public class SetupTagsModel
    {

        public string Organization { get; set; }
        public string Module { get; set; }
        public string UserEmail { get; set; }
        public string Device { get; set; }

    }


    public class MapChapterData
    {

        public string Id { get; set; }
        public string FullName { get; set; }
        public int MaxWatched { get; set; }
        public int Remaining { get; set; }
        public int OrderNumber { get; set; }
        public List<Content> Content { get; set; }
        public List<ContentTopic> TopicContent { get; set; }
        public bool IsArvo { get; set; }
        public bool? sloBased { get; set; }
    }

    public class RequestDataBookBind
    {
        public string organizationCode { get; set; }
        public string email { get; set; }

    }
    public class ArvoApiResponseBookBind
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public ResponseDataBookBind Data { get; set; }
    }

    public class ResponseData
    {
        public string Email { get; set; }

        public List<SubjectBook> SubjectBooks { get; set; }
    }
    public class RequestBodyBookBindRegister
    {


        public string organizationCode { get; set; }

        public string email { get; set; }

        public string session { get; set; }

        public string programLevel { get; set; }


        public string @class { get; set; }

        public string board { get; set; }
        public string medium { get; set; }

        public string[] subjects { get; set; }
    }
    public class ResponseDataBookBindEx
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public bool Data { get; set; }
    }

    public class ApiResponseTestYourself
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; } = string.Empty;
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public QuizDataTestYourself Data { get; set; }
    }

    public class QuizDataTestYourself
    {
        public int Id { get; set; }
        public int NumberOfQuestions { get; set; }
        public bool ShuffleQuestion { get; set; }
        public bool NegativeMarking { get; set; }
        public string QuizName { get; set; } = string.Empty;
        public List<BookQuizQuestionTestYourself> BookQuizQuestions { get; set; }
    }

    public class BookQuizQuestionTestYourself
    {
        public int Id { get; set; }
        public string QuestionNumber { get; set; } = string.Empty;
        public double Marks { get; set; }
        public double? NegativeMarks { get; set; }
        public int ContentId { get; set; }
        public int ContentTypeId { get; set; }
        public QuizQuestionDetailTestYourself QuizQuestionDetail { get; set; }
    }

    public class QuizQuestionDetailTestYourself
    {
        public int FrontendTopicId { get; set; }
        public int? FetSequence { get; set; }
        public int ContentTagId { get; set; }
        public int QuestionSourceId { get; set; }
        public string QuestionSourceName { get; set; } = string.Empty;
        public int QuestionNatureId { get; set; }
        public string QuestionNatureName { get; set; } = string.Empty;
        public int? BookId { get; set; }
        public string BookTitle { get; set; }
        public int? ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public int Sequence { get; set; }
        public int ProgramComboId { get; set; }
        public string ProgramComboName { get; set; } = string.Empty;
        public int? SubjectId { get; set; }
        public string SubjectName { get; set; }
        public bool IsViewed { get; set; }
        public string SelectedOption { get; set; } = string.Empty;
        public string CorrectOption { get; set; } = string.Empty;
        public int Id { get; set; }
        public string Statement { get; set; } = string.Empty;
        public int QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; } = string.Empty;
        public int QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; } = string.Empty;
        public string AnswerExplanation { get; set; } = string.Empty;
        public int TopicId { get; set; }
        public string TopicName { get; set; } = string.Empty;
        public List<McqOptionTestYourself> McqOptions { get; set; }
        public List<GeneralContentPastPaperTestYourself> GeneralContentPastPapers { get; set; }
    }

    public class McqOptionTestYourself
    {
        public int Id { get; set; }
        public string OptionName { get; set; } = string.Empty;
        public string OptionValue { get; set; } = string.Empty;
        public bool CorrectAnswer { get; set; }
    }

    public class GeneralContentPastPaperTestYourself
    {
        public int Id { get; set; }
        public int YearId { get; set; }
        public int BoardId { get; set; }
        public int McqId { get; set; }
        public string YearName { get; set; } = string.Empty;
        public string BoardName { get; set; } = string.Empty;
        public string PastPaper { get; set; } = string.Empty;
    }


    public class ResponseBlanks
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<DataBlanks> Data { get; set; }
    }

    public class DataBlanks
    {
        public int Id { get; set; }
        public string Statement { get; set; }
        public string Identifier { get; set; }
        public int? ContentTagId { get; set; }
        public int? SubjectId { get; set; }
        public string SubjectName { get; set; }
        public int? TopicId { get; set; }
        public string TopicName { get; set; }
        public int? ProgramComboId { get; set; }
        public string ProgramComboName { get; set; }
        public int? QuestionSourceId { get; set; }
        public string QuestionSourceName { get; set; }
        public int? QuestionNatureId { get; set; }
        public string QuestionNatureName { get; set; }
        public int? QuestionDifficultyId { get; set; }
        public string QuestionDifficultyName { get; set; }
        public int? QuestionLanguageId { get; set; }
        public string QuestionLanguageName { get; set; }
        public List<AnswerBlanks> Answers { get; set; }
        public List<SecondaryTopicBlanks> SecondaryTopics { get; set; }
    }

    public class AnswerBlanks
    {
        public int Id { get; set; }
        public string Answer { get; set; }
        public int? Sequence { get; set; }
    }

    public class SecondaryTopicBlanks
    {
        public int Id { get; set; }
        public int? FillInTheBlankId { get; set; }
        public int? TopicId { get; set; }
        public string TopicName { get; set; }
    }








}