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
    [Table("Province", Schema = "Setup")]
    public partial class SetupProvince
    {
		[Key]
		[Required]
		public Guid ProvinceId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public string Code { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public Guid CountryId { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}