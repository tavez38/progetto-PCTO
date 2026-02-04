using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.data;
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

        [HttpPost]
        [Route("uploadWork")]
        public IActionResult AddWork([FromBody] Progetto nuovoProgetto)
        {
            ProgettiUtente.progetti.Add(nuovoProgetto);
            using (var db = new UtentiDb())
            {
                db.progetti.Add(nuovoProgetto);
                db.SaveChanges();
            }
            
            return CreatedAtAction(nameof(GetAllWorks), nuovoProgetto);
        }
    }

    
}
