using Microsoft.AspNetCore.Mvc;
using   WebApp.Models;
using WebApp.data;

namespace WebApp.Controllers
{
    [Route("/register")]
    public class AccountController : Controller
    {
        [Route("/register")]
        public IActionResult ShowPageRegister()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "Registrazione.html");
            return PhysicalFile(path, "text/html");
        }

        [HttpPost]
        [Route("/register")]
        public IActionResult Registrazione([FromBody] Utente u)
        {
            if(u == null) { 
                return BadRequest();
            }

            if (string.IsNullOrEmpty(u.name) || string.IsNullOrEmpty(u.password) || string.IsNullOrEmpty(u.email)) {
                return BadRequest("Tutti i campi sono obbligatori.");
            }

            Dipendenti.dipendenti.Add(u);
            try
            {
                using var db = new UtentiDb();
                db.dipendenti.Add(u);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest("Errore durante la registrazione: " + ex.Message);
            }

            return Ok("Registrazione avvenuta con successo.");
        }
    }
}
