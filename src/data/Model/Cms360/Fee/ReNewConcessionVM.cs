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

    public partial class ReNewConcessionVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string RefferrenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public Guid ScholarshipCriteriaId { get; set; }
        public decimal Percentage { get; set; }
        public string ConcessionName { get; set; }
        public bool IsSelected { get; set; }
        public string AdmissionType { get; set; }
        public string ContinuationPolicy { get; set; }
        public bool IsEligible { get; set; }
        public string FirstConcession{get;set;}

    }
    [Table ("VW_ConcessionContinutionRules", Schema = "Fee")]
 public partial class VW_ConcessionContinutionRules
    {
        [Key]
        public Guid ConcessionRulesId { get; set; }
        public string ConcessionContinutionRules { get; set; }
    }
    public partial class ReNewConcessionVMEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RollNo { get; set; }
        public string RefferrenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public Guid ScholarshipCriteriaId { get; set; }
        public decimal Percentage { get; set; }
        public string ConcessionName { get; set; }
        public bool IsSelected { get; set; }
        public string AdmissionType { get; set; }
        public string ContinuationPolicy { get; set; }
        public bool IsEligible { get; set; }
        public Guid ClassId { get; set; }

    }
     
}