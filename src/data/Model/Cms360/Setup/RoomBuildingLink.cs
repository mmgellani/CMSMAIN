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
    [Table("RoomBuildingLink", Schema = "Setup")]
    public partial class SetupRoomBuildingLink
    {
		[Key]
		[Required]
		public Guid RoomBuildingLinkId { get; set; }
		[Required]
		public Guid RoomId { get; set; }
		[Required]
		public Guid BuildingId { get; set; }
		[Required]
		public string Remarks { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }

	public  class RoomBuildingLinkVM
    {
		[Key]
		
		public Guid RoomBuildingLinkId { get; set; }
	
		public Guid RoomId { get; set; }
		
		public Guid BuildingId { get; set; }
		
		public string Remarks { get; set; }

		public string Name { get; set; }

		public string FullName { get; set; }


		public int Capacity {get;set;}
		
		public int StatusId { get; set; }

		public Guid CampusId { get; set; }

		public string CampusName { get; set; }
	

    }
	public partial class SetupSectionCourseLink2
    {
	[Key]
	public Guid RoomBuildingLinkId{get;set;}
	public Guid SectionId {get;set;}
	public string RoomName {get;set;}


    }
}