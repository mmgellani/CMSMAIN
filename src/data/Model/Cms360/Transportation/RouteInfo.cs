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
    [Table("RouteInfo", Schema = "Transportation")]
    public partial class TransportationRouteInfo
    {
		[Key]
		[Required]
		public Guid RouteId { get; set; }
		[Required]
		public string RouteTitle { get; set; }
		[Required]
		public Guid SubCityId { get; set; }
		[Required]
		public int MaxInstallmentNo { get; set; }
		[Required]
		public string DriverName { get; set; }
		[Required]
		public string DriverPhoneNo { get; set; }
		[Required]
		public string RouteStartPoint { get; set; }
		[Required]
		public string RouteEndPoint { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		[Required]
		public Guid VehicleId { get; set; }

		public string Longitude {get;set;}

		public string Latitude { get; set; }

    }


	public class TransportationRouteInfoByStudent
	{
		[Key]
		[Column("RouteId")]
		public Guid routeId { get; set; }
		[Column("RouteTitle")]
		public string routeTitle { get; set; }
		[Column("StatusId")]
		public int statusId { get; set; }

	}
}