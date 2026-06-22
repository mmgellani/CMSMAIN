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
    [Table("AdmissionAverage", Schema = "Dashboard")]
    public class AdmissionAverage
    {
        [Key]
        public Guid AdmissionAverageId { get; set; }
        public Int32 Session { get; set; }
        public String Possession { get; set; }
        public Int32 TotalCampus { get; set; }
        public Int32 Average { get; set; }
    }

    public class AdmissionAverageEx
    {
        [Key]
        public Guid AdmissionAverageId { get; set; }
        public Int32 Session { get; set; }
        public String Possession { get; set; }
        public Int32 TotalCampus { get; set; }
        public Int32 Average { get; set; }
        public Int32 TotalAdmission { get; set; }
    }
}
