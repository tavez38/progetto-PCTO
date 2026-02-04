namespace WebApp.Models
{
    public class Progetto
    {
        public string IdProprietario { get; private set; }
        public string idProg {  get; private set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateOnly scadenza { get; set; }
        public TimeOnly orarioScadenza { get; set; }

        public Progetto(string idProp, string title, string description, DateOnly scadenza, TimeOnly orarioScadenza) {
            this.IdProprietario = idProp;
            Random rnd = new Random();
            //TODO aggiungere funz che controlla id
            this.idProg ="P"+ rnd.Next(); 
            this.title = title;
            this.description = description;
            this.scadenza = scadenza;
            this.orarioScadenza = orarioScadenza;
        }
    }
}
