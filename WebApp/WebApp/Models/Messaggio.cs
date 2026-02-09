using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApp.Models
{
    public class Messaggio
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }


        public string titolo { get; set; }
        public string contenuto { get; set; }
        public DateTime dataInvio { get; set; }
        
        public string destinatario { get; set; } //mail

        public string? mittente { get; set; } //mail
        public Messaggio()
        {
            
        }
       
    }
}
