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
    [Table("VWConcessionDetail", Schema = "Fee")]
    public partial class FeeConcessionDetailVM
    {
        [Key]
        [Required]
        public Guid ConcessionDetailId { get; set; }
        [Required]
        public Guid ConcessionId { get; set; }
        [Required]
        public Guid FeeHeadId { get; set; }
        [Required]
        public decimal Percentage { get; set; }
        [Required]
        public int FeeAmount { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string FeeHeadName { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ShiftId { get; set; }



    }

    [Table("VWGetStudents", Schema = "Fee")]
    public partial class GetStudentsVM
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid StudentId { get; set; }
        [Required]
        public Guid AdmissionTypeId { get; set; }
        [Required]
        public string RollNo { get; set; }
        [Required]
        public string RefferenceNo { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]

        public string FatherName { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public string StudentCNIC { get; set; }
        [Required]
        public string ParentCNIC { get; set; }
        [Required]
        public string Obtained { get; set; }
        [Required]
        public string Total { get; set; }
        [Required]
        public string StudentContact { get; set; }
        [Required]
        public string ParentContact { get; set; }
        [Required]
        public string Guardians { get; set; }
        [Required]
        public Guid GenderId { get; set; }
        [Required]

        public DateTime DateOfBirth { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }
        
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        [Required]
        public Guid ShiftId { get; set; }
        [Required]
        public Guid ZoneId { get; set; }
        [Required]
        public Guid StudentFeeStructureId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public int InstallmentNo { get; set; }
        [Required]

        public Guid FeeHeadId { get; set; }
        [Required]

        public int FeeAmount { get; set; }
        

        public Guid? ConcessionDetailId { get; set; }
        [Required]
        public int PayableAmount { get; set; }
        [Required]
        public string AdmissionTypeName { get; set; }








    }
}