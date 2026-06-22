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
    [Table("Batch", Schema = "Setup")]
   	public partial class SetupBatch
    {
		[Key]
		[Required]
		public int BatchId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		

    }
}