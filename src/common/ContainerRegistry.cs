using StructureMap;
using Cms360.Contract;

namespace Cms360.Common
{
    public class ContainerRegistry : Registry
    {
        public ContainerRegistry()
        {
            For<ICryptoService>().Use<CryptoHelper>();
        }
    }
}