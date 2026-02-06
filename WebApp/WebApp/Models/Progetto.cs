using Microsoft.Extensions.Primitives;
using System.Text.Json.Serialization;

namespace WebApp.Models
{
    public class Progetto
    {
        [JsonIgnore]
        public string? id { get;  set; }

        [JsonIgnore]
        public string? IdProprietario { get;  set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateOnly scadenza { get; set; }
        public TimeOnly orarioScadenza { get; set; }

        public Progetto() {
            this.id = generateId();
        }

        private string generateId()
        {
            Random rnd = new Random();
            return "P" + rnd.Next();
        }
    }
}
