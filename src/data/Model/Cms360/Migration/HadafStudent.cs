using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    public class HadafStudent
    {


        public Guid StudentId { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string StudentCNIC { get; set; }

        public string ParentCNIC { get; set; }

        public string StudnetContactNo { get; set; }

        public string ParentContactNo { get; set; }

        public Guid? GenderId { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string Address { get; set; }

        public Guid? BloodGroupId { get; set; }

        public Guid? ReligionId { get; set; }

        public int StatusId { get; set; }

        public Guid? LoggerId { get; set; }


        public string AcademicInfo { get; set; }

        public string Images { get; set; }

        public Guid? AdmissionFormId { get; set; }

        public Guid? CampusProgramId { get; set; }

        public Guid? AdmissionTypeId { get; set; }

        public Guid? GroupID { get; set; }

        public string RollNo { get; set; }

        public string ReferenceNo { get; set; }

        public DateTime? AdmissionDate { get; set; }
        public bool IsSelected { get; set; }
    }
}