using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApp.data;
using WebApp.Models;

namespace WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllersWithViews();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true, // Scadenza automatica del token
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = builder.Configuration["Jwt:Issuer"],
                            ValidAudience = builder.Configuration["Jwt:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                        };
                });

            var app = builder.Build();
            app.UseAuthentication(); // Chi sei?
            app.UseAuthorization();  // Cosa puoi fare?
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapControllers();
            config();
            app.Run();
        }

        static void config()
        {
            using (var db = new UtentiDb())
            {
                ProgramManager.dipendenti = db.dipendenti.ToList();
                ProgramManager.progetti = db.progetti.ToList();
                ProgramManager.messaggi = db.messaggi.ToList();
            }
            
        }
    }
}
