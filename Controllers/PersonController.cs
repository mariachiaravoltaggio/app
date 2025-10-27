using Microsoft.AspNetCore.Mvc;

namespace GestionaleCN.Controllers;

[Route("api/[controller]")]
[ApiController]

public class PersonController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
