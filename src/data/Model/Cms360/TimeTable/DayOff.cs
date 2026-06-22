
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model

{
    [Table("DayOff", Schema = "TimeTable")]

    public class DayOff
    {
        [Key]
        public Guid DayOffId { get; set; }


        public Guid TimeTableId { get; set; }

        public DateTime FromDate { get; set; }


        public DateTime ToDate { get; set; }

        public int StatusId { get; set; }

    }


    public class DayOffVM
    {
        [Key]
        public Guid DayOffId { get; set; }


        public Guid TimeTableId { get; set; }

        public DateTime FromDate { get; set; }


        public DateTime ToDate { get; set; }

        public int StatusId { get; set; }
        public string FullName { get; set; }


    }
}