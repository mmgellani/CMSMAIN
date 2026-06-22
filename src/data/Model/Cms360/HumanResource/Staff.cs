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
    [Table("Staff", Schema = "HumanResource")]
    public partial class HumanResourceStaff
    {
        [Key]
        [Required]
        public Guid StaffId { get; set; }

        public Guid DepartmentId { get; set; }

        public Guid DesignationId { get; set; }
        public Guid CountryId { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }

        public Guid GenderId { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string CNIC { get; set; }

        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }

        public bool MaritalStatus { get; set; }
        [Column(TypeName = "jsonb")]
        public string ContactNo { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }
        public string Picture { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public string EmpolyeeCode { get; set; }
        public Nullable<Guid> CityId { get; set; }
        public Nullable<Guid> SubCityId { get; set; }


    }

    public class StaffHODData
    {
        
        [Key]
         public Guid Ide { get; set; }

         public string FullName {get;set;}

         public string Email { get; set; }

         public bool IsChecked { get; set; }

    }
    public  class EvaluationMaster
    {
        [Key]
         public Guid EvaluationId { get; set; }

         public string FullName {get;set;}

         public string Description { get; set; }

         public int StatusId { get; set; }


    }
    public  class EvaluationDetail
    {
        [Key]
         public Guid EvaluationDetailId { get; set; }

         public string FullName {get;set;}

         public string Description { get; set; }

         public int StatusId { get; set; }
         [Column(TypeName = "jsonb")]

         public string Options  {get;set;}

         public string Questions {get;set;}


    }

    public  class TeacherProfileList
    {
        [Key]
         public Guid NewID { get; set; }

         public Guid TeacherId {get;set;}

         public string TeacherName { get; set; }

         public string Email { get; set; }

         public string CNIC { get; set; }

        [Column(TypeName = "jsonb")]
         public string ContactNo { get; set; }

         public string Department { get; set; }

         public string Designation { get; set; }

         public string CityName { get; set; }

         public string SubCity { get; set; }
    }


        public  class StaffByCampus
    {
        [Key]

         public Guid StaffId {get;set;}
         public string FullName { get; set; }

         public string Email { get; set; }
         public string FatherName { get; set; }

      
    }

}