namespace WebApp.Models
{
    public class Progetto
    {
        public string IdProprietario { get; private set; }
        public string id { get; private set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateOnly scadenza { get; set; }
        public TimeOnly orarioScadenza { get; set; }

        public Progetto() {
            this.id = generateId();
        }

        public Progetto(string idProp, string title, string description, DateOnly scadenza, TimeOnly orarioScadenza)
        {
            this.IdProprietario = idProp;
            //TODO aggiungere funz che controlla id
            this.id = generateId();
            this.title = title;
            this.description = description;
            this.scadenza = scadenza;
            this.orarioScadenza = orarioScadenza;
        }

        private string generateId()
        {
            Random rnd = new Random();
            return "P" + rnd.Next();
        }
    }
}
