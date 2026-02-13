using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{ 

    public class UsernameModifyRequest
    {
        public string usernameNew { get; set; }
        public UsernameModifyRequest() { }
    }
    public class MailModifyRequest
    {
        public string emailNew { get; set; }
        public string pswConf { get; set; }

        public MailModifyRequest() { }

    }

    public class PswModifyRequest
    {
        public string pswNew { get; set; }
        public string pswOld { get; set; }
        public PswModifyRequest() { }
    }
    public class ReqDelAcc
    {
        public string pswConf {  set; get; }
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

        [HttpGet]
        [Route("/api/modifyAccount/getUserInfo")]
        public IActionResult getUserInfo()
        {
            var idUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;
            var userDb = db.dipendenti.FirstOrDefault(u => u.id == idUser);
            
            if (userDb == null) return NotFound(new { res = "user non trovato" });
            return Ok(new { username = userDb.name, email = userDb.email });
        }

        [HttpPut]
        [Route("/api/modifyAccount/username")]
        public IActionResult ModifyUsername([FromBody] UsernameModifyRequest request)
        {
            var idUser= User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.Identity?.Name;

            var userDb = db.dipendenti.FirstOrDefault(u=> u.id == idUser);
           

            if (userDb==null)
                return NotFound(new { res= "Utente non trovato" });

            userDb.name = request.usernameNew;
            
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

            if (!BCrypt.Net.BCrypt.Verify(request.pswOld, userDb.password))
            {
                return BadRequest(new { res = "password errata" });
            }
            userDb.password = BCrypt.Net.BCrypt.HashPassword(request.pswNew);
         
            db.SaveChanges();
            return Ok(new { res = "credenziali aggiornate" });
        }

        [HttpPost]
        [Route("/api/modifyAccount/deleteAccount")]
        public IActionResult deleteAccount([FromBody] ReqDelAcc request)
        {
            var idUser = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
               ?? User.FindFirst("sub")?.Value
               ?? User.Identity?.Name;

            var userDb = db.dipendenti.FirstOrDefault(u => u.id == idUser);
            var progEliminare = db.progetti.Where(p => p.IdProprietario == idUser).ToList();
            var mailDel = db.messaggi.Where(m => m.destinatario == userDb.email).ToList();

            


            if (userDb == null ) return NotFound(new { res = "user non trovato" });

            if (!BCrypt.Net.BCrypt.Verify(request.pswConf, userDb.password))
            {
                return BadRequest(new { res = "password errata" });
            }
            db.messaggi.RemoveRange(mailDel);
            db.progetti.RemoveRange(progEliminare);
            db.dipendenti.Remove(userDb);
            db.SaveChanges();
            return Ok(new {res="utente eliminato"});
        }
    }
}
