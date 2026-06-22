using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{

    [Table("AcademicCalendarMaster", Schema = "AcademicCalendar")]

    public class AcademicCalendarMaster
    {
        [Key]
        public Guid AcademicCalendarMasterId { get; set; }
        public Guid SessionId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid ClassId { get; set; }
        public Guid? BoardId { get; set; }
        public string FullName { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Weeks { get; set; }
        public int StatusId { get; set; }
        public int YearlyWeekNo { get; set; }
        public Boolean? IsApproved { get; set; }
    }
    
    public class AcademicCalendarMasterCity
    {
        [Key]
        public Guid AcademicCalendarMasterId { get; set; }
        public Guid SessionId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid ClassId { get; set; }
        public Guid? BoardId { get; set; }
        public string FullName { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Weeks { get; set; }
        public int StatusId { get; set; }
        public int YearlyWeekNo { get; set; }
        public Boolean? IsApproved { get; set; }
                public string SubCity { get; set; }

    }
}