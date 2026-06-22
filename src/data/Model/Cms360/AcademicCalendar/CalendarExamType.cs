using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{
    [Table("CalendarExamType", Schema = "AcademicCalendar")]
    public class CalendarExamType
    {
        [Key]

        public Guid CalendarExamTypeId { get; set; }
        public string Name { get; set; }
        public Guid AcademicCalendarMasterId { get; set; }
        public Guid CourseId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int StatusId { get; set; }
        public string TopicIds { get; set; }

    }
}