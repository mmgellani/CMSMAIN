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
    [Table("Status", Schema = "Setup")]
    public partial class SetupStatus
    {
		[Key]
		[Required]
		public int StatusId { get; set; }
		[Required]
		public string Status { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}