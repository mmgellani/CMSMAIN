
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    public class TimeTableTimeTableMerge
    {
        [Key]
        public Guid MergeTimeTableId { get; set; }


        public Guid[] TimeTableId { get; set; }

        public DateTime FromDate { get; set; }


        public DateTime ToDate { get; set; }

        public int StatusId { get; set; }

        public string FullName { get; set; }
    }
    [Table("VWTimeTableMerge", Schema = "TimeTable")]
    public partial class TimeTableVWTimeTableMerge
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
}