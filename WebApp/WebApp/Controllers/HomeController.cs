using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // aggiunto
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        private readonly IConfiguration _config; // aggiunto

        public HomeController(IConfiguration config) // aggiunto
        {
            _config = config;
        }

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
               return BadRequest(new {id = -3});
           }

            foreach (Utente u in ProgramManager.dipendenti)
            {
                if ((userLog.username == u.name || userLog.username == u.email) && BCrypt.Net.BCrypt.Verify(userLog.password, u.password))
                {
                    var infoSaveToken= new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier , u.id),
                        new Claim(ClaimTypes.Email , u.email)

                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        issuer: _config["JWT:Issuer"],
                        audience: _config["JWT:Audience"],
                        claims: infoSaveToken,
                        expires: DateTime.Now.AddDays(1),
                        signingCredentials: creds
                        );

                    return Ok(new { 
                        id = u.id,
                        token = new JwtSecurityTokenHandler().WriteToken(token)
                    });
                }
                else if (userLog.username == u.name || userLog.username == u.email)
                {
                    return Unauthorized(new { id = -1 });
                }
            }
            return NotFound(new { id = -2 });
        }


    }
}
