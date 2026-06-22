using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{
    [Table("AcademicCalendarType", Schema = "AcademicCalendar")]
    public class AcademicCalendarType
    {
        [Key]

        public Guid AcademicCalendarTypeId { get; set; }
        public string FullName { get; set; }
        public string Code { get; set; }
        public int StatusId { get; set; }
        public bool IsHoliday { get; set; }
       

    }

}