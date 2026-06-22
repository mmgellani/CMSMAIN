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
    [Table("Institution", Schema = "Setup")]
    public partial class SetupInstitution
    {
        [Key]

        public Guid InstitutionId { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public Guid BusinessUnitID { get; set; }

        public Guid InstitutionTypeId { get; set; }

        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }

        public String Code { get; set; }
    }
}