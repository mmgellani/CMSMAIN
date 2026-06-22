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
    [Table("VW-CampusBuildingLink", Schema = "Setup")]
    public partial class SetupCampusBuildingLinkVM
    {
		[Key]
		[Required]
		public Guid CampusId { get; set; }
		[Required]
		public string CampusName { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public Guid CampusBuildingId { get; set; }
		[Required]
		public Guid BuildingId { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
        
       
       
    }

	[Table("VW-CampusBuildingLinkEx", Schema = "Setup")]
    public partial class SetupCampusBuildingLinkVMEx
    {
		[Key]
		[Required]
		public Guid CampusBuildingId { get; set; }
		[Required]
		public Guid CampusId { get; set; }
		[Required]
		public string CampusName { get; set; }
		[Required]
		public string FullName { get; set; }
		
		[Required]
		public Guid BuildingId { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		public string CampusBuildingName { get; set; }
        
       
       
    }
}