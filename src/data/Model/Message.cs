using System.Runtime.ConstrainedExecution;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms.Data.Model
{
    [Table("SmsAPI", Schema = "Message")]
    public class SmsAPI
    {
        [Key]
        public Guid SmsApId { get; set; }
        public string LoginId { get; set; }
        public string Password { get; set; }
        public string ShortCodePref { get; set; }
        public string IsUnicode { get; set; }
        public string Mask { get; set; }
    }

    [Table("Templates", Schema = "Message")]
    public class Templates
    {
        [Key]
        public Guid TemplateId { get; set; }
        public string Type { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public int SendSms { get; set; }
        public int SendNotification { get; set; }
    }

    [Table("Sms", Schema = "Message")]
    public partial class Sms
    {
        [Key]
        public Guid MessageId { get; set; }
        public string MessageNo { get; set; }
        public string MessageText { get; set; }
        public DateTime QuedDate { get; set; }
        public DateTime SendDate { get; set; }
        public string SendTo { get; set; }
        public decimal Status { get; set; }

        public Guid? SmsApId { get; set; }
    }

    [Table("SmsApproval", Schema = "Message")]
    public partial class SmsApproval
    {
        [Key]
        public Guid MessageId { get; set; }
        public string MessageNo { get; set; }
        public string MessageText { get; set; }
        public DateTime QuedDate { get; set; }
        public DateTime SendDate { get; set; }
        public string SendTo { get; set; }
        public decimal Status { get; set; }

        public Guid? SmsApId { get; set; }

        public bool IsApproved { get; set; }
        public int UserId { get; set; }
    }

    [Table("SmsSys", Schema = "Message")]
    public partial class SmsSys
    {
        [Key]
        public Guid MessageId { get; set; }
        public string MessageNo { get; set; }
        public string MessageText { get; set; }
        public DateTime QuedDate { get; set; }
        public DateTime SendDate { get; set; }
        public string SendTo { get; set; }
        public decimal Status { get; set; }

        public Guid? SmsApId { get; set; }

        public Guid? AdmissionFormId { get; set; }

        public Guid? CampusProgramId { get; set; }
    }

    [Table("VWCustomData", Schema = "Message")]
    public partial class VWCustomData
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public int StatusId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }

        public string StudentContactNo { get; set; }

        public string ParentContactNo { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public Guid SectionId { get; set; }
        public string SectionName { get; set; }
    }

    public class MessageRequest
    {
        public string MessageText { get; set; }
        public string[] SendToList { get; set; }
    }

     public class ExamSmSApprovalStdData
    {
        [Key]
       
        public Guid admissionformid { get; set; }
        public Guid campusprogramid { get; set; }
        public string parentcontactno { get; set; }
        public Guid examsmsapprovalid { get; set; }
        public Guid smsapid { get; set; }
        public string mask { get; set; }


    
    }

    public class MessageRequestModel
    {
        public string MessageText { get; set; }
        public string SendToList { get; set; }
    }

    public class MessageApproval
    {

        [Key]
        public Guid ViewId { get; set; }
        public string MessageText { get; set; }
        public int Recipients { get; set; }
        public int MessageCount { get; set; }
        public DateTime QuedDate { get; set; }
        public bool IsApproved { get; set; }
        public string Mask { get; set; }
        public int UserId { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
         public bool Ischecked { get; set; }
    }

    public class MessageApprovalEx
    {

        [Key]
        public Guid ViewId { get; set; }
        public string MessageText { get; set; }
        public int Recipients { get; set; }
        public int MessageCount { get; set; }
        public string SmsStatus { get; set; }
        public DateTime QuedDate { get; set; }
        public bool IsApproved { get; set; }
        public string Mask { get; set; }
        public int UserId { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
    }

    public class MessageApprovalEx1
    {

        [Key]
        public Guid ViewId { get; set; }
        public string MessageText { get; set; }
        public int Recipients { get; set; }
        public int MessageCount { get; set; }
        public string SmsStatus { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsApproved { get; set; }
        public string Mask { get; set; }
        public int UserId { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
    }
    public class NotificationReport
    {
        [Key]
        public Guid BulkNotificationId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public string NotificationText { get; set; }
        public int TextCount { get; set; }
        public string Sessions { get; set; }
        public string Campus { get; set; }
        public string ProgramDetail { get; set; }
        public string Classes { get; set; }
        public string Sections { get; set; }
        public string Rollno { get; set; }
        public string Statuses { get; set; }
        public string ÄpprovalStatus { get; set; }
        public DateTime Qdate { get; set; }
        public DateTime? Sdate { get; set; }

    }

     public class NotificationReportEx
    {
        [Key]
        public Guid BulkNotificationId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
         public DateTime Fromdate { get; set; }
          public DateTime Todate { get; set; }
         public string Title { get; set; }

        public string NotificationText { get; set; }
        public int TextCount { get; set; }
        public string Sessions { get; set; }
        public string Campus { get; set; }
         public string Subcity { get; set; }

        public string ProgramDetail { get; set; }
        public string Classes { get; set; }
        public string Sections { get; set; }
        public string Rollno { get; set; }
        public string Statuses { get; set; }
        public string ÄpprovalStatus { get; set; }
        public string Qdate { get; set; }
        public DateTime? Sdate { get; set; }

    }

    public class MessageDelivery
    {

        [Key]
        public Guid MessageId { get; set; }
        public string MessageText { get; set; }
        public string SendTo { get; set; }
        public DateTime QuedDate { get; set; }
        public string SmsStatus { get; set; }

        public string Mask { get; set; }
        public int UserId { get; set; }
        public int Status { get; set; }

        public string DisplayName { get; set; }
        public string Username { get; set; }
    }


    public class FeeRequestModel
    {
        public Guid StudentId { get; set; }
        public string DeviceId { get; set; }
        public Guid classId { get; set; }
    }
    public class NotificationModel
    {
        [Key]
        public Guid NotificationId { get; set; }
        public string UserId { get; set; }
        public DateTime? SendDate { get; set; }
        public DateTime? QuedDate { get; set; }
        public string MessageText { get; set; }

    }
    [Table("BulkNotification", Schema = "Message")]
    public class BulkNotificationModel
    {
        [Key]
        public Guid BulkNotificationId { get; set; }
        public DateTime? SendDate { get; set; }
        public DateTime? QuedDate { get; set; }
        public string MessageText { get; set; }
        public string Operation { get; set; }
        public int Status { get; set; }
        public int ApprovalStatus { get; set; }
        public int charCount { get; set; }
        public string qDate { get; set; }
        public string UserName { get; set; }


    }


    public class BulkNotificationModelEx
    {

        public string MessageText { get; set; }
        [Key]
        public Guid BulkNotificationId { get; set; }
        public DateTime? SendDate { get; set; }
        public DateTime? QuedDate { get; set; }
        public int NotificationCount { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string SubCity { get; set; }
        public string Operation { get; set; }
        public int Status { get; set; }
        public int ApprovalStatus { get; set; }
        public int charCount { get; set; }
        public string qDate { get; set; }
        public string UserName { get; set; }
        public string TagName { get; set; }

         public string ReceiverType { get; set; }


    }





     public class BulkNotificationList
    {

        
        [Key]
        public Guid BulkNotificationId { get; set; }
        public string MessageText { get; set; }
        
        public int UserId { get; set; }
        public DateTime Qdate { get; set; }
        public DateTime sendDate { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string SubCity { get; set; }
        public string Operation { get; set; }
        public int charCount { get; set; }
        public string UserName { get; set; }
        public string TagName { get; set; }

         public string ReceiverType { get; set; }


    }
    public class BulkNotificationModelExx
    {

        public string MessageText { get; set; }
        [Key]
        public Guid BulkNotificationId { get; set; }
        public DateTime? SendDate { get; set; }
        public DateTime? QuedDate { get; set; }
        public int NotificationCount { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string SubCity { get; set; }
        public string Operation { get; set; }
        public int Status { get; set; }
        public int ApprovalStatus { get; set; }
        public int charCount { get; set; }
        public string qDate { get; set; }
        public string UserName { get; set; }
        public bool Ischecked { get; set; }


    }
    public class MessageDetailStud
    {

        [Key]
        public Guid MessageId { get; set; }
        public string MessageText { get; set; }
        public DateTime? SendDate { get; set; }

        public int Status { get; set; }

        public string MessageNo { get; set; }

    }

}