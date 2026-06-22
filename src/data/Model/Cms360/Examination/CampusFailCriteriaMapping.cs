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
    [Table("CampusFailCriteriaMapping", Schema = "Examination")]
    public partial class ExaminationCampusFailCriteriaMapping
    {
        [Key]
        [Required]
        public Guid CampusFailCriteriaId { get; set; }
        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid FailMasterId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid ExamTypeId { get; set; }
        [Required]
        public DateTime Month { get; set; }


    }


    [Table("VWCampusFailCriteria", Schema = "Examination")]
    public partial class ExaminationVWCampusFailCriteria
    {

        [Key]
        public Guid Id { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid FailMasterId { get; set; }
        public int Fail_In { get; set; }
        public Boolean AbsentConsiderFail { get; set; }
        public int FailMarks { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public Guid CampusFailCriteriaId { get; set; }
        public Guid ExamTypeId { get; set; }
        public DateTime Month { get; set; }
        public string ExamType { get; set; }


    }

}