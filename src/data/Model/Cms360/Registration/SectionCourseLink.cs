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
    [Table("SectionCourseLink", Schema = "Registration")]
    public partial class RegistrationSectionCourseLink
    {
		[Key]
		[Required]
		public Guid SectionCourseLinkId { get; set; }
		[Required]
		public Guid CampusProgramId { get; set; }
		[Required]
		public Guid ClassId { get; set; }
		[Required]
		public Guid SectionId { get; set; }
		[Required]
		public int FromSerial { get; set; }
		[Required]
		public int ToSerial { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
	    // [Required]
		// public Guid RoomBuildingLinkId{ get; set; }

    }
public partial class RegistrationSectionCourseLink2
    {
	[Key]
	public Guid RoomBuildingLinkId{get;set;}
	public string BuildingName {get;set;}
	public string RoomName {get;set;}
	public  Guid CampusId {get;set;} 

    }

	public  class RegistrationSectionCourseLinkList
    {
		[Key]
		public Guid SectionCourseLinkId { get; set; }
		public Guid CampusProgramId { get; set; }
		public Guid ClassId { get; set; }
		public Guid SectionId { get; set; }
		public int FromSerial { get; set; }
		public int ToSerial { get; set; }
		public int StatusId { get; set; }
		public Guid LoggerId { get; set; }

		public string  FullName { get; set; }

    }
}