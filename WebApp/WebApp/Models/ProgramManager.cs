using WebApp.data;
namespace WebApp.Models
{
    public class ProgramManager
    {
            private readonly UtentiDb db;
        public ProgramManager(UtentiDb db)
        {
            this.db = db;
        }
        public static List<Utente> dipendenti { get; set; } = new List<Utente>();
        public static List<Progetto> progetti { get; set; } = new List<Progetto>();
        public static List<Messaggio> messaggi { get; set; } = new List<Messaggio>();

        public void Config()
        {
            ProgramManager.dipendenti = db.dipendenti.ToList();
            ProgramManager.progetti = db.progetti.ToList();
            ProgramManager.messaggi = db.messaggi.ToList();
        }
    }
}
