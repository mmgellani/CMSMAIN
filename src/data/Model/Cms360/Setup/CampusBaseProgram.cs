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
    [Table("VWCampusBaseProgram", Schema = "Setup")]
    public partial class VWCampusBaseProgram
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }
        public Guid SessionId { get; set; }


    }
}