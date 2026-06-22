using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("VWAdmissionReportEnrolled", Schema = "Admission")]
    public partial class AdmissionReportsEnrolled {
        [Key]
        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public Guid CampusId { get; set; }

        public Guid SectionId { get; set; }

        public Guid CityId { get; set; }

        public Guid ProgramId { get; set; }

        public string ProgramName { get; set; }

        public Guid SubCityId { get; set; }
        public string Name { get; set; }
        public Guid AdmissionTypeId { get; set; }

        public Guid GenderId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public string RefferenceNo { get; set; }
        public DateTime AdmissionDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

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

        public string EnrollmentNo { get; set; }

        public string ParentCNIC { get; set; }

        public string ParentContact { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string GenderType { get; set; }

        public string StudentType { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }

        public string SectionName { get; set; }

        public string ShiftName { get; set; }

        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }
    }
}