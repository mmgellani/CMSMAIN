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
    [Table("Inquiry", Schema = "Admission")]
    public partial class AdmissionInquiry
    {
		[Key]
		[Required]
		public Guid InquiryId { get; set; }
		[Required]
		public Guid CampusProgramId { get; set; }
		[Required]
		public DateTime Dated { get; set; }
		[Required]
		public string InquiryNo { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public string FatherName { get; set; }
		
		public string Institution { get; set; }
		public string Reference { get; set; }
		public string Area { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public string Contact { get; set; }
        [Required]
		public string Email { get; set; }

       [Column (TypeName = "jsonb")]
		public string AcademicInfo { get; set; }

    }
}