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
    [Table("LevelDefinition", Schema = "Assessment")]
    public partial class LevelDefinition
    {
		[Key]
		[Required]
		public Guid LevelId { get; set; }
		
		public string Code { get; set; }
		
		public string FullName { get; set; }
		
		public int StatusId { get; set; }

    }

}