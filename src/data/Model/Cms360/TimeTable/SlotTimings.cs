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
    [Table("SlotTimings", Schema = "TimeTable")]
    public partial class TimeTableSlotTimings
    {
        [Key]
        [Required]
        public Guid SlotTimingId { get; set; }
        [Required]
        public Guid SlotId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public TimeSpan StartTime { get; set; }
        [Required]
        public TimeSpan EndTime { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }
    [Table("VWSlotTimings", Schema = "TimeTable")]
    public partial class TimeTableVWSlotTimings
    {
        [Key]
        [Required]
        public Guid SlotTimingId { get; set; }
        [Required]
        public Guid SlotId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string StartTime { get; set; }
        [Required]
        public string EndTime { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("VW-SlotTiming", Schema = "TimeTable")]
    public partial class TimeTableSlotTimingsVM
    {
        [Key]
        [Required]
        public Guid SlotTimingId { get; set; }
        [Required]
        public Guid SlotId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public TimeSpan StartTime { get; set; }
        [Required]
        public TimeSpan EndTime { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public TimeSpan CampusStartTime { get; set; }
        [Required]
        public TimeSpan CampusEndTime { get; set; }
        [Required]
        public string Name { get; set; }
    }
}