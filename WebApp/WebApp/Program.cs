using WebApp.Models;
using WebApp.data;

namespace WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllersWithViews();
            var app = builder.Build();

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
            }
            
        }
    }
}
