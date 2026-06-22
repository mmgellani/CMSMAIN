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
    [Table("VWFailCriteria", Schema = "Examination")]
    public partial class ExaminationFailCriteria
    {
        [Key]
        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public string Fail_In { get; set; }
        [Required]
        public Boolean AbsentConsiderFail { get; set; }
        [Required]
        public int FailMarks { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        public string Description { get; set; }
        [Required]
        public Guid FailDetailId { get; set; }

    }
    [Table("FailMasterCriteria", Schema = "Examination")]
    public partial class ExaminationFailMasterCriteria
    {
        [Key]
        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public int Fail_In { get; set; }
        [Required]
        public Boolean AbsentConsiderFail { get; set; }
        [Required]
        public int FailMarks { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }

    }
    [Table("FailDetailCriteria", Schema = "Examination")]
    public partial class ExaminationFailDetailCriteria
    {
        [Key]
        [Required]
        public Guid FailDetailId { get; set; }
        public Guid FailMasterId { get; set; }
        public int Fail_In { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string Description { get; set; }

    }

    [Table("VWFailMasterCriteria", Schema = "Examination")]
    public partial class ExaminationVWFailMasterCriteria
    {
        [Key]
        [Required]
        public Guid FailMasterId { get; set; } 
        [Required]
        public int Fail_In { get; set; } 
        [Required]
        public Boolean AbsentConsiderFail { get; set; } 
        [Required]
        public int FailMarks { get; set; } 
        [Required]
        public int StatusId { get; set; } 
        [Required]
        public Guid LoggerId { get; set; } 
        public string FullName { get; set; } 
    }


}