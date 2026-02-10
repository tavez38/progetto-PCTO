using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class RequestDelProgetto
    {
        public string idProg { get; set; }
        public RequestDelProgetto() { }
    }
    [Authorize]
    [Route("/api")]
    [ApiController]
    public class PersonalAreaController : ControllerBase
    {
        private readonly UtentiDb db;
        public PersonalAreaController(UtentiDb db)
        {
            this.db = db;
        }

        [HttpGet]
        [Route("/api/personalArea")]
        public IActionResult GetAllWorks()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;
            var progetti = db.progetti.Where(p => p.IdProprietario==id).ToList()?? new List<Progetto>();
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
            db.progetti.Add(nuovoProgetto);
            db.SaveChanges();
            
            return Ok();
        }

        [HttpPost]
        [Route("/api/deleteWork")]
        public IActionResult DeleteWork([FromBody] RequestDelProgetto request)
        {
            var idProprietario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;
            if (string.IsNullOrEmpty(idProprietario))
                return Unauthorized();
            var progetto = db.progetti.FirstOrDefault(p => p.id == request.idProg && p.IdProprietario == idProprietario);
            if (progetto == null)
                return NotFound();
            db.progetti.Remove(progetto);
            db.SaveChanges();
            return Ok(new {res="progetto eliminato"});
        }
    } 
}
