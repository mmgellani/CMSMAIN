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
    [Table("Enrollments", Schema = "Registration")]
    public partial class RegistrationEnrollments
    {
        [Key]
        [Required]
        public Guid EnrollmentId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid[] SectionCourseLinkId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("VWStudentToEnroll", Schema = "Registration")]
    public partial class StudentToEnrollVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }

        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public Guid SectionId { get; set; }
        public string Range { get; set; }
        public bool IsSelected { get; set; }
        public bool IsDisabled { get; set; }
        public Guid GenderId { get; set; }
        public int StatusId { get; set; }

        public string ObtainedMarks { get; set; }
    }
    [Table("VWStudentsToEnrolledPercentage", Schema = "Registration")]
    public partial class StudentsToEnrolledPercentageVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }

        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public Guid SectionId { get; set; }
        public string Range { get; set; }
        public bool IsSelected { get; set; }
        public bool IsDisabled { get; set; }
        public Guid GenderId { get; set; }
        public int StatusId { get; set; }
        public decimal Percentage { get; set; }
    }
    [Table("VWStudentEnrolled", Schema = "Registration")]
    public partial class StudentEnrolledVM
    {

        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }

        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public Guid SectionId { get; set; }
        public string Range { get; set; }
        public bool IsSelected { get; set; }
        public bool IsDisabled { get; set; }
        public Guid GenderId { get; set; }
        public int StatusId { get; set; }
        public string SectionName { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        [Key]
        public Guid EnrollmentId { get; set; }
        public Guid LoggerId { get; set; }
        public Guid ProgramId { get; set; }
        public string ClassName { get; set; }


    }
    [Table("VWToEnrollWithoutPaid", Schema = "Registration")]
    public partial class ToEnrollWithoutPaidVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }

        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public Guid SectionId { get; set; }
        public string Range { get; set; }
        public bool IsSelected { get; set; }
        public bool IsDisabled { get; set; }
        public Guid GenderId { get; set; }
        public int StatusId { get; set; }
    }


    public class StudentPromotionList
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RefferenceNo { get; set; }

        public string RollNo { get; set; }


        public string FullName { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public bool IsSelected { get; set; }


    }

    public class StudentPromotionPreList
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RefferenceNo { get; set; }

        public string RollNo { get; set; }


        public string FullName { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public bool IsSelected { get; set; }
        public string Range { get; set; }
        public string NewRollNo { get; set; }





    }
}