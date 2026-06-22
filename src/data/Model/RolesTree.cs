using System;
using System.Collections.Generic;

namespace Cms360.Data.Model
{
    public class TreeItem
    {
        public TreeItem()
        {
            Children = new List<TreeItem>();
        }
        public Guid ID { get; set; }
        public Guid Parent { get; set; }
        public String Caption { get; set; }
        public Boolean IsChecked { get; set; }
        public List<TreeItem> Children { get; set; }
    }

    public class CheckedTreeList
    {
        public List<TreeItemARVO> TreeList { get; set; }
        public string OldIds { get; set; }
    }

    public class CheckedTreeListEx
    {
        public List<TreeItem> TreeList { get; set; }
        public string OldIds { get; set; }
    }

    public class TreeItemARVO
    {
        public TreeItemARVO()
        {
            Children = new List<TreeItemARVO>();
        }
        public int ID { get; set; }
        public int Parent { get; set; }
        public String Caption { get; set; }
        public Boolean IsChecked { get; set; }
        public List<TreeItemARVO> Children { get; set; }
    }
    public class RolesTree
    {
        public List<ZonesRolesTree> zones = new List<ZonesRolesTree>();
    }

    public class ZonesRolesTree
    {
        public List<CityRolesTree> city = new List<CityRolesTree>();
        public Guid zoneiD;
        public string zonename;
    }
    public class CityRolesTree
    {
        public List<SubCityRolesTree> subCity = new List<SubCityRolesTree>();
        public Guid CityID;
        public string Cityname;
    }

    public class SubCityRolesTree
    {
        public List<CampusRolesTree> campus = new List<CampusRolesTree>();
        public Guid subCityID;
        public string subCityname;
    }

    public class CampusRolesTree
    {
        public List<ProgramRolesTree> program = new List<ProgramRolesTree>();
        public Guid CampusID;
        public string Campusname;
    }

    public class ProgramRolesTree
    {
        public List<ClassRolesTree> Class = new List<ClassRolesTree>();

        public Guid ProgramID;
        public string Programname;
    }

    public class ClassRolesTree
    {
        public List<ShiftRolesTree> Shift = new List<ShiftRolesTree>();

        public Guid ClassID;
        public string Classname;
    }
    public class ShiftRolesTree
    {
        public Guid ShiftID;
        public string ShiftName;
    }
}