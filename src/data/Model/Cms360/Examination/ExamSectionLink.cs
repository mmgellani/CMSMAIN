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
    [Table("VWExamSectionLink", Schema = "Examination")]
    public partial class ExaminationExamSectionLinkVM
    {
        [Key]
        [Required]
        public Guid ClassId { get; set; }
        
        public int StatusId { get; set;}
        
        public string ClassName { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }

        public string Description { get; set; }
        [Required]
        public Guid SectionId { get; set; }

        public string SectionName { get; set; }
        [Required]
        public Guid CampusId { get; set; }

        public string CampusName { get; set; }
    }
}