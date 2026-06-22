using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("VWAdmissionReport", Schema = "Admission")]
    public partial class AdmissionReports
    {
        [Key]
        [Required]
        public Guid? StudentId { get; set; }

        [Required]
        public Guid? SessionId { get; set; }

        [Required]
        public Guid? CampusId { get; set; }

        [Required]
        public Guid? DegreeId { get; set; }

        public Guid? GroupId { get; set; }

        public Guid? CityId { get; set; }

        public Guid? ProgramId { get; set; }

        public Guid? AdmissionTypeId { get; set; }
        public string ProgramName { get; set; }

        public Guid? SubCityId { get; set; }
        public string Name { get; set; }

        //public Guid SectionId { get; set; }

        public Guid? GenderId { get; set; }

        public Guid? ProgramDetailId { get; set; }

        public string RefferenceNo { get; set; }
        public DateTime AdmissionDate { get; set; }

        //public string SectionName { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }
        public string DegreeName { get; set; }

        public string GroupName { get; set; }

        public string CityName { get; set; }

        public string Address { get; set; }

        public string FatherName { get; set; }

        //        [Required]
        public string Board { get; set; }

        //        [Required]
        public string Year { get; set; }

        //        [Required]
        public string Obtained { get; set; }

        //        [Required]
        public string Total { get; set; }

        //        [Required]
        public string BoardRollNo { get; set; }

        public string EnrollmentNo { get; set; }

        public string ParentCNIC { get; set; }

        public string ParentContact { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string GenderType { get; set; }

        public string StudentType { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }

        public string ShiftName { get; set; }

        public int StatusId { get; set; }

        [Required]
        public Guid? LoggerId { get; set; }

        public string FormNo { get; set; }
    }


    [Table("VWAdmissionReportVM", Schema = "Admission")]
    public partial class AdmissionReportsVM
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid? StudentId { get; set; }

        [Required]
        public Guid? SessionId { get; set; }

        [Required]
        public Guid? CampusId { get; set; }

        [Required]
        public Guid? DegreeId { get; set; }

        public Guid? GroupId { get; set; }

        public Guid? CityId { get; set; }

        public Guid? ProgramId { get; set; }

        public Guid? AdmissionTypeId { get; set; }
        public string ProgramName { get; set; }

        public Guid? SubCityId { get; set; }
        public string Name { get; set; }

        //public Guid SectionId { get; set; }

        public Guid? GenderId { get; set; }

        public Guid? ProgramDetailId { get; set; }

        public string RefferenceNo { get; set; }
        public DateTime AdmissionDate { get; set; }

        //public string SectionName { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }
        public string DegreeName { get; set; }

        public string GroupName { get; set; }

        public string CityName { get; set; }

        public string Address { get; set; }

        public string FatherName { get; set; }

        //        [Required]
        public string Board { get; set; }

        //        [Required]
        public string Year { get; set; }

        //        [Required]
        public string Obtained { get; set; }

        //        [Required]
        public string Total { get; set; }

        //        [Required]
        public string BoardRollNo { get; set; }

        public string EnrollmentNo { get; set; }

        public string ParentCNIC { get; set; }

        public string ParentContact { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string GenderType { get; set; }

        public string StudentType { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }

        public string ShiftName { get; set; }

        public int StatusId { get; set; }

        [Required]
        public Guid? LoggerId { get; set; }

        public string FormNo { get; set; }
    }


    public partial class PreAdmissionReport
    {
        [Key]
        public Guid NewID { get; set; }
        public string SessionName { get; set; }
        public string SubCityName { get; set; }
        public string Description { get; set; }
        public int OnlineTotalCount { get; set; }
        public int PhysicalTotalCount { get; set; }
        public int OnlineFeepaid { get; set; }
        public int PhysicalFeepaid { get; set; }
        public int OnlineEnrolled { get; set; }
        public int PhysicalEnrolled { get; set; }
    }

    public partial class RegularAdmissionReport
    {
        [Key]
        public Guid NewID { get; set; }
        public string SessionName { get; set; }
        public string SubCityName { get; set; }
        public string Description { get; set; }
        public int OnlineTotalCount { get; set; }
        public int PhysicalTotalCount { get; set; }
        public int OnlineFeepaid { get; set; }
        public int PhysicalFeepaid { get; set; }
        public int OnlineEnrolled { get; set; }
        public int PhysicalEnrolled { get; set; }
    }



    public partial class AdmissionReportsdet
    {
        [Key]
        public Guid? StudentId { get; set; }

        public Guid? SessionId { get; set; }

        public Guid? CampusId { get; set; }

        public Guid? DegreeId { get; set; }

        public Guid? GroupId { get; set; }

        public Guid? CityId { get; set; }

        public Guid? ProgramId { get; set; }

        public Guid? AdmissionTypeId { get; set; }
        public string ProgramName { get; set; }

        public string FormNo { get; set; }

        public Guid? SubCityId { get; set; }
        public string Name { get; set; }

        //public Guid SectionId { get; set; }

        public Guid? GenderId { get; set; }

        public Guid? ProgramDetailId { get; set; }

        public string RefferenceNo { get; set; }
        public DateTime? AdmissionDate { get; set; }

        //public string SectionName { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }
        public string DegreeName { get; set; }

        public string GroupName { get; set; }

        public string CityName { get; set; }

        public string Address { get; set; }

        public string FatherName { get; set; }

        //        [Required]
        public string Board { get; set; }

        //        [Required]
        public string Year { get; set; }

        //        [Required]
        public string Obtained { get; set; }

        //        [Required]
        public string Total { get; set; }

        //        [Required]
        public string BoardRollNo { get; set; }

        public string EnrollmentNo { get; set; }

        public string ParentCNIC { get; set; }

        public string StudentCNIC { get; set; }

        public string ParentContact { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string GenderType { get; set; }

        public string StudentType { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }

        public string ShiftName { get; set; }

        public int StatusId { get; set; }
        public Guid? LoggerId { get; set; }

    }

    public partial class FormReport
    {
        [Key]
        public Guid? StudentId { get; set; }

        public Guid? SessionId { get; set; }

        public Guid? CampusId { get; set; }

        public Guid? DegreeId { get; set; }

        public Guid? GroupId { get; set; }

        public Guid? CityId { get; set; }

        public Guid? ProgramId { get; set; }

        public Guid? AdmissionTypeId { get; set; }
        public string ProgramName { get; set; }

        public string FormNo { get; set; }

        public Guid? SubCityId { get; set; }
        public string Name { get; set; }

        //public Guid SectionId { get; set; }

        public Guid? GenderId { get; set; }

        public Guid? ProgramDetailId { get; set; }

        public string RefferenceNo { get; set; }
        public DateTime? AdmissionDate { get; set; }

        //public string SectionName { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }
        public string DegreeName { get; set; }

        public string GroupName { get; set; }

        public string CityName { get; set; }

        public string FatherName { get; set; }

        //        [Required]
        public string Board { get; set; }

        //        [Required]
        public string Year { get; set; }

        //        [Required]
        public string Obtained { get; set; }

        //        [Required]
        public string Total { get; set; }

        //        [Required]
        public string BoardRollNo { get; set; }

        public string RegistrationNo { get; set; }

        public string EnrollmentNo { get; set; }

        public string ParentCNIC { get; set; }

        public string StudentCNIC { get; set; }

        public string ParentContact { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string GenderType { get; set; }

        public string StudentType { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }

        public string ShiftName { get; set; }

        public int StatusId { get; set; }
        public Guid? LoggerId { get; set; }
    }
    public partial class AdmissionMatricMarks
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public string EnrollmentNo { get; set; }

        public string StudentName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public string MatricMarks { get; set; }
    }
    public partial class AdmissionMatricPerc
    {
        [Key]
        public Guid NewID { get; set; }

        public int StudentsCount { get; set; }

        public string CityName { get; set; }

        public string SessionName { get; set; }

        public string MarksPercentage { get; set; }

        public string Description { get; set; }

        public string Grade { get; set; }
    }

    public partial class FeeDefaultEx
    {
        [Key]
        public Guid ProgramDetailId { get; set; }

        public string Campus { get; set; }

        public string Description { get; set; }

        public string ProgramName { get; set; }

        public string SessionName { get; set; }

        public int StudentCount { get; set; }

        public int DefaultAmount { get; set; }

        public int Installment { get; set; }
    }
 public  class AdmissionStaticsWise
    {
        [Key]
        public Guid CityId { get; set; }

        public string City { get; set; }

        public int FormCollection { get; set; }

        public int FeePaid { get; set; }

        public int Enrolled { get; set; }

    }

     public  class VWSourceInfo
    {
        [Key]

        public string SorceInfo { get; set; }

        public int Count { get; set; }

    }


}