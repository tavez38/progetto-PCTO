using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using WebApp.data;
using Microsoft.AspNetCore.Authorization;

namespace WebApp.Controllers
{
    public class DelRequest
    {
        public int idMsg { get; set; }
        public string destinatario { get; set; }
    }
    public class SignedAsRead
    {
        public int id { get; set; }
        public bool letto { get; set; }

        public string destinatario { get; set; }

        public SignedAsRead(){}

    }
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
            if(!db.dipendenti.Any(u=> u.email == msg.destinatario))
            {
                return NotFound();
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

        [HttpPut]
        [Route("/api/messages/markAsRead")]
        public IActionResult MarkAsRead([FromBody] SignedAsRead request)
        {
            var mailUSLog = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                              ?? User.FindFirst("email")?.Value
                              ?? User.FindFirst("Email")?.Value;
            if (request.destinatario != mailUSLog)
            {
                return Unauthorized();
            }
            var msg = db.messaggi.FirstOrDefault(m => m.Id == request.id);
            if (msg == null)
            {
                return NotFound(new { res = "Messaggio non trovato" });
            }
            if(msg.destinatario != mailUSLog)
            {
                return Unauthorized();
            }

            msg.letto = request.letto;
            db.SaveChanges();
            return Ok(new { res = "Messaggio segnato come letto" });
        }

        [HttpPost]
        [Route("/api/messages/deleteMsg")]
        public IActionResult DeleteMsg([FromBody] DelRequest request)
        {
            var mailUSLog = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                              ?? User.FindFirst("email")?.Value
                              ?? User.FindFirst("Email")?.Value;
            if (request.destinatario != mailUSLog)
            {
                return Unauthorized();
            }
            var msg = db.messaggi.FirstOrDefault(m => m.Id == request.idMsg);
            if (msg == null)
            {
                return NotFound(new { res = "Messaggio non trovato" });
            }
            if (msg.destinatario != mailUSLog)
            {
                return Unauthorized();
            }
            db.messaggi.Remove(msg);
            db.SaveChanges();
            return Ok(new { res = "Messaggio eliminato" });
        }
    }
}
