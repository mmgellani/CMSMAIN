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
    [Table("Students", Schema = "Admission")]
    public partial class AdmissionStudents
    {
        [Key]
        [Required]
        public Guid StudentId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string FatherName { get; set; }
        [Required]
        public string StudentCNIC { get; set; }
        [Required]
        public string ParentCNIC { get; set; }
        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }
        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }
        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        [Required]
        public Guid GenderId { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }
        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public string Image { get; set; }
         

         [Column(TypeName = "jsonb")]
        public string Operation  {get;set;}

    }




    [Table("VWStudentRecord", Schema = "Admission")]
    public partial class StudentRecordVM
    {
        [Key]
        [Required]
        public Guid StudentId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public string CampusName { get; set; }
        [Required]
        public Guid ShiftId { get; set; }
        [Required]
        public string ShiftName { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public string SessionName { get; set; }

        [Required]
        public string ClassName { get; set; }


    }

    [Table("PreviousAcademic", Schema = "Admission")]
    public partial class PreviousAcademicRecord
    {
        [Key]
        [Required]
        public Guid PreviousAcademicId { get; set; }
        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid DegreeId { get; set; }
        [Column(TypeName = "jsonb")]
        public string AcademicMarksDetail { get; set; }
        [Required]
        public int StatusId { get; set; }

    }

    public partial class ProgramCourseList
    {
        [Key]
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public string FullName { get; set; }

    }

    [Table("StudentChallanAttachments", Schema = "Fee")]
    public partial class StudentChallanAttachments
    {
                [Key]
                [Required]
                public Guid StudentChallanAttachmentsId { get; set; }

                public Guid AdmissionFormId { get; set; }

                public Guid ClassId { get; set; }

                public string Image { get; set; }
                public string FileName { get; set; }

                public int InstallmentNo { get; set; }

                public int CreatedOn { get; set; }
                public int StatusId { get; set; }


    }



public class AdmissionFormRequest
{
    [Key]
    public Guid StudentChallanAttachmentId { get; set; }
    public Guid AdmissionFormId { get; set; }
    public Guid ClassId { get; set; }
    public int InstallmentNo { get; set; }
    public string Image { get; set; }
    public int StatusId { get; set; }
    public string FullName { get; set; }
        public string FileName { get; set; }

}

}