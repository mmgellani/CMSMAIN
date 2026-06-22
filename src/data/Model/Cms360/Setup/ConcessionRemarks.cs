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
    [Table("ConcessionRemarks", Schema = "Setup")]
    public partial class SetupConcessoinRemarks
    {
        [Key]
        [Required]
        public Guid ConcessionRemarksId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        public string Remarks { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

    }

    [Table("VW-ConcessionRemarks", Schema = "Setup")]
    public partial class VWConcessionRemarksVM
    {
        [Key]
        [Required]
        public Guid ConcessionRemarksId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public string Remarks { get; set; }
        [Required]
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
    }
}