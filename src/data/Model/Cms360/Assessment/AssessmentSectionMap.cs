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
    [Table("AssessmentSectionMap", Schema = "Assessment")]
    public partial class AssessmentSectionMap
    {
		[Key]
		[Required]
        public Guid AssessmentSectionMapId { get; set; }

		public Guid AssessmentSchemeMasterId { get; set; }

		public Guid SectionCourseLinkId { get; set; }

		public int StatusId { get; set; }

    }

	[Table("VWAssessmentSectionMap", Schema = "Assessment")]
    public partial class VWAssessmentSectionMap
    {
		[Key]
		[Required]
        public Guid AssessmentSectionMapId { get; set; }
		public Guid AssessmentSchemeMasterId { get; set; }
        public string AssessmentMaster { get; set; }
		public Guid SectionCourseLinkId { get; set; }
		public Guid SectionId { get; set; }
		public Guid ProgramDetailId { get; set; }
		public string SectionName { get; set; }
		public Guid CampusId { get; set; }
		public string CampusName { get; set; }	
		public Guid ProgramId { get; set; }
		public string ProgramName { get; set; }		
		public Guid ClassId { get; set; }
		public string ClassName { get; set; }
		public Guid LevelId { get; set; }
		public string LevelName { get; set; }
		public Guid SessionId { get; set; }
		public Guid CampusProgramId { get; set; }
		public int StatusId { get; set; }

    }

	 public partial class AssessmentLevelProgram
    {
		[Key]
		[Required]
        public Guid ProgramId { get; set; }

		public string ProgramName { get; set; }

		public Guid LevelId { get; set; }

		public Guid ProgramDetailId { get; set; }

		public Guid CampusProgramId { get; set; }

		public int StatusId { get; set; }

    }

}