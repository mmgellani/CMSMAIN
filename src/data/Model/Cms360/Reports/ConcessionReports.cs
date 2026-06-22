using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{

    public partial class ConcessionReports
    {
        [Key]
        [Required]


        public Guid ID { get; set; }
        //public Guid AdmissionFormId { get; set; }

        public string RefferenceNo { get; set; }

        public string Description { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string SessionName { get; set; }

        public string ShiftName { get; set; }

        public string ProgramName { get; set; }

        public string CampusName { get; set; }

         public string ClassName { get; set; }
         public string GenderName { get; set; }

        public string Concession { get; set; }

        // public DateTime? PaidDate { get; set; }


        //public Guid SessionId { get; set; }

        public Int16 InstallmentNo { get; set; }
        public string Remarks {get; set; }

        //public Guid? CampusId { get; set; }
        

        //public Guid? ProgramId { get; set; }

        //public Guid? ShiftId { get; set; }

        //public Guid? ProgramDetailId { get; set; }

        //public Guid ClassId { get; set; }
    }
    public partial class ConceReportwithPercentage
    {
        [Key]
      
        public Guid AdmissionFormId { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Leave { get; set; }
        public int Percentage { get; set; }
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }
        public string CampusName { get; set; }
        public string SessionName { get; set; }
        public string RollNo { get; set; }
        public string Remarks { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
       // public string SectionName { get; set; }
        public string ClassName { get; set; }
       // public string ShiftName { get; set; }
        public int InstallmentNo { get; set; }
        public string ConcessionName { get; set; }
    }
}