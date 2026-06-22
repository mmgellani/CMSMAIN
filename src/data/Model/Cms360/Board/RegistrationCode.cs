using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("RegistrationCode", Schema = "Board")]
    public class BoardRegistrationCode
    {
        [Key]
        public Guid RegistrationCodeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid ProgramId { get; set; }

         public Guid BoardId { get; set; }
        public int StatusId { get; set; }
    }
}