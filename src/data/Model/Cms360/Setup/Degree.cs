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
    [Table("Degree", Schema = "Setup")]
    public partial class SetupDegree
    {
		[Key]
		[Required]
		public Guid DegreeId { get; set; }
		[Required]
		public string FullName { get; set; }
		public int StatusId { get; set; }
		public Guid LoggerId { get; set; }

    }
}