using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("/login/personalArea")]
    [ApiController]
    public class PersonalAreaController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllWorks()
        {
            var progetti = ProgettiUtente.progetti;
            return Ok(progetti);
        }
    }
}
