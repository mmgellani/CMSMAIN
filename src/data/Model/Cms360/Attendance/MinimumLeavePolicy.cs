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
    [Table("MinimumLeavePolicy", Schema = "Setup")]
    public partial class MinimumLeavePolicy
    {
		[Key]
	
		public Guid MinimumLeaveId { get; set; }

		public  int MinLeaveDay { get; set; }
		
	
		public int StatusId { get; set; }
		

    }
}