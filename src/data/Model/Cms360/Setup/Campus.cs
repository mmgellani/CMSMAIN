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
    [Table("Campus", Schema = "Setup")]
    public partial class SetupCampus
    {
        [Key]
        [Required]
        public Guid CampusId { get; set; }
        public Guid? FranchiseId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Code { get; set; }
        public string Description { get; set; }
        public Guid InstitutionId { get; set; }
        public string DigitCode { get; set; }
        public Guid SubCityId { get; set; }

        [Required]
        public int StatusId { get; set; }
        public string Logo { get; set; }

        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public string CustomerCode { get; set; }
        [Required]
        public int IsTestCampus { get; set; }

        public Guid? BusinessUnitId { get; set; }

        public Guid? SmsApId { get; set; }

        public string EmailPrefix { get; set; }
        public bool IsEbook { get; set; }
        public bool? IsMerchandise { get; set; }
        public bool? IsDelivery { get; set; }

    }



    [Table("VWStepCampuCity", Schema = "Setup")]
    public partial class StepCampuCity
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }


    }









    [Table("VWCampuCity", Schema = "Setup")]
    public partial class CampusCityVM
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }
        public Guid FranchiseId { get; set; }

    }
      [Table("VW_HadafSMSCampus", Schema = "Setup")]
    public partial class VWHadafSMSCampus
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }
        public Guid FranchiseId { get; set; }

    }

    public partial class CampusCityUserBased
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }


    }

    public partial class CampusCityData
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid CityId { get; set; }
        public Guid SubCityId { get; set; }

    }



    [Table("VWCampuCityEx", Schema = "Setup")]
    public partial class CampusCityVMEx
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }


    }

    [Table("VWCampuCityExHadaf", Schema = "Setup")]
    public partial class CampusCityVMExHadaf
    {
        [Key]
        public Guid CampusId { get; set; }

        public string CityName { get; set; }

        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }


    }

    public partial class CampusCityVMExGenderWise
    {
        [Key]
        public Guid CampusId { get; set; }
        public string CityName { get; set; }
        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }


    }

    public class CampusCityVMExGenderWiseHadaf
    {
        [Key]
        public Guid CampusId { get; set; }
        public string CityName { get; set; }
        public string CampusName { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }


    }
    public class BulkCopyProgramDetailResponse
    {
        [Key]
        public string Result { get; set; }


    }
}