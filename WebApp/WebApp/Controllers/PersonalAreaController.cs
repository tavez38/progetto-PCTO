using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("/html/personalArea")]
    [ApiController]
    public class PersonalAreaController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllWorks()
        {
            var progetti = ProgettiUtente.progetti;
            if (progetti == null || progetti.Count == 0)
            {
                return NotFound("Nessun progetto trovato.");
            }
            return Ok(progetti);
        }

        [HttpPost]
        [Route("/html/uploadWork")]
        public IActionResult AddWork([FromBody] Progetto nuovoProgetto)
        {
            ProgettiUtente.progetti.Add(nuovoProgetto);
            using (var db = new UtentiDb())
            {
                db.progetti.Add(nuovoProgetto);
                db.SaveChanges();
            }
            
            return Ok();
        }
    }

    
}
