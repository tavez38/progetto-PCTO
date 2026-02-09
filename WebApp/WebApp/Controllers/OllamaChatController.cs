using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OllamaSharp;
using System.Threading.Tasks;
namespace WebApp.Controllers
{
    [Authorize]
    [Route("/api/ollama")]
    [ApiController]
    public class OllamaChatController : ControllerBase
    {
        private readonly OllamaApiClient _ollama;
        public OllamaChatController()
        {
            _ollama = new OllamaApiClient("http://localhost:11434");
            _ollama.SelectedModel= "llama3";
        }

        [HttpPost]
        [Route("/api/ollama/sendOllamaReq")]
        public async Task<IActionResult> SendOllamaReq([FromBody] string request)
        {
            try
            {
                var rispostaCompleta = "";
                await foreach (var risposta in _ollama.GenerateAsync(request))
                {
                    rispostaCompleta += risposta.Response;
                }
                return Ok(new { response = rispostaCompleta });
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }
    }
}
