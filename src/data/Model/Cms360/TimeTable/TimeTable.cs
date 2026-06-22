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
    [Table("TimeTable", Schema = "TimeTable")]
    public partial class TimeTableTimeTable
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
		public Guid? ProgramCourseLinkId { get; set; }
		[Required]
		public bool IsBreak { get; set; }

    }
	[Table("VWTeacherTimeTableReport", Schema = "TimeTable")]
	public class VWTeacherTimeTableReport
	{
		[Key]
		public Guid NewId { get; set; }
		public Guid TimeTableId { get; set; }
		public Guid StaffId { get; set; }
		public string StaffName { get; set; }
		public Guid SessionId { get; set; }
		public string SessionName { get; set; }
		public Guid CampusId { get; set; }
		public string CampusName { get; set; }
		public Guid ProgramDetailId { get; set; }
		public string Description { get; set; }
		public string Detail { get; set; }
		public Guid ClassId { get; set; }
		public string ClassName { get; set; }
		public Guid ShiftId { get; set; }
		public string ShiftName { get; set; }
		public Guid MediumId { get; set; }
		public string MediumName { get; set; }
		public Guid CourseId { get; set; }
		public string CourseName { get; set; }
		public Guid RoomId { get; set; }
		public string RoomName { get; set; }
		public string DayName { get; set; }
		public string StartEndTime { get; set; }
		public Guid SlotTimingId { get; set; }
		public string LectureNo { get; set; }
		public int UserId { get; set; }
		public Guid SectionId { get; set; }
		public string SectionName { get; set; }
	}
 public class SectionIncharge
    {
        
        [Key]
         public Guid Ide { get; set; }

         public string FullName {get;set;}

         public string Email { get; set; }

         public bool IsChecked { get; set; }

    }

	  public class AttendanceNotificationEx
    {
        [Key]
		public string Rollno { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        
        public string MessageText { get; set; }
        

    }

}