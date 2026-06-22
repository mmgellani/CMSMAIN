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
    [Table("AcademicSectionLink", Schema = "AcademicCalendar")]
    public partial class AcademicSectionMap
    {
		[Key]
		[Required]
		public Guid AcademicSectionLinkId { get; set; }
		public Guid AcademicCalendarMasterId { get; set; }
		public Guid SectionCourseLinkId { get; set; }
		public int StatusId { get; set; }

    }

	public partial class AcademicSectionMapVW

    {

        [Key]

        [Required]

        public Guid AcademicSectionLinkId { get; set; }

        public Guid AcademicCalendarMasterId { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public Guid CampusProgramId { get; set; }

        public string AcademicMaster { get; set; }

        public string SectionName { get; set; }

        public Guid SubCityId { get; set; }

        public Guid SessionId { get; set; }

        public Guid ClassId { get; set; }

        public Guid BoardId { get; set; }

        public int StatusId { get; set; }



    }


}