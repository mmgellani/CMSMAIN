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
    [Table("StudentsImage", Schema = "Admission")]
    public partial class AdmissionStudentsImage
    {
        [Key]
        [Required]
        public Guid StudentsImageId { get; set; }
        [Required]
        public Guid StudentId { get; set; }
        [Required]
        public string Image { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }


    [Table("VWStudentsImage", Schema = "Admission")]
    public partial class AdmissionStudentsImageVM
    {
        [Key]
        [Required]
        public Guid StudentsImageId { get; set; }
        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public String FullName { get; set; }
        [Required]
        public string Image { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }
}