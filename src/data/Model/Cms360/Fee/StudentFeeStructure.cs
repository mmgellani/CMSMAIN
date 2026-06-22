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
    [Table("StudentFeeStructure", Schema = "Fee")]
    public partial class FeeStudentFeeStructure
    {
        [Key]
        [Required]
        public Guid StudentFeeStructureId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
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
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }
    public partial class StudentCreditNotes
    {
        [Key]
        public Guid NewID { get; set; }
        public int Sr { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string ChallanNo { get; set; }
        public int InstallmentNo { get; set; }
        public int Amount { get; set; }
        public bool isChecked { get; set; }
        public string paidDate { get; set; }
    }
    public partial class SectionList
    {
        [Key]
        public Guid SectionId { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }

    }
    public partial class InstallmentNos
    {
        [Key]
        public Guid Id { get; set; }
        public int InstallmentNo { get; set; }
    }

    public partial class AttendanceCutOffDate
    {
        [Key]
        public Guid Id { get; set; }
        public string CutOffDate { get; set; }
    }

    public partial class GetConcessionReversalStudents
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public int Total { get; set; }
        public int Presents { get; set; }
        public int Absents { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public string CurrentConcession { get; set; }
        public string ReConcession { get; set; }
        public bool isChecked { get; set; }
        public int InstallmentNo { get; set; }
        public string ClassId { get; set; }

    }

    public partial class GetConcessionStudentsList
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string AdmissionType { get; set; }
        public int InstallmentNo { get; set; }
        public string ClassId { get; set; }
        public bool isChecked { get; set; }
        public string Remarks { get; set; }
        public Guid ScholarshipCriteriaId { get; set; }


    }
    public partial class GetConcessionStudentsListEX
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string AdmissionType { get; set; }
        public string ContinuationPolicy { get; set; }
        public string RollNo { get; set; }
        public string RefferrenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public Guid ScholarshipCriteriaId { get; set; }
        public string ConcessionName { get; set; }
        public bool IsChecked { get; set; }

    }
    public partial class StudentRefundFee
    {
        [Key]
        public Guid NewID { get; set; }
        public string Session { get; set; }
        public string ClassName { get; set; }
        public string RefferenceNo { get; set; }

        public string StudentName { get; set; }
        public string Section { get; set; }

        public string City { get; set; }
        public string SubCity { get; set; }
        public string ChallanNo { get; set; }
        public int InstallmentNo { get; set; }
        public string Collector { get; set; }
        public int Amount { get; set; }
        public string ParentContactNo { get; set; }
        public string paidDate { get; set; }
        public string Status { get; set; }

    }

    public partial class StudentFeeStructureVM
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public string RefferenceNo { get; set; }

        [Required]

        public string RollNo { get; set; }

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
        public string Description { get; set; }

        [Required]
        public int StatusId { get; set; }



    }
    public partial class AdhocChallanFeeHead
    {
        [Key]
        [Required]
        public Guid FeeHeadId { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
        public Guid ChallanTypeId { get; set; }
    }

    [Table("VWStudentChallanVM", Schema = "Fee")]
    public partial class FeeStudentFeeStructureVM
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]

        public string Description { get; set; }


        [Required]

        public string RefferenceNo { get; set; }
        [Required]

        public string FullName { get; set; }
        [Required]

        public string FatherName { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]

        public int StatusId { get; set; }



    }

    public class AdhocChallanModel
    {
        [Key]

        public Guid CampusId { get; set; }
        public int Amount { get; set; }
        public Guid FeeHeadId { get; set; }
        public DateTime DueDate { get; set; }
        public Guid StaffId { get; set; }
        public string Remarks { get; set; }


    }

    public class UpdateAdhocChallan
    {
        [Key]
        public Guid adhocchallanid { get; set; }
        public int amount { get; set; }
        public DateTime duedate { get; set; }
        public bool isdelete { get; set; }
        public string Remarks { get; set; }

    }

    public class GetAdhocListData
    {
        [Key]
        public Guid AdhocChallanId { get; set; }
        public string FeeHead { get; set; }
        public Guid FeeHeadId { get; set; }
        public int FeeAmount { get; set; }
        public string Campus { get; set; }
        public DateTime DueDate { get; set; }

        public string ChallanNo { get; set; }
        public string Status { get; set; }
        public string StaffName { get; set; }
        public Guid StaffId { get; set; }

        public string Remarks { get; set; }

        public Guid ChallanTypeId { get; set; }
        public string Email { get; set; }

    }


    public partial class RefundChallanofStudent
    {
        [Key]
        public Guid NewID { get; set; }
        public string StudentName { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string ChallanNo { get; set; }
        public decimal InstallmentNo { get; set; }
        public string Class { get; set; }
        public string ProgramDetail { get; set; }
        public string ChallanType { get; set; }


    }

    public partial class AllalreadyRefundChallan
    {
        [Key]
        public Guid RefundChallanId { get; set; }
        public Guid StudentChallanId { get; set; }
        public string RefundAmount { get; set; }
        public DateTime RefundDate { get; set; }
        public string ChallanNo { get; set; }

        public string RollNo { get; set; }

        public string StudentName { get; set; }

        public string FatherName { get; set; }

        public string PayName { get; set; }

        public string ChequeNumber { get; set; }

        public DateTime ChequeDate { get; set; }

        public string Bank { get; set; }

        public string Remarks { get; set; }

        public Guid CampusBankLinkId { get; set; }

      
        public string Detail { get; set; }




    }

    public partial class ReversalChalln
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string ReversalChallan { get; set; }
        public string NewChallan { get; set; }
        public int FeeAmount { get; set; }

    }

}