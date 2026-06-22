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
    [Table("SessionDuration", Schema = "Attendance")]
    public partial class SessionDuration
    {
        [Key]
        [Required]
        public Guid SessionDurationId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public int StatusId { get; set; }

    }


    [Table("VWSessionDuration", Schema = "Attendance")]
    public partial class VWSessionDuration
    {

        [Key]
        [Required]
        public Guid SessionDurationId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string ClassName { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public int StatusId { get; set; }


    }

}