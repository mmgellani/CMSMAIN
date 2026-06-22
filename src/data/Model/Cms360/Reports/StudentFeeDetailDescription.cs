using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {

    public partial class StudentFeeDetailDescription {
        [Key]
        public Guid Id { get; set; }
        public int InstallmentNo { get; set; }
        public string ChallanNo { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string FullName { get; set; }
        public int FeeAmount { get; set; }
        public DateTime? PaidDate { get; set; }
        public string Concession { get; set; }

        public int Admission { get; set; }

        public int AdmissionConcession { get; set; }

        public int Tuition { get; set; }

        public int TuitionConcession { get; set; }

        public int MiscCharges { get; set; }

    }

    public class StudentFeesdetailActivity {
        public string Activity { get; set; }
        public DateTime Activity_DateTime { get; set; }

        public int Month_Campus_Class_Fee_Structure_Detail_ID { get; set; }
        public int Status_ID { get; set; }

        public DateTime Payable_Date { get; set; }
        [Key]
        public string Challan_Number{ get; set; }
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
        public DateTime Due_Date { get; set; }
        public int Over_Due_Amount{ get; set; }
        public DateTime Print_Date { get; set; }
        public string Bank_Account { get; set; }
        public DateTime PayDate { get; set; }
        public string ModeOfPayment { get; set; }
        public  string  Campus_ID { get; set; }
        public DateTime GenerationDate{ get; set; }
        public int  BoardRegistrationSportsHouseCollegeExam { get; set; }
        public int CollegeFee { get; set; }
        public  int Transportation { get; set; }
        public int BoardRegistrationFee { get; set; }
        public int UniversityRegistrationFee { get; set; }
        public int BoardExamFee { get; set; }
        public int UniversityExamFee { get; set; }
        public int EntryTestFee { get; set; }
        public int StatusId { get; set; }
    }

}