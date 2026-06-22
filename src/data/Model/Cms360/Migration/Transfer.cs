using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    public class Transfer
    {
        public string fromid { get; set; }
        [Key]
        public string toid { get; set; }

        public string campus { get; set; }

    }
}