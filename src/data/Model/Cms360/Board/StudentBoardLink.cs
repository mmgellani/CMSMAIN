using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("StudentBoardLink", Schema = "Board")]
    public class BoardStudentBoardLink
    {
        [Key]
        public Guid StudentBoardLinkId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid ReturnTypeId { get; set; }

        public Guid RegistrationCodeId { get; set; }

        public DateTime DueDate { get; set; }

        public int Amount { get; set; }

        public DateTime ReturnDate { get; set; }
        public int StatusId { get; set; }

        public string BoardUniversityNo { get; set; }

    }

    public class StudentBoardLinkData
    {

        [Key]
        public Guid StudentBoardLinkId { get; set; }

        public string Student { get; set; }

        public string FatherName { get; set; }

        public string RollNo { get; set; }
        public string Description { get; set; }

        public string FullName { get; set; }

        public int Amount { get; set; }

        public Guid ReturnTypeId { get; set; }

        public Guid RegistrationCodeId { get; set; }


        public DateTime ReturnDate { get; set; }

        public DateTime DueDate { get; set; }

        public string BoardName { get; set; }

        public string BoardUniversityNo { get; set; }



    }

    public class StudentBoardRegistration
    {

        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }

        public string SectionName {get;set;}

        public string FullName { get; set; }
        public string FatherName { get; set; }


        public string BoardUniversityNo { get; set; }



    }


     public class StudentBoardUniRollData
    {

        [Key]
        public Guid AdmissionFormId { get; set; }

        public Guid BoardUniversityExamEntryId { get; set; }

        public string BoardRollNo { get; set; }



        public string RollNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }


        public string BoardUniversityNo { get; set; }

        public string ExamTypeName { get; set; }

        public Guid ExamTypeId { get; set; }


        public string ExamYear { get; set; }




    }

    public class StudentBoardUniversityRollNoList
    {
         [Key]
        public Guid BoardUniRollNoSlipId { get; set; }

        public Guid BoardUniversityExamEntryId {get;set;}

        public string RollNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }


        public string BoardUniversityNo { get; set; }

       public string BoardRollNo { get; set; }






    }
    public class BoardUniversityResultCard
    {
         [Key]
        public Guid BoardUniResultCardId { get; set; }

        public Guid BoardUniRollNoSlipId {get;set;}

        public string RollNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }


        public string BoardUniversityNo { get; set; }

       public string BoardRollNo { get; set; }

       public string PassFailCriteria { get; set; }






    }
    public class BoardUniRollNoSlip{

[Key]

        public Guid BoardUniRollNoSlipId { get; set; }
        public Guid BoardUniversityExamEntryId { get; set; }

        public string BoardRollNo { get; set; }

        public int StatusId { get; set; }

    }
      public class BoardUniResultCard{

[Key]

        public Guid BoardUniRollNoSlipId { get; set; }
        public Guid BoardUniResultCardId { get; set; }

        public string PassFailCriteria { get; set; }

        public int StatusId { get; set; }

    }

    public class StudentBoardExamEntry
    {

        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }


        public string BoardUniversityNo { get; set; }

        public string ExamTypeName { get; set; }

        public Guid ExamTypeId { get; set; }


        public string ExamYear { get; set; }




    }

    public class StudentBoardRegistrationEx
    {

        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }


        public string BoardUniversityNo { get; set; }


        public bool IsSelected { get; set; }



    }

    public class BoardFeePaidStudent
    {

        [Key]
        public Guid AdmissionFormId { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string RollNo { get; set; }

        public bool IsSelected { get; set; }

        public string BoardNo { get; set; }




    }
    public class StudentBoardUnivertySearch
    {

        [Key]
        public Guid AdmissionFormId { get; set; }
        public string BoardName { get; set; }
        public string Year { get; set; }
        public string Rolln { get; set; }
        public string RegNo { get; set; }
        public Guid StudentId { get; set; }
        public string Student { get; set; }
        public string FatherName { get; set; }
        public string RollNo { get; set; }
        public string boardUniversityNo { get; set; }
        public string ExamType { get; set; }

    }

   
}