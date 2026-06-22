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
    [Table("VW-CampusBankLink", Schema = "Fee")]
    public partial class FeeCampusBankVM
    {
        [Key]
        [Required]
        public Guid CampusBankLinkId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public String CampusName { get; set; }
        [Required]
        public Guid? ProgramDetailId { get; set; }
        [Required]
        public String Description { get; set; }
        [Required]

        public String BankName { get; set; }
        [Required]
        public Guid BankId { get; set; }
        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

    }


    [Table("VWCampusBankAccountNo", Schema = "Fee")]
    public partial class FeeCampusBankAccountVM
    {
        [Key]
        [Required]
        public Guid CampusBankLinkId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public String CampusName { get; set; }
        [Required]
        public Guid? ProgramDetailId { get; set; }
        [Required]
        public String Description { get; set; }
        [Required]

        public String BankName { get; set; }
        [Required]
        public Guid BankId { get; set; }
        [Required]
        public int? StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        [Required]
        public string AccountNo { get; set; }

        [Column (TypeName = "jsonb")]

		public string GenderId { get; set; }

        public bool? ShowInChallan  {get;set;}


    }

    [Table("VWCampusBank", Schema = "Fee")]
    public partial class CampusBank
    {
        [Key]
        [Required]
        public Guid CampusBankLinkId { get; set; }
        [Required]
        public Guid CampusId { get; set; }
        [Required]
        public Guid? ProgramDetailId { get; set; }

        [Required]
        public String BankName { get; set; }
        [Required]
        public string AccountNo { get; set; }
        [Required]
        public Guid BankId { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string AccountTitle { get; set; }
        [Required]
        public int StatusId { get; set; }

    }
}