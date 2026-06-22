using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("VWRouteDetail", Schema = "Transportation")]
    public partial class VWRouteDetail {
        [Key]
        [Required]
        public Guid RouteDetailId { get; set; }

        [Required]
        public Guid RouteId { get; set; }

        [Required]
        public string StopName { get; set; }

        [Required]
        public string RouteTitle { get; set; }

        [Required]
        public string StartingPoint { get; set; }

        [Required]
        public string EndingPoint { get; set; }

        [Required]
        public int Fare { get; set; }

        [Required]
        public decimal StatusId { get; set; }

        public string Longitude { get; set; }

        public string Latitude { get; set; }

    }
}