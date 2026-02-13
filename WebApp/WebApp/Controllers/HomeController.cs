using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; 
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApp.data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        private readonly UtentiDb db;
        private readonly IConfiguration _config; 

        public HomeController(IConfiguration config, UtentiDb ctx) 
        {
            _config = config;
            this.db = ctx;
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
               return BadRequest();
           }
            var u = db.dipendenti.FirstOrDefault(x => x.email == userLog.username || x.name == userLog.username);

            if(u != null)
            {
                if (BCrypt.Net.BCrypt.Verify(userLog.password, u.password))
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
                else
                {
                    return Unauthorized();
                }
            }
            return Unauthorized();
        }
    }
}
