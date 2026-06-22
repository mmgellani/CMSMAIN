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
    [Table("EligibilityCriteria", Schema = "Admission")]
    public partial class AdmissionEligibilityCriteria
    {
		[Key]
		[Required]
		public Guid EligibilityCriteriaId { get; set; }
		[Required]
		public Guid CampusProgramId { get; set; }
		[Required]
		public Guid AdmissionTypeId { get; set; }
		[Required]
		public Guid GenderId { get; set; }
		[Required]
		public int MarkPercentage { get; set; }
		[Required]
		public DateTime MinPassingYear { get; set; }
		[Required]
		public DateTime FromDob { get; set; }
		[Required]
		public DateTime ToDob { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }

    }

	 [Table("VW-EligibilityCriteria", Schema = "Admission")]
    public partial class AdmissionEligibilityCriteriaVM
    {
		[Key]
		[Required]
		public Guid EligibilityCriteriaId { get; set; }
		[Required]
		public Guid CampusProgramId { get; set; }
		[Required]
		public Guid AdmissionTypeId { get; set; }
		[Required]
		public Guid GenderId { get; set; }
		[Required]
		public int MarkPercentage { get; set; }
		[Required]
		public DateTime MinPassingYear { get; set; }
		[Required]
		public DateTime FromDob { get; set; }
		[Required]
		public DateTime ToDob { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public String FullName{ get; set; }
		[Required]
		public String Gender{ get; set; }
		[Required]
		public String Description{ get; set; }
		[Required]
		public Guid LoggerId { get; set; }

		[Required]
		public Guid CampusId { get; set; }

		[Required]
		public Guid SessionId { get; set; }

    }
}