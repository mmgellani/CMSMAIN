/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("FeeStructure", Schema = "Fee")]
    public partial class FeeFeeStructure
    {
        [Key]
        [Required]
        public Guid FeeStructureId { get; set; }
        [Required]
        public Guid ZoneId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        [Required]
        public Guid ProgramId { get; set; }
        [Required]
        public Guid ShiftId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        public Guid FeeHeadId { get; set; }
        [Required]
        public decimal FeeAmount { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public Boolean IsApproved { get; set; }

    }

    [Table("VWFeeStructure", Schema = "Fee")]
    public class FeeStructureVM
    {
        [Key]
        public Guid FeeStructureId { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ShiftId { get; set; }
        public Guid ClassId { get; set; }
        public Guid FeeHeadId { get; set; }
        public decimal FeeAmount { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public Boolean IsApproved { get; set; }
        public string ShiftName { get; set; }
        public string ClassName { get; set; }
        public string FeeHeadName { get; set; }
        public string ProgramName { get; set; }
        public decimal Percentage { get; set; }
        public decimal Amount { get; set; }

    }

    [Table("VWFeeStructureEx", Schema = "Fee")]
    public class FeeStructureVMEx
    {
        [Key]
        public Guid FeeStructureId { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ShiftId { get; set; }
        public Guid ClassId { get; set; }
        public Guid FeeHeadId { get; set; }
        public decimal FeeAmount { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public Boolean IsApproved { get; set; }
        public string ShiftName { get; set; }
        public string ClassName { get; set; }
        public string FeeHeadName { get; set; }
        public string ProgramName { get; set; }
        public decimal Percentage { get; set; }
        public decimal Amount { get; set; }

    }

    public class ProgramJSON
    {

        public ProgramJSON()
        {
            ObjClass = new List<ClassJSON>();
        }
        public Guid ProgamId { get; set; }

        public List<ClassJSON> ObjClass { get; set; }


    }

    public class ClassJSON
    {

        public ClassJSON()
        {
            ObjShift = new List<ShiftJSON>();
        }
        public Guid ClassId { get; set; }


        public List<ShiftJSON> ObjShift { get; set; }
    }

    public class ShiftJSON
    {
        public ShiftJSON()
        {
            ObjFee = new List<FeeHeadJSON>();
        }
        public Guid ShiftId { get; set; }
        public List<FeeHeadJSON> ObjFee { get; set; }
    }

    public class FeeHeadJSON
    {
        public Guid FeeHeadId { get; set; }
        public int Status { get; set; }
        public Guid FeeStructureId { get; set; }
        public decimal FeeAmount { get; set; }

    }

    public class FeesJSON
    {

        public Guid FeeStructureId { get; set; }
        public Guid ZoneId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid ShiftId { get; set; }
        public Guid ClassId { get; set; }
        public Guid FeeHeadId { get; set; }
        public decimal FeeAmount { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public bool IsApproved { get; set; }

    }

    public class ZoneJSON
    {
        public Guid ZoneId { get; set; }
        public Guid SessionId { get; set; }
        public ProgramJSON ObjProgram { get; set; }
        public Guid? LoggerId { get; set; }
    }

    public class Installment
    {
        public Guid InstallmentId { get; set; }
        public Guid FeeStructureId { get; set; }
        public int InstallmentNo { get; set; }
        public decimal InstallmentAmount { get; set; }
        public Guid FeeHeadId { get; set; }
    }

    public class InstallmentHead
    {
        public List<Installment> InstallmentList;
        public InstallmentHead()
        {
            InstallmentList = new List<Installment>();
        }
    }
    public class InstallStr
    {
        public List<Feestr> Feestr { get; set; }
    }
    public class Feestr
    {
        public string FeName { get; set; }
        public decimal Value { get; set; }
    }
}