using BAL;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace EesassinErp.Controllers
{
    [ValidateSession]
    public class PartyMasterController : Controller
    {
        public ActionResult PartyMast()
        {
            return View();
        }
        public async Task<string> GetPartyMasterDT(TblPartyMaster obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DAL.DLL.PartyMaster(obj)));
            return result;
        }


        public async Task<string> InsertUpdateDelPartyMaster(TblPartyMaster obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DAL.DLL.InsertUpdateDelPartyMaster(obj)));
            return result;
        }


        public ActionResult Location()
        {
            return View();
        }
        public async Task<string> GetSearchLocation(TblPartyMaster obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DAL.DLL.GetSearchLocation(obj)));
            return result;
        }


        public async Task<string> InsertUpdateDelLocation(TblPartyMaster obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DAL.DLL.InsertUpdateDelLocation(obj)));
            return result;
        }
    }
}