using System;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("BoardProgramClassCourseLink", Schema = "EL")]

    public class BoardProgramClassCourseLink
    {

        [Key]
        public Guid BoardProgramClassCourseLinkId { get; set; }
        public Guid BoardId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid CourseId { get; set; }
        public int StatusId { get; set; }
    }

      [Table("VWBoardProgramClassCourse", Schema = "EL")]

    public class BoardProgramClassCourseVM
    {

        [Key]
         public Guid BoardProgramClassCourseLinkId { get; set; }
        public Guid BoardId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ClassId { get; set; }
        public Guid CourseId { get; set; }
        public string Board { get; set; }
        public string Program { get; set; }
        public string Class { get; set; }
        public string Course { get; set; }
        public string Alias { get; set; }
        public int StatusId { get; set; }
    }
}