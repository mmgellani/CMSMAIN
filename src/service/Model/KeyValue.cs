
using Cms360.Contract.Model;

namespace Cms360.Service.Model
{
    public class KeyValue : IKeyValue
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}