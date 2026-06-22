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
    [Table("BulitanSale", Schema = "Admission")]
    public partial class AdmissionBulitanSale
    {
		[Key]
		[Required]
		public Guid BulitanSaleId { get; set; }
		[Required]
		public Guid ProgramDetailId { get; set; }
		[Required]
		public DateTime SaleDate { get; set; }
		[Required]
		public int FormNumber { get; set; }
		[Required]
		public string FullName { get; set; }
		[Required]
		public string FatherName { get; set; }
		[Required]
		public Guid GenderId { get; set; }
		[Required]
		public string MobileNumber { get; set; }
		[Required]
		public Guid SaleTypeId { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }
}