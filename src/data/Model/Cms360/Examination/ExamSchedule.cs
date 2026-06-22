/*
*   Author: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("ExamSchedule", Schema = "Examination")]
    public partial class ExaminationExamSchedule
    {
        [Key]
        [Required]
        public Guid ExamScheduleId { get; set; }
        [Required]
        public DateTime ExamDate { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public int TotalMarks { get; set; }
        public string FullName { get; set; }
        public string Month { get; set; }
    }
    public partial class ExaminationExamScheduleList
    {
        [Key]
        [Required]
        public string FullName { get; set; }
        public Guid Id { get; set; }
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }

    }

    public partial class ExaminationExamScheduleModel
    {
        [Key]
        [Required]
        public Guid ExamScheduleId { get; set; }
        [Required]
        public DateTime ExamDate { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public int TotalMarks { get; set; }
        public string FullName { get; set; }
        public string Month { get; set; }
    }
    public class VWExaminationExamSchedule
    {
        [Key]
        [Required]
        public Guid ExamScheduleId { get; set; }

        [Required]
        public DateTime ExamDate { get; set; }
        [Required]

        public int StatusId { get; set; }

        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public Guid CourseId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public int TotalMarks { get; set; }
        public string FullName { get; set; }
        public string FailMasterName { get; set; }
        public string Name { get; set; }
    }
    public class VWExaminationExamScheduleEx
    {



        public int StatusId { get; set; }

        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }

        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Key]
        public Guid Id { get; set; }
        public string ExamTypeName { get; set; }
        public string FullName { get; set; }
        public string FailMasterName { get; set; }
        public string Name { get; set; }
        public string CourseName { get; set; }
        public int FailIn { get; set; }
        public int FailMarks { get; set; }
        public bool AbsentConsiderFail { get; set; }
        public string Month { get; set; }

    }



    public class ExamScheduleExx
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid ExamTypeId { get; set; }
        public string FullName { get; set; }
    }
    public class getcourselist
    {
        public string CourseName { get; set; }

        [Key]
        public Guid CourseId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }


    }
    public class Checkdayoff
    {
        //public string CourseName { get; set; }

        //public Guid CourseId { get; set; }
        // public Guid ProgramDetailId { get; set; }
        // public Guid ProgramCourseLinkId { get; set; }
        [Key]
        public string Response { get; set; }
    }
    public class updatemarks
    {
        //public string CourseName { get; set; }

        //public Guid CourseId { get; set; }
        // public Guid ProgramDetailId { get; set; }
        // public Guid ProgramCourseLinkId { get; set; }
        [Key]
        public int pg_catalog { get; set; }
    }

    public class examcourselist
    {
        [Key]
        public Guid ExamScheduleId { get; set; }
        public Guid CourseId { get; set; }
        public Guid ExamTypeId { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public string FullName { get; set; }
        public Guid ClassId { get; set; }
        public int TotalMarks { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public DateTime ExamDate { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid FailMasterId { get; set; }
        public Guid GradingMasterId { get; set; }
        public int StatusId { get; set; }
        public string Month { get; set; }
    }
}