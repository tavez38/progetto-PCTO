using Microsoft.AspNetCore.Mvc;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        [Route("/")]
        public IActionResult Index()
        {
            return RedirectToAction("ShowHomePage");

        }
        [Route("/index")]
        public IActionResult ShowHomePage()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","html","Index.html");
            return PhysicalFile(path,"text/html");
        }
        
        [HttpPost]
        [Route("/index")]
        public IActionResult Login([FromBody] LoginRequest userLog)
        {
           if(userLog == null)
           {
               return BadRequest("Dati non validi");
           }

            foreach (Utente u in Dipendenti.dipendenti)
            {
                if ((userLog.username == u.name || userLog.username == u.email) && userLog.password == u.password)
                {
                    return Ok("utente loggato");
                }
                else if (userLog.username == u.name || userLog.username == u.email)
                {
                    return Unauthorized("password errata");
                }
            }
            return NotFound("Utente inesistente");
        }


    }
}
