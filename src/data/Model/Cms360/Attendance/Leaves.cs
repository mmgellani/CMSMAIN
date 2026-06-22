using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("Leaves", Schema = "Attendance")]
    public partial class AttendanceLeaves
    {
        [Key]
        [Required]
        public Guid LeaveId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }
        [Required]
        public bool IsPartial { get; set; }

        [Column(TypeName = "jsonb")]
        public string ProgramCourseLinkId { get; set; }

        [Required]
        public bool IsApproved { get; set; }
        [Column(TypeName = "jsonb")]
        public string Information { get; set; }

    }


    public class LeaveInfo
    {

       [Key]
        [Required]
        public Guid LeaveId { get; set; }
        [Required]
        public Guid AdmissionFormId { get; set; }
        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }
        [Required]
        public bool IsPartial { get; set; }

       
        public Guid ProgramCourseLinkId { get; set; }

        [Required]
        public bool IsApproved { get; set; }
        [Column(TypeName = "jsonb")]
        public string Information { get; set; }

         public string FullName { get; set; }
    }
}