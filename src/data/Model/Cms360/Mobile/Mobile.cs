using System.Reflection.Metadata;
using System.Security.AccessControl;
/*
 *   Author: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Cms360.Data.Model
{

    [Table("Question", Schema = "Message")]
    public class MessageQuestion
    {
        [Key]
        [Required]
        public Guid QuestionId { get; set; }

        [Required]
        public string Question { get; set; }

        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        [Required]
        public bool Mark { get; set; }

        [Required]
        public int StatusId { get; set; }
    }

    public partial class NotificationSurvey
    {
        public string Operation { get; set; }
        [Key]
        public String RollNo { get; set; }
        public String Remarks { get; set; }


    }


    public partial class NotificationOutPut
    {
        [Key]
        public Guid BulkNotificationId { get; set; }
        public String NotificationObject { get; set; }
        public DateTime QuedDate { get; set; }
    }


    public partial class ChatOutPut
    {
        [Key]
        public Guid QuestionId { get; set; }
        public String Question { get; set; }
        public DateTime Date { get; set; }

        public String From { get; set; }
        public String Topic { get; set; }
        public String Answer { get; set; }
        public DateTime? ResponsDate { get; set; }

        public bool Mark { get; set; }


    }

    public partial class ChatOutPutWithTeacher
    {
        [Key]
        public Guid QuestionId { get; set; }
        public String Question { get; set; }
        public DateTime Date { get; set; }

        public String From { get; set; }
        public String Topic { get; set; }
        public String TeacherName { get; set; }
        public String Subject { get; set; }

        public String Answer { get; set; }
        public DateTime? ResponsDate { get; set; }

        public bool Mark { get; set; }


    }

    public partial class ChatOutPutEx
    {
        [Key]
        public Guid QuestionId { get; set; }
        public String Question { get; set; }
        public DateTime Date { get; set; }

        public String From { get; set; }
        public String Topic { get; set; }
        public String Answer { get; set; }
        public DateTime? ResponsDate { get; set; }

        public bool Mark { get; set; }
        public String StudentName { get; set; }
        public String RollNo { get; set; }



    }


    public partial class ChatOutPutCourse
    {
        [Key]
        public Guid QuestionId { get; set; }
        public String Question { get; set; }
        public DateTime Date { get; set; }

        public String From { get; set; }
        public String Topic { get; set; }
        public String Answer { get; set; }
        public DateTime? ResponsDate { get; set; }

        public bool Mark { get; set; }
        public String StudentName { get; set; }
        public String RollNo { get; set; }

        public Guid? CourseId { get; set; }
        public String CourseName { get; set; }
        public Guid? SectionId { get; set; }
        public String SectionName { get; set; }

    }

    public partial class NotiObject
    {
        [Key]
        public string notification { get; set; }
        public string type { get; set; }
    }

    public class AttendenceDatasStudent
    {

        [Key]
        public Guid admission_ID { get; set; }
        public String studentID { get; set; }
        public String studentName { get; set; }

        public Guid TimeTableId { get; set; }
        public string absent_ID { get; set; }
        public bool ShouldAbsent { get; set; }

    }


    public class AttendenceDatasStudentEx
    {

        [Key]
        public Guid admission_ID { get; set; }
        public String studentID { get; set; }
        public String studentName { get; set; }

        public Guid TimeTableId { get; set; }
        public string absent_ID { get; set; }
        public bool ShouldAbsent { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }

    }


    public partial class UpdateAttendanceModel
    {
        [Key]
        public Guid AttendanceDetailId { get; set; }
        public Guid AttendanceMasterId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid AttendenceStatusId { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public bool IsApproved { get; set; }
        public string DayName { get; set; }
        public string RoomName { get; set; }
        public string Name { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string StaffName { get; set; }
        public string SectionName { get; set; }
        // public string FullName { get; set; }
        public string AttendanceStatus { get; set; }
        public string FullName { get; set; }
        public DateTime Dated { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionId { get; set; }
        public string Session { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid CampusId { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public bool IsChecked { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public Guid TimeTableId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public bool? ShouldAbsent { get; set; }

    }

    public partial class TeacherStudentExaminfoaModel

    {
        [Key]

        public string RollNo { get; set; }
        public Guid StaffId { get; set; }




    }


    public partial class HodStudentExaminfoaModel

    {
        [Key]

        public Guid Hodid { get; set; }
        public Guid StaffId { get; set; }

        public Guid classId { get; set; }




    }

    public partial class TeacherStudentExaminfoaModel1

    {
        [Key]

        public string RollNo { get; set; }
        public Guid StaffId { get; set; }
        public Guid CourseId { get; set; }




    }




    public partial class TeacherScoursesModel

    {
        [Key]

        public Guid SectionCourseLinkId { get; set; }




    }

    public partial class TeacherExamModel

    {
        [Key]

        public Guid SectionCourseLinkId { get; set; }
        public Guid CourseId { get; set; }




    }
    public partial class AttendenceDataModel
    {
        [Key]
        public int SerialId { get; set; }

        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public Guid StudentId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string DayName { get; set; }
        public Guid SlotTimingId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public Guid ClassId { get; set; }
        public string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public Guid TimeTableId { get; set; }
        public Guid AttendenceStatusId { get; set; }
        public string Absent_ID { get; set; }
        public bool IsChecked { get; set; }
        public Guid SessionId { get; set; }
        public Guid SectionId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public string SectionName { get; set; }
        public bool? ShouldAbsent { get; set; }

    }

    public class Response
    {
        public string UserName { get; set; }
        public DateTime TimeDate { get; set; }
        public string Teacher { get; set; }
        public string TeacherID { get; set; }
        public Guid SessionID { get; set; }
        public Guid TeacherStudentID { get; set; }

        public int Code { get; set; }

        public string Message { get; set; }
    }


    public class ResponseEx
    {
        public string UserName { get; set; }
        public DateTime TimeDate { get; set; }
        public string Teacher { get; set; }
        public string TeacherID { get; set; }
        public Guid SessionID { get; set; }
        public Guid TeacherStudentID { get; set; }

        public int Code { get; set; }

        public string Message { get; set; }

        public bool HodCheck { get; set; }
    }


    [Table("VWMobileLogin", Schema = "Role")]
    public class LoginData
    {
        [Key]
        public Int64 UserId { get; set; }
        public string DisplayName { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public Guid StaffId { get; set; }
        public string Type { get; set; }
        public string Username { get; set; }
    }

    [Table("VWMobileLoginEx", Schema = "Role")]
    public class LoginDataEx
    {
        [Key]
        public Int64 UserId { get; set; }
        public string DisplayName { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public Guid StaffId { get; set; }
        public string Type { get; set; }
        public string Username { get; set; }
        public bool HodCheck { get; set; }
    }

    [Table("VWTimeTableStudent", Schema = "Message")]
    public class TimeTableStudentVM
    {

        public Guid TimeTableId { get; set; }

        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid EnrollmentId { get; set; }
        public string RefferenceNo { get; set; }

        public string RollNo { get; set; }
        public Guid PresentId { get; set; }

        public Guid AbsentId { get; set; }

    }
    public class EnrollmentModel
    {
        public string EnrollmentId { get; set; }

    }

    public class LoginParam
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public string SessionId { get; set; }
        public string User_name { get; set; }
        public string User_Password { get; set; }

    }

    [Table("UserLink", Schema = "Role")]
    public class UserLink
    {
        [Required]
        [Key]
        public Int64 UserId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public string Type { get; set; }
    }

    [Table("MobileSession", Schema = "Message")]
    public class MobileSession
    {
        [Required]
        [Key]
        public Guid MobileSessionId { get; set; }

        [Required]
        public string MobileCode { get; set; }

        [Required]
        public DateTime Dated { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Int64 UserId { get; set; }
    }

    [Table("VWUserSession", Schema = "Message")]
    public class VWUserSession
    {
        [Key]
        public Guid NewId { get; set; }
        public string Username { get; set; }
        public Guid StaffId { get; set; }
        public int StatusId { get; set; }
        public DateTime Dated { get; set; }
        public string MobileCode { get; set; }
    }
    public class SessionParams
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public Guid Teacher_ID { get; set; }
        public string User_name { get; set; }
        public string User_Password { get; set; }
    }
    public class NotificationParams
    {

        public string Student_ID { get; set; }
        public int limits { get; set; }
        public string Cnic { get; set; }
        public Guid Teacher_ID { get; set; }
    }

    public class ChatParams
    {

        public string Student_ID { get; set; }
        public Guid Teacher_ID { get; set; }
    }

    public class UserParameter
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
    }
    public class StudentLoginParam
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public string Mac_Address { get; set; }
        public string User_name { get; set; }
        public string User_Password { get; set; }

    }

    [Table("StudentUserLink", Schema = "Role")]
    public partial class StudentUserLink
    {
        [Key]
        public Guid StudentUserId { get; set; }
        public Guid StudentId { get; set; }
        public string Username { get; set; }
        public bool IsEnable { get; set; }
        public string Password { get; set; }
    }

    [Table("VWBoardInfo", Schema = "Message")]
    public partial class BoardInfoVM
    {
        [Key]
        public string ClgRollNo { get; set; }
        public DateTime Admission_date { get; set; }

        public string Class { get; set; }
        public string Program { get; set; }
        public string Shift { get; set; }
        public string Section { get; set; }
        public string Board_Registration_No { get; set; }
        public DateTime Datetime_Registration { get; set; }
        public string BoardTitle { get; set; }
        public string Status { get; set; }
        public string Msg { get; set; }
    }

    public class provided
    {
        [Key]
        public string ProviderId { get; set; }
        public string DisplayName { get; set; }
        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }
        public Guid UserSessionID { get; set; }
        public bool IsActive { get; set; }

        public Guid TeacherStudentID { get; set; }

    }
    public class ClassAttendance
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid Session_Id { get; set; }
        public Guid Teacher_ID { get; set; }

    }

    public class ClassAttendanceEx
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid Session_Id { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Day { get; set; }

    }

    public class StudentAttendance
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid SectionCourseLinkId { get; set; }
        public string RefferenceNo { get; set; }
        public string Month { get; set; }


    }
    public class StudentExam
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public string RefferenceNo { get; set; }
        public string ExamName { get; set; }


    }
    public class StudentCourse
    {
        public string rollno { get; set; }
        public Guid programcourselinkid { get; set; }
    }


    public class SubjectSchedual
    {
        public string refno { get; set; }
        public Guid courseid { get; set; }
        public string examname { get; set; }
    }
    public class attndancedata
    {
        public string refno { get; set; }
        public Guid staffid { get; set; }
    }
    public class attndancedatacoursewise
    {
        public string refno { get; set; }
        public Guid staffid { get; set; }
        public string monthname { get; set; }
    }
    public class SearchStaff
    {

        public Guid staffid { get; set; }

    }
    public class SearchStaffwithref
    {
        public string refno { get; set; }
        public Guid staffid { get; set; }

    }
    public class Testwisedata
    {

        public string refno { get; set; }
        public Guid staffid { get; set; }
        public string examname { get; set; }
    }
    public class StudentExamSection
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public string SectionCourseLinkId { get; set; }



    }
    public class StudentExamSectionnew
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public string SectionCourseLinkId { get; set; }
        public string ExamName { get; set; }

    }
    public class GetTeacherTimeTable
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }

    }
    public class ClassAttendanceByWeek
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid Session_Id { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Day { get; set; }

    }
    public class AttendanceLecture
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid Session_Id { get; set; }
        public Guid TimeTableID { get; set; }

    }
    public class AttendanceLectureResponseModel
    {
        [Key]
        public Guid Admission_ID { get; set; }
        public string Enrollment_ID { get; set; }
        public string StudentID { get; set; }
        public string StudentName { get; set; }
        public Guid TimeTableID { get; set; }
        public string Absent_ID { get; set; }
    }
    public class SubmitAttendanceLecture
    {

        public List<EnrollmentModel> Enrollment { get; set; }
        public Guid TimeTableId { get; set; }
    }
    public class GetExamData
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Exam_Type_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid ExamMasterId { get; set; }
    }
    public class SubmitExamData
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public string EnrollmentIDs { get; set; }
        public string AttendanceOptionIDs { get; set; }
        public decimal ObtainedMarks { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid ExamDetailId { get; set; }
    }

    public class ExamdetailTemp
    {
        public Guid ExamDetailId { get; set; }
        public string AttendanceStatusId { get; set; }
        public decimal ObtainMarks { get; set; }
    }
    public class StudentMonthlyInfomonthwise
    {

        public string Start_Date { get; set; }
        public string Student_ID { get; set; }
    }

    [Table("VWMobileAttendance", Schema = "Message")]
    public class AttendanceLectureData
    {
        [Key]
        public Guid AttendanceDetailId { get; set; }
        public int StatusId { get; set; }
        public string StudentName { get; set; }
        public string DayName { get; set; }
        public string LectureNo { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string StaffName { get; set; }
        public string Sections_Name { get; set; }
        public Guid ClassId { get; set; }
        public Guid Sections_ID { get; set; }
        public string Session { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Subject_ID { get; set; }
        public string Subject_name { get; set; }
        public string Enrollment_ID { get; set; }
        public string StudentID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid AttendenceStatusId { get; set; }
        public string AttendanceStatus { get; set; }
        public DateTime Dated { get; set; }
        public Guid TimeTableID { get; set; }
        public Guid Admission_ID { get; set; }
        public string Absent_ID { get; set; }
        public string Program_Class { get; set; }
    }

    [Table("VWAttendanceData", Schema = "Message")]
    public partial class GetAttendenceData
    {
        [Key]
        public int SerialId { get; set; }
        public Guid Admission_ID { get; set; }
        public Guid CampusProgramId { get; set; }
        public string Enrollment_ID { get; set; }
        public string StudentID { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string DayName { get; set; }
        public Guid SlotTimingId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public Guid ClassId { get; set; }
        public string Subject_name { get; set; }
        public Guid Subject_ID { get; set; }
        public Guid TimeTableID { get; set; }
        public Guid AttendenceStatusId { get; set; }
        public string Absent_ID { get; set; }
        public bool IsChecked { get; set; }
        public Guid SessionId { get; set; }
        public Guid Sections_ID { get; set; }

    }

    [Table("VWTimeTableReport", Schema = "Message")]
    public partial class TimeTableReportData
    {
        [Key]
        [Required]
        public Guid TimeTableID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Room_ID { get; set; }
        public string Day { get; set; }
        public Guid Slot_ID { get; set; }
        public string Room_Name { get; set; }
        public string LectureNo { get; set; }
        public string TimeStart { get; set; }
        public string TimeEnd { get; set; }
        public string Teacher_Name { get; set; }
        public string Campus_Name { get; set; }
        public string Subject_Name { get; set; }
        public string Sections_Name { get; set; }
        public Guid ClassId { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Campus_Prog_ID { get; set; }
        public string Class_Prog_Name { get; set; }
        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public Guid Sections_ID { get; set; }
        public string Class { get; set; }
        public Guid Subject_ID { get; set; }
        public string ColorName { get; set; }
        public int StatusId { get; set; }
        public DateTime? Dated { get; set; }
        public bool? IsApproved { get; set; }

    }


    public partial class TimeTableReportDataEx
    {
        [Key]
        [Required]
        public Guid TimeTableID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Room_ID { get; set; }
        public string Day { get; set; }
        public Guid Slot_ID { get; set; }
        public string Room_Name { get; set; }
        public string LectureNo { get; set; }
        public string TimeStart { get; set; }
        public string TimeEnd { get; set; }
        public string Teacher_Name { get; set; }
        public string Campus_Name { get; set; }
        public string Subject_Name { get; set; }
        public string Sections_Name { get; set; }
        public Guid ClassId { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Campus_Prog_ID { get; set; }
        public string Class_Prog_Name { get; set; }
        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public Guid Sections_ID { get; set; }
        public string Class { get; set; }
        public Guid Subject_ID { get; set; }
        public string ColorName { get; set; }
        public int StatusId { get; set; }
        public DateTime? Dated { get; set; }
        public bool? IsApproved { get; set; }

    }

    [Table("VWSectionAPI", Schema = "Message")]
    public class Sectionapi
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public string Subject_name { get; set; }
        public Guid Subject_ID { get; set; }
    }

    [Table("VWSectionAPIQuestion", Schema = "Message")]
    public class VWSectionAPIQuestion
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public string Subject_name { get; set; }
        public Guid Subject_ID { get; set; }
    }

    [Table("VWExamSections", Schema = "Message")]
    public class ExamSectionapi
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public string Subject_name { get; set; }
        public Guid Subject_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
    }

    [Table("VWExamTypeAPI", Schema = "Message")]
    public class ExamTypeAPI
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public Guid ExamTypeId { get; set; }
        public string ExamType { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
    }

    [Table("VWExamTypeAPIEx", Schema = "Message")]
    public class ExamTypeAPIEx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public Guid ExamTypeId { get; set; }
        public string ExamType { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid SectionCourseLinkId { get; set; }
    }

    [Table("VWTimeTableSession", Schema = "Message")]
    public partial class VWTimeTableSession
    {
        [Key]
        public Guid TimeTableID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid RoomId { get; set; }
        public string DayName { get; set; }
        public Guid SlotTimingId { get; set; }
        public string RoomName { get; set; }
        public string SlotTimings { get; set; }
        public string TimeStart { get; set; }
        public string TimeEnd { get; set; }
        public string Teacher_Name { get; set; }
        public string Campus_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Class_Prog_Name { get; set; }
        public Guid Campus_Prog_ID { get; set; }
        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public Guid Sections_ID { get; set; }
        public Guid ClassId { get; set; }
        public string Subject_Name { get; set; }
        public string Sections_Name { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid Subject_ID { get; set; }
        public bool IsBreak { get; set; }
        public string ClassName { get; set; }
    }

    [Table("VWGetCampuses", Schema = "Message")]
    public class VWGetCampuses
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public string Campus_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public int StatusId { get; set; }

    }

    [Table("VWGetPrograms", Schema = "Message")]
    public class VWGetPrograms
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public string Campus_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Campus_Prog_ID { get; set; }
        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public string Campus_Prog_Name { get; set; }
        public int StatusId { get; set; }

    }

    [Table("VWExamData", Schema = "Message")]
    public class VWExamData
    {
        [Key]
        public Guid NewId { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid ExamDetailId { get; set; }
        public Guid ExamTypeId { get; set; }
        public string ExamType { get; set; }
        public DateTime Dated { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid Admission_ID { get; set; }
        public string StudentName { get; set; }
        public string Enrollment_ID { get; set; }
        public string StudentID { get; set; }
        public int TotalMarks { get; set; }
        public float ObtainMarks { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public string Absent_ID { get; set; }
        public Guid Subject_ID { get; set; }
        public string Subject_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string SectionName { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public bool ShouldAbsent { get; set; }
        public bool IsApproved { get; set; }

    }



    public class StudentClassList
    {
        [Key]
        public Guid Admission_ID { get; set; }
        public DateTime Dated { get; set; }

        public string StudentName { get; set; }
        public string Enrollment_ID { get; set; }
        public string StudentID { get; set; }
        public int TotalMarks { get; set; }
        public float ObtainMarks { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public string Absent_ID { get; set; }
        public bool ShouldAbsent { get; set; }
        public bool IsApproved { get; set; }

    }
    public class GetCampuses
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
    }

    public class StudentAttendanceInfo
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Student_ID { get; set; }
    }

    public class StudentAttendanceInfoResponseModel
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public int TotalLectures { get; set; }
        public int Attendance_Percentage { get; set; }
        public int Present_Count { get; set; }
        public int Absent_Count { get; set; }
        public int Leave_Count { get; set; }
        public string Month { get; set; }
        public string Month_Start_Date { get; set; }
        public string Month_End_Date { get; set; }
    }

    public class TeacherDataResponse
    {
        [Key]
        public Guid NewId { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string Section { get; set; }

        public Guid ProgramCourseLinkId { get; set; }

        public string Course { get; set; }

    }

    public class TeacherDataResponseCI
    {
        [Key]
        public Guid NewId { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string Section { get; set; }

        public Guid ProgramCourseLinkId { get; set; }

        public string Course { get; set; }

        public bool IsClassIncharge { get; set; }

    }
    public class CoursewiseStudentAttendanceData
    {
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        [Key]
        public string Course { get; set; }
        public double Present { get; set; }
        public double Absent { get; set; }
        public double Leave { get; set; }
        public double Percentage { get; set; }
    }
    public class StudentAttendanceDataoverall
    {
        [Key]
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public double Present { get; set; }
        public double Absent { get; set; }
        public double Leave { get; set; }
        public double Percentage { get; set; }
    }
    public class StudentExamDataSubjectWise
    {
        [Key]
        public Guid Id { get; set; }
        public string DegreeName { get; set; }
        public double TotalMarks { get; set; }
        public double ObtainedMarks { get; set; }
        public double Percentage { get; set; }

        public string CourseName { get; set; }
        public string Grade { get; set; }
    }
    public class StudentExamDataSubjectWise2
    {
        [Key]
        public Guid Id { get; set; }
        public string DegreeName { get; set; }
        public double TotalMarks { get; set; }
        public double ObtainedMarks { get; set; }
        public double Percentage { get; set; }

        public string CourseName { get; set; }
        public string Grade { get; set; }
    }
    public class ClassInchargeAttendancedata
    {
        [Key]
        public Guid NewId { get; set; }
        public string StudentName { get; set; }
        public string RollNo { get; set; }
        public string SectionName { get; set; }
        public string Month { get; set; }
        public double Total { get; set; }
        public double Presents { get; set; }
        public double Absents { get; set; }
        public double Leave { get; set; }
        public double Percentage { get; set; }
    }
    public class ClassInchargeAttendancedataCoursewise
    {
        [Key]
        public Guid NewId { get; set; }
        public string StudentName { get; set; }
        public string RollNo { get; set; }
        public string CourseName { get; set; }
        public string SectionName { get; set; }
        public double Total { get; set; }
        public double Presents { get; set; }
        public double Absents { get; set; }
        public double Leave { get; set; }
        public double Percentage { get; set; }
    }
    public class StudentExamDataSubjectWise3
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public bool IsClassIncharge { get; set; }
        public string SectionName { get; set; }
        public Guid SectionCourseLinkId { get; set; }

    }

    public class StudentExamDataSubjectWise4
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public Guid StaffId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public bool IsClassIncharge { get; set; }
        public string SectionName { get; set; }
        public Guid SectionCourseLinkId { get; set; }

    }

    public class StudentReportExamData
    {
        [Key]
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }
        public string SectionName { get; set; }
        public string Detail { get; set; }


    }
    public class StudentTestData
    {
        [Key]
        public Guid Id { get; set; }
        public string DegreeName { get; set; }
        public double TotalMarks { get; set; }
        public double ObtainedMarks { get; set; }
        public double Percentage { get; set; }

        public string CourseName { get; set; }
        public string Grade { get; set; }
        public string AttendanceStatus { get; set; }
        public bool IsPass { get; set; }


    }
    public class StudentExamDataOverall
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }
    }
    public class StudentExamDataOverallData
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }
    }

    public class StudentAttendanceData
    {
        public IEnumerable<StudentAttendanceDataoverall> StudentAttendanceDataoverall { get; set; }
        public IEnumerable<CoursewiseStudentAttendanceData> CoursewiseStudentAttendanceData { get; set; }
    }
    public class TeacherstudentAttDataResponse
    {
        [Key]
        public Guid NewId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public string Class { get; set; }

        public string Course { get; set; }
        public Guid CourseId { get; set; }

    }

    public class TeacherstudentAttDataMonthResponse
    {
        [Key]
        public Guid NewId { get; set; }
        public int Percentage { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public string Class { get; set; }
        public string MonthYear { get; set; }
        public string Course { get; set; }
        public Guid CourseId { get; set; }

    }

    public class TeacherStudentExaminfoResponse
    {
        [Key]
        public Guid ExamDetailId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string ClassName { get; set; }
        public string ExamType { get; set; }
        public DateTime Dated { get; set; }
        public int TotalMarks { get; set; }
        public int ObtainMarks { get; set; }
        public string Course { get; set; }
        public bool IsPass { get; set; }
        public string Section { get; set; }
        public bool Approved { get; set; }



    }


    public class TeacherStudentinfoResponse
    {
        [Key]
        public Guid NewId { get; set; }
        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string ClassName { get; set; }
        public Guid ClassId { get; set; }


        public string Course { get; set; }

        public Guid CourseId { get; set; }

        public string Section { get; set; }

        public Guid SectionId { get; set; }



    }

    public class TeacherExamDataResponse
    {
        [Key]
        public Guid Exam_Type_ID { get; set; }
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }



    }

    public class TeacherExamDataResponseEx
    {
        [Key]
        public Guid Exam_Type_ID { get; set; }
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public bool Approved { get; set; }

    }

    public class TeacherExamDataResponseHod
    {
        [Key]
        public Guid Exam_Type_ID { get; set; }
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public bool Approved { get; set; }

    }

    public class TeacherExamDataResponseEx1
    {
        [Key]
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid exam_Type_ID { get; set; }
        public bool Approved { get; set; }
        public int RowOrder { get; set; }

    }

    public class TeacherExamDataResponseHodEx
    {
        [Key]
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid exam_Type_ID { get; set; }
        public bool Approved { get; set; }
        public int RowOrder { get; set; }

    }



    public class TeacherExamDataResponseEx2
    {
        [Key]
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public bool Approved { get; set; }
        public int RowOrder { get; set; }

    }


    public class TeacherExamDataResponseEx3
    {
        [Key]
        public string ExamType { get; set; }
        public Guid SectionCourseLinkId { get; set; }

        public bool Approved { get; set; }
        public int RowOrder { get; set; }

    }


    public class GetTeacherCourses
    {

        [Key]
        public Guid ProgramCourseLinkId { get; set; }

        public Guid CourseId { get; set; }


        public string Courses { get; set; }
        public bool IsApproved { get; set; }

    }
    public class GetPrograms
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid SessionId { get; set; }
        public Guid Campus_ID { get; set; }
    }

    public class Section_ExamType
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }

    }
    public class AttendanceReportParams
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public Guid Subject_ID { get; set; }

        public string DateFrom { get; set; }
        public string DateTo { get; set; }

    }
    public class TimeTableParams
    {
        public string Student_ID { get; set; }
        public string Device_Id { get; set; }

    }
    public class TimeTableParams2
    {
        public string Student_ID { get; set; }
        public Guid ClassId { get; set; }

    }
    [Table("VWTimeTableAPI", Schema = "Message")]
    public class TimeTableAPI
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string Student_ID { get; set; }
        public int StatusId { get; set; }
        public string Name { get; set; }
        public string Campus { get; set; }
        public string Class { get; set; }
        public string Section { get; set; }
        public string TeacherName { get; set; }
        public string Day { get; set; }
        public string Room { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string SubjectName { get; set; }
    }


    [Table("VWTimeTableAPIEx", Schema = "Message")]
    public class TimeTableAPIEx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string Student_ID { get; set; }
        public int StatusId { get; set; }
        public string Name { get; set; }
        public string Campus { get; set; }
        public string Class { get; set; }
        public string Section { get; set; }
        public string TeacherName { get; set; }
        public string Day { get; set; }
        public string Room { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string SubjectName { get; set; }
        public Guid StaffId { get; set; }

    }

    public class ExamReport
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public Guid Subject_ID { get; set; }
        public Guid Exam_Type_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
    }

    [Table("VWExamReport", Schema = "Message")]
    public class VWExamReport
    {
        [Key]
        public Guid NewId { get; set; }
        public Guid ExamMasterId { get; set; }
        public DateTime Dated { get; set; }
        public int TotalMarks { get; set; }
        public Guid ExamDetailId { get; set; }
        public decimal ObtainMarks { get; set; }
        public Guid Exam_Type_ID { get; set; }
        public string ExamType { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid CampusProgramId { get; set; }
        public string Remarks { get; set; }
        public string Grades { get; set; }
    }
    public class StudentInfo
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public Guid Subject_ID { get; set; }
    }
    public class StudentInfoMain
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public string StudentID { get; set; }
        public string StudentName { get; set; }
        public decimal AttendancePercentage { get; set; }
        public string ExamType { get; set; }
        public int ExamTotalMarks { get; set; }
        public decimal ExamObtainMarks { get; set; }
        public string Obtained { get; set; }
        public string Total { get; set; }
        public string Degree { get; set; }
        public string Board { get; set; }
    }

    public class StudentInfoResponse
    {
        public string StudentID { get; set; }
        public string StudentName { get; set; }
        public decimal AttendancePercentage { get; set; }
        public List<PastResult> past_result_data { get; set; }
        public List<AcademicInfo> academic_info_data { get; set; }
        public StudentInfoResponse()
        {
            past_result_data = new List<PastResult>();
            academic_info_data = new List<AcademicInfo>();
        }

    }
    public class PastResult
    {
        public string ExamType { get; set; }
        public int ExamTotalMarks { get; set; }
        public decimal ExamObtainMarks { get; set; }
    }
    public class AcademicInfo
    {
        public string Degree { get; set; }
        public string Total { get; set; }
        public string Obtained { get; set; }
    }
    public class ExamReportResponseModel
    {
        public Guid Admission_Form_ID { get; set; }
        public string StudentName { get; set; }
        public string Student_ID { get; set; }
        public List<Detail_Data> Detail_Data { get; set; }
    }
    public class Detail_Data
    {
        private String Subject { get; set; }
        private String Total_Marks { get; set; }
        private String Obtained_Marks { get; set; }
        private String Grade { get; set; }
        private String OverAllGrade { get; set; }
        private String Attendance { get; set; }
        private String Remarks { get; set; }
    }

    public class AttendanceReportResponseModel
    {
        public string Program_Class { get; set; }
        public string StudentName { get; set; }
        public string StudentID { get; set; }
        public List<AttendanceModel> days_data { get; set; }
        public AttendanceReportResponseModel()
        {
            days_data = new List<AttendanceModel>();
        }
    }
    public class AttendanceModel
    {
        public DateTime Attendance_Date { get; set; }
        public string Attendance_Status { get; set; }
    }
    public class ResponseTimeTableAPI
    {
        //public string DayName { get; set; }
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Campus")]
        public string Campus { get; set; }

        [JsonProperty("Section")]
        public string Section { get; set; }

        [JsonProperty("Class")]
        public string Class { get; set; }

        [JsonProperty("Day")]
        public string Day { get; set; }

        [JsonProperty("TimeTableData")]
        public List<SubResponseTimeTableAPI> TimeTableData { get; set; }
        public ResponseTimeTableAPI()
        {
            TimeTableData = new List<SubResponseTimeTableAPI>();
        }
    }
    public class SubResponseTimeTableAPI
    {
        [JsonProperty("TeacherName")]
        public string TeacherName { get; set; }

        [JsonProperty("SubjectName")]
        public string SubjectName { get; set; }

        [JsonProperty("Room")]
        public string Room { get; set; }

        [JsonProperty("ClassTime")]
        public string ClassTime { get; set; }
    }


    public class ResponseTimeTableAPIEx
    {
        //public string DayName { get; set; }
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Campus")]
        public string Campus { get; set; }

        [JsonProperty("Section")]
        public string Section { get; set; }

        [JsonProperty("Class")]
        public string Class { get; set; }

        [JsonProperty("Day")]
        public string Day { get; set; }

        [JsonProperty("TimeTableData")]
        public List<SubResponseTimeTableAPIEx> TimeTableData { get; set; }
        public ResponseTimeTableAPIEx()
        {
            TimeTableData = new List<SubResponseTimeTableAPIEx>();
        }
    }
    public class SubResponseTimeTableAPIEx
    {
        [JsonProperty("TeacherName")]
        public string TeacherName { get; set; }

        [JsonProperty("SubjectName")]
        public string SubjectName { get; set; }

        [JsonProperty("Room")]
        public string Room { get; set; }

        [JsonProperty("ClassTime")]
        public string ClassTime { get; set; }
        [JsonProperty("StaffId")]
        public Guid StaffId { get; set; }
    }

    public class AttendanceReportResponseModelVM
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Admission_ID { get; set; }
        public string DayName { get; set; }
        public string Program_Class { get; set; }
        public string StudentName { get; set; }
        public string StudentID { get; set; }
        public DateTime Dated { get; set; }
        public string Absent_ID { get; set; }
    }

    [Table("VWGetSubjects", Schema = "Message")]
    public partial class VWGetSubjects
    {
        [Key]
        [Required]
        public Guid TimeTableID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public string Campus_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Prog_Name { get; set; }
        public Guid Campus_Prog_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public string Subject_Name { get; set; }
        public Guid Subject_ID { get; set; }
        public int StatusId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
    }
    [Table("VW_NegativeVideoRatting", Schema = "EL")]
    public partial class VW_NegativeVideoRatting
    {
        [Key]
        [Required]
        public Guid NegativeVideoRattingId { get; set; }
        public string PopUpHeading { get; set; }
        public int Order { get; set; }
        public int StatusId { get; set; }
        public string Heading { get; set; }
        public string Explanation { get; set; }
        public string Topicid { get; set; }
        public Guid? Userid { get; set; }
        public string Videorating { get; set; }
        public string Remarks { get; set; }

    }

    [Table("VWGetSubjectsEx", Schema = "Message")]
    public partial class VWGetSubjectsEx
    {
        [Key]
        [Required]
        public Guid TimeTableID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid SessionId { get; set; }
        public string SessionName { get; set; }
        public string Campus_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Prog_Name { get; set; }
        public Guid Campus_Prog_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public string Subject_Name { get; set; }
        public Guid Subject_ID { get; set; }
        public int StatusId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
    }

    public class GetSubjects
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Campus_ID { get; set; }
        public Guid Sections_ID { get; set; }
        public Guid SectionCourseLinkId { get; set; }

    }
    public class UpdateAttendanceStudentList
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        // public Guid Teacher_ID { get; set; }
        // public Guid Campus_ID { get; set; }
        // public Guid Sections_ID { get; set; }
        public Guid TimeTableID { get; set; }
        public DateTime Dated { get; set; }
    }

    public class DeleteStudentLeave
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid SessionId { get; set; }
        public Guid TeacherID { get; set; }

        public Guid StudentID { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

    }
    public class StudentsFromId
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid SessionId { get; set; }
        public Guid Teacher_ID { get; set; }
        public string StudentID { get; set; }
        public string Sections_Name { get; set; }

        public Guid Sections_ID { get; set; }
    }

    public class StudentsFromName
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid SessionId { get; set; }
        public Guid Teacher_ID { get; set; }
        public string StudentName { get; set; }
        public string Sections_Name { get; set; }

        public Guid Sections_ID { get; set; }
    }

    public class UpdateStudentLeave
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }

        public Guid SessionId { get; set; }
        public Guid Teacher_ID { get; set; }
        public string StudentID { get; set; }
        public DateTime DateFrom { get; set; }

        public DateTime DateTo { get; set; }
        public string Remarks { get; set; }
        public string LeaveType { get; set; }
    }

    public class Attendance_CMS
    {
        public string Student_ID { get; set; }
        public string Device_ID { get; set; }
        public Guid Class_Level_ID { get; set; }
    }
    public partial class AttendanceResponseModel_CMS
    {
        [Key]
        [JsonProperty("NewID")]
        public Guid NewID { get; set; }

        [JsonProperty("AdmissionFormId")]
        public Guid AdmissionFormId { get; set; }

        [JsonProperty("Present")]
        public int Present { get; set; }

        [JsonProperty("Absent")]
        public int Absent { get; set; }

        [JsonProperty("Leave")]
        public int Leave { get; set; }

        [JsonProperty("Month")]
        public string Month { get; set; }

        [JsonProperty("TotalCount")]
        public int TotalCount { get; set; }

        [JsonProperty("Percentage")]
        public int Percentage { get; set; }

    }

    [Table("VWFeeChallan_API", Schema = "Message")]
    public class VWFeeChallan_API
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public int PayableAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string CampusName { get; set; }
        public int ChallanAmount { get; set; }
        public string CustomerCode { get; set; }
        public string BusinessUnit { get; set; }
        public int StatusId { get; set; }
        public Guid StudentChallanId { get; set; }
        // public Guid BankTransactionId { get; set; }
        // public Guid TransactionId { get; set; }
        // public Guid RevesalId { get; set; }
    }

    public class InquiryResponseModel
    {
        public string p_StudentName { get; set; }
        public int p_Amount { get; set; }
        public string p_BillingMonth { get; set; }
        public string p_DueDate { get; set; }
        public string p_ReferenceNo { get; set; }
        public string p_CompanyName { get; set; }
        public string p_CampusName { get; set; }
        public string p_CustomerCode { get; set; }

        [Key]
        public string p_ChallanNumber { get; set; }
        public string ReturnValue { get; set; }
    }

    public class InquiryResponseFr
    {
        public string p_StudentName { get; set; }
        public int p_Amount { get; set; }
        public string p_BillingMonth { get; set; }
        public string p_DueDate { get; set; }
        public string p_ReferenceNo { get; set; }
        public string p_CompanyName { get; set; }
        public string p_CampusName { get; set; }
        public string p_CustomerCode { get; set; }

        [Key]
        public string p_ChallanNumber { get; set; }
        public string p_AccountNo { get; set; }
        public decimal p_RoyaltyPercentage { get; set; }
        public string ReturnValue { get; set; }
        public string ReturnMessage { get; set; }

    }

    public class Inquiry
    {
        //public Guid key { get; set; }
        public string p_UserName { get; set; }
        public string p_Password { get; set; }
        public string p_ChallanNumber { get; set; }
    }

    public class Payment
    {
        //public Guid key { get; set; }
        public string p_UserName { get; set; }
        public string p_Password { get; set; }
        public string p_ChallanNumber { get; set; }
        public string p_TransactionId { get; set; }
        public int p_Amount { get; set; }
    }

    public class ChQuery
    {
        [Key]
        public string FullName { get; set; }
        public string Email { get; set; }

    }
    public class Reverse
    {
        //public Guid key { get; set; }
        public string p_UserName { get; set; }
        public string p_Password { get; set; }
        public string p_OriginalTransactionId { get; set; }
        public string p_ReverseTransactionId { get; set; }
    }

    public class FeeRequestData
    {
        public string Student_Id { get; set; }
        public string Device_Id { get; set; }
        public Guid Class_Level_Id { get; set; }
    }
    public class VWFeeApi
    {
        [Key]
        [JsonProperty("Challan_Number")]
        public string Challan_Number { get; set; }

        [JsonProperty("Amount")]
        public int Amount { get; set; }

        [JsonProperty("Due_date")]
        public DateTime Due_date { get; set; }

        [JsonProperty("received_date")]
        public DateTime received_date { get; set; }

        [JsonProperty("Status")]
        public int Status { get; set; }

        [JsonProperty("ConcessionType")]
        public string ConcessionType { get; set; }

        [JsonProperty("INstallment")]
        public int INstallment { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Installment_Order")]
        public string Installment_Order { get; set; }

        [JsonProperty("Challan_Instruction_Type")]
        public string Challan_Instruction_Type { get; set; }

        [JsonProperty("Class_ID")]
        public string Class_ID { get; set; }

        [JsonProperty("Chalan_type_name")]
        public string Chalan_type_name { get; set; }

    }
    public class VWFeeApiPrintButton
    {
        [Key]
        [JsonProperty("Challan_Number")]
        public string Challan_Number { get; set; }

        [JsonProperty("Amount")]
        public int Amount { get; set; }

        [JsonProperty("Due_date")]
        public DateTime Due_date { get; set; }

        [JsonProperty("received_date")]
        public DateTime received_date { get; set; }

        [JsonProperty("Status")]
        public int Status { get; set; }

        [JsonProperty("ConcessionType")]
        public string ConcessionType { get; set; }

        [JsonProperty("INstallment")]
        public int INstallment { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Installment_Order")]
        public string Installment_Order { get; set; }

        [JsonProperty("Challan_Instruction_Type")]
        public string Challan_Instruction_Type { get; set; }

        [JsonProperty("Class_ID")]
        public string Class_ID { get; set; }

        [JsonProperty("Chalan_type_name")]
        public string Chalan_type_name { get; set; }

        [JsonProperty("AllowButton")]
        public bool AllowButton { get; set; }

    }
    public class APIStudentProfileResponse


    {
        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Admission_Form_ID")]
        public Guid Admission_Form_ID { get; set; }

        [JsonProperty("Name")]

        public string Name { get; set; }

        [JsonProperty("Enrollment_ID")]

        [Key]
        public Guid Enrollment_ID { get; set; }

        [JsonProperty("Class_section_id")]
        public Guid Class_section_id { get; set; }

        [JsonProperty("Campus_id")]

        public Guid Campus_id { get; set; }

        [JsonProperty("Class_Level_ID")]

        public Guid Class_Level_ID { get; set; }

        [JsonProperty("RollNo")]

        public string RollNo { get; set; }

        [JsonProperty("Section")]

        public string Section { get; set; }

        [JsonProperty("Session")]

        public string Session { get; set; }

        [JsonProperty("Program")]

        public string Program { get; set; }

        [JsonProperty("Class")]

        public string Class { get; set; }

        [JsonProperty("Father_Name")]

        public string Father_Name { get; set; }

        [JsonProperty("Father_CNIC")]

        public string Father_CNIC { get; set; }

        [JsonProperty("Mobile")]

        public string Mobile { get; set; }

        [JsonProperty("Permanent_Address")]

        public string Permanent_Address { get; set; }

        [JsonProperty("Postal_Address")]

        public string Postal_Address { get; set; }

        [JsonProperty("Campus")]

        public string Campus { get; set; }

        [JsonProperty("Gaurdian_Name")]
        public string Gaurdian_Name { get; set; }

        [JsonProperty("Image_Name")]
        public string Image_Name { get; set; }

        [JsonProperty("Student_Pic")]
        public string Student_Pic { get; set; }

        [JsonProperty("IsEbook")]
        public bool? IsEbook { get; set; }
        [JsonProperty("IsMerchandise")]
        public bool? IsMerchandise { get; set; }
        [JsonProperty("IsDisclaimer")]
        public bool IsDisclaimer { get; set; }
    }

    public class APIStudentProfileResponseNew


    {
        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Admission_Form_ID")]
        public Guid Admission_Form_ID { get; set; }

        [JsonProperty("Name")]

        public string Name { get; set; }

        [JsonProperty("Enrollment_ID")]

        [Key]
        public Guid Enrollment_ID { get; set; }

        [JsonProperty("Class_section_id")]
        public Guid Class_section_id { get; set; }

        [JsonProperty("Campus_id")]

        public Guid Campus_id { get; set; }

        [JsonProperty("Class_Level_ID")]

        public Guid Class_Level_ID { get; set; }

        [JsonProperty("RollNo")]

        public string RollNo { get; set; }

        [JsonProperty("Section")]

        public string Section { get; set; }

        [JsonProperty("Session")]

        public string Session { get; set; }

        [JsonProperty("Program")]

        public string Program { get; set; }

        [JsonProperty("Class")]

        public string Class { get; set; }

        [JsonProperty("Father_Name")]

        public string Father_Name { get; set; }

        [JsonProperty("Father_CNIC")]

        public string Father_CNIC { get; set; }

        [JsonProperty("Mobile")]

        public string Mobile { get; set; }

        [JsonProperty("Permanent_Address")]

        public string Permanent_Address { get; set; }

        [JsonProperty("Postal_Address")]

        public string Postal_Address { get; set; }

        [JsonProperty("Campus")]

        public string Campus { get; set; }

        [JsonProperty("Gaurdian_Name")]
        public string Gaurdian_Name { get; set; }

        [JsonProperty("Image_Name")]
        public string Image_Name { get; set; }

        [JsonProperty("Student_Pic")]
        public string Student_Pic { get; set; }

        [JsonProperty("IsEbook")]
        public bool? IsEbook { get; set; }
        [JsonProperty("IsMerchandise")]
        public bool? IsMerchandise { get; set; }

        [JsonProperty("IsDisclaimer")]
        public bool IsDisclaimer { get; set; }

        [JsonProperty("PopupImageLink")]
        public string PopupImageLink { get; set; }

        [JsonProperty("PopupExternalLink ")]
        public string PopupExternalLink { get; set; }
        [JsonProperty("StoreStatus")]
        public int StoreStatus { get; set; }
    }


    public class APIStudentProfileResponseNewEx


    {
        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Admission_Form_ID")]
        public Guid Admission_Form_ID { get; set; }

        [JsonProperty("Name")]

        public string Name { get; set; }

        [JsonProperty("Enrollment_ID")]

        [Key]
        public Guid Enrollment_ID { get; set; }

        [JsonProperty("Class_section_id")]
        public Guid Class_section_id { get; set; }

        [JsonProperty("Campus_id")]

        public Guid Campus_id { get; set; }

        [JsonProperty("Class_Level_ID")]

        public Guid Class_Level_ID { get; set; }

        [JsonProperty("RollNo")]

        public string RollNo { get; set; }

        [JsonProperty("Section")]

        public string Section { get; set; }

        [JsonProperty("Session")]

        public string Session { get; set; }

        [JsonProperty("Program")]

        public string Program { get; set; }

        [JsonProperty("Class")]

        public string Class { get; set; }

        [JsonProperty("Father_Name")]

        public string Father_Name { get; set; }

        [JsonProperty("Father_CNIC")]

        public string Father_CNIC { get; set; }

        [JsonProperty("Mobile")]

        public string Mobile { get; set; }

        [JsonProperty("Permanent_Address")]

        public string Permanent_Address { get; set; }

        [JsonProperty("Postal_Address")]

        public string Postal_Address { get; set; }

        [JsonProperty("Campus")]

        public string Campus { get; set; }

        [JsonProperty("Gaurdian_Name")]
        public string Gaurdian_Name { get; set; }

        [JsonProperty("Image_Name")]
        public string Image_Name { get; set; }

        [JsonProperty("Student_Pic")]
        public string Student_Pic { get; set; }

        [JsonProperty("IsEbook")]
        public bool? IsEbook { get; set; }
        [JsonProperty("IsMerchandise")]
        public bool? IsMerchandise { get; set; }

        [JsonProperty("IsDisclaimer")]
        public bool IsDisclaimer { get; set; }

        [JsonProperty("PopupImageLink")]
        public string PopupImageLink { get; set; }

        [JsonProperty("PopupExternalLink ")]
        public string PopupExternalLink { get; set; }
        [JsonProperty("StoreStatus")]
        public int StoreStatus { get; set; }
        [JsonProperty("IsTraining")]
        public bool? IsTraining { get; set; }

        [JsonProperty("IsStruckOff")]
        public bool? IsStruckOff { get; set; }
    }




    public class StudentProfileMarchantile
    {
        [Key]
        public Guid AdmissionFormID { get; set; }

        // Rename 'Detail' to 'DetailData' to avoid conflict with class name 'Detail'
        [Column("Detail")]
        public string DetailData { get; set; }
        [Column("CampusDetail")]
        public string CampusDetailData { get; set; }

        // Deserialized properties
        [NotMapped]
        public List<Detail> DetailJsonString { get; set; }

        [NotMapped]
        public List<CampusDetail> CampusDetailJsonString { get; set; }
    }

    // Define Detail class
    public class Detail
    {
        public string Msg { get; set; }
        public string City { get; set; }
        public string Name { get; set; }
        public string Campus { get; set; }
        public string Mobile { get; set; }
        public string RollNo { get; set; }
        public string Program { get; set; }
        public string Session { get; set; }
        public string UserName { get; set; }
        public string Campus_id { get; set; }
        public string Image_Name { get; set; }
        public string Father_CNIC { get; set; }
        public string Father_Name { get; set; }
        public string Student_Pic { get; set; }
        public string Gaurdian_Name { get; set; }
        public string Postal_Address { get; set; }

        [Key]
        public string Admission_Form_ID { get; set; }

        public string Permanent_Address { get; set; }
    }

    // Define CampusDetail class
    public class CampusDetail
    {
        [Key]

        public Guid CampusId { get; set; }
        public bool IsDefault { get; set; }

        public string CamPusName { get; set; }

    }

    public class APIStudentProfileResponseReff

    {
        [Key]
        public Guid Admission_Form_ID { get; set; }
        // [JsonProperty("Name")]
        public string Name { get; set; }
        //  [JsonProperty("Msg")]
        public string Msg { get; set; }
        //  [JsonProperty("RefferenceNo")]
        public string RefferenceNo { get; set; }

        // [JsonProperty("RollNo")]
        public string RollNo { get; set; }

        // [JsonProperty("Status")]
        //public int Status { get; set; }

        // [JsonProperty("Submission_Date")]
        public DateTime Submission_Date { get; set; }
        //  [JsonProperty("Campus_id")]
        public Guid Campus_id { get; set; }

        // [JsonProperty("CityName")]
        public string CityName { get; set; }
        // [JsonProperty("CampusCode")]
        public string CampusCode { get; set; }

        //[JsonProperty("studentcnic")]
        public string studentcnic { get; set; }

        // [JsonProperty("ReligionName")]
        public string ReligionName { get; set; }

        // [JsonProperty("Program")]
        public string Program { get; set; }

        // [JsonProperty("DateOfBirth")]
        public DateTime DateOfBirth { get; set; }
        //[JsonProperty("Father_Name")]
        public string Father_Name { get; set; }
        //[JsonProperty("Father_CNIC")]
        public string Father_CNIC { get; set; }
        // [JsonProperty("Exam_Category")]
        public string Exam_Category { get; set; }

        //   [JsonProperty("exam_name")]
        public string exam_name { get; set; }

        //[JsonProperty("Mobile")]
        public string Mobile { get; set; }
        // [JsonProperty("Permanent_Address")]
        public string Permanent_Address { get; set; }
        // [JsonProperty("Postal_Address")]
        public string Postal_Address { get; set; }

        // [JsonProperty("Total_Marks")]
        public string Total_Marks { get; set; }
        // [JsonProperty("Obtained_Marks")]
        public string Obtained_Marks { get; set; }
        // [JsonProperty("Institute_Name")]
        public string Institute_Name { get; set; }
        // [JsonProperty("Campus")]
        public string Campus { get; set; }
        // [JsonProperty("Gaurdian_Name")]
        public string Gaurdian_Name { get; set; }
        //[JsonProperty("Session")]
        public string Session { get; set; }
        // [JsonProperty("Image_Name")]
        public string Image_Name { get; set; }
        // [JsonProperty("Student_Pic")]
        public string Student_Pic { get; set; }
        // [JsonProperty("Email")]
        public string Email { get; set; }

        //[JsonProperty("Father_Contact")]
        public string Father_Contact { get; set; }
        // [JsonProperty("Gender")]
        public string Gender { get; set; }


    }
    public class APIStudentProfileResponseEx

    {
        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Admission_Form_ID")]
        public Guid Admission_Form_ID { get; set; }

        [JsonProperty("Name")]

        public string Name { get; set; }

        [JsonProperty("Enrollment_ID")]

        [Key]
        public Guid Enrollment_ID { get; set; }

        [JsonProperty("Class_section_id")]
        public Guid Class_section_id { get; set; }

        [JsonProperty("Campus_id")]

        public Guid Campus_id { get; set; }

        [JsonProperty("Class_Level_ID")]

        public Guid Class_Level_ID { get; set; }

        [JsonProperty("RollNo")]

        public string RollNo { get; set; }

        [JsonProperty("Section")]

        public string Section { get; set; }

        [JsonProperty("Session")]

        public string Session { get; set; }

        [JsonProperty("Program")]

        public string Program { get; set; }

        [JsonProperty("Class")]

        public string Class { get; set; }

        [JsonProperty("Father_Name")]

        public string Father_Name { get; set; }

        [JsonProperty("Father_CNIC")]

        public string Father_CNIC { get; set; }

        [JsonProperty("Mobile")]

        public string Mobile { get; set; }

        [JsonProperty("Permanent_Address")]

        public string Permanent_Address { get; set; }

        [JsonProperty("Postal_Address")]

        public string Postal_Address { get; set; }

        [JsonProperty("Campus")]

        public string Campus { get; set; }

        [JsonProperty("Gaurdian_Name")]
        public string Gaurdian_Name { get; set; }

        [JsonProperty("Image_Name")]
        public string Image_Name { get; set; }

        [JsonProperty("Student_Pic")]
        public string Student_Pic { get; set; }

        [JsonProperty("Gender")]

        public string Gender { get; set; }

        [JsonProperty("DOB")]

        public DateTime Dob { get; set; }

    }




    public class GetTeacherList
    {
        public string Device_Id { get; set; }
        public string Application_Name { get; set; }
        public string Application_Version { get; set; }
        public string UserMacAddress { get; set; }
        public string Student_ID { get; set; }
        public string StudentID { get; set; }
    }
    public class GetTeacherListresponse
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public string StudentName { get; set; }
        public string StudentID { get; set; }
        public Guid Subject_ID { get; set; }
        public string Subject_Name { get; set; }
    }
    public class SendQuestion
    {
        public string Device_Id { get; set; }
        public string Application_Name { get; set; }
        public string Application_Version { get; set; }
        public string UserMacAddress { get; set; }
        public string Student_ID { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Subject_ID { get; set; }
        public string Question { get; set; }
        public Guid Section_ID { get; set; }
    }

    public class SendQuestionEx
    {
        public string Device_Id { get; set; }
        public string Application_Name { get; set; }
        public string Application_Version { get; set; }
        public string UserMacAddress { get; set; }
        public string Student_ID { get; set; }
        public Guid Teacher_ID { get; set; }
        public Guid Subject_ID { get; set; }
        public string Question { get; set; }
        public Guid Section_ID { get; set; }

        public string From { get; set; }
        public string Topic { get; set; }


    }


    public class TeacherReaponseEx
    {


        public Guid QuestionId { get; set; }
        public string Answer { get; set; }


    }

    public class FeedbackReaponse
    {


        public Guid Admissionformid { get; set; }
        public string feedbacktext { get; set; }
        public string paraentcnic { get; set; }
        public string divceinfo { get; set; }
        public string deviceType { get; set; }



    }


    public class InsertExam
    {


        public string list { get; set; }


        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }

        public Guid ExamScheduleId { get; set; }


    }


    public class GetQuestions
    {
        public Guid Teacher_ID { get; set; }
        public Guid Section_ID { get; set; }
        public Guid Subject_ID { get; set; }
        public string Device_Id { get; set; }
        public string Application_Name { get; set; }
        public string Application_Version { get; set; }
        public string UserMacAddress { get; set; }
    }
    public class GetQuestionsResponse
    {
        [Key]
        [JsonProperty("Question_ID")]
        public Guid Question_ID { get; set; }

        [JsonProperty("Question")]
        public string Question { get; set; }

        [JsonProperty("Section_name")]
        public string Section_name { get; set; }

        [JsonProperty("Student_Roll")]
        public string Student_Roll { get; set; }

        [JsonProperty("StudentName")]
        public string StudentName { get; set; }

        [JsonProperty("Date")]
        public DateTime Date { get; set; }

        [JsonProperty("Mark")]
        public bool Mark { get; set; }
    }
    public class GetExamComparison
    {
        public string Application_Version { get; set; }
        public string Application_Name { get; set; }
        public string Device_Id { get; set; }
        public string User_name { get; set; }
        public Guid Teacher_ID { get; set; }
        public List<ETDataObject> ETData { get; set; }
        public List<SCLDataObject> SCLData { get; set; }
        public GetExamComparison()
        {
            SCLData = new List<SCLDataObject>();
            ETData = new List<ETDataObject>();
        }
    }
    public class SCLDataObject
    {
        public Guid SectionCourseLinkId { get; set; }
    }
    public class ETDataObject
    {
        public Guid ExamTypeId { get; set; }
    }
    public class GetExamComparisonResponse
    {
        public Guid Id { get; set; }
        public Guid ExamTypeId { get; set; }
        public int ObtainedMarks { get; set; }
        public int TotalMarks { get; set; }
        public decimal Percentage { get; set; }
        public string ExamType { get; set; }
        public string Section { get; set; }
        public Guid SectionCourseLinkId { get; set; }
    }

    public class MarkRead
    {
        public string Device_Id { get; set; }
        public string Application_Name { get; set; }
        public string Application_Version { get; set; }
        public string UserMacAddress { get; set; }
        public Guid Question_ID { get; set; }
    }
    public class Count
    {
        [Key]
        public int QuestionCount { get; set; }
    }
    public class SectionProgramLink
    {
        public Guid Sections_ID { get; set; }
        public Guid ExamTypeId { get; set; }
        public Guid Subject_ID { get; set; }
    }

    [Table("UserApp", Schema = "Role")]
    public class UserApp
    {
        [Key]
        public Guid UserAppId { get; set; }
        public Guid StudentUserId { get; set; }
        public string Apps { get; set; }
        public int StatusId { get; set; }
    }

    [Table("VWSectionProgramLink", Schema = "Message")]
    public class VWSectionProgramLink
    {
        [Key]
        public Guid NewId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid SectionId { get; set; }
        public Guid ExamTypeId { get; set; }
        public Guid CourseId { get; set; }
    }

    public class ExamMonths
    {
        public Guid ProgramCourseLinkId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ExamTypeId { get; set; }
    }

    [Table("VWExamMonths", Schema = "Message")]
    public class VWExamMonths
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid ExamMasterId { get; set; }
        public DateTime Dated { get; set; }
        public Guid ExamTypeId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
    }

    [Table("VWExamSectionsEx", Schema = "Message")]
    public class ExamSectionapiEx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid Teacher_ID { get; set; }
        public string Teacher_Name { get; set; }
        public Guid Campus_ID { get; set; }
        public string Campus_Name { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public Guid SectionCourseLinkId { get; set; }
    }

    [Table("VWGetExamMaster", Schema = "Message")]
    public class VWGetExamMaster
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid Sections_ID { get; set; }
        public string Sections_Name { get; set; }
        public Guid ExamTypeId { get; set; }
        public string Exam_Type { get; set; }
        public Guid Subject_ID { get; set; }
        public string Subject_Name { get; set; }
        public DateTime Dated { get; set; }
    }

    public class StudentPortalExamType
    {

        [Key]

        [JsonProperty("Ide")]
        public Guid Ide { get; set; }
        //SDF

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Class_Exam_ID")]
        public string Class_Exam_ID { get; set; }

        [JsonProperty("Month")]
        public string Month { get; set; }

        [JsonProperty("Month_id")]
        public string Month_id { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Status")]
        public string Status { get; set; }

    }

    public class StudentPortalExamTypeAll
    {

        [Key]

        [JsonProperty("Ide")]
        public Guid Ide { get; set; }
        //SDF

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Class_Exam_ID")]
        public string Class_Exam_ID { get; set; }

        [JsonProperty("Month")]
        public string Month { get; set; }

        [JsonProperty("Month_id")]
        public string Month_id { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("NextCall")]
        public string NextCall { get; set; }

    }
    public class StudentPortalGetAllExamsResult
    {
        [Key]
        [JsonProperty("ExamTypeId")]
        public Guid ExamTypeId { get; set; }
        [JsonProperty("MTotal")]
        public double MTotal { get; set; }
        [JsonProperty("MObtained")]
        public double MObtained { get; set; }
        [JsonProperty("FirstYearTotal")]
        public double FirstYearTotal { get; set; }

        [JsonProperty("FirstYearObtained")]
        public double FirstYearObtained { get; set; }
        [JsonProperty("TotalMarksMatric")]
        public double TotalMarksMatric { get; set; }
        [JsonProperty("ObtainMarkMatric")]
        public double ObtainMarkMatric { get; set; }
        [JsonProperty("TotalMarksInter")]
        public double TotalMarksInter { get; set; }
        [JsonProperty("ObtainMarksInter")]
        public double ObtainMarksInter { get; set; }
        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Year")]
        public string Year { get; set; }

        [JsonProperty("Month")]
        public string Month { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Subject")]
        public string Subject { get; set; }

        [JsonProperty("TotalMarks")]
        public int TotalMarks { get; set; }

        [JsonProperty("Obtained_Marks")]
        public double Obtained_Marks { get; set; }

        [JsonProperty("Percentage")]
        public double Percentage { get; set; }

        [JsonProperty("OverAllGrade")]
        public string OverAllGrade { get; set; }

        [JsonProperty("OAllRemarks")]
        public string OAllRemarks { get; set; }
        [JsonProperty("OAllObtMarks")]
        public double OAllObtMarks { get; set; }
        [JsonProperty("OAllTotMarks")]
        public double OAllTotMarks { get; set; }
        [JsonProperty("Remarks")]
        public string Remarks { get; set; }
    }

    public class StudentPortalExamTypeParam
    {
        public string Student_ID { get; set; }

        public string Device_ID { get; set; }
        public Guid Enrollment_ID { get; set; }
        public Guid Class_Level_ID { get; set; }
        public Guid Campus_ID { get; set; }

    }

    public class ExamResultParam
    {
        public string Student_ID { get; set; }
        public Guid Class_Exam_ID { get; set; }
        public string Device_ID { get; set; }

        public string Exm_Dated { get; set; }

    }

    public class ExamResultParamEX
    {
        public string Student_ID { get; set; }
        public Guid Class_Exam_ID { get; set; }
        public string Device_ID { get; set; }

        public string Exm_Title { get; set; }

    }

    public class ExamresultResponse
    {
        [Key]
        [JsonProperty("NewID")]
        public Guid NewID { get; set; }

        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Msg")]
        public string Msg { get; set; }

        [JsonProperty("Subject")]
        public string Subject { get; set; }

        [JsonProperty("TotalMarks")]
        public int TotalMarks { get; set; }

        [JsonProperty("Obtained_Marks")]
        public int Obtained_Marks { get; set; }

        [JsonProperty("OverAllGrade")]
        public string OverAllGrade { get; set; }

        [JsonProperty("OAllRemarks")]
        public string OAllRemarks { get; set; }

        [JsonProperty("OAllObtMarks")]
        public int OAllObtMarks { get; set; }

        [JsonProperty("OAllTotMarks")]
        public int OAllTotMarks { get; set; }

        [JsonProperty("Remarks")]
        public string Remarks { get; set; }

    }

    public class ParentsLoginParam
    {

        public string CNIC { get; set; }
        public string PIN { get; set; }
        public string AppName { get; set; }
    }

    public class AttendanceCourseResponseModel
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }
        public string Course { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Total { get; set; }

    }

    public class AttendanceTeacherMonthSection
    {
        [Key]

        public string Dated { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }


    }


    public class TeacherSearchApi
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }

    }

    public class TeacherSearchApiEx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public string Section { get; set; }
        public Guid SectionCourseLinkId { get; set; }


    }

    public class TeacherCalendar
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string TeacherName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }

    }
    public class NewTeacherCalendar
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string TeacherName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string TopicId { get; set; }
        public string Topic { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }

    }

    public class TeacherCourseCalendar
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string TeacherName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public DateTime EndDate { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string Title { get; set; }
        public Guid TopicId { get; set; }
        public bool IsCurrentWeek { get; set; }
        public bool IsMarked { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }

    }




    public class StudentCalendar
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string StudentName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }

    }

    public class AttendanceTeacherMonth
    {
        [Key]

        public string Dated { get; set; }
        public Guid TimeTableId { get; set; }

    }


    public class StudentAcademicCalendar
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string StudentName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string TopicId { get; set; }
        public string Topic { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }
    }
    public class StudentAcademicCalendarNewModel
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string StudentName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string TopicId { get; set; }
        public string Topic { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }
        public virtual List<string> TopicDetail { get; set; } // Made virtual for lazy loading
    }
    public class StudentAcademicCalendarEX
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string StudentName { get; set; }
        public string SubCityName { get; set; }
        public DateTime DateRange { get; set; }
        public string Class { get; set; }
        public string Code { get; set; }
        public string Day { get; set; }
        public Guid? AcademicCalendarId { get; set; }
        public int? YearlyWeekNo { get; set; }
        public int? WeekNo { get; set; }
        public string TopicDescription { get; set; }
        public string TopicId { get; set; }
        public string Topic { get; set; }
        public string Link { get; set; }
        public string ChapterName { get; set; }
        public string Abbreviation { get; set; }
        public string CourseName { get; set; }
        public virtual List<TopicContentVir> TopicDetail { get; set; } // Made virtual for lazy loading
    }




    public class TopicContentVir
    {
        [Key]
        public string FrontEndTopicId { get; set; }
        public string TopicName { get; set; }
        public int? BookId { get; set; }
        public string BookName { get; set; }
        public string Language { get; set; }
        public int? Sequence { get; set; }
        public int? ParentId { get; set; }
        public virtual List<TopicContentVir> FrontendTopicContents { get; set; } // Made virtual for lazy loading
        public int TotalMcqsCount { get; set; }
        public int TotalShortQuestionCount { get; set; }
        public int TotalLongQuestionCount { get; set; }
        public int TotalVideosCount { get; set; }
        public int TotalExamCount { get; set; }
    }



    public class ApiResponseVr
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public List<TopicContentVir> Data { get; set; }
    }
    public class StudentAcademicTopics
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid ChapterId { get; set; }
        public string ChapterName { get; set; }
        [JsonProperty("TopicList")]
        public string TopicList { get; set; }

    }
    public class AttendanceTeacherMonthDetail
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }

    }


    public class AttendanceTeacherMonthDetailHodEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }

    }

    public class PPStudentDetail
    {
        [Key]
        public Guid AttendanceDetailId { get; set; }


        public string Course { get; set; }
        public string Code { get; set; }

    }
    public class StudentExamDataCourseWise
    {
        [Key]
        public Guid Id { get; set; }
        public string ExamType { get; set; }
        public double TotalMarks { get; set; }
        public double ObtainedMarks { get; set; }
        public double Percentage { get; set; }
        public string Grade { get; set; }
    }


    public class AttendanceTeacherMonthDetail2
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }

        public Guid ClassId { get; set; }

        public string ClassName { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }
        public string ParentContactNo { get; set; }

    }

    public class AttendanceTeacherMonthDetailHod
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string RollNo { get; set; }

        public Guid ClassId { get; set; }

        public string ClassName { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }
        public string ParentContactNo { get; set; }

    }




    public class StudentExamDetail
    {
        [Key]
        public Guid NewID { get; set; }
        public string ExamName { get; set; }
        public int TotalMarks { get; set; }

        public int ObtainedMarks { get; set; }

        public int Percentage { get; set; }
        public string CourseName { get; set; }
        public string Grade { get; set; }

    }

    public class StudentExamDetailNew
    {
        [Key]
        public Guid NewID { get; set; }
        public string ExamName { get; set; }
        public int TotalMarks { get; set; }

        public int ObtainedMarks { get; set; }

        public int Percentage { get; set; }
        public string CourseName { get; set; }
        public string Grade { get; set; }
        public bool IsPass { get; set; }


    }

    public class Secwisedata
    {


        public Guid sectioncourselinkid { get; set; }
        public Guid StaffId { get; set; }


    }

    public class SecwiseStudentdata
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public bool IsClassIncharge { get; set; }
        public string SectionName { get; set; }
        public Guid SectionCourseLinkId { get; set; }

    }

    public class HodStudentExaminfoResponse
    {
        [Key]
        public Guid NewID { get; set; }
        public string HodName { get; set; }
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public string Class { get; set; }
        public string CourseName { get; set; }

        public Guid ClassId { get; set; }
        public int SectionStrength { get; set; }

        public Guid SectionId { get; set; }

        public string SectionName { get; set; }
        [JsonProperty("Detail")]
        public string Detail { get; set; }

    }





    public class HodStudentExaminfoResponseEx
    {
        [Key]


        public Guid StaffId { get; set; }

        public string HodName { get; set; }
        public string StaffName { get; set; }
        public string Class { get; set; }
        public string CourseName { get; set; }

        public Guid ClassId { get; set; }
        public int SectionStrength { get; set; }

        [JsonProperty("Detail")]
        public string Detail { get; set; }

    }
    [Table("SlotWiseTotal", Schema = "StepAcademy")]
    public class SlotWiseTotal
    {
        [Key]
        public Guid NewId { get; set; }
        public string Location { get; set; }
        public string Class { get; set; }
        public int Slot1 { get; set; }
        public int Slot2 { get; set; }
        public int Slot3 { get; set; }
        public int Total { get; set; }

    }
    [Table("GetStudentInfoStepAcademy", Schema = "StepAcademy")]
    public class GetStudentInfoStepAcademy
    {

        public Guid LocationId { get; set; }
        public string Location { get; set; }
        public Guid TestId { get; set; }
        public string Test { get; set; }
        public Guid SlotTimeId { get; set; }
        public string SlotTime { get; set; }
        [Key]
        public string RefferenceNo { get; set; }
        public string Year { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string TestDateSelected { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string CollegeName { get; set; }

    }
    public class StudentOverAllWeitage
    {
        [Key]
        public Guid NewId { get; set; }
        public string RollNo { get; set; }
        public decimal OverAllWeitage { get; set; }
        public decimal OverAllAchivedWeitage { get; set; }
        public decimal OverAllPerecntage { get; set; }
        public bool IsCheked { get; set; }




    }
    public class StudentOverAllWeitageData
    {
        [Key]
        public Guid NewId { get; set; }
        public string RollNo { get; set; }
        public string Month { get; set; }
        public string AssessmentName { get; set; }
        public decimal Weightage { get; set; }
        public decimal ObtainedWeitage { get; set; }
        public decimal Totalsubjectwetge { get; set; }
        public decimal AssesmentObtainedWeighted { get; set; }
        public bool IsApproved { get; set; }

        public string Detail { get; set; }

    }
    [Table("VideosRating", Schema = "EL")]
    public partial class VideosRating
    {

        public Guid Userid { get; set; }
        [Key]
        public String Topicid { get; set; }
        public int Videorating { get; set; }
        public DateTime Dated { get; set; }


    }
    public partial class getVideoRating
    {

        public Guid Userid { get; set; }
        [Key]
        public String Topicid { get; set; }
        public int Rating { get; set; }
    }


 public partial class GetStaffCheckData
    {
        [Key]

        public Guid StaffId { get; set; }
        public bool Status { get; set; }
    }

    [Table("TopicsWatched", Schema = "EL")]
    public partial class TopicsWatched

    {
        [Key]
        [Required]
        public Guid TopicWatchId { get; set; }
        public Guid UserId { get; set; }
        public string TopicId { get; set; }
        public DateTime OperationOn { get; set; }
        public Int32 Duration { get; set; }
        public Int32 Percentage { get; set; }
        public bool? EnableMcq { get; set; }
        public string Result { get; set; }
    }

    public class CompilerPayload
    {
        public string Code { get; set; }
        public int LanguageId { get; set; }
        public string UserEmail { get; set; }
        public string Module { get; set; }
        public string Device { get; set; }
    }



    public class CompilerResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public int HttpStatusCode { get; set; }
        public int TotalCounts { get; set; }
        public CompilerResponseData Data { get; set; }
    }

    public class CompilerResponseData
    {
        public string Stdout { get; set; }
        public string Time { get; set; }
        public int? Memory { get; set; }
        public string Stderr { get; set; }
        public string Token { get; set; }
        public string Compile_Output { get; set; }
        public string Message { get; set; }
        public CompilerStatus Status { get; set; }
    }

    public class CompilerStatus
    {
        public int? Id { get; set; }
        public string Description { get; set; }
    }

    public class ECompilerResponseData
    {
        public string Stdout { get; set; }
        public string Time { get; set; }
        public string Memory { get; set; } // Changed from int to string
        public string Stderr { get; set; }
        public string Token { get; set; }
        public string Compile_Output { get; set; }
        public string Message { get; set; }
        public ECompilerStatus Status { get; set; }
    }

    public class ECompilerStatus
    {
        public string Id { get; set; } // Changed from int to string
        public string Description { get; set; }
    }
}