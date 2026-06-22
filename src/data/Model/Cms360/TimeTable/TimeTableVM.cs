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

    public partial class TimeTableTimeTableCourseVM
    {

        [Key]
        public Guid TimeTableId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Guid CourseId { get; set; }
        public Guid StaffId { get; set; }
        public Guid RoomId { get; set; }
        public string DayName { get; set; }
        public Guid SlotTimingId { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string RoomName { get; set; }
        public string Name { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string StaffName { get; set; }
        public string CampusName { get; set; }
        public string Description { get; set; }
        public string Session { get; set; }
        public string FullName { get; set; }
        public string SectionName { get; set; }
        public bool IsBreak { get; set; }
    }




    [Table("VWTimeTableSessionEx2", Schema = "TimeTable")]
    public partial class TimeTableTimeTableVM
    {
        [Key]
        [Required]
        public Guid TimeTableId { get; set; }

        [Required]
        public Guid SectionCourseLinkId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public string DayName { get; set; }

        [Required]
        public Guid SlotTimingId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public string RoomName { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [Required]
        public string StaffName { get; set; }

        [Required]
        public string CampusName { get; set; }

        [Required]
        public Guid CampusId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public string Session { get; set; }

        [Required]
        public Guid SectionId { get; set; }

        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string SectionName { get; set; }

        [Required]
        public Guid ProgramCourseLinkId { get; set; }

        public Guid CourseId { get; set; }
        public bool IsBreak { get; set; }
    }
    [Table("VWTimeTableSessionEx", Schema = "TimeTable")]
    public partial class TimeTableTimeTableVMEx
    {
        [Key]
        [Required]
        public Guid TimeTableId { get; set; }

        [Required]
        public Guid SectionCourseLinkId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public string DayName { get; set; }

        [Required]
        public Guid SlotTimingId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public string RoomName { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [Required]
        public string StaffName { get; set; }

        [Required]
        public string CampusName { get; set; }

        [Required]
        public Guid CampusId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public string Session { get; set; }

        [Required]
        public Guid SectionId { get; set; }

        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string SectionName { get; set; }

        [Required]
        public Guid ProgramCourseLinkId { get; set; }

        public Guid CourseId { get; set; }
        public bool IsBreak { get; set; }
        public int IsDayOff { get; set; }
    }

    [Table("VWTimeTableTeacher", Schema = "TimeTable")]
    public partial class TimeTableTimeTableTeacher
    {
        [Key]
        [Required]
        public Guid TimeTableId { get; set; }

        [Required]
        public Guid SectionCourseLinkId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public string DayName { get; set; }

        [Required]
        public Guid SlotTimingId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public string RoomName { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [Required]
        public string StaffName { get; set; }

        [Required]
        public string CampusName { get; set; }

        [Required]
        public Guid CampusId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public string Session { get; set; }

        [Required]
        public Guid SectionId { get; set; }

        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string SectionName { get; set; }

        [Required]
        public Guid ProgramCourseLinkId { get; set; }

        public Guid CourseId { get; set; }
        public bool IsBreak { get; set; }
        public int UserId { get; set; }
        public string ClassName { get; set; }

        public int Ribbon { get; set; }
        public int IsDayOff { get; set; }

    }


    public partial class TimeTableTimeTableTeacher4
    {
        [Key]
        [Required]
        public Guid TimeTableId { get; set; }

        [Required]
        public Guid SectionCourseLinkId { get; set; }

        [Required]
        public Guid StaffId { get; set; }

        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public string DayName { get; set; }

        [Required]
        public Guid SlotTimingId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public string RoomName { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [Required]
        public string StaffName { get; set; }

        [Required]
        public string CampusName { get; set; }

        [Required]
        public Guid CampusId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public string Session { get; set; }

        [Required]
        public Guid SectionId { get; set; }

        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string SectionName { get; set; }

        [Required]
        public Guid ProgramCourseLinkId { get; set; }

        public Guid CourseId { get; set; }
        public bool IsBreak { get; set; }
        public int UserId { get; set; }
        public string ClassName { get; set; }

        public int Ribbon { get; set; }
        public int IsDayOff { get; set; }

    }
}

public partial class TimeTableTimeTableDayClose
{
    [Key]
    [Required]
    public Guid TimeTableId { get; set; }

    [Required]
    public Guid SectionCourseLinkId { get; set; }

    [Required]
    public Guid StaffId { get; set; }

    [Required]
    public Guid RoomId { get; set; }

    [Required]
    public string DayName { get; set; }

    [Required]
    public Guid SlotTimingId { get; set; }

    [Required]
    public int StatusId { get; set; }

    [Required]
    public Guid LoggerId { get; set; }

    [Required]
    public string RoomName { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string StartTime { get; set; }

    [Required]
    public string EndTime { get; set; }

    [Required]
    public string StaffName { get; set; }

    [Required]
    public string CampusName { get; set; }

    [Required]
    public Guid CampusId { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public Guid ProgramDetailId { get; set; }

    [Required]
    public Guid SessionId { get; set; }

    [Required]
    public string Session { get; set; }

    [Required]
    public Guid SectionId { get; set; }

    [Required]
    public Guid ClassId { get; set; }

    [Required]
    public string FullName { get; set; }

    [Required]
    public string SectionName { get; set; }

    [Required]
    public Guid ProgramCourseLinkId { get; set; }

    public Guid CourseId { get; set; }
    public bool IsBreak { get; set; }
    public int UserId { get; set; }
    public string ClassName { get; set; }

    public int Ribbon { get; set; }
    public bool IsChecked { get; set; }
    public Guid AttendenceMasterId { get; set; }


}
public partial class TimeTableTimeTableVMEX3
{
    [Key]
    public Guid TimeTableId { get; set; }
    public Guid SectionCourseLinkId { get; set; }
    public Guid StaffId { get; set; }
    public Guid RoomId { get; set; }
    public string DayName { get; set; }
    public Guid SlotTimingId { get; set; }
    public int StatusId { get; set; }
    public Guid LoggerId { get; set; }
    public string RoomName { get; set; }
    public string Name { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string StaffName { get; set; }
    public string CampusName { get; set; }
    public string Description { get; set; }
    public string Session { get; set; }
    public string FullName { get; set; }
    public string SectionName { get; set; }
    public bool IsBreak { get; set; }
}
public partial class TimeTableCloseResponse
{
    [Key]
    public string res { get; set; }
}

public partial class TimeTableClose
{
    [Key]
    public Guid TimeTableCloseId { get; set; }
    public Guid CampusProgramId { get; set; }
    public Guid ProgramDetailId { get; set; }
    public string CampusName { get; set; }
    public string Description { get; set; }
    public Guid ProgramId { get; set; }
    public string ProgramName { get; set; }
    public Guid ShiftId { get; set; }
    public string ShiftName { get; set; }
    public string MediumName { get; set; }
    public bool IsChecked { get; set; }
}
public partial class textmessage

{
    [Key]
    public string Response { get; set; }
}

public partial class TimeTableTimeTableDayClose4
{
    [Key]

    [Required]
    public Guid SectionCourseLinkId { get; set; }

    [Required]
    public string SectionName { get; set; }
    [Required]
    public Guid SectionId { get; set; }

    [Required]
    public Guid CampusId { get; set; }

    [Required]
    public string CampusName { get; set; }


    [Required]
    public Guid ClassId { get; set; }

    [Required]
    public string ClassName { get; set; }

    [Required]
    public Guid ProgramDetailId { get; set; }

    [Required]
    public string ProgramDetail { get; set; }

    public int TotalLecture { get; set; }
    public int LecturesApproved { get; set; }
    public int UnApprovedLectures { get; set; }
    public int UnMarkedLectures { get; set; }
    public bool IsBreak { get; set; }
    public bool IsChecked { get; set; }
    public bool Isdisabled { get; set; }



}
public partial class TimeTableDailyAttendanceStatus
{
    [Key]
    public Guid StaffId { get; set; }
    public string TeacherName { get; set; }
    public string Email { get; set; }
     public string ContactNo { get; set; }
    public int TotalLecture { get; set; }
    public int LecturesMarked { get; set; }
    public int LecturesUnMarked { get; set; }
    public int TotalApproved { get; set; }
    public int OnTime { get; set; }
    public int OffTime { get; set; }
    public bool IsChecked { get; set; }

}

public partial class TimeTableDailyAttendanceDetail
{
     [Key]
    public Guid NewID { get; set; }
    public Guid StaffId { get; set; }
    public string SectionName { get; set; }
    public Guid SectionId { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string CourseName { get; set; }
    public string ProgramDetail { get; set; }
    public Guid ProgamDeatilId { get; set; }
    public string Class { get; set; }
    public Guid Classid { get; set; }
    public string Location { get; set; }
    public string Status { get; set; }

}