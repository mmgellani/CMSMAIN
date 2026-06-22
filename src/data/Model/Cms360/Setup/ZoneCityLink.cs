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
    [Table("ZoneCityLink", Schema = "Setup")]
    public partial class SetupZoneCityLink
    {
        [Key]
        [Required]
        public Guid ZoneCityId { get; set; }
        [Required]
        public Guid ZoneId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("VW-ZoneCityLink", Schema = "Setup")]
    public partial class SetupZoneCityLinkVM
    {

        [Required]

        public Guid ZoneCityId { get; set; }
        [Required]
        public Guid ZoneId { get; set; }
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string Name { get; set; }
        [Key]
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }





    }

    [Table("VWZoneCity", Schema = "Setup")]
    public partial class ZoneCityVM
    {
        [Key]
        [Required]
        public Guid ZoneCityId { get; set; }
        [Required]
        public Guid ZoneId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public string ZoneName { get; set; }
        public string Name { get; set; }




    }
}