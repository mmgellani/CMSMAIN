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
    [Table("CampusProgramLink", Schema = "Setup")]
    public partial class SetupCampusProgramLink
    {
        [Key]
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid SessionId { get; set; }

    }

    [Table("VW-CampusProgramLink", Schema = "Setup")]
    public partial class SetupCampusProgramLinkVM
    {
        [Key]
        [Required]
        public Guid CampusProgramId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        [Required]
        public Guid SessionId { get; set; }
        public string Description { get; set; }

    }

    [Table("VWCampusProgramLink", Schema = "Setup")]
    public partial class SetupCampusProgramVM
    {
        [Key]
        [Required]
        public Guid? CampusProgramId { get; set; }
        [Required]
        public Guid? CampusId { get; set; }
        [Required]
        public Guid? ProgramDetailId { get; set; }
        [Required]
        public int? StatusId { get; set; }
        [Required]
        public Guid? LoggerId { get; set; }
        [Required]
        public Guid? SessionId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string ProgramName { get; set; }
        public Guid? ProgramId { get; set; }
        public Guid? ShiftId { get; set; }
        public string ShiftName { get; set; }
    }


 [Table("VWLevelProgramDetails", Schema = "Assessment")]
    public partial class LevelProgamDetailsVM
    {
         [Key]
        [Column("CampusProgramId")]
        public Guid CampusProgramId { get; set; }

        [Column("CampusId")]
        public Guid CampusId { get; set; }

        [Column("ProgramDetailId")]
        public Guid ProgramDetailId { get; set; }

        [Column("StatusId")]
        public int StatusId { get; set; }

        [Column("LoggerId")]
        public Guid LoggerId { get; set; }

        [Column("SessionId")]
        public Guid SessionId { get; set; }

        [Column("CampusName")]
        public string CampusName { get; set; }

        [Column("Description")]
        public string Description { get; set; }

        [Column("ProgramName")]
        public string ProgramName { get; set; }

        [Column("ProgramId")]
        public Guid ProgramId { get; set; }

        [Column("ShiftId")]
        public Guid ShiftId { get; set; }

        [Column("ShiftName")]
        public string ShiftName { get; set; }

        [Column("LevelId")]
        public Guid LevelId { get; set; }
    }

     [Table("VWClassLevel", Schema = "Assessment")]
    public class VWClassLevel
    {
        [Key]
        [Column("FullName")]
        public string FullName { get; set; }

        [Column("Description")]
        public string Description { get; set; }

        [Column("ClassCode")]
        public string ClassCode { get; set; }

        [Column("LevelId")]
        public Guid LevelId { get; set; }

        [Column("ProgramId")]
        public Guid ProgramId { get; set; }

        [Column("ClassId")]
        public Guid ClassId { get; set; }
    }

    

 [Table("VWAssessmentNames", Schema = "Assessment")]
     public class VWAssessmentNames
    {
        [Key]
        [Required]
        public Guid AssessmentSchedulingDetailId { get; set; }
        public Guid AssessmentSchemeDetailId { get; set; }
        public string FullName { get; set; }
        public string Month { get; set; }
        public decimal Weightage { get; set; }
        public long Order { get; set; }
        public int StatusId { get; set; }
        public Guid AssessmentSchedulingMasterId { get; set; }
        public Guid AssessmentSchemeMasterId { get; set; }
        public Guid ExamTypeId { get; set; }
        public string ExamName { get; set; }
    }

    [Table("VWAssessmentSections", Schema ="Assessment")]
    public class VWAssessmentSections
    {
        [Key]
        [Column("FullName")]
        public string FullName { get; set; }

        [Column("Description")]
        public string Description { get; set; }

        [Column("AssessmentSchemeMasterId")]
        public Guid AssessmentSchemeMasterId { get; set; }

        [Column("StatusId")]
        public int StatusId { get; set; }

        [Column("AssessmentSectionMapId")]
        public Guid AssessmentSectionMapId { get; set; }

        [Column("SectionCourseLinkId")]
        public Guid SectionCourseLinkId { get; set; }

        [Column("SectionId")]
        public Guid SectionId { get; set; }
    }
     public partial class VWCampusProgramCity
    {
        [Key]
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramId { get; set; }
        public Guid CityId { get; set; }
    }

    public partial class VWCampusProgramLevel
    {
        [Key]
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramId { get; set; }
    }
 public  class VWCampusProgramLevelEx
    {
        [Key]
        [Required]
        public Guid ProgramDetailId { get; set; }
        [Required]
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public Guid ProgramId { get; set; }
    }
    public partial class VWProgramLevel
    {
        [Key]
        [Required]
        public Guid ProgramId { get; set; }
        [Required]
        public string ProgramName { get; set; }
       
    }

    [Table("VWCampusProgramZone", Schema = "Setup")]
    public partial class CampusProgramZoneVM
    {
        [Key]
        [Required]
        public Guid? CampusProgramId { get; set; }
        [Required]
        public Guid? CampusId { get; set; }
        [Required]
        public Guid? ProgramDetailId { get; set; }
        [Required]
        public int? StatusId { get; set; }
        [Required]
        public Guid? LoggerId { get; set; }
        [Required]
        public Guid? SessionId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string ProgramName { get; set; }
        public Guid? ProgramId { get; set; }
        public Guid? ShiftId { get; set; }
        public string ShiftName { get; set; }

        public Guid? ZoneId { get; set; }
        public string ZoneName { get; set; }
    }

    public partial class SetupCampusProgramVMo
    {
        [Required]
        public String CampusProgramId { get; set; }
        [Required]
        public String CampusId { get; set; }
        [Key]
        [Required]
        public Guid? ProgramDetailId { get; set; }
        [Required]
        public String StatusId { get; set; }
        [Required]
        public String LoggerId { get; set; }
        [Required]
        public String SessionId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string ProgramName { get; set; }
        public String ProgramId { get; set; }
        public String ShiftId { get; set; }
        public string ShiftName { get; set; }
    }

    public class CampusProgramData
    {
        [Key]
        public Guid CampusProgramId { get; set; }

        public int StatusId { get; set; }

        public string Session { get; set; }

        public string Campus { get; set; }

        public string Description { get; set; }

    }
}