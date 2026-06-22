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
    [Table("ChallanValidity", Schema = "Fee")]
    public partial class FeeChallanValidity
    {
        [Key]
        [Required]
        public Guid ChallanValidityId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public int InstallmentNo { get; set; }
        [Required]
        public DateTime FromDate { get; set; }
        [Required]
        public DateTime ToDate { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        public Guid? CampusProgramId { get; set; }

        public Guid? ClassId { get; set; }



    }


    [Table("VW-CampusChallanValidity", Schema = "Fee")]
    public partial class CampusChallanValidityVM
    {
        [Key]
        [Required]
        public Guid ChallanValidityId { get; set; }
        [Required]
        public Guid CampusId { get; set; }

        [Required]
        public String FullName { get; set; }
        [Required]
        public int InstallmentNo { get; set; }
        [Required]
        public DateTime FromDate { get; set; }
        [Required]
        public DateTime ToDate { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        public Guid CampusProgramId { get; set; }

        public string Description { get; set; }
        public Guid ClassId { get; set; }

        public Guid SessionId { get; set; }


    }
    [Table("VWChallanValidityUpdate", Schema = "Fee")]
    public partial class VMChallanValidityUpdate
    {
        [Key]
        public string ChallanNo { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public int? FeeAmount { get; set; }
        public int? InstallmentNo { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int StatusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionId { get; set; }
        public Boolean IsSelected { get; set; }
        public Guid SectionCourseLinkId { get; set; }
    }


    [Table("VWChallanValidityUpdateEx", Schema = "Fee")]
    public partial class VMChallanValidityUpdateEx
    {
        [Key]
        public string ChallanNo { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public int? FeeAmount { get; set; }
        public int? InstallmentNo { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int StatusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ClassId { get; set; }
        public Guid? SectionId { get; set; }
        public Boolean IsSelected { get; set; }
        public Guid? SectionCourseLinkId { get; set; }

        public string RefferenceNo { get; set; }

        public Guid GenderId { get; set; }

    }

    [Table("StudentUserMV", Schema = "Registration")]
    public partial class StudentUserGenEx
    {
        [Key]
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public Boolean IsSelected { get; set; }
    }


    public partial class ChallanValidityUpdatemodel
    {
        [Key]
        public string ChallanNo { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public Guid AdmissionFormId { get; set; }
        public int? FeeAmount { get; set; }
        public int? InstallmentNo { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int StatusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionId { get; set; }
        public Boolean IsSelected { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public DateTime? NewDueDate { get; set; }
        public Guid GenderId { get; set; }
        public Boolean AllowButton { get; set; }
        public Boolean EnablePrintButton { get; set; }
        public Boolean ExpiredButton { get; set; }
    }
    public partial class SSATDataRequired
    {
        [Key]
        public string RefferenceNo { get; set; }
        public string Date { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string CollegeName { get; set; }
        public string RollNo { get; set; }
        public string Marks { get; set; }
        public string ProgramDetail { get; set; }
        public string ProvinceName { get; set; }
        public string CityName { get; set; }

    }

    public partial class ChallanValidityUpdateEx
    {
        [Key]
        public string ChallanNo { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public Guid? AdmissionFormId { get; set; }
        public int? FeeAmount { get; set; }
        public int? InstallmentNo { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int StatusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ClassId { get; set; }
        public Guid? SectionId { get; set; }
        public Boolean IsSelected { get; set; }
        public Guid? SectionCourseLinkId { get; set; }

        public string RefferenceNo { get; set; }

        public Guid GenderId { get; set; }
        public Boolean AllowButton { get; set; }


    }

}