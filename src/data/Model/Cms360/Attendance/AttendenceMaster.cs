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
    [Table("AttendenceMaster", Schema = "Attendance")]
    public partial class AttendanceAttendenceMaster
    {
        [Key]
        [Required]
        public Guid AttendenceMasterId { get; set; }
        [Required]
        public Guid TimeTableId { get; set; }
        [Required]
        public DateTime Dated { get; set; }
        [Required]
        public bool IsApproved { get; set; }

        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("VWAttendenceMasterVM", Schema = "Attendance")]
    public partial class AttendanceAttendenceMasterVM
    {
        [Key]
        [Required]
        public Guid AttendenceMasterId { get; set; }
        [Required]
        public Guid TimeTableId { get; set; }
        [Required]
        public DateTime Dated { get; set; }
        [Required]
        public bool IsApproved { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        // public string FullName { get; set; }
        public string SectionName { get; set; }

        public string Name { get; set; }

        public string RoomName { get; set; }

        public string DayName { get; set; }

        public string StaffName { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }
        public string Session { get; set; }

        public Guid CampusId { get; set; }

        public string CampusName { get; set; }

        public Guid SessionId { get; set; }

        public Guid SectionId { get; set; }

        public Guid ProgramDetailId { get; set; }

        // public Guid CampusProgramId { get; set; }

        public Guid ClassId { get; set; }

    }

    [Table("VWAttendanceApprovalData", Schema = "Attendance")]
    public partial class AttendanceApprovalDataVM
    {
        [Key]

        public Guid AttendenceMasterId { get; set; }
        public Guid TimeTableId { get; set; }
        public DateTime Dated { get; set; }
        public string Date
        {
            get
            {
                if (this.Dated != null)
                {
                    return this.Dated.ToShortDateString();
                }
                else
                {
                    return null;
                }
            }
        }
        public bool IsApproved { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid CourseId { get; set; }
        public string SectionName { get; set; }
        public string DayName { get; set; }
        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

    }

    [Table("VWAttendanceApprovalDataEx", Schema = "Attendance")]
    public partial class AttendanceApprovalDataExVM
    {
        [Key]

        public Guid AttendenceMasterId { get; set; }
        public Guid TimeTableId { get; set; }
        public DateTime Dated { get; set; }
        public string Date
        {
            get
            {
                if (this.Dated != null)
                {
                    return this.Dated.ToShortDateString();
                }
                else
                {
                    return null;
                }
            }
        }
        public bool IsApproved { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string Course { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid CourseId { get; set; }
        public string SectionName { get; set; }
        public string DayName { get; set; }
        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }
        public string StaffName { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
        public class AttendenceMonthWise
    {  [Key]

        public Guid ID { get; set; }
        public string Month { get; set; }

        public int Presents { get; set; }
        public int Total { get; set; }

        public int Absents { get; set; }
        public int Leave { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public float AttendencePercentage { get; set; }

        public float AggrePercentage { get; set; }

    }


    public class AttendanceApprovalExNotificationVM
    {
         [Key]
         public Guid AttendenceMasterId { get; set; }
         public DateTime Dated { get; set; }
         public string Course { get; set; }
         public Guid sessionId { get; set; }
         public Guid CampusId { get; set; }
         public Guid CampusProgramId { get; set; }
         public Guid ClassId { get; set; }
         public Guid SectionCourseLinkId { get; set; }
         public string RollNo { get; set; }
         public string Code { get; set; }
         public string Name { get; set; }

    }


    [Table("VWAttendanceHistory", Schema = "Attendance")]
    public class VWAttendanceHistory
    {
        [Key]
        public Guid AttendenceMasterId { get; set; }
        public DateTime Dated { get; set; }
        public string InTime { get; set; }
        public string ApprovedBy { get; set; }
        public string InsertedBy { get; set; }
        public string BrowserInfo { get; set; }
        public string ApprovalTime { get; set; }
        public string InsertionTime { get; set; }
        public int StatusId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

    }

    public class AttendanceDevice
    {
        [Key]
        public string BrowserInfo { get; set; }
        public int Count { get; set; }
        public DateTime Dated { get; set; }

    }

    public class StudentToSend
    {
        [Key]
        public Guid Id { get; set; }
        public string PhoneNo { get; set; }
        public string FullName { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string CourseName { get; set; }
        public Guid AdmissionFormId { get; set; }


    }

    public class DeviceInfoEx

    {
        [Key]

        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }
    }

      public class AttendencePercentages
    {  [Key]

        public Guid ID { get; set; }
        

        public int Presents { get; set; }
        public int Total { get; set; }
        public int Absents { get; set; }
        public int Leave { get; set; }

        public float AttendencePercentage { get; set; }

    

    }


}