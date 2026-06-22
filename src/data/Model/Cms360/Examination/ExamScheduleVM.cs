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
    [Table("VWExamSchedule", Schema = "Examination")]
    public partial class ExaminationExamScheduleVM
    {
        [Key]
        [Required]
        public Guid ExamScheduleId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

        public Guid ExamTypeId { get; set; }

        public string ExamName { get; set; }

        public Guid CourseId { get; set; }

        public string CourseName { get; set; }

        public Guid CampusId { get; set; }

        public string CampusName { get; set; }

        public Guid ProgramDetailId { get; set; }

        public string Description { get; set; }

        public Guid ClassId { get; set; }

        public string ClassName { get; set; }

        public Guid SessionId { get; set; }

        public string Session { get; set; }

        public Guid CampusProgramId { get; set; }
    }
}