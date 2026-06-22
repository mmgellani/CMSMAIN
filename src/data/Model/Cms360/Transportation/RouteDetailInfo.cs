/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
	[Table ("RouteDetailInfo", Schema = "Transportation")]
	public partial class TransportationRouteDetailInfo {
		[Key]
		[Required]
		public Guid RouteDetailId { get; set; }

		[Required]
		public Guid RouteId { get; set; }

		[Required]
		public string StopName { get; set; }

		[Required]
		public string StartingPoint { get; set; }

		[Required]
		public string EndingPoint { get; set; }

		[Required]
		public int Fare { get; set; }

		[Required]
		public decimal StatusId { get; set; }

		[Required]
		public Guid LoggerId { get; set; }

		public string Longitude { get; set; }

		public string Latitude { get; set; }

	}
}