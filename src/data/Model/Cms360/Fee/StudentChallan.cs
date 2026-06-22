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

namespace Cms360.Data.Model {
     public class StudentFeeInfoData {
        [Key]
        public Guid NewID { get; set; }
        public string ChallanNo { get; set; }
        public string StudentName { get; set; }
        public string Concession { get; set; }
        public string FatherName { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public int InstallmentNo { get; set; }
        public string FullName { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int FeeAmount { get; set; }
        public int? ExemptionAmount { get; set; }
        public string RefferenceNo { get; set; }
        public Guid ChallanTypeId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string ClassName { get; set; }
        public bool AllowButton { get; set; }

    }

    [Table ("PreFirstYearTemp", Schema = "public")]
    public partial class PreFirstYear {
        [Column ("Name_Eng")]
        public string Name { get; set; }

        [Column ("Student_ID")]
        [Key]
        public string StudentId { get; set; }

        [Column ("Father_CNIC")]
        public string FatherCnic { get; set; }

        [Column ("Father_Name_Eng")]
        public string FatherName { get; set; }

        [Column ("Amount")]
        public string Amount { get; set; }

        [Column ("Challan_Number")]
        public string ChallanNo { get; set; }

        [Column ("received_date")]
        public string RecievedDate { get; set; }

    }





 [Table ("VW_AdhocStudentChallan", Schema = "Fee")]
    public partial class VW_AdhocStudentChallan {
        [Key]
 
        public Guid StudentChallanId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid ClassId { get; set; }
        public int? InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int? StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public int? Fine { get; set; }
        public Nullable<Guid> CollectorId { get; set; }
        public Nullable<Guid> ChallanTypeId { get; set; }
 
    }

    [Table ("VW_ReversalStudentChallan", Schema = "Fee")]
    public partial class VW_ReversalStudentChallan {
        [Key]
 
        public Guid StudentChallanId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid ClassId { get; set; }
        public int? InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int? StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public int? Fine { get; set; }
        public Nullable<Guid> CollectorId { get; set; }
        public Nullable<Guid> ChallanTypeId { get; set; }
 
    }
    [Table("StudentChallan", Schema = "Fee")]
    public partial class FeeStudentChallan {
        [Key]

        public Guid StudentChallanId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid ClassId { get; set; }
        public int? InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int? StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public int? Fine { get; set; }
        public Nullable<Guid> CollectorId { get; set; }
        public Nullable<Guid> ChallanTypeId { get; set; }

    }
        public partial class FeeStudentChallans {
        [Key]

        public Guid StudentChallanId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid ClassId { get; set; }
        public int? InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int? StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public int? Fine { get; set; }
        public Nullable<Guid> CollectorId { get; set; }
        public Nullable<Guid> ChallanTypeId { get; set; }
        public bool? AllowButton { get; set; }
    }

    [Table ("StudentChallanEx", Schema = "Fee")]
    public partial class StudentChallanEx {
        [Key]

        public Guid StudentChallanId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid ClassId { get; set; }

        public int InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public int FeeAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

    }

    [Table ("VW-StudentFeeVM", Schema = "Fee")]
    public partial class FeeStudentChallanVM {

        public Guid FeeHeadId { get; set; }

        public int stfeeamount { get; set; }
        public int PayableAmount { get; set; }

        public string CollectorName { get; set; }

        public string ChallanNo { get; set; }

        public string DocumentNo { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public string RefferenceNo { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public string ConcessionName { get; set; }

        [Key]

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string FeeHead { get; set; }

        public Guid LoggerId { get; set; }

        public Guid BankId { get; set; }

        public string BankName { get; set; }

        public string Branch { get; set; }

        public int? FeeAmount { get; set; }

        public string AccountNo { get; set; }

        public string Code { get; set; }

        public string ClassName { get; set; }

        public string ProgramName { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string RollNo { get; set; }

    }

    [Table ("VWSubinstallmentView", Schema = "Fee")]
    public partial class FeeSubinstallmentVM {

        public Guid FeeHeadId { get; set; }

        [Key]

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }
        public Guid? ClassId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionFullName { get; set; }

        public string Campus { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int PayableAmount { get; set; }
        public string CampusCode { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }
        public Guid ChallanTypeId { get; set; }
        public string Remarks { get; set; }

        public string RollNo { get; set; }

    }
    [Table ("VWSubinstallmentViews", Schema = "Fee")]
    public partial class FeeSubinstallmentVMs {

        public Guid FeeHeadId { get; set; }

        [Key]

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }
        public Guid? ClassId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionFullName { get; set; }

        public string Campus { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int PayableAmount { get; set; }
        public string CampusCode { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }
        public Guid ChallanTypeId { get; set; }
        public string Remarks { get; set; }

        public string RollNo { get; set; }
        public string ChallanNo { get; set; }

    }
    [Table ("VWSubInstallmentViewTransportEx", Schema = "Fee")]
    public partial class TransportSubinstallmentVM {

        public Guid FeeHeadId { get; set; }

        [Key]

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionFullName { get; set; }

        public string Campus { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int PayableAmount { get; set; }
        public string CampusCode { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }
        public string Remarks { get; set; }

        public string RollNo { get; set; }

    }

    [Table ("VWFeeChallan", Schema = "Fee")]
    public class StudentChallanReport {

        [Key]
        public Guid FeeChallanId { get; set; }

        public Guid FeeHeadId { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string CustomerCode { get; set; }

        public string BusinessUnit { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string SectionName { get; set; }

    }

    [Table ("VWFeeChallanEx", Schema = "Fee")]
    public class StudentChallanReportEx {

        [Key]
        public Guid FeeChallanId { get; set; }

        public Guid FeeHeadId { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public string InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string CustomerCode { get; set; }

        public string BusinessUnit { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string SectionName { get; set; }
        public string Cap { get; set; }

    }

    public class StudentChallanReportFu {

        [Key]
        public Guid FeeChallanId { get; set; }

        public Guid FeeHeadId { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public string InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string CustomerCode { get; set; }

        public string BusinessUnit { get; set; }



        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string SectionName { get; set; }
        public string Cap { get; set; }
        public string ZoneNote { get; set; }

        public Guid ClassId { get; set; }

         public decimal AttendencePercentage{ get; set; }

         public DateTime? FromDate { get; set; }
         public DateTime? ToDate { get; set; }

    }


    public class StudentChallanReportFuLatest {

        [Key]
        public Guid FeeChallanId { get; set; }

        public Guid FeeHeadId { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public string InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string CustomerCode { get; set; }

        public string BusinessUnit { get; set; }
        public string Prefix { get; set; }
        public string MobileApp { get; set; }

        public string MobileApp1 { get; set; }

        public string MobileApp2 { get; set; }

        public string MobileApp3 { get; set; }
        public string MobileApp4 { get; set; }
        public string MobileApp5 { get; set; }



        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string SectionName { get; set; }
        public string Cap { get; set; }
        public string ZoneNote { get; set; }

        public Guid ClassId { get; set; }

         public decimal AttendencePercentage{ get; set; }

         public DateTime? FromDate { get; set; }
         public DateTime? ToDate { get; set; }

    }

    public class StudentFeePaid {

        [Key]
        public Guid StudentChallanId { get; set; }

        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public int InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public int FeeAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string ChallanType { get; set; }
        public string Collector { get; set; }

        public string Campus { get; set; }

        public string Description { get; set; }

    }

    public class ChallanBReport {
        public string ChallanNo { get; set; }

        public GeneralList General { get; set; }
        public List<BankDataList> Banks { get; set; }
        public List<InfoList> ChallanInfo { get; set; }
        public List<SubInstList> NextInstallment { get; set; }

        public ChallanBReport () {
            General = new GeneralList ();

            Banks = new List<BankDataList> ();
            ChallanInfo = new List<InfoList> ();
            NextInstallment = new List<SubInstList> ();

        }
    }

    public class ChallanBReportEx {
        public string ChallanNo { get; set; }
         public decimal AttendencePercentage{ get; set; }
          public DateTime? FromDate { get; set; }
         public DateTime? ToDate { get; set; }


        public GeneralListEx General { get; set; }
        public List<BankDataList> Banks { get; set; }
        public List<InfoList> ChallanInfo { get; set; }
        public List<SubInstList> NextInstallment { get; set; }

        public ChallanBReportEx () {
            General = new GeneralListEx ();

            Banks = new List<BankDataList> ();
            ChallanInfo = new List<InfoList> ();
            NextInstallment = new List<SubInstList> ();

        }
    }

    public class ChallanBReportExLatest {
        public string ChallanNo { get; set; }
         public decimal AttendencePercentage{ get; set; }
          public DateTime? FromDate { get; set; }
         public DateTime? ToDate { get; set; }


        public GeneralListExLatest General { get; set; }
        public List<BankDataList> Banks { get; set; }
        public List<InfoList> ChallanInfo { get; set; }
        public List<SubInstList> NextInstallment { get; set; }

        public ChallanBReportExLatest () {
        General = new GeneralListExLatest ();

        Banks = new List<BankDataList> ();
        ChallanInfo = new List<InfoList> ();
        NextInstallment = new List<SubInstList> ();

        }
    }
    public class ChallanBReportLatestEx {
        public string ChallanNo { get; set; }
         public decimal AttendencePercentage{ get; set; }
          public DateTime? FromDate { get; set; }
         public DateTime? ToDate { get; set; }


        public GeneralListLatestEx General { get; set; }
        public List<BankDataList> Banks { get; set; }
        public List<InfoList> ChallanInfo { get; set; }
        public List<SubInstList> NextInstallment { get; set; }

        public ChallanBReportLatestEx () {
        General = new GeneralListLatestEx ();

        Banks = new List<BankDataList> ();
        ChallanInfo = new List<InfoList> ();
        NextInstallment = new List<SubInstList> ();

        }
    }

    public class GeneralList {
        public string BusinessUnit { get; set; }
        public string CampusName { get; set; }
        public string Cap { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string SectionName { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string ChallanNo { get; set; }
        public string InstallmentNo { get; set; }
        public int ChallanAmount { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerCode { get; set; }
        public string DocNo { get; set; }
        public string ChallanNote { get; set; }
        public string UserName { get; set; }
    }

    public class GeneralListEx {
        public string BusinessUnit { get; set; }

        public string CampusName { get; set; }
        public string Cap { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string SectionName { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string ChallanNo { get; set; }
        public string InstallmentNo { get; set; }
        public int ChallanAmount { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerCode { get; set; }
        public string DocNo { get; set; }
        public string ChallanNote { get; set; }
        public string UserName { get; set; }
        public string BankIban { get; set; }
    }


    public class GeneralListExLatest {
        public string BusinessUnit { get; set; }
        public string Prefix { get; set; }
         public string MobileApp { get; set; }

        public string MobileApp1 { get; set; }

        public string MobileApp2 { get; set; }

        public string MobileApp3 { get; set; }
        public string MobileApp4 { get; set; }
        public string MobileApp5 { get; set; }

        public string CampusName { get; set; }
        public string Cap { get; set; }
        public string RefferenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string SectionName { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string ChallanNo { get; set; }
        public string InstallmentNo { get; set; }
        public int ChallanAmount { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerCode { get; set; }
        public string DocNo { get; set; }
        public string ChallanNote { get; set; }
        public string UserName { get; set; }
        public string BankIban { get; set; }
    }

     public class GeneralListLatestEx {
        public string BusinessUnit { get; set; }
        public string Prefix { get; set; }
         public string MobileApp { get; set; }

        public string MobileApp1 { get; set; }

        public string MobileApp2 { get; set; }

        public string MobileApp3 { get; set; }
        public string MobileApp4 { get; set; }
        public string MobileApp5 { get; set; }

        public string CampusName { get; set; }
        public string Cap { get; set; }
        public string RefferenceNo { get; set; }
        public Guid AdmissionFormId { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string Description { get; set; }
        public string SectionName { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string ChallanNo { get; set; }
        public string InstallmentNo { get; set; }
        public int ChallanAmount { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerCode { get; set; }
        public string DocNo { get; set; }
        public string ChallanNote { get; set; }
        public string UserName { get; set; }
        public string BankIban { get; set; }
    }


    public class BankDataList {
        public string ChallanNo { get; set; }
        public string BankName { get; set; }
        public string AccountNo { get; set; }
        public string Address { get; set; }

    }

    public class InfoList {
        public string ChallanNo { get; set; }
        public string FeeHead { get; set; }
        public int FeeAmount { get; set; }
        public int PayableAmount { get; set; }
        public string ConcessionName { get; set; }
    }

    public class SubInstList {
        public string ChallanNo { get; set; }
        public string ChallanNoEx { get; set; }
        public DateTime? DueDate { get; set; }

        public int FeeAmount { get; set; }
    }

    public class ChallanList {
        [Key]
        public string ChallanNo { get; set; }
        public Guid ChallanTypeId { get; set; }

    }

    public class ChallanListEx {
        [Key]
        public string ChallanNo { get; set; }
    }

    [Table ("VWTransportChallan", Schema = "Fee")]
    public class TransportChallanReport {

        [Key]
        public Guid FeeChallanId { get; set; }

        public Guid FeeHeadId { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string CustomerCode { get; set; }

        public string BusinessUnit { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string SectionName { get; set; }
        public Guid? ChallanTypeId { get; set; }

    }

    public class StudentReportData {

        [Key]
        public Guid NewID { get; set; }

        public Guid FeeHeadId { get; set; }

        public string BankName { get; set; }

        public string AccountNo { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string ChallanNote { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string CampusCode { get; set; }

        public string DigitCode { get; set; }
        public string BusinessUnit { get; set; }


    }

    public class StudentConcessedData {

        [Key]
        public Guid StudentFeeStructureId { get; set; }
        public Guid StudentChallanId { get; set; }
        public int InstallmentNo { get; set; }
        public Guid FeeHeadId { get; set; }

        public string ChallanNo { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string RefferenceNo { get; set; }

        public int PayableAmount { get; set; }

        public int StatusId { get; set; }

        public int FeeAmount { get; set; }

        public Guid AdmissionFormId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ShiftId { get; set; }
        public Guid ProgramDetailId { get; set; }

    }
    public class StudentPaidCountData {

        [Key]
        public int FeeCount { get; set; }
    }

    public class StudentChallanINfoData {

        [Key]

        public string ChallanNo { get; set; }
        public int InstallmentNo { get; set; }

        public string FullName { get; set; }

        public string Concession { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int FeeAmount { get; set; }

    }
    public class StudentChallanINfoData2 {

        [Key]

        public string ChallanNo { get; set; }
        public decimal InstallmentNo { get; set; }
        public string FullName { get; set; }
        public string Concession { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int FeeAmount { get; set; }

    }
    
    public class DisableChallans {

        [Key]
        public Guid NewID { get; set; }

        public string DisplayName { get; set; }

        public string FullName { get; set; }

        public string RollNo { get; set; }

        public string LocalIpPort { get; set; }

        public string Device { get; set; }

        public string Operation1 { get; set; }

        public string ChallanNo { get; set; }
        public string DueDate { get; set; }

        public string InstallmentNo { get; set; }

        public string PaidDate { get; set; }

        public string Amount { get; set; }
        public string RefferenceNo { get; set; }

    }

    public class FeeStatEx {

        public string SessionName { get; set; }

        [Key]
        public Guid ProgramDetailId { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int TotalAmount { get; set; }
        public int TotalStudents { get; set; }
        public int TotalAmountP { get; set; }
        public int TotalStudentsP { get; set; }
        public int TotalAmountR { get; set; }
        public int TotalStudentsR { get; set; }
        public int InstallmentNo { get; set; }

    }

    public class FinanceData {

        [Key]
        public Guid Id { get; set; }

        public string Activity { get; set; }

        public DateTime Activity_DateTime { get; set; }

        public int Month_Campus_Class_Fee_Structure_Detail_ID { get; set; }

        public int Status_ID { get; set; }

        public DateTime? Payable_Date { get; set; }
        public string Challan_Number { get; set; }

        public string Student_Name { get; set; }

        public string Father_Name { get; set; }

        public string Class { get; set; }
        public string Ref_No { get; set; }
        public string Reg_No { get; set; }
        public string Section { get; set; }
        public string Fee_For { get; set; }
        public string Legal_Entity { get; set; }
        public string Cluster { get; set; }
        public string Campus { get; set; }
        public string City { get; set; }
        public string Program { get; set; }
        public string Description { get; set; }
        public string Session { get; set; }
        public string Academic_Year { get; set; }
        public string Bank_Name { get; set; }
        public int Admission { get; set; }

        public int DiscountOnAdmission { get; set; }

        public int Tuition { get; set; }

        public int DiscountOnTuition { get; set; }

        public int Misc_Charges { get; set; }

        public int DiscountOnBoardRegistration_Exam_Sport_CollegeCard_Building_Mis { get; set; }

        public int DiscountOnOtherFeeHeads { get; set; }

        public int Discount { get; set; }

        public int Fine { get; set; }
        public int Late_Fee_Fine { get; set; }
        public int Total_Payable { get; set; }
        public DateTime? Due_Date { get; set; }
        public int Over_Due_Amount { get; set; }
        public DateTime? Print_Date { get; set; }
        public string Bank_Account { get; set; }
        public DateTime? PayDate { get; set; }
        public string ModeOfPayment { get; set; }
        public string Campus_ID { get; set; }
        public DateTime GenerationDate { get; set; }
        public int BoardRegistrationSportsHouseCollegeExam { get; set; }

        public int CollegeFee { get; set; }

        public int Transportation { get; set; }

        public int BoardRegistrationFee { get; set; }

        public int UniversityRegistrationFee { get; set; }

        public int BoardExamFee { get; set; }

        public int UniversityExamFee { get; set; }

        public int EntryTestFee { get; set; }

    }

    public class StudentChallanInfoExx {

        [Key]
        public string ChallanNo { get; set; }

        public int FeeAmount { get; set; }

        public Guid ChallanTypeId { get; set; }

    }

       public class StudentChallanINfoData2New {

        [Key]

        public string ChallanNo { get; set; }
        public decimal InstallmentNo { get; set; }
        public string FullName { get; set; }
        public string Concession { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public int FeeAmount { get; set; }

         public string Image { get; set; }


    }

}