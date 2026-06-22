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
    [Table("Departments", Schema = "HumanResource")]
    public partial class HumanResourceDepartments
    {
        [Key]
        [Required]
        public Guid DepartmentId { get; set; }

        public Guid? DepartmentParentId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        
        public int? Level { get; set; }
      
        public string Code { get; set; }


    }
    [Table("VWDepartment", Schema = "HumanResource")]
    public partial class HumanResourceDepartmentsVM
    {
        [Key]
        [Required]
        public Guid DepartmentId { get; set; }

        public Guid? DepartmentParentId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        
        public int? Level { get; set; }
      
        public string Code { get; set; }

    }
}