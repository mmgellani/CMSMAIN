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
    [Table("VehicleInfo", Schema = "Transportation")]
    public partial class TransportationVehicleInfo
    {
		[Key]
		[Required]
		public Guid VehicleId { get; set; }
		[Required]
		public string VehicleName { get; set; }
		[Required]
		public int VehicleCapacity { get; set; }
		[Required]
		public string VehicleNumberPlate { get; set; }
		[Required]
		public string RegistrationNo { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		public string Parking { get; set; }

    }
}