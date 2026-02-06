using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Authorize]
    [Route("/html")]
    [ApiController]
    public class PersonalAreaController : ControllerBase
    {
        [HttpGet]
        [Route("/api/personalArea")]
        public IActionResult GetAllWorks()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;
            var progetti = ProgramManager.progetti.Where(p => p.IdProprietario==id).ToList()?? new List<Progetto>();
            return Ok(progetti);
        }

        [HttpPost]
        [Route("/api/uploadWork")]
        public IActionResult AddWork([FromBody] Progetto nuovoProgetto)
        {
            var idProprietario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;
            if (string.IsNullOrEmpty(idProprietario))
                return Unauthorized();
            nuovoProgetto.IdProprietario = idProprietario;
            ProgramManager.progetti.Add(nuovoProgetto);
            using (var db = new UtentiDb())
            {
                db.progetti.Add(nuovoProgetto);
                db.SaveChanges();
            }
            
            return Ok();
        }
    } 
}
