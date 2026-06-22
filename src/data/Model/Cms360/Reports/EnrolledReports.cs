using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{

    public partial class EnrolledReports
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        // public string ParentContactNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string SectionName { get; set; }
        public string Board { get; set; }
        public string Obtained { get; set; }
        public string Religion { get; set; }
    }

    public partial class EnrolledReportsCont
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string ParentContactNo { get; set; }
        public string StudentContactNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string SectionName { get; set; }
        public string Board { get; set; }
        public int Obtained { get; set; }
        public string Religion { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string StudentCNIC { get; set; }
    }
    public partial class EnrolledReportsContEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string ParentContactNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string SectionName { get; set; }
        public string Board { get; set; }
        public int Obtained { get; set; }
        public int Total { get; set; }
        public decimal Percentage { get; set; }
        public string Religion { get; set; }
        public string ClassName { get; set; }
    }

    public partial class EnrolledReportsContEx2
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string Address { get; set; }
        public string ParentContactNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string SectionName { get; set; }
        public string Board { get; set; }
        public int Obtained { get; set; }
        public int Total { get; set; }
        public decimal Percentage { get; set; }
        public string Religion { get; set; }
        public string ClassName { get; set; }
        public string Grade { get; set; }
        public Guid CourseId { get; set; }
        public string StaffName { get; set; }

    }
    public partial class EnrolledReportsWithoutAdd
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }
        public string RollNo { get; set; }
        public string Description { get; set; }
        public string StudentName { get; set; }
        public string FatherName { get; set; }
        public string ParentContactNo { get; set; }
        public string SessionName { get; set; }
        public string CampusName { get; set; }
        public string SectionName { get; set; }
        public string Religion { get; set; }
    }
    public class StudentUsernamePassword
    {
        public string StudentName { get; set; }
        public string RefferenceNo { get; set; }
        [Key]
        public string RollNo { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

    }
}