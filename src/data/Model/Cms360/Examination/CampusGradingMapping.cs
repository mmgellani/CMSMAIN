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
    [Table("CampusGradingMapping", Schema = "Examination")]
    public partial class ExaminationCampusGradingMapping
    {
        [Key]
        [Required]
        public Guid CampusGradingLinkId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public DateTime Month { get; set; }


    }


    public class ExaminationCampusGradingMappingVM
    {
        [Key]
        [Required]
        public Guid CampusGradingLinkId { get; set; }
        public Guid CampusProgramId { get; set; }

        public Guid GradingMasterId { get; set; }
        public int StatusId { get; set; }
        public string Session { get; set; }

        public string Name { get; set; }


        public string Campus { get; set; }


        public string Description { get; set; }
        public Guid LoggerId { get; set; }
        public Guid ExamTypeId { get; set; }
        public DateTime Month { get; set; }
        public string ExamType { get; set; }


    }
}