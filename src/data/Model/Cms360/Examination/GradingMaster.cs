using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("GradingCriteriaVM", Schema = "Examination")]
    public partial class ExaminationGradingCriteriaVM
    {
        [Key]
        [Required]
        public Guid GradingDetailId { get; set; }
        [Required]
        public int MaxMarks { get; set; }
        [Required]
        public string GradeLetter { get; set; }
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

    }
    [Table("GradingDetail", Schema = "Examination")]
    public partial class ExaminationGradingDetail
    {
        [Key]
        [Required]
        public Guid GradingDetailId { get; set; }
        [Required]
        public int MaxMarks { get; set; }
        [Required]
        public string GradeLetter { get; set; }
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

    }
    [Table("GradingMaster", Schema = "Examination")]
    public partial class ExaminationGradingMaster
    {
        [Key]
        [Required]
        public Guid GradingMasterId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }

    }
    public class GradingMasterDetailData
    {

        [Key]
       

        public Guid GradingMasterId { get; set; }

        public string Name { get; set; }

      



    }

}