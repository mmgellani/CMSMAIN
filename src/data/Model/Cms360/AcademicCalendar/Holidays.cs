using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{
    [Table("Holiday", Schema = "AcademicCalendar")]
    public partial class Holidays
    {
		[Key]
		public Guid HolidayId { get; set; }
		public Guid HolidayTypeId{ get; set; }
		public string Description { get; set; }
		public int StatusId { get; set; }
		public DateTime Dates {get;set;}

    }
	public  class HolidaysVM
    {
		[Key]
		[Required]
		public Guid HolidayId { get; set; }
		[Required]
		public string Holiday { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]

		public Guid HolidayTypeId{ get; set; }


		public DateTime Dated {get;set;}

		public string  HolidayType  { get; set; } 

    }
}