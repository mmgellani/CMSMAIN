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
    [Table("BusStopInfo", Schema = "Transportation")]
    public partial class TransportationBusStopInfo
    {
		[Key]
		[Required]
		public Guid BusStopId { get; set; }
		[Required]
		public string BusStopName { get; set; }
		[Required]
		public Guid RouteId { get; set; }
		[Required]
		public decimal FeeAmount { get; set; }
		[Required]
		public Guid SessionId { get; set; }
		public int StatusId { get; set; }
		public Guid LoggerId { get; set; }
		public Guid VehicleId { get; set; }

    }
}