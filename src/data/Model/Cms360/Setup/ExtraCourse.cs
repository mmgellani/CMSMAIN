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
    [Table("ExtraCourse", Schema = "Setup")]
    public partial class SetupExtraCourse
    {
        [Key]
        [Required]
        public Guid ExtraCourseId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public int StatusId { get; set; }


    }


    [Table("VW-ExtraCourse", Schema = "Setup")]
    public partial class SetupExtraCourseVM
    {
        [Key]
        [Required]
        public Guid ExtraCourseId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]

        public string CourseName { get; set; }
        [Required]
        public int StatusId { get; set; }


    }
}