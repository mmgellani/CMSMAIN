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
  [Table("AssessmentType", Schema = "Assessment")]
  public partial class AssessmentType
  {
    [Key]
    [Required]
    public Guid AssessmentTypeId { get; set; }

    public Guid AssessmentCategoryId { get; set; }
    public Guid ExamTypeId { get; set; }
    public int StatusId { get; set; }

  }
  [Table("VWAssessmentTypeData", Schema = "Assessment")]
  public partial class AssessmentTypeVM
  {
    [Key]
    [Required]
    public Guid AssessmentTypeId { get; set; }
    public Guid AssessmentCategoryId { get; set; }
    public Guid ExamTypeId { get; set; }

    public string AssessmentCategory { get; set; }
    public string AssessmentType { get; set; }
    public string Code { get; set; }

    public int StatusId { get; set; }

  }

  // [Table("AssessmentCategory", Schema = "Assessment")]
  // public partial class AssessmentCatorgorydata
  // {
  //   [Key]
  //   [Required]
  //   public Guid AssessmentCategoryId { get; set; }
  //   public string FullName { get; set; }
  //   public string Code { get; set; }

  //   public int StatusId { get; set; }

  // }

}