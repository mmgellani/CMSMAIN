using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Cms360.Data.Model
{

    
    public class SecurityClaimUpd
    {        
        [Key]
        public string SecurityClaimId { get; set; }
        public string Description { get; set; }
        public bool Enabled { get; set; }
        public string Origin { get; set; }
        public string ValidationPattern { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public long? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
    }
}