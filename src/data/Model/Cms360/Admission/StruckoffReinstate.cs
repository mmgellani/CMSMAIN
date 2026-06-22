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
    [Table("StruckoffReinstate", Schema = "Admission")]
    public partial class StruckoffReinstate
    {
        [Key]

        public Guid StruckoffReinstateId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public DateTime StruckoffDate { get; set; }

        public string StruckoffReason { get; set; }

        public bool ShouldAbsent { get; set; }

        public DateTime ?  ReinstateDate { get; set; }

        public string ReinstateReason { get; set; }


    }
}