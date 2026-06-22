using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("VWCampusStudentLink", Schema = "Board")]
    public class BoardVWCampusStudentLink
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string BoardCampus { get; set; }
        public string RollNo { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SessionId { get; set; }
        public Guid SectionId { get; set; }
        public Guid ClassId { get; set; }
        public string StudentName { get; set; }
        public int StatusId { get; set; }
    }
}