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
    [Table("GradingPolicy", Schema = "Examination")]
    public partial class ExaminationGradingPolicy
    {
        [Key]
        [Required]
        public Guid GradingPolicyId { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public float FromRange { get; set; }
        [Required]
        public float ToRange { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        public string Remarks { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public Guid SectionId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }

    }
}