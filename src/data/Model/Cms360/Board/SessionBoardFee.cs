using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("SessionBoardFee", Schema = "Board")]
    public class SessionBoardFee {
        [Key]
        public Guid SessionBoardFeeId { get; set; }
        public Guid SessionId { get; set; }

        public Guid BoardId { get; set; }

        public Guid FeeHeadId { get; set; }

        public int Amount { get; set; }

        public int StatusId { get; set; }
    }

    [Table ("VWSessionBoardFee", Schema = "Board")]
    public class SessionBoardFeeVM {
        [Key]
        public Guid SessionBoardFeeId { get; set; }
        public Guid SessionId { get; set; }

        public string FeeHead { get; set; }

        public string Board { get; set; }

        public string Session { get; set; }

        public Guid BoardId { get; set; }

        public Guid ChallanTypeId { get; set; }

        public Guid FeeHeadId { get; set; }

        public int Amount { get; set; }

        public int StatusId { get; set; }
    }
}