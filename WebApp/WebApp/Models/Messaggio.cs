namespace WebApp.Models
{
    public class Messaggio
    {
        public int? Id { get; set; }
        public string titolo { get; set; }
        public string contenuto { get; set; }
        public DateTime dataInvio { get; set; }
        public string mittente { get; set; } //mail
        public string destinatario { get; set; } //mail

        public Messaggio()
        {
            Id= GenerateId();
        }
        private static int GenerateId()
        {
            Random rnd = new Random();
            return  rnd.Next();
        }
    }
}
