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
    [Table("VWProfileStaff", Schema = "Role")]
    public partial class ProfileStaff
    {
        [Key]
        [Required]
        public Guid StaffId { get; set; }
        [Required]
        public Guid DepartmentId { get; set; }
        [Required]
        public Guid DesignationId { get; set; }

        public Guid GenderId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string FatherName { get; set; }
        [Required]
        public string CNIC { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        [Required]
        public bool MaritalStatus { get; set; }
        [Column(TypeName = "jsonb")]
        public string ContactNo { get; set; }
        [Column(TypeName = "jsonb")]
        public string Address { get; set; }
        public string Picture { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public int UserId { get; set; }

        public Guid CountryId { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }


    }
}