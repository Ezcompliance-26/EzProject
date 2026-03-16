using System.Web.Mvc;

namespace EesassinErp.Controllers
{
    [ValidateSession]
    public class ComplianceController : Controller
    {
        // GET: Compliance
        public ActionResult ComplianceMaster()
        {
            return View();
        }
    }
}