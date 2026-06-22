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
    [Table("FeeHead", Schema = "Fee")]
    public partial class FeeFeeHead
    {
		[Key]
		[Required]
		public Guid FeeHeadId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public short FeeType { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
		public int OrderBy { get; set; }
		public Guid ChallanTypeId { get; set; }

    }
}