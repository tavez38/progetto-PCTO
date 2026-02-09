using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using WebApp.data;
using Microsoft.AspNetCore.Authorization;

namespace WebApp.Controllers
{
    [Authorize]
    [Route("/api/messages")]
    [ApiController]
    public class MessaggiController : ControllerBase
    {
        private readonly UtentiDb db;
        public MessaggiController(UtentiDb db)
        {
            this.db = db;
        }
        [HttpGet]
        [Route("/api/messages/getMsg")]
        public IActionResult GetMsg()
        {
            var mailUtente = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                              ?? User.FindFirst("email")?.Value
                              ?? User.FindFirst("Email")?.Value;
            var msgUtente = db.messaggi.Where(m => m.destinatario == mailUtente).ToList() ?? new List<Messaggio>();
            return Ok(msgUtente);
        }


        [HttpPost]
        [Route("/api/messages/sendMsg")]
        public IActionResult SendMsg([FromBody] Messaggio msg)
        {
            if (msg == null || string.IsNullOrEmpty(msg.titolo) || string.IsNullOrEmpty(msg.contenuto) || string.IsNullOrEmpty(msg.destinatario))
            {
                return BadRequest("Dati del messaggio non validi");
            }

            msg.dataInvio = DateTime.Now;
            var mailMittente = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                              ?? User.FindFirst("email")?.Value
                              ?? User.FindFirst("Email")?.Value;

            if (string.IsNullOrEmpty(mailMittente))
            {
                return Unauthorized("Mittente non identificato");
            }

            msg.mittente = mailMittente;
            db.messaggi.Add(msg);
            db.SaveChanges();
            return Ok();
        }
    }
}
