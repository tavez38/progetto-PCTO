using WebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApp.data
{
    public class UtentiDb : DbContext
    {
        public DbSet<Utente> dipendenti { get; set; }

        public DbSet<Progetto> progetti { get; set; }

        public DbSet<Messaggio> messaggi { get; set; }

        public UtentiDb(DbContextOptions<UtentiDb> options) : base(options)
        {
        }
    }
}
