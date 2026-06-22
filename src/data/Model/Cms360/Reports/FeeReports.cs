using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("VWFeeReports", Schema = "Fee")]
    public partial class FeeReports
    {
        [Key]
        [Required]
        public Guid StudentId { get; set; }

        public string RollNo { get; set; }

        public string RefferenceNo { get; set; }

        public string FullName { get; set; }

        public string ParentContactNo { get; set; }

        public string StudentContactNo { get; set; }

        public string Description { get; set; }

        public Guid ClassId { get; set; }

        public string ClassName { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public string SectionName { get; set; }

        public string FatherName { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }
        public Guid SessionId { get; set; }
        public Guid GenderId { get; set; }
        public string GenderName { get; set; }

        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string ShiftName { get; set; }

        // public string Logo { get; set; }

        // public string Slogan { get; set; }

        public string ChallanNo { get; set; }

        public Int64 InstallmentNo { get; set; }

        public double FeeAmount { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? PaidDate { get; set; }

        public double FeeDetail { get; set; }

        public double PayableAmount { get; set; }

        public string ConcessionName { get; set; }
        public int StatusId { get; set; }
    }

    [Table("VWFeeStatement", Schema = "Fee")]
    public partial class VWFeeStatement
    {
        [Key]
        [Required]
        public Guid NewID { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ShiftId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime PaidDate { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid GenderId { get; set; }
        public Guid ClassId { get; set; }
        public Guid FeeHeadId { get; set; }
        public string FeeHeadName { get; set; }
        public Guid? ScholarshipCriteriaId { get; set; }
        public string ScholarshipCriteriaName { get; set; }
        public string Remarks { get; set; }
        public int PayableAmount { get; set; }
        public int TotalAmount { get; set; }
        public Guid ProgramId { get; set; }
        public Guid CollectorId { get; set; }


    }

    [Table("VWFeeStatementEnrolled", Schema = "Fee")]
    public partial class FeeStatementEnrolledVM
    {
        [Key]
        [Required]
        public Guid NewID { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ShiftId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime PaidDate { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid GenderId { get; set; }
        public Guid ClassId { get; set; }
        public Guid FeeHeadId { get; set; }
        public string FeeHeadName { get; set; }
        public Guid? ScholarshipCriteriaId { get; set; }
        public string ScholarshipCriteriaName { get; set; }
        public string Remarks { get; set; }
        public int PayableAmount { get; set; }
        public int TotalAmount { get; set; }
        public Guid ProgramId { get; set; }
        public Guid CollectorId { get; set; }
        public Guid SectionId { get; set; }
        public string Collector { get; set; }
        public string ClassName { get; set; }


    }
    public partial class FinalDuesList
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string ClassName { get; set; }

        public string Description { get; set; }

        public string SectionName { get; set; }

        public string ProgramName { get; set; }

        public string ShiftName { get; set; }

        public int Education { get; set; }

        public int Transport { get; set; }

        public int Fine { get; set; }

        public int OtherFee { get; set; }

        public int StepFee { get; set; }

        public int Board_University { get; set; }

        public int Total { get; set; }
    }

    public partial class InstallmentPaid
    {
        [Key]
        public Guid NewID { get; set; }
        public int Count { get; set; }
        public Guid ProgramDetailId { get; set; }

        public string Description { get; set; }

        public string ShiftName { get; set; }
        public string Gender { get; set; }
        public string Class { get; set; }
        public int InstallmentNo { get; set; }

        public string Campus { get; set; }

        public string City { get; set; }

        public string Session { get; set; }

    }

    public partial class RevenuePaid
    {
        [Key]
        public Guid NewID { get; set; }
        public int Receivable { get; set; }
        public int Received { get; set; }

        public int Balance { get; set; }

        public int InstallmentNo { get; set; }
        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }

        public string Campus { get; set; }

        public Guid ProgramId { get; set; }

        public string Program { get; set; }
        public Guid ClassId { get; set; }

        public string Class { get; set; }

        public string ProgramClass { get; set; }

    }

    public partial class StudentRevenuePaid
    {
        [Key]
        public Guid NewID { get; set; }
        public int Receivable { get; set; }
        public int Received { get; set; }

        public int Balance { get; set; }
        public int Fine { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }

        public string BoardUniversityNo { get; set; }
        public string FormNo { get; set; }

        public int InstallmentNo { get; set; }
        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }

        public string Campus { get; set; }

        public Guid ProgramId { get; set; }

        public string Program { get; set; }
        public Guid ClassId { get; set; }

        public string Class { get; set; }

        public string ProgramClass { get; set; }
        public string ConcessionRemarks { get; set; }

    }


    public partial class StudentRevenuePaidEx
    {
        [Key]
        public Guid NewID { get; set; }
        public int Transfer { get; set; }

        public int Receivable { get; set; }
        public int Received { get; set; }

        public int Balance { get; set; }
        public int Fine { get; set; }

        public Guid AdmissionFormId { get; set; }
        public DateTime? PaidDate { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string AnnualFee { get; set; }

        public string BoardUniversityNo { get; set; }
        public string FormNo { get; set; }

        public int InstallmentNo { get; set; }
        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }

        public string Campus { get; set; }

        public Guid ProgramId { get; set; }

        public string Program { get; set; }
        public Guid ClassId { get; set; }

        public string Class { get; set; }

        public string ProgramClass { get; set; }
        public string ConcessionRemarks { get; set; }

    }

    public partial class StudentRevenuePaidExx2
    {
        [Key]
        public Guid NewID { get; set; }
        public int Transfer { get; set; }

        public int Receivable { get; set; }
        public int Received { get; set; }

        public int Balance { get; set; }
        public int Fine { get; set; }

        public Guid AdmissionFormId { get; set; }
        public string PaidDate { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string AnnualFee { get; set; }

        public string BoardUniversityNo { get; set; }
        public string FormNo { get; set; }

        public int InstallmentNo { get; set; }
        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }

        public string Campus { get; set; }

        public Guid ProgramId { get; set; }

        public string Program { get; set; }
        public Guid ClassId { get; set; }

        public string Class { get; set; }

        public string ProgramClass { get; set; }
        public string ConcessionRemarks { get; set; }

    }

    public partial class StudentRevenuePaidExxxy
    {
        [Key]
        public Guid NewID { get; set; }
        public int Transfer { get; set; }

        public int Receivable { get; set; }
        public int Received { get; set; }

        public int Balance { get; set; }
        public int Fine { get; set; }
        public int OtherFee { get; set; }
        public int Exemption { get; set; }


        public Guid AdmissionFormId { get; set; }
        public string PaidDate { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string AnnualFee { get; set; }

        public string BoardUniversityNo { get; set; }
        public string FormNo { get; set; }

        public int InstallmentNo { get; set; }
        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }

        public string Campus { get; set; }

        public Guid ProgramId { get; set; }

        public string Program { get; set; }
        public Guid ClassId { get; set; }

        public string Class { get; set; }

        public string ProgramClass { get; set; }
        public string ConcessionRemarks { get; set; }

    }


    public partial class StudentRevenuePaidEx2
    {
        [Key]
        public Guid NewID { get; set; }
        public int Transfer { get; set; }

        public int Receivable { get; set; }
        public int Received { get; set; }

        public int Balance { get; set; }
        public int Fine { get; set; }
        public int OtherFee { get; set; }
        public int Exemption { get; set; }

        public int PreAdjustment { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string PaidDate { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string AnnualFee { get; set; }

        public string BoardUniversityNo { get; set; }
        public string FormNo { get; set; }

        public int InstallmentNo { get; set; }
        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }

        public string Campus { get; set; }

        public Guid ProgramId { get; set; }

        public string Program { get; set; }
        public Guid ClassId { get; set; }

        public string Class { get; set; }

        public string ProgramClass { get; set; }
        public string ConcessionRemarks { get; set; }

    }

public partial class TeacherAttendancereport
{

    [Key]
        public Guid NewID { get; set; }
        public Guid StaffId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string section { get; set; }
        public string Course { get; set; }
        public Guid CourseId { get; set; }

        public string Description { get; set; }

        public string SubCity { get; set; }

        public string ClassName { get; set; }

        public string MarkedBy { get; set; }
        public string MarkedBYstatus { get; set; }
        public string Status { get; set; }
        public string SessionName { get; set; }

        public DateTime Dated { get; set; }

}

    public partial class StdMailingLabel
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public int StatusId { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StdType { get; set; }
        public string StdtypeFather { get; set; }
        public string ParentContact { get; set; }
        public string Adrs { get; set; }
        public string Image { get; set; }
        public string ClassSection { get; set; }
        public string Session { get; set; }


    }

    public partial class FeeReportsData
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }
        public string RollNo { get; set; }

        public string Description { get; set; }

        public string SectionName { get; set; }
        public string ConcessionName { get; set; }

        public int InstallmentNo { get; set; }
        public DateTime DueDate { get; set; }

        public DateTime PaidDate { get; set; }

        public string ProgramName { get; set; }
        public int FeeAmount { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHeadName { get; set; }

        public string ParentContactNo { get; set; }
        public string StudentContactNo { get; set; }
        public string ScholarshipName { get; set; }
        public string AdmissionType { get; set; }
    }
    public partial class ScholarshipReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }
        public string RollNo { get; set; }

        public string Description { get; set; }

        public string SectionName { get; set; }
        public string ConcessionName { get; set; }

        public int InstallmentNo { get; set; }
        public DateTime DueDate { get; set; }

        public DateTime PaidDate { get; set; }

        public string ProgramName { get; set; }
        public int FeeAmount { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHeadName { get; set; }

        public int Percentage { get; set; }
        public string ScholarshipName { get; set; }
        public string AdmissionType { get; set; }
    }

    public partial class FeeDefaulterReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public int InstallmentNo { get; set; }

        public string Description { get; set; }

        public string SectionName { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime? PaidDate { get; set; }

        public string ProgramName { get; set; }
        public int FeeAmount { get; set; }

        public string ChallanNo { get; set; }

        public string ParentContactNo { get; set; }
        public string StudentContactNo { get; set; }


    }
    public partial class FeeDefaulterReportnew
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }

        public string CampusName { get; set; }

        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public int InstallmentNo { get; set; }

        public string Description { get; set; }

        public string SectionName { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime? PaidDate { get; set; }

        public string ProgramName { get; set; }
        public int FeeAmount { get; set; }

        public string ChallanNo { get; set; }

        public string ParentContactNo { get; set; }
        public string StudentContactNo { get; set; }
        public string Class { get; set; }


    }
    public partial class FeeConcessCountReport
    {
        [Key]
        public Guid NewID { get; set; }
        public int TotalCount { get; set; }
        public int EnrolledCount { get; set; }
        public int FeePaid { get; set; }
        public string CityName { get; set; }
        public string SessionName { get; set; }
        public string ConcessionName { get; set; }
        public string CampusName { get; set; }
    }

    public partial class FeeStepCountReport
    {
        [Key]
        public Guid NewID { get; set; }
        public string SessionName { get; set; }
        public string CityName { get; set; }
        public int PunjabianTotalCount { get; set; }
        public int NonePunjabianTotalCount { get; set; }
        public int PunjabianFeepaid { get; set; }
        public int NonPunjabianFeepaid { get; set; }
        public int PunjabianEnrolled { get; set; }
        public int NonePunjabianEnrolled { get; set; }
    }



    public partial class FeeStatementExinstall
    {
        [Key]
        [Required]
        public Guid NewID { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ShiftId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string ShiftName { get; set; }
        public string InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime PaidDate { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid GenderId { get; set; }
        public Guid ClassId { get; set; }
        public Guid FeeHeadId { get; set; }
        public string FeeHeadName { get; set; }
        public Guid? ScholarshipCriteriaId { get; set; }
        public string ScholarshipCriteriaName { get; set; }
        public string Remarks { get; set; }
        public int PayableAmount { get; set; }
        public int TotalAmount { get; set; }
        public Guid ProgramId { get; set; }
        public Guid CollectorId { get; set; }
        public Guid SectionId { get; set; }
        public string Collector { get; set; }
        public string ClassName { get; set; }


    }


    public partial class Installemntexamption
    {
        [Key]
        public Guid StudentChallanId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public string ChallanNo { get; set; }
        public string Status { get; set; }
        public int InstallmentNo { get; set; }

        public Guid SessionId { get; set; }
        public string Session { get; set; }
        public Guid CampusId { get; set; }
        public string Campus { get; set; }
        public Guid ProgramId { get; set; }
        public string Program { get; set; }
        public string ProgramDetail { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public Guid ProgramDetailId { get; set; }
        public string Shift { get; set; }

        public string Section { get; set; }
        public int? ExamaptionAmount { get; set; }
        public int? RecivedAmount { get; set; }
        public string ExceptionRemarks { get; set; }
        public string ConcessionName { get; set; }

    }
    public partial class TransportDefaulterReport
    {


        // public Guid NEWID { get; set; }
        [Key]
        public string ChallanNo { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public int FeeAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string GenderName { get; set; }
        public string ClassName { get; set; }
        public string Description { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string ShiftName { get; set; }
        public string SectionName { get; set; }
        public string Route { get; set; }

    }
    public partial class GetTransportFeeDetailReport
    {

        [Key]
        public Guid NEWID { get; set; }
        public string Session { get; set; }
        public string CampusName { get; set; }
        public string ProgramName { get; set; }
        public string Class { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string StudentName { get; set; }
        public string SectionName { get; set; }
        public string Route { get; set; }
        public int? TotalAmount { get; set; }
        public int? DividedTotalAmount { get; set; }
        public int? DividedExemption { get; set; }
        public int? Exemption { get; set; }
        public int? Receiveable { get; set; }
        public string ChallanNo { get; set; }
        public int ChallanAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int? TotalReceivedAmount { get; set; }
        public int? ReceivedAmount { get; set; }
        public int? Balance { get; set; }
        public int? DividedBalance { get; set; }
        public int? Tchallans { get; set; }

    }

    public partial class GetFullFeeStudentDetail
    {

        [Key]
        public Guid NEWID { get; set; }
        public string Session { get; set; }
        public string City { get; set; }
        public string Class { get; set; }
        public string Program { get; set; }
        public string Shift { get; set; }
        public int InstallmentNo { get; set; }
        public int Cnnt { get; set; }

    }


}




