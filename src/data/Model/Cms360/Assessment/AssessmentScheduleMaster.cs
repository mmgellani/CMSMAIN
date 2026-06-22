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
    [Table("AssessmentSchedulingMaster", Schema = "Assessment")]
    public partial class AssessmentSchedulingMaster
    {
		[Key]
		[Required]
		public Guid AssessmentSchedulingMasterId { get; set; } 
	    public int StatusId { get; set; }
        public Guid AssessmentSchemeMasterId { get; set; }


    } 

}