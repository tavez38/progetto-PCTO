using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class MailModifyRequest
    {
        public string emailNew { get; set; }
        public string pswConf { get; set; }

        public MailModifyRequest() { }

    }

    public class PswModifyRequest
    {
        public string pswNew { get; set; }
        public string pswConf { get; set; }
        public PswModifyRequest() { }
    }


    [Authorize]
    [Route("/api/modifyAccount")]
    [ApiController]
    public class ModifyController : ControllerBase
    {
        private readonly UtentiDb db;
        public ModifyController(UtentiDb db)
        {
            this.db = db;
        }

        [HttpPut]
        [Route("/api/modifyAccount/username")]
        public IActionResult ModifyUsername([FromBody] string request)
        {
            var idUser= User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;

            var userDb = db.dipendenti.FirstOrDefault(u=> u.id == idUser);
           

            if (userDb==null)
                return NotFound(new { res= "Utente non trovato" });

            userDb.name = request;
            
            db.SaveChanges();
            
            return Ok(new {res ="utente modificato"});
        }

        [HttpPut]
        [Route("/api/modifyAccount/email")]
        public IActionResult modifyMail([FromBody] MailModifyRequest request)
        {
            var idUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;

            var userDb = db.dipendenti.FirstOrDefault(u => u.id == idUser);
            

            if (userDb==null) return NotFound(new { res = "user non trovato" } );

            if (!BCrypt.Net.BCrypt.Verify(request.pswConf, userDb.password))
            {
                return BadRequest(new { res = "password errata" });
            }
            userDb.email = request.emailNew;
           
            db.SaveChanges();
            return Ok(new { res = "credenziali aggiornate" });
        }

        [HttpPut]
        [Route("/api/modifyAccount/psw")]
        public IActionResult modifyPsw([FromBody] PswModifyRequest request)
        {
            var idUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? User.FindFirst("sub")?.Value
               ?? User.Identity?.Name;

            var userDb = db.dipendenti.FirstOrDefault(u => u.id == idUser);
           

            if (userDb == null) return NotFound(new { res = "user non trovato" });

            if (!BCrypt.Net.BCrypt.Verify(request.pswConf, userDb.password))
            {
                return BadRequest(new { res = "password errata" });
            }
            userDb.password = request.pswNew;
         
            db.SaveChanges();
            return Ok(new { res = "credenziali aggiornate" });
        }

        [HttpDelete]
        [Route("/api/modifyAccount/deleteAccount")]
        public IActionResult deleteAccount([FromBody] string pswConf)
        {
            var idUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? User.FindFirst("sub")?.Value
               ?? User.Identity?.Name;

            var userDb = db.dipendenti.FirstOrDefault(u => u.id == idUser);
           

            if (userDb == null ) return NotFound(new { res = "user non trovato" });

            if (!BCrypt.Net.BCrypt.Verify(pswConf, userDb.password))
            {
                return BadRequest(new { res = "password errata" });
            }
           
            db.dipendenti.Remove(userDb);
            db.SaveChanges();
            return Ok(new {res="utente eliminato"});
        }
    }
}
