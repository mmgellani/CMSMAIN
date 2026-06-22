using System.Numerics;
/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("AttendanceDetail", Schema = "Attendance")]
    public partial class AttendanceAttendanceDetail
    {
        [Key]
        [Required]
        public Guid AttendanceDetailId { get; set; }

        [Required]
        public Guid AttendanceMasterId { get; set; }

        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public Guid AttendenceStatusId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("VWAttendenceDetailVM", Schema = "Attendance")]
    public partial class AttendanceAttendanceDetailVM
    {
        [Key]
        [Required]
        public Guid AttendanceDetailId { get; set; }

        [Required]
        public Guid AttendanceMasterId { get; set; }

        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public Guid AttendenceStatusId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
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

    }

    public partial class AttendanceAttendanceDetailVMEx
    {
        [Key]
        [Required]
        public Guid AttendanceDetailId { get; set; }

        [Required]
        public Guid AttendanceMasterId { get; set; }

        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public Guid AttendenceStatusId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
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

        public bool ShouldAbsent { get; set; }

    }

    public partial class AttendanceUpdateVM
    {
        [Key]
        [Required]
        public Guid AttendanceDetailId { get; set; }

        [Required]
        public Guid AttendanceMasterId { get; set; }

        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public Guid AttendenceStatusId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
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
        public bool ShouldAbsent { get; set; }
    }

    [Table("VWAttendanceData", Schema = "Attendance")]
    public partial class AttendenceData
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
        public bool IsChecked { get; set; }
        public Guid SessionId { get; set; }
        public Guid SectionId { get; set; }

    }

    public partial class StudentOfSection
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }

    }

    public partial class StudentOfSectionEx
    {
[Key]
public Guid Id { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        
        public Guid ClassId { get; set; }

        public string ClassName { get; set; }


    }

    public partial class AttendenceDataDayoff
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
        public bool IsChecked { get; set; }
        public Guid SessionId { get; set; }
        public Guid SectionId { get; set; }
        public int IsDayOff { get; set; }

    }

    public partial class AttendenceDataEx
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
        public bool IsChecked { get; set; }
        public Guid SessionId { get; set; }
        public Guid SectionId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public string SectionName { get; set; }
        public bool ShouldAbsent { get; set; }


    }

    [Table("VWAttendanceDataTeacher", Schema = "Attendance")]
    public partial class AttendenceDataTeacher
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
        public bool IsChecked { get; set; }
        public Guid SessionId { get; set; }
        public Guid SectionId { get; set; }
        public Guid StaffId { get; set; }
        public long UserId { get; set; }

    }

    [Table("VWCourseSection", Schema = "Attendance")]
    public partial class CourseSection
    {
        [Key]

        public Guid SectionCourseLinkId { get; set; }

        public string SectionName { get; set; }

        public Guid CampusProgramId { get; set; }

        public string DayName { get; set; }

        public Guid ClassId { get; set; }

        public Guid ProgramCourseLinkId { get; set; }

        public Guid SectionId { get; set; }

        public Guid CourseId { get; set; }

        public string CourseName { get; set; }

    }

    public partial class AttendanceAttendanceReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string AttendanceStatus { get; set; }
        // public int AbsentStatus { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public DateTime Dated { get; set; }
        public string DayName { get; set; }
        public string SectionName { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string CourseName { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string ShiftName { get; set; }
        public string ClassName { get; set; }
        public string SessionName { get; set; }

    }

    public class AttendenceStudentInfoEx
    {
        
        [Key]
        public DateTime Dated { get; set; }

         [Column(TypeName = "jsonb")]
        public string Detail {get;set;}

    }


    public partial class AttendanceAttendanceStudentInfo
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        // public int AbsentStatus { get; set; }
        public string StudentName { get; set; }
        public DateTime Dated { get; set; }
        public string DayName { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string ShiftName { get; set; }
        public string CourseName { get; set; }
        public string AttendanceStatus { get; set; }

    }
    public partial class AttendanceAttendanceReportVM
    {
        [Key]
        public Guid TimeTableId { get; set; }
        public string Email { get; set; }
        public string StaffName { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string SectionName { get; set; }
        public string CourseName { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string ShiftName { get; set; }
        public string ClassName { get; set; }
        public string SessionName { get; set; }

    }
    public partial class AttendanceAttendanceSubWise
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public string DatedParam { get; set; }
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string RollNo { get; set; }
        public string SectionName { get; set; }
        public string CourseName { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string ShiftName { get; set; }
        public string ClassName { get; set; }
        public string SessionName { get; set; }

    }
    public partial class AttendanceAttendanceSummary
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
       

        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Month { get; set; }
        public int MonthNbr { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ConcessionName { get; set; }
    }
    public partial class AttendanceAttendanceSummary2
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public int OverAllPercentage { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Month { get; set; }
        public int MonthNbr { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ConcessionName { get; set; }
    }

    public partial class AttendanceAttendanceIndividSummary
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public int OverAllPercentage { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Month { get; set; }
        public int MonthNbr { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ConcessionName { get; set; }
    }

  
     public partial class AttendanceAttendanceIndividSummaryEx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int TotalLecture { get; set; }
        

        public int Percentage { get; set; }
        public int OverAllPercentage { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Month { get; set; }
        public int MonthNbr { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ConcessionName { get; set; }
    }

    
    public partial class AttendanceAttendanceSummaryII
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public int OverAllPercentage { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Month { get; set; }
        public int MonthNbr { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string SectionName { get; set; }
        public string ClassName { get; set; }
        public string ShiftName { get; set; }
    }
}