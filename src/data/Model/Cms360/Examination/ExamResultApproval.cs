using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("VWExamResultApproval", Schema = "Examination")]
    public partial class ExamResultApproval
    {

        [Key]
        [Required]
        public Guid CourseId { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid StudentId { get; set; }

        public string RollNo { get; set; }

        public string StudentName { get; set; }

        public string CourseName { get; set; }

        public DateTime Dated { get; set; }

        public string dayname { get; set; }

        public int TotalMarks { get; set; }

        public int ObtainMarks { get; set; }

        public int StatusId { get; set; }

        public bool IsApproved { get; set; }

        public Guid SessionId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public Guid ClassId { get; set; }

        public Guid SectionId { get; set; }

    }
}