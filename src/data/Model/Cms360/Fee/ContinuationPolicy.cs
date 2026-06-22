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
    [Table("ContinuationPolicy", Schema = "Fee")]
    public partial class FeeContinuationPolicy
    {
        [Key]
        [Required]
        public Guid ContinuationPolicyId { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public int MaxInstallmentNo { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }


    public partial class FeeContinuationPolicyCB
    {
        [Key]
        public Guid ContinuationPolicyId { get; set; }
        public string FullName { get; set; }
        public Guid IsChecked { get; set; }

    }
}