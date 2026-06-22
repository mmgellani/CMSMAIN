using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{
    [Table("Event", Schema = "AcademicCalendar")]
    public partial class Events
    {
        [Key]
        public Guid EventId { get; set; }
        public Guid HolidayTypeId { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string Description { get; set; }
        public int StatusId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

    }
    public partial class EventsVW
    {
        [Key]
        public Guid EventId { get; set; }
        public Guid HolidayTypeId { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public string Description { get; set; }
        public int StatusId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string HolidayType { get; set; }

    }
}