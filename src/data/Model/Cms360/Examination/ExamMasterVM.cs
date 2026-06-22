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
    [Table("VWExam", Schema = "Examination")]
    public partial class ExaminationExamMasterVM
    {
        [Key]
        [Required]
        public Guid ExamMasterId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public DateTime Dated { get; set; }
        [Required]
        public int TotalMarks { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]
        public Guid ProgramCourseLinkId { get; set; }
        [Required]
        public Guid ClassId { get; set; }

        public string ClassName { get; set; }
    
        public string SectionName { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public string CourseName { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }
        [Required]
        public Guid SessionId { get; set; }

        public string CampusName { get; set; }
        
        public string ProgramName { get; set; }
        
        public string FullName { get; set; }

    }
}