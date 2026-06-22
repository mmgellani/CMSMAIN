using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Cms360.Contract;
using Cms360.Service;
using Cms360.Server.Model;
using Cms360.Service.Model;
using Cms360.Contract.Security;
using Cms360.Server.Security;
using Cms360.Service.Security;

namespace Cms360.Server.Controllers.Admin
{
    [Authorize(Roles = RoleTypes.Admin + "," + RoleTypes.SiteAdmin)]
    [Route("api/manage/role/[action]")]
    [ServiceFilter(typeof(Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Filters.ApiExceptionFilter))]
    public class ManageRoleController : ControllerBase
    {
        private readonly IManageRoleService manageRoleService;

        public ManageRoleController(IManageRoleService manageRoleService, IDomainContextResolver resolver, ILocalizationService localization) : base(resolver, localization)
        {
            this.manageRoleService = manageRoleService;
        }

        [HttpGet]

        [HttpGet]
        public async Task<object> CloneRole(string id)
        {
            return new
            {
                AllowedValuesPattern = SecurityClaimTypes.AllowedValuesPattern,
                AvailableClaims = await this.manageRoleService.GetAvailableClaims(),
                ExistingRoles = (await this.manageRoleService.GetRoles()).Select(o => new { o.RoleId, o.Name }),
                Role = await this.manageRoleService.CloneRole(id),
                SystemRoles = await this.manageRoleService.GetSystemRoles()
            };
        }

        [HttpGet]
        public async Task<object> GetRole(string id)
        {
            return new
            {
                AllowedValuesPattern = SecurityClaimTypes.AllowedValuesPattern,
                AvailableClaims = await this.manageRoleService.GetAvailableClaims(),
                ExistingRoles = (await this.manageRoleService.GetRoles()).Select(o => new { o.RoleId, o.Name }),
                Role = await this.manageRoleService.GetRole(id),
                SystemRoles = await this.manageRoleService.GetSystemRoles()
            };
        }

        [HttpGet]
        public async Task<object> Search(int page, int pageSize)
        {
            return await this.manageRoleService.Search(page, pageSize);
        }

        [HttpPut]
        public async Task<object> UpdateRole([FromBody]Role role)
        {
            return await this.manageRoleService.UpdateRole(role, this.User);
        }

        [HttpPut]
        public async Task<object> UpdateRoleStatus([FromBody]Role role)
        {
            return await this.manageRoleService.UpdateRoleStatus(role, this.User);
        }

        [HttpPost]
        public async Task<object> CreateRole([FromBody] Role role)
        {
            if (role == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            return await this.manageRoleService.CreateRole(role, this.User);
        }
    }
}