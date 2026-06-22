using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    public partial class RoleAssignedData
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ZoneId { get; set; }
        public string ZoneName { get; set; }
        public Guid CityId { get; set; }
        public string CityName { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public Guid CampusId { get; set; }
        public String CampusName { get; set; }

        public Guid ProgramId { get; set; }
        public String ProgramName { get; set; }

        public Guid ShiftId { get; set; }
        public String ShiftName { get; set; }

        public Guid ClassId { get; set; }
        public String ClassName { get; set; }


    }
     public partial class SmartAttendence
    {
        [Key]
        public Guid Id { get; set; }
       
        public Guid CityId { get; set; }
        public string CityName { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public Guid CampusId { get; set; }
        public String CampusName { get; set; }

    


    }







}