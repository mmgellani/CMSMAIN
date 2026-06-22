/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("Bank", Schema = "Fee")]
    public partial class FeeBank {
        [Key]
        [Required]
        public Guid BankId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string Abbreviation { get; set; }

        [Required]
        public string AccountTitle { get; set; }

        [Required]
        public string AccountNo { get; set; }
        public bool  IsEnabled { get; set; }


        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        public Guid CityId { get; set; }

    }

    [Table ("BankVM", Schema = "Fee")]
    public partial class FeeBankVM {
        [Key]
        [Required]
        public Guid BankId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string AccountTitle { get; set; }

        [Required]
        public string AccountNo { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]

        public Guid LoggerId { get; set; }
        public bool?  IsEnabled { get; set; }

        public string Abbreviation { get; set; }

        public Guid? CityId { get; set; }

        public string CityName { get; set; }

    }
    public partial class feeStructureinsertion {
        [Key]
        [Column ("fsi")]
        public bool feestructureinsertion { get; set; }
    }
}