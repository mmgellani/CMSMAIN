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
    [Table("ScholarshipCriteria", Schema = "Fee")]
    public partial class FeeScholarshipCriteria
    {
        [Key]
        [Required]
        public Guid ScholarshipCriteriaId { get; set; }

        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid AdmissionTypeId { get; set; }

        [Required]
        public Guid ContinuationPolicyId { get; set; }

        [Required]
        public Guid ConcessionId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }
        public Guid ScholarshipTypeId { get; set; }
        public decimal MarksPer { get; set; }
        public float AttendancePercentage { get; set; }
        public bool? IsScholarship { get; set; }


    }

    [Table("VW-ScholarshipCriteria", Schema = "Fee")]
    public partial class FeeScholarshipCriteriaVM
    {
        [Key]
        [Required]
        public Guid ScholarshipCriteriaId { get; set; }

        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid AdmissionTypeId { get; set; }

        [Required]
        public Guid ContinuationPolicyId { get; set; }

        [Required]
        public Guid ConcessionId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }
        public string ContinuationPolicyName { get; set; }
        public string ConcessionName { get; set; }
        public string AdmissionTypeName { get; set; }
        public Guid ShiftId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public float AttendancePercentage { get; set; }
        public Guid ScholarshipTypeId { get; set; }
        public decimal MarksPer { get; set; }
        public bool? IsScholarship { get; set; }
    }

    [Table("VWScholarships", Schema = "Fee")]
    public partial class ScholarshipsVM
    {
        [Key]
        public Guid ScholarshipCriteriaId { get; set; }
        public Guid CampusProgramId { get; set; }
        public string ConcessioName { get; set; }
    }
   [Table("VWScholarshipsEX", Schema = "Fee")]
    public partial class VWScholarshipsEX
    {
        [Key]
        public Guid ScholarshipCriteriaId { get; set; }
        public Guid CampusProgramId { get; set; }
        public string ConcessioName { get; set; }
        public Guid AdmissionTypeId { get; set; }
    }
}