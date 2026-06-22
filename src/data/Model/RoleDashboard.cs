using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Cms360.Data.Model
{
    [Table("RoleDashboard", Schema = "Role")]
    public class RoleDashboard
    {
        [Key]
        public int RoleDasboardId { get; set; }
        public string RoleId { get; set; }
        public string ModuleId { get; set; }
        public string ColumnWidth { get; set; }
        public int OrderBy { get; set; }

    }

    public class RoleDashboardFilter
    {
        [Key]
        public int RoleDasboardId { get; set; }
        public string ModuleId { get; set; }
        public string ColumnWidth { get; set; }
        public int OrderBy { get; set; }

    }

    [Table("TodoList", Schema = "DashBoard")]
    public class TodoList
    {
        [Key]
        public Guid TodoListId { get; set; }
        public int UserId { get; set; }
        public DateTime Dated { get; set; }
        public string Description { get; set; }
        public bool TaskStatus { get; set; }

        public string Title { get; set; }
        public int StatusId { get; set; }

    }

}
