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
    [Table("FeeStructureDetail", Schema = "Fee")]
    public partial class FeeFeeStructureDetail
    {
		[Key]
		[Required]
		public Guid FeeStructureDetailId { get; set; }
		[Required]
		public Guid FeeStructureId { get; set; }
		[Required]
		public int InstallmentNo { get; set; }
		[Required]
		public Guid ChallanTypeId { get; set; }
		[Required]
		public int FeeAmount { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}