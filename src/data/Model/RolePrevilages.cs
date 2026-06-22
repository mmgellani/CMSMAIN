using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("RolePrevilages", Schema = "Role")]
    public partial class RolePrevilages
    {
        [Key]

        public Guid RolePrevilagesLinkId { get; set; }
        public int UserId { get; set; }

        [Column(TypeName = "jsonb")]
        public string ModuleStore { get; set; }





    }

    public class MaskList
    {
        [Key]
        public Guid Id { get; set; }
        public string Text { get; set; }

        public bool IsChecked { get; set; }

    }

    public class Roles
    {
        [Key]
        public string RoleId { get; set; }
        public string ParentRoleId { get; set; }
        public bool Enabled { get; set; }
        public string Name { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public long? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }

        public string RoleId1 { get; set; }


    }

    public class RoleAssignedList
    {
        [Key]

        public Guid id { get; set; }
        public string RoleId { get; set; }
        public string StoreData { get; set; }
        public string ModuleType { get; set; }



    }


    public class GetRoleUpdateData

    {
        [Key]
        public Guid id { get; set; }
        public string name { get; set; }

        public bool Status { get; set; }
    }

    public class Result
    {
        [Key]

        public int UpdateRolePrevilagesData { get; set; }
    }

    public class UserList
    {
        [Key]
        public int Uid { get; set; }
        public string Name { get; set; }

        public string Type { get; set; }
    }

    public class PrevilagesData
    {
        [Key]
        public string Id { get; set; }
        public string Model { get; set; }
    }

    public class UserRoleDashboardlink
    {
        [Key]
        public Guid UserDashboadId { get; set; }
        public int RoleDasboardId { get; set; }
        public string RoleId { get; set; }

        public string ModuleId { get; set; }
        public string ColumnWidth { get; set; }
        public int OrderBy { get; set; }
        public int UserId { get; set; }
        public int StatusId { get; set; }

    }
}
