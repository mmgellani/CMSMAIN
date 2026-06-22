using System.Reflection.Metadata;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization;
using System.Security.AccessControl;
/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Cms360.Data.Model
{
    [Table("VWProgramList", Schema = "OnlineAdmission")]
    public partial class ProgramListVM
    {
        [Key]
        [Required]
        public Guid NewId { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string Description { get; set; }
        public Guid DDL_ID { get; set; }
    }

    [Table("VWProgramList2", Schema = "OnlineAdmission")]
    public partial class ProgramListVM2
    {
        [Key]
        [Required]
        public Guid NewId { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string Description { get; set; }
        public Guid DDL_ID { get; set; }
    }

    [Table("VWProgramListEx", Schema = "OnlineAdmission")]
    public partial class ProgramListEx
    {
        [Key]
        [Required]
        public Guid NewId { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string Description { get; set; }
        public Guid DDL_ID { get; set; }
    }

    [Table("VWProgramListHadaf", Schema = "OnlineAdmission")]
    public partial class ProgramListHadaf
    {
        [Key]
        [Required]
        public Guid NewId { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string Description { get; set; }
        public Guid DDL_ID { get; set; }
    }

    [Table("VWBankIban", Schema = "public")]
    public partial class BankIbanVM
    {
        [Key]
        [Required]
        public Guid CampusId { get; set; }
        public string BankDetail { get; set; }

    }


    [Table("ClassChallanNote", Schema = "public")]
    public partial class ClassNote
    {
        [Key]
        [Required]
        public Guid ClassId { get; set; }
        public string ChallanNote { get; set; }

    }

    public class UserCredencials
    {
        [Key]
        public string Password { get; set; }
    }

    [Table("AdmissionUser", Schema = "OnlineAdmission")]
    public partial class AdmissionUserVM
    {
        [Key]
        [Required]
        public Guid AdmissionUserId { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }
        public string DocumentLink { get; set; }
        public bool Flag { get; set; }
        public string FullName { get; set; }
        public string PhoneNo { get; set; }
        public string StudentType { get; set; }

        public string RefferenceNo { get; set; }
        public Guid SubCityId { get; set; }

        public Guid ProgramDetailId { get; set; }



    }

    [Table("OnlineAdmission", Schema = "OnlineAdmission")]
    public partial class OnlineAdmissionVM
    {
        [Key]
        [Required]
        public Guid OnlineAdmissionId { get; set; }
        public Guid SessionId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Decleration { get; set; }
        public int StatusId { get; set; }

        [JsonProperty("CampusProgramId")]
        public string CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
        public int ScholarshipMarks { get; set; }
    }
    public class BaseClass
    {
        [JsonProperty("ResponseCode")]
        public string ResponseCode { get; set; }

        [JsonProperty("Message")]
        public string Message { get; set; }
    }

    public class ResponseTable
    {
        [Key]
        public string Message { get; set; }
    }

    public class DeclerationClass
    {
        [JsonProperty("ResponseCode")]
        public string ResponseCode { get; set; }

        [JsonProperty("Message")]
        public string Message { get; set; }

        [JsonProperty("Decleration")]
        public string Decleration { get; set; }
    }

    public class AdmissionCheckClass
    {
        [JsonProperty("AdmissionStatus")]
        public bool AdmissionStatus { get; set; }

        [JsonProperty("Message")]
        public string Message { get; set; }
    }

    public class R_List
    {
        public string DDL_ID { get; set; }

        public string DDL_Title { get; set; }
    }

    public class OA_Parameter
    {
        [JsonProperty("DDL_Name")]
        public string DDL_Name { get; set; }
    }

    public class OA_CityParameter
    {
        [JsonProperty("City_ID")]
        public Guid City_ID { get; set; }
    }

    public class ChallanResp
    {
        [Key]
        public string ChallanNo { get; set; }

        public Guid? ChallanTypeId { get; set; }

    }

    public class OnlineAdmissionResponse
    {
        public string ChallanNumber { get; set; }

        [Key]
        public string Message { get; set; }

        public Guid? ChallanTypeId { get; set; }

    }
    public class OnlineAdmissionResponsestep
    {

        [Key]
        public string Message { get; set; }

    }
    public class OnlineAdmissionResponsestepModel
    {
        public Guid? StepCityId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string CollegeName { get; set; }
        public string RollNo { get; set; }
        public string BoardMarks { get; set; }
        public string ProgramDetail { get; set; }
        public Guid? StepProvinceId { get; set; }


    }
    public class cityprovince
    {
        public string provincename { get; set; }
    }


    public class RefferenceNoResp
    {

        [Key]
        public string RefferenceNo { get; set; }



    }

    public class OnlineAdmissionResponseEx
    {
        public string ChallanNumber { get; set; }

        [Key]
        public string Message { get; set; }

        public Guid? ChallanTypeId { get; set; }

        public string StudentType { get; set; }

    }

    public class OA_ProgramParameter
    {
        [JsonProperty("Program_Detail_ID")]
        public Guid Program_Detail_ID { get; set; }
    }

    public class PopulateAll : BaseClass
    {
        [JsonProperty("R_List")]
        public IEnumerable<R_List> R_List { get; set; }
    }

    public class OnlineAdmissionUpdData
    {


        public Guid StudentId { get; set; }

        [Key]
        public Guid AdmissionFormId { get; set; }
        public string ParentCNIC { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string ParentNo { get; set; }
        public string StudentNo { get; set; }
        public string Address { get; set; }
        public string Year { get; set; }
        public string BoardRollNo { get; set; }
        public int Total { get; set; }
        public int Obtained { get; set; }
        public string Board { get; set; }
        public string Email { get; set; }
        public string RollNo { get; set; }
        public string Institution { get; set; }
        public Guid DegreeId { get; set; }
        public Guid Gender { get; set; }
        public Guid Program { get; set; }
        public Guid City { get; set; }
        public Guid GroupId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime AdmissionDate { get; set; }

    }
    public class OnlineAdmissionUpdDataEx
    {


        public Guid StudentId { get; set; }

        [Key]
        public Guid AdmissionFormId { get; set; }
        public string ParentCNIC { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string ParentNo { get; set; }
        public string StudentNo { get; set; }
        public string Address { get; set; }
        public string Year { get; set; }
        public string BoardRollNo { get; set; }
        public int Total { get; set; }
        public int Obtained { get; set; }
        public string Board { get; set; }
        public string Email { get; set; }
        public string RollNo { get; set; }
        public string Institution { get; set; }
        public Guid DegreeId { get; set; }
        public Guid Gender { get; set; }
        public Guid Program { get; set; }
        public Guid City { get; set; }
        public Guid GroupId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string ChallanNo { get; set; }
        public string FeeAmount { get; set; }


    }
    public class AdmissionStatus
    {
        public int StatusCount { get; set; }
        [Key]
        public string ApllicationStatus { get; set; }
        public int OrderBy { get; set; }


    }

    public class ConcessionType
    {
        [Key]
        public string ConcessionTypeId { get; set; }

        public string Description { get; set; }

        public int ShouldProceed { get; set; }
    }

    public class CampusProgramInfo
    {
        [Key]
        public Guid CampusProgramId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }



    }

    public class AdmissionConcession
    {
        [Key]

        public Guid AdmissionConcessionId { get; set; }
        public Guid AdmissionUserId { get; set; }
        public string ConcessionType { get; set; }
        public string OldRollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string City { get; set; }
        public string Session { get; set; }
        public string Program { get; set; }

        public string Section { get; set; }
        public string Address { get; set; }
        public int Status { get; set; }

        public Guid AdmissionFormId { get; set; }
        public Guid? ConcessionId { get; set; }

    }

    public class OnlineAdmissionResponsestepModelSSAT
    {
        public Guid? LocationId { get; set; }
        public Guid? TestId { get; set; }
        public Guid? SlotTimeId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string CollegeName { get; set; }
    }

}