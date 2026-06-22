using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("VWTimeTableReport", Schema = "TimeTable")]
    public partial class TimeTableReport {
        [Key]
        [Required]
        public Guid TimeTableId { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public Guid CampusId { get; set; }
        public Guid SectionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid StaffId { get; set; }
        public string Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Period { get; set; }
        public string Class { get; set; }
        public string Room { get; set; }
        public string Staff { get; set; }
        public string Course { get; set; }
        public Guid CourseId { get; set; }
        public string SectionName { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public int StatusId { get; set; }
        
        public Guid RoomId { get; set; }
        public Guid SlotTimingId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }
    }
}