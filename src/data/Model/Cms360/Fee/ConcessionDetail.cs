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
    [Table("ConcessionDetail", Schema = "Fee")]
    public partial class FeeConcessionDetail
    {
        [Key]
        [Required]
        public Guid ConcessionDetailId { get; set; }
        [Required]
        public Guid ConcessionId { get; set; }
        [Required]
        public Guid FeeHeadId { get; set; }
        [Required]
        public decimal Percentage { get; set; }
        [Required]
        public int FeeAmount { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    public partial class ConcessionVM
    {
        [Key]
        public Guid ScholarshipCriteriaId { get; set; }
        public Guid ConcessionId { get; set; }
        public string Concession { get; set; }

    }

    public class CheckBoxModel
    {
        public Guid id { get; set; }
        public string name { get; set; }
    }
}