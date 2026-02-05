namespace WebApp.Models
{
    public class ProgramManager
    {
        public static List<Utente> dipendenti { get; set; } = new List<Utente>();
        public static List<Progetto> progetti { get; set; } = new List<Progetto>();
        public static List<Messaggio> messaggi { get; set; } = new List<Messaggio>();
    }
}
