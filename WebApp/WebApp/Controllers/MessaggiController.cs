using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using WebApp.data;

namespace WebApp.Controllers
{
    [Route("/api/messages")]
    [ApiController]
    public class MessaggiController : ControllerBase
    {
        [HttpGet]
        [Route("/api/messages/getMsg/{idUtente}")]
        public IActionResult GetMsg(string idUtente)
        {
            var mailUtente = ProgramManager.dipendenti.FirstOrDefault(u => u.id == idUtente)?.email;
            var msgUtente = ProgramManager.messaggi.Where(m => m.destinatario == mailUtente).ToList() ?? new List<Messaggio>();
            return Ok(msgUtente);
        }

        [HttpGet]
        [Route("/api/messages/getMailMit/{idMit}")]
        public IActionResult getMailMit(string idMit)
        {
            try
            {
                var mit = ProgramManager.dipendenti.First(d => idMit == d.id);
                var mailMit = mit.email;
                return Ok(new { mail = mailMit });
            } catch(Exception e) {
                return NotFound();
            }
        }

        [HttpPost]
        [Route("api/messages/sendMsg")]
        public IActionResult SendMsg([FromBody] Messaggio msg)
        {
            if (msg == null || string.IsNullOrEmpty(msg.titolo) || string.IsNullOrEmpty(msg.contenuto) || string.IsNullOrEmpty(msg.mittente) || string.IsNullOrEmpty(msg.destinatario))
            {
                return BadRequest("Dati del messaggio non validi");
            }
            msg.dataInvio = DateTime.Now;
            ProgramManager.messaggi.Add(msg);
            using(var db = new UtentiDb())
            {
                db.messaggi.Add(msg);
                db.SaveChanges();
            }
            return Ok();
        }
    }
}
