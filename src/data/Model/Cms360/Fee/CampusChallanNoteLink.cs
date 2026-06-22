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
    [Table("CampusChallanNoteLink", Schema = "Fee")]
    public partial class FeeCampusChallanNoteLink
    {
        [Key]
        [Required]
        public Guid CampusChallanNoteLinkId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid ChallanNoteId { get; set; }
        [Required]
        public int InstallmentNo { get; set; }
        [Required]
        public Guid ChallanTypeId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }
    [Table("VW-CampusChallanNoteLink", Schema = "Fee")]
    public partial class FeeCampusChallanNoteLinkVM
    {
        [Key]
        [Required]
        public Guid CampusChallanNoteLinkId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid ChallanNoteId { get; set; }
        [Required]
        public int InstallmentNo { get; set; }
        [Required]
        public Guid ChallanTypeId { get; set; }
        [Required]
        public int StatusId { get; set; }

        [Required]
        public String CampusName { get; set; }
		 [Required]
        public String Description { get; set; }
		 [Required]
        public String FullName { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }
}