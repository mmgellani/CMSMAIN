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
    [Table("CampusBankLink", Schema = "Fee")]
    public partial class FeeCampusBankLink
    {
        [Key]
        [Required]
        public Guid CampusBankLinkId { get; set; }

        [Required]
        public Guid CampusId { get; set; }


        public Nullable<Guid> ProgramDetailId { get; set; }

        [Required]
        public Guid BankId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        [Column(TypeName = "jsonb")]

        public string GenderId { get; set; }

        public   bool ShowInChallan  {get;set;}

    }
}