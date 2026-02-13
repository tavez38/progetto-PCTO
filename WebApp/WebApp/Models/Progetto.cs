using Microsoft.Extensions.Primitives;
using System.Text.Json.Serialization;

namespace WebApp.Models
{
    public class Progetto
    {
        
        public string? id { get;  set; }
        public string? IdProprietario { get;  set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateOnly scadenza { get; set; }
        public TimeOnly orarioScadenza { get; set; }

        public Progetto() {
            id = Guid.NewGuid().ToString();
        }
    }
}
