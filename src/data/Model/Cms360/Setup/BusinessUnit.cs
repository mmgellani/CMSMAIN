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
    [Table("BusinessUnit", Schema = "Setup")]
    public partial class SetupBusinessUnit
    {
		[Key]
		[Required]
		public Guid BusinessUnitId { get; set; }
		[Required]
		public string FullName { get; set; }
		public string Description { get; set; }
		[Required]
		public Guid BusinessGroupId { get; set; }
		[Required]
		public Guid AddressId { get; set; }
		public string Logo { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

	    public string  DigitCode { get; set; }

    }
}