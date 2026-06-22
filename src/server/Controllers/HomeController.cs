using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cms360.Server.Model;

namespace Cms360.Server.Controllers
{
    [Route("[controller]/[action]")]
    public class HomeController : Controller
    {
        public HomeController()
        {

        }

        [HttpGet]
        public ActionResult Index()
        {
            string virtualPath = "index.html";
            string contentType = "text/html";

            return File(virtualPath, contentType);
        }

        [HttpGet]
        public ActionResult Admin()
        {
            string virtualPath = "admin.html";
            string contentType = "text/html";

            return File(virtualPath, contentType);
        }
    }
}
