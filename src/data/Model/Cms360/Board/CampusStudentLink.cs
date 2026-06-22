using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("CampusStudentLink", Schema = "Board")]
    public class BoardCampusStudentLink
    {
        [Key]
        public Guid CampusStudentLinkId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid BoardCampusId { get; set; }
        public int StatusId { get; set; }
    }
}