/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("City", Schema = "Setup")]
    public partial class SetupCity
    {
        [Key]
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string CityCode { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid ProvinceId { get; set; }
        [Required]
        public Guid ZoneId { get; set; }

    }
    public partial class SetupCityPossession
    {
        [Key]
        public Guid CityId { get; set; }
        public string FullName { get; set; }
        public string CityCode { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public Guid ProvinceId { get; set; }
        public Guid ZoneId { get; set; }

    }
    [Table("VWCitySubCity", Schema = "Setup")]
    public partial class CitySubCity
    {

        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }


        [Required]
        public string SubCityName { get; set; }

    }
    public partial class CitySubCity2
    {

        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }


        [Required]
        public string SubCityName { get; set; }

    }

    [Table("VWCitySubCityOnlineAdmission", Schema = "Setup")]
    public partial class GetCityOnlineAdmissionPortal
    {

        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }
        [Required]
        public string SubCityName { get; set; }
        [Required]
        public bool IsCampusShow { get; set; }

    }

    [Table("VWCityHadaf", Schema = "Setup")]
    public partial class CityHadaf
    {

        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }
        [Required]
        public string SubCityName { get; set; }

    }
    [Table("VWCitySubCityOnlineAdmissionHadaf", Schema = "Setup")]
    public partial class GetCityOnlineAdmissionPortalHadaf
    {

        [Key]
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }
        [Required]
        public string SubCityName { get; set; }
        [Required]
        public bool IsCampusShow { get; set; }

    }

    public class returnResponseValue
    {
        [Key]
        [Required]
        public string Result { get; set; }

    }
    public class GetEbookCheckResponse
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }
        public bool IsEbook { get; set; }

    }


}