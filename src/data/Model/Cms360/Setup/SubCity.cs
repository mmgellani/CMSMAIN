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
    [Table("SubCity", Schema = "Setup")]
    public partial class SetupSubCity
    {
        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public String Code { get; set; }
    }

    [Table("VWCitySubCityLink", Schema = "Setup")]
    public partial class SetupCitySubCityLink
    {
        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public string SubCityName { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public String Code { get; set; }
        [Required]
        public string CityName { get; set; }
    }
    [Table("VW_OwnedSubCities", Schema = "Setup")]
    public partial class VW_OwnedSubCities
    {
        [Key]
        [Required]
        public Guid SubCityId { get; set; }
       
        public string Name { get; set; }
        
        public int StatusId { get; set; }
       
        public Guid LoggerId { get; set; }
       
        public Guid CityId { get; set; }
       
        public String Code { get; set; }
    }

}