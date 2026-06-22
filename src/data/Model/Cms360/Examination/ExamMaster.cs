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
    [Table("ExamMaster", Schema = "Examination")]
    public partial class ExaminationExamMaster
    {
        [Key]
        [Required]
        public Guid ExamMasterId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public DateTime Dated { get; set; }
        [Required]
        public int TotalMarks { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid? SectionCourseLinkId { get; set; }
        [Required]
        public Guid ProgramCourseLinkId { get; set; }

        public bool IsApproved { get; set; }
        public bool Operation { get; set; }
    }

    public partial class ExaminationExamMasterNew
    {
        [Key]
        public Guid ProgramCourseLinkId { get; set; }
    }


    public partial class ExamMonthWise
    {
        [Key]

        public Guid Ide { get; set; }
        public string Month { get; set; }

        public DateTime Dated { get; set; }

        public int Total { get; set; }

        public int Obtained { get; set; }

        public int Percentage { get; set; }

        public int PassCount { get; set; }

        public int FailCount { get; set; }

        public Guid ExamTypeId { get; set; }

        public string ExamType { get; set; }




    }
    public class ExamMonthWiseEx
    {
        [Key]

        public Guid Ide { get; set; }
        public string Month { get; set; }
        public string ExamScheduleName { get; set; }
        public DateTime Dated { get; set; }

        public int Total { get; set; }

        public int Obtained { get; set; }

        public float Percentage { get; set; }

        public int PassCount { get; set; }

        public int FailCount { get; set; }

        public Guid ExamTypeId { get; set; }

        public string ExamType { get; set; }




    }


    public class StudentAcademicAnalysisReportExm2
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ExamScheduleId { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamTypeId { get; set; }

        public string ExamType { get; set; }

        public string Remarks { get; set; }

        public decimal? PreAcademicPerc { get; set; }

        public string Month { get; set; }

        public string Code { get; set; }

        public int TotalMarks { get; set; }
        public bool IsApproved { get; set; }
        public Guid ExamDetailId { get; set; }
        public Guid AdmissionFormId { get; set; }

        public Guid AttendanceStatusId { get; set; }

        public decimal ObtainMarks { get; set; }
        public DateTime ExamScheduleDate { get; set; }
        public string ExamScheduleName { get; set; }
        public string CourseName { get; set; }
        public decimal Percentage { get; set; }

        public string StudentName { get; set; }
        public string SectionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }

        public DateTime? ExamMasterDate { get; set; }


    }

    public class StudentAcademicAnalysisReportExm3
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ExamScheduleId { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamTypeId { get; set; }

        public string ExamType { get; set; }

        public string Remarks { get; set; }

        public decimal? PreAcademicPerc { get; set; }

        public string Month { get; set; }

        public string Code { get; set; }

        public int TotalMarks { get; set; }
        public bool IsApproved { get; set; }
        public Guid ExamDetailId { get; set; }
        public Guid AdmissionFormId { get; set; }

        public Guid AttendanceStatusId { get; set; }

        public decimal ObtainMarks { get; set; }
        public DateTime ExamScheduleDate { get; set; }
        public string ExamScheduleName { get; set; }
        public string CourseName { get; set; }
        public decimal Percentage { get; set; }

        public string StudentName { get; set; }
        public string SectionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }

        public DateTime? ExamMasterDate { get; set; }
        public int TotalAll { get; set; }

        public float PercentageAll { get; set; }

        public int ObtainAll { get; set; }

        public bool AbsentConsiderFail { get; set; }
        public int FailMarks { get; set; }


    }


    public class StudentAcademicAnalysisEx
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ExamScheduleId { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public Guid ExamTypeId { get; set; }

        public string ExamType { get; set; }

        public string Remarks { get; set; }
        public decimal? MatricPreAcademicPerc { get; set; }


        public decimal? PreAcademicPerc { get; set; }

        public string Month { get; set; }

        public string Code { get; set; }

        public int TotalMarks { get; set; }
        public bool IsApproved { get; set; }
        public Guid ExamDetailId { get; set; }
        public Guid AdmissionFormId { get; set; }

        public Guid AttendanceStatusId { get; set; }

        public decimal ObtainMarks { get; set; }
        public DateTime ExamScheduleDate { get; set; }
        public string ExamScheduleName { get; set; }
        public string CourseName { get; set; }
        public decimal Percentage { get; set; }

        public string StudentName { get; set; }
        public string SectionName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }

        public DateTime? ExamMasterDate { get; set; }
        public int TotalAll { get; set; }

        public float PercentageAll { get; set; }

        public int ObtainAll { get; set; }

        public bool AbsentConsiderFail { get; set; }
        public int FailMarks { get; set; }


    }



    public class StudentAcademicAnalysisReportExm2Sub
    {
        [Key]

        public Guid ExamScheduleId { get; set; }


        public string Remarks { get; set; }


        public string Month { get; set; }


        public int TotalMarks { get; set; }


        public decimal ObtainMarks { get; set; }
        public DateTime ExamScheduleDate { get; set; }
        public string ExamScheduleName { get; set; }
        public decimal Percentage { get; set; }





    }


    public class StudentAssessmentList
    {
        [Key]

        public Guid AssessmentSchedulingDetailId { get; set; }
        public string FullName { get; set; }
        public int StatusId { get; set; }
    }

    public class StudentAssessmentListEx
    {
        [Key]

        public Guid AssessmentSchedulingDetailId { get; set; }
        public string FullName { get; set; }
        public string ExamName { get; set; }

        public int StatusId { get; set; }
    }



    public class StudentFinanceReport
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }

        public string Student_Name { get; set; }


        public string Father_Name { get; set; }
        public string Ref_No { get; set; }
        public string Reg_No { get; set; }


        public string Program { get; set; }


        public string ProgramDetail { get; set; }
        public string Class { get; set; }
        public string ChallenType { get; set; }
        public string Challan_Number { get; set; }


        public string Session { get; set; }
        public string Academic_Year { get; set; }
        public int InstallmentNo { get; set; }

        public int AdmissionFee { get; set; }
        public int DiscountOnAdmission { get; set; }


        public decimal Admission { get; set; }
        public int TuitionFee { get; set; }
        public int DiscountOnTuition { get; set; }
        public decimal Tuition { get; set; }


        public string ConcessionName { get; set; }
        public int EntryTestFee { get; set; }
        public int DistEntryTest { get; set; }
        public int Transportation { get; set; }
        public int ExamFee { get; set; }
        public int TourFee { get; set; }
        public int Other { get; set; }

        public string Status { get; set; }
        public DateTime Due_Date { get; set; }
        public DateTime PayDate { get; set; }

        public string Section { get; set; }
        public string Bank_Account { get; set; }

        public int TotalFeeReceiable { get; set; }
        public int FeeRecived { get; set; }
        public int Balance { get; set; }
    }
    public class StudentFinanceDataLatest
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string Program { get; set; }
        public string ProgramDetail { get; set; }
        public string ClassName { get; set; }
        public string Shift { get; set; }
        public string ChallenType { get; set; }
        public string ChallanNo { get; set; }
        public string Session { get; set; }
        public string InstallmentNo { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string Campus { get; set; }
        public int AdmissionFee { get; set; }
        public int TutionFee { get; set; }
        public int ExamptionAmount { get; set; }
        public int ConcessionAmount { get; set; }
        public decimal ConcessionPercentage { get; set; }
        public string ConcessionRemarks { get; set; }
        public string Status { get; set; }
        public int FeeReceived { get; set; }
        public int FeeReceivable { get; set; }
        public string BankAccountNo { get; set; }
    }


    public class StudentFinanceData
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string Student_Name { get; set; }


        public string Father_Name { get; set; }
        public string Ref_No { get; set; }
        public string Reg_No { get; set; }


        public string Program { get; set; }


        public string ProgramDetail { get; set; }

    }



    public class CityFinanceData
    {

        [Key]
        public Guid NewID { get; set; }

        public string Campus { get; set; }
        public double StudentsNo { get; set; }
        public double Admission { get; set; }
        public double DistAdmission { get; set; }
        public double DisAdms { get; set; }
        public double TuitionFee { get; set; }
        public double DiscountTutuion { get; set; }

        public double DisTuition { get; set; }

        public double EntryTest { get; set; }
        public double DistEntryTest { get; set; }

        public double ExamFee { get; set; }
        public double TourFee { get; set; }
        public double TransportationFee { get; set; }
        public double Other { get; set; }
        public double TotalFeeReceiable { get; set; }
        public double FeeRecived { get; set; }
        public double Balance { get; set; }

    }
    public class CityWiseFinanceData
    {
        [Key]
        public Guid NewID { get; set; }
        public string Session { get; set; }
        public string City { get; set; }
        public string Campus { get; set; }
        public long TotalAmount { get; set; }
        public long TutionFee { get; set; }
        public long Pre1styearAdjustment { get; set; }
        public long ExamptionAmount { get; set; }
        public long ConcessionAmount { get; set; }
        public long ConcessionCount { get; set; }
        public long ChallanCount { get; set; }
        public decimal ConcessionPercentage { get; set; }
        public long FeeReceived { get; set; }
        public long Balance { get; set; }
    }




    public class CampusWiseDifferenceResult
    {
        [Key]
        public Guid NewID { get; set; }

        public Guid CityId { get; set; }
        public Guid SubCityId { get; set; }
        public string City { get; set; }
        public string SubCity { get; set; }
        public string Campus { get; set; }
        public int AdmissionFee { get; set; }
        public int TutionFee { get; set; }
        public int Pre1styearAdjustment { get; set; }
        public int ExamptionAmount { get; set; }
        public int ConcessionAdmissionAmount { get; set; }
        public decimal ConcessionAdmissionPercentage { get; set; }
        public int ConcessionTuitionAmount { get; set; }
        public decimal ConcessionTutionPercentage { get; set; }
        public int ConcessionCount { get; set; }
        public int EntryTest { get; set; }
        public int Fine { get; set; }
        public int ExamFee { get; set; }
        public int RecreationalTrip { get; set; }
        public int Transport { get; set; }
        public int ChallanCount { get; set; }
        public int FeeReceived { get; set; }
        public int Balance { get; set; }
    }
    public class BusniessUnitFinanceData

    {
        [Key]
        public Guid NewId { get; set; }
        public DateTime Dated { get; set; }
        public string BusinessUnit { get; set; }
        public int TotalAmount { get; set; }

        public int ChallansCount { get; set; }


    }

    public class CitywiseConsolidatedData

    {
        [Key]
        public Guid NewId { get; set; }
        public DateTime Dated { get; set; }
        public string City { get; set; }
        public int TotalAmount { get; set; }

        public int ChallansCount { get; set; }


    }
    public class BankCitywiseConsolidatedData

    {
        [Key]
        public Guid NewId { get; set; }
        public DateTime Dated { get; set; }
        public string City { get; set; }
        public string BankName { get; set; }

        public string AccountNo { get; set; }

        public int TotalAmount { get; set; }

        public int ChallansCount { get; set; }


    }
    public class CampusWiseFinanceDataList
    {
        [Key]
        public Guid NewID { get; set; }
        public string Session { get; set; }
        public string Campus { get; set; }
        public string City { get; set; }
        public string ClassName { get; set; }
        public string ProgramDetail { get; set; }
        public string Shift { get; set; }
        public long TotalAmount { get; set; }
        public long TutionFee { get; set; }
        public long Pre1styearAdjustment { get; set; }
        public long ExamptionAmount { get; set; }
        public long ConcessionAmount { get; set; }
        public long ConcessionCount { get; set; }
        public long ChallanCount { get; set; }
        public decimal ConcessionPercentage { get; set; }
        public long FeeReceived { get; set; }
        public long Balance { get; set; }
    }




    public class CampusFinanceData
    {

        [Key]
        public Guid NewID { get; set; }

        public string Program { get; set; }
        public double StudentsNo { get; set; }
        public double Admission { get; set; }
        public double DistAdmission { get; set; }
        public double DisAdms { get; set; }
        public double TuitionFee { get; set; }
        public double DiscountTutuion { get; set; }

        public double DisTuition { get; set; }

        public double EntryTest { get; set; }
        public double DistEntryTest { get; set; }

        public double ExamFee { get; set; }
        public double TourFee { get; set; }
        public double TransportationFee { get; set; }
        public double Other { get; set; }
        public double TotalFeeReceiable { get; set; }
        public double FeeRecived { get; set; }
        public double Balance { get; set; }

    }


    public class ProgramFinanceData
    {

        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RefferenceNo { get; set; }
        public string StudentName { get; set; }
        public string Session { get; set; }
        public string City { get; set; }
        public string ClassName { get; set; }
        public string ProgramDetail { get; set; }
        public string Shift { get; set; }
        public string Campus { get; set; }
        public int TotalAmount { get; set; }
        public int ExamptionAmount { get; set; }
         public int PreAdjustment { get; set; }

        public int ConcessionAmount { get; set; }

        public int FeeReceived { get; set; }

        public decimal ConcessionPercentage { get; set; }



    }
    
     public class ProgramFinanceDataLatest
    {

        [Key]
        public Guid NewID { get; set; }

        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }

        public string Section { get; set; }

        public string BoardUniversityNo { get; set; }

        public string FullName { get; set; }
         public string FatherName { get; set; }

        public string InstallmentNo { get; set; }

         public string Session { get; set; }
        public string Challan_Number { get; set; }

         public DateTime PaidDate { get; set; }

         public int PreAdjustment { get; set; }

        public string City { get; set; }
         public string ClassName { get; set; }
        public string ProgramDetail { get; set; }
         public string Shift { get; set; }
        public string Campus { get; set; }
        public int TotalAmount { get; set; }
        public int Exemption { get; set; }

        public int ConcessionAmount { get; set; }

        public int Received { get; set; }

        public decimal ConcessionPercentage { get; set; }


        
    }

public class ProgramWiseConcessionReportModel
{
        [Key]

    public Guid NewID { get; set; }
    public string RefferenceNo { get; set; }
    public string BoardUniversityNo { get; set; }
    public string StudentCNIC { get; set; }
    public string Section { get; set; }
    public string Concession { get; set; }
    public string Category { get; set; }
    public string FullName { get; set; }
    public Guid CampusProgramId { get; set; }
    public string CampusName { get; set; }
    public string ProgramName { get; set; }
    public string ShiftName { get; set; }
    public Guid ShiftId { get; set; }
    public Guid ProgramId { get; set; }
    public Guid SessionId { get; set; }
    public string SessionName { get; set; }
    public Guid ProgramDetailId { get; set; }
    public string Description { get; set; }
    public Guid CampusId { get; set; }
    public Guid ClassId { get; set; }
    public string InstallmentNo { get; set; }
    public Guid AdmissionFormId { get; set; }
    public string FatherName { get; set; }
    public int StatusId { get; set; }
    public DateTime? PaidDate { get; set; }
    public string ClassName { get; set; }
    public Guid GenderId { get; set; }
    public string GenderName { get; set; }
    public string Remarks { get; set; }
}
    
}