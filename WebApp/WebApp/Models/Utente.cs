namespace WebApp.Models
{
    public class Utente
    {
        public string? id { get;  set; }
        public string name { get; set; }
        public string password {  get; set; }
        public string email { get; set; }
        
        public Utente()
        {
            id = Guid.NewGuid().ToString();
        }
        
    }
}
