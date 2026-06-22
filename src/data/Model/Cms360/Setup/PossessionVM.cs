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
    [Table("VW-Possession", Schema = "Setup")]
    public partial class SetupPossessionVM
    {
		[Key]
		[Required]
		public Guid PossessionTypeId { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

        public string Name { get; set; }
        public Guid PossessionId { get; set; }
        public string Description { get; set; }

    }
}