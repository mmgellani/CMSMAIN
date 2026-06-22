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
    [Table("VW-BuildingAddresPossesion", Schema = "Setup")]
    public partial class SetupBuildingAddressPossessionVM
    {
        [Key]
        [Required]
        public string BuildingName { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public string PostalCode { get; set; }
        [Required]
        public Guid AddressId { get; set; }
        [Required]
        public Guid PossessionId { get; set; }
        [Required]
        public Guid BuildingId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }
        public String PhoneNo { get; set; }
        public String Coordinate { get; set; }
        public Guid? SubCityId { get; set; }
    }
}