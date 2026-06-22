using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("VWConcession", Schema = "Fee")]
    public partial class VWConcession {

        public int InstallmentNo { get; set; }

        public string FeeHeadName { get; set; }

        public int FeeAmount { get; set; }

        public int PayableAmount { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public string RefferenceNo { get; set; }

        public string ConcessionName { get; set; }

        public int ConcessionAmount { get; set; }

        [Key]
        public Guid ConcessionDetailId { get; set; }

        public string Description { get; set; }

        public string CampusName { get; set; }

    }

}