/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//sadfsd
namespace Cms360.Data.Model
{
    [Table("HolidayType", Schema = "AcademicCalendar")]
    public partial class HolidayType
    {
		[Key]
		[Required]
		public Guid HolidayTypeId { get; set; }
		[Required]
		public string Name { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public int StatusId { get; set; }
		

		public bool? IsRecursive { get; set; }

    }

	public  class AcademicCalendarVM
    {

		[Key]
		[Required]
		public Guid HolidayDetailId { get; set; }
		[Required]
		public string CalendarName { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public DateTime Dates { get; set; }
		public string HolidayType { get; set; }
		public string Session { get; set; }

		public string FullName { get; set; }

    }



}