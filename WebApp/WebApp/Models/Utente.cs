namespace WebApp.Models
{
    public class Utente
    {
        public string id { get; private set; }
        public string name { get; set; }
        public string password {  get; set; }
        public string email { get; set; }
        
        public Utente()
        {
            id = GenerateId();
        }
        public Utente(string name, string password, string email) {
            Random  rnd = new Random();
            //TODO
            //aggiungere funz per check id exist
            id = GenerateId();
            this.name = name;
        }
        
        private static string GenerateId()
        {
            Random rnd = new Random();
            return "D"+ rnd.Next();
        }
    }
}
