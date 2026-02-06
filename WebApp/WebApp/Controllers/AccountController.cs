using Microsoft.AspNetCore.Mvc;
using   WebApp.Models;
using WebApp.data;
using BCrypt.Net;

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
                return BadRequest(new {desc="utente nullo"});
            }

            if (string.IsNullOrEmpty(u.name) || string.IsNullOrEmpty(u.password) || string.IsNullOrEmpty(u.email)) {
                return BadRequest(new { desc = "campi vuoti" });
            }
            if (ProgramManager.dipendenti.Any(p => u.name == p.name) )
            {
                return BadRequest(new { desc = "username già in uso" });
            }
            if (ProgramManager.dipendenti.Any(d => d.email == u.email))
            {
                return BadRequest(new { desc = "email già in uso" });
            }

            // Hash della password prima di salvarla
            string hpassword = BCrypt.Net.BCrypt.HashPassword(u.password);
            u.password = hpassword;

            try
            {
                using var db = new UtentiDb();
                db.dipendenti.Add(u);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(new {desc= $"errore durante la registrazione: {ex.Message}" });
            }
            ProgramManager.dipendenti.Add(u);

            return Ok(new {desc = "registrazione avvenuta con successo"});
        }
    }
}
