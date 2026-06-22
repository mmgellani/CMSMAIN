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
    [Table("ProgramCourseLink", Schema = "Registration")]
    public partial class RegistrationProgramCourseLink
    {
        [Key]
        [Required]
        public Guid ProgramCourseLinkId { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }


    [Table("VW_ProgramLinkVM", Schema = "Registration")]
    public partial class RegistrationProgramCourseLinkVM
    {
        [Key]
        [Required]
        public Guid ProgramCourseLinkId { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public String CourseName { get; set; }
        [Required]
        public String ClassName { get; set; }

        [Required]
        public String Description { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }
}