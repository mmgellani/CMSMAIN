using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    public class CmsModel
    {

        public string City { get; set; }

        public string Campus { get; set; }

        public string combination { get; set; }

        public int AdmissionYear { get; set; }

        public int CurrentCampusID { get; set; }

        public string program { get; set; }

        public int Shift_ID { get; set; }

        public int Medium_ID { get; set; }

        public int Admission_Form_ID { get; set; }

        public int Program_Detail_ID { get; set; }

        [Key]
        public string Rollno { get; set; }

        public string ReferenceNo { get; set; }

        public string AdmissionType { get; set; }


        public DateTime Admission_Date_Save { get; set; }

        public DateTime Admission_Date { get; set; }

        public int Status_ID { get; set; }

        public string StudentName { get; set; }

        public string FatherName { get; set; }

        public string StudentCNIC { get; set; }

        public string Father_CNIC { get; set; }

        public string studentContactNo { get; set; }

        public string Father_Phone_No { get; set; }

        public string Guardians { get; set; }

        public DateTime Date_of_Birth { get; set; }

        public int Gender_ID { get; set; }

        public string Blood_Group_ID { get; set; }

        public string Religion_ID { get; set; }

        public string Image { get; set; }

        public string Address { get; set; }

        public string Class { get; set; }

        public string Matric_Registration_Number { get; set; }

        public string Board_Registration_Number { get; set; }

        public string Academicinfo { get; set; }
        public bool IsSelected { get; set; }
    }
}