using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("StaffCourse", Schema = "HumanResource")]
    public partial class StaffCourse
    {
        [Key]
        public Guid StaffCourseId { get; set; }
        public Guid CampusBuildingId { get; set; }
        public Guid CourseId { get; set; }
        public bool IsPrimary { get; set; }
        public int StatusId { get; set; }
        public Guid StaffId { get; set; }


    }
    [Table("VWStaffCourse", Schema = "HumanResource")]
    public partial class StaffCourseVM
    {
        [Key]
        public Guid StaffCourseId { get; set; }
        public Guid CampusBuildingId { get; set; }
        public Guid CourseId { get; set; }
        public bool IsPrimary { get; set; }
        public int StatusId { get; set; }
        public string StaffName { get; set; }
        public string CampusName { get; set; }
        public string BuildingName { get; set; }
        public string Course { get; set; }
        public Guid StaffId { get; set; }


    }

     [Table("VWStaffCourseDepartment", Schema = "HumanResource")]
    public partial class StaffCourseDeptVM
    {
        [Key]
        public Guid StaffCourseId { get; set; }
        public Guid CampusBuildingId { get; set; }
        public Guid CourseId { get; set; }
        public bool IsPrimary { get; set; }
        public int StatusId { get; set; }
        public string Building { get; set; }
        public string Campus { get; set; }
        public string Department { get; set; }
        public string ParentDepartment { get; set; }
        public string Course { get; set; }
        public Guid StaffId { get; set; }      
    }
}