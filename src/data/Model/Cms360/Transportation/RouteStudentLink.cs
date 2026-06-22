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
    [Table("RouteStudentLink", Schema = "Transportation")]
    public partial class TransportationRouteStudentLink
    {
        [Key]
        [Required]
        public Guid RouteStudentLinkId { get; set; }
        [Required]
        public Guid RouteDetailId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public int Exemption { get; set; }
        [Required]
        public DateTime StartingDtae { get; set; }
        [Required]
        public decimal StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Boolean IsChecked { get; set; }

    }

    [Table("VWStudentsSubCity", Schema = "Transportation")]
    public partial class StudentSubCityVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid StudentLoggerId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public string CityName { get; set; }
        public DateTime PaidDate { get; set; }
        public int InstallmentNo { get; set; }
        

    }

    public partial class StudentsCampusVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid StudentLoggerId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public string CityName { get; set; }
        public DateTime PaidDate { get; set; }
        public int InstallmentNo { get; set; }
        

    }

    
    [Table("VWStudentsSubCityEx", Schema = "Transportation")]
    public partial class StudentSubCityVMEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        
        public string FullName { get; set; }
        
               public Guid SessionId { get; set; }
               public Guid SubCityId { get; set; }
       
        

    }

    [Table("VWRouteStudentLink", Schema = "Transportation")]
    public partial class routestudentlinkVM
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid StudentId { get; set; }
        [Required]
        public string RollNo { get; set; }
        [Required]
        public string FullName { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }

        [Required]
        public Guid ZoneId { get; set; }

        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public string CampusName { get; set; }
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public string SubCityName { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }


    }

    [Table("VWRouteStudentLinkList", Schema = "Transportation")]
    public partial class routestudentlinklistVM
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        [Required]
        public string FullName { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }

        [Required]
        public Guid ZoneId { get; set; }

        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public string CampusName { get; set; }
        [Required]
        public Guid SubCityId { get; set; }
        [Required]
        public string SubCityName { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public string CityName { get; set; }
        [Required]
        public Guid RouteDetailId { get; set; }
        [Required]
        public Guid RouteId { get; set; }
        [Required]
        public string StopName { get; set; }
        [Required]
        public string RouteTitle { get; set; }

        [Required]
        public DateTime StartingDtae { get; set; }

        [Required]
        public int StatusId { get; set; }
    }

    public partial class RouteStudentLinkEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }

        public Guid CampusProgramId { get; set; }

        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public Guid CityId { get; set; }
        public string CityName { get; set; }
        public Guid RouteDetailId { get; set; }
        public Guid RouteId { get; set; }
     
        public string StopName { get; set; }
        
        public string RouteTitle { get; set; }

        public DateTime StartingDtae { get; set; }

        public int StatusId { get; set; }
        public Guid ClassId { get; set; }


    }


}