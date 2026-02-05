using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("/html")]
    [ApiController]
    public class PersonalAreaController : ControllerBase
    {
        [HttpGet]
        [Route("/api/personalArea")]
        public IActionResult GetAllWorks()
        {
            var progetti = ProgramManager.progetti ?? new List<Progetto>();
            return Ok(progetti);
        }

        [HttpPost]
        [Route("/api/uploadWork")]
        public IActionResult AddWork([FromBody] Progetto nuovoProgetto)
        {
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
