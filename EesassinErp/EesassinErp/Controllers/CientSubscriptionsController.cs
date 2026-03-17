using System.Web.Mvc;

namespace EesassinErp.Controllers
{
    [ValidateSession]
    public class CientSubscriptionsController : Controller
    {
        public ActionResult CientSubscript()
        {
            return View();
        }

    }
}