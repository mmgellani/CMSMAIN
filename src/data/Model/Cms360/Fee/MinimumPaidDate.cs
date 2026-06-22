/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("MinimumPaidDate", Schema = "Fee")]
    public partial class MinimumPaidDate {
        [Key]

        public Guid MinimumPaidDateId { get; set; }
        public Guid SubCityId { get; set; }
        public int MinDays { get; set; }
        public int StatusId { get; set; }

    }
    public partial class MinimumPaidDateVM {
        [Key]

        public Guid MinimumPaidDateId { get; set; }
        public Guid SubCityId { get; set; }
        public Guid CityId { get; set; }

        public string City { get; set; }

        public string SubCity { get; set; }

        public int MinDays { get; set; }
        public int StatusId { get; set; }

    }
}