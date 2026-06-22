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
    [Table("SaleType", Schema = "Admission")]
    public partial class AdmissionSaleType
    {
        [Key]
        [Required]
        public Guid SaleTypeId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("ProgramFeeAdjustment", Schema = "Admission")]
    public class ProgramFeeAdjustment
    {
        [Key]

        public Guid ProgramFeeAdjustmentId { get; set; }
        public Guid CampusProgramId { get; set; }
        public bool IsEnabled { get; set; }
        public int StatusId { get; set; }

    }

    [Table("VWProgramFeeAdjustment", Schema = "Admission")]
    public class ProgramFeeAdjustmentVM
    {
        [Key]

        public Guid ProgramFeeAdjustmentId { get; set; }
        public Guid CampusProgramId { get; set; }
        public bool IsEnabled { get; set; }
        public int StatusId { get; set; }
        public string Program { get; set; }

        public string Shift { get; set; }

        public string Medium { get; set; }

        public string Description { get; set; }
          public Guid SessionId { get; set; }
            public Guid CampusId { get; set; }


    }
}