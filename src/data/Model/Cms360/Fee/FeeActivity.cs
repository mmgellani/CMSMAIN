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
    [Table("FeeActivity", Schema = "Fee")]
    public partial class FeeFeeActivity
    {
		[Key]
		[Required]
		public Guid FeeActivityId { get; set; }
		[Required]
		public Guid StudentChallanId { get; set; }
		[Required]
		public DateTime Dated { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}