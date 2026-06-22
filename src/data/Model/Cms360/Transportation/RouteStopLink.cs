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
    [Table("RouteStopLink", Schema = "Transportation")]
    public partial class TransportationRouteStopLink
    {
		[Key]
		[Required]
		public Guid RouteStopLinkIId { get; set; }
		[Required]
		public Guid RouteId { get; set; }
		[Required]
		public Guid VehicleId { get; set; }
		[Required]
		public decimal StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }

[Table("VWRouteStopLink", Schema = "Transportation")]
    public partial class VMTransportationRouteStopLink
    {
		[Key]
		[Required]
		public Guid ZoneId { get; set; }

		[Required]
		public string ZoneName { get; set; }
		[Required]
		public Guid CityId { get; set; }
		[Required]
		public string CityName { get; set; }
		[Required]
		public Guid SubCityId { get; set; }
		[Required]
		public string SubCityName { get; set; }
		[Required]
		public Guid RouteId { get; set; }
		[Required]
		public string RouteTitle { get; set; }
		[Required]
		public Guid VehicleId { get; set; }
		[Required]
		public string VehicleName { get; set; }
		[Required]
		public string VehicleNumberPlate { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		[Required]
		public Guid RouteStopLinkIId { get; set; }

    }

}


