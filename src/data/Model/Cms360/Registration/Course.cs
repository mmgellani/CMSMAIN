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
    [Table("Course", Schema = "Registration")]
    public partial class RegistrationCourse
    {
		[Key]
		[Required]
		public Guid CourseId { get; set; }
		[Required]
		public string Title { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		public Guid? DepartmentId { get; set; }

    }
	 
    public partial class RegistrationCourseVM
    {
		[Key]
		[Required]
		public Guid CourseId { get; set; }
		[Required]
		public string Title { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		public Guid? DepartmentId { get; set; }
		public Guid? SubDepartmentId { get; set; }
		public string DepartmentName { get; set; }
		public string SubDepartmentName  {get;set;}

    }

	[Table("EmailTemplate", Schema = "Registration")]
    public  class EmailTemplate
    {
		[Key]
		public Guid EmailTemplateId { get; set; }
		public string Subject { get; set; }
		public string Body { get; set; }
		public int StatusId { get; set; }


    }

	[Table("ArvoCourses", Schema = "EL")]
    public  class ArvoCourses
	{
		[Key]
		public string CourseName { get; set; }
        public string ClassIds { get; set; }
    }

    [Table("ArvoReferenceSubject", Schema = "EL")]
    public class ArvoReferenceSubject
    {
        [Key]
        public string Subject { get; set; }
        public string ReferenceSubject { get; set; }
        public string Program { get; set; }
    }

	public   class  CourseData
    {
		[Key]
        public Guid CourseId { get; set; }
        public string Title { get; set; }
        public string FullName { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public Guid? DepartmentId { get; set; }

    }
}