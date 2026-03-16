using BAL;
using DAL;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace EesassinErp.Controllers
{
    public class LoginApiController : ApiController
    {
        [HttpPost]
        [Route("Api/LoginApi/SendGeneralSMS")]
        public async Task<IHttpActionResult> SendGeneralSMS(SMSBAL obj)
        {

            string result = await Task.Run(() => DLL.dll.SendGeneralSMS(obj));
            return Json(result);
        }
        //[Route("Api/LoginApi/GetUserId")]
        //[HttpPost]
        //public async Task<IHttpActionResult> GetUserId(LoginBAL obj)
        //{
        //    var result = await Task.Run(() => DLL.dll.LoginVerify(obj));
        //    return Json(result); // This will return plain JSON.
        //}


        [HttpPost]
        [Route("Api/LoginApi/GetUserId")]
        public async Task<IHttpActionResult>GetUserId(LoginBAL obj)
        {
            // Step 1: Fetch user by username
            var dt = DLL.dll.GetUserByUserName(obj.UserName);
            if (dt == null || dt.Rows.Count == 0)
                return Ok(new object[0]); // no user

            string storedHash = dt.Rows[0]["PasswordHash"]?.ToString() ?? "";

            bool isHashed = storedHash.StartsWith("$2a$") || storedHash.StartsWith("$2b$") || storedHash.StartsWith("$2y$");

            if (isHashed)
            {
                // Case 1: Hashed password in DB
                if (!PasswordHelper.VerifyPassword(obj.Password, storedHash))
                    return Ok("-1"); // invalid password
            }
            else
            {
                // Case 2: Plain password in DB
                if (storedHash != obj.Password)
                    return Ok("-1"); // invalid password

                // Update DB with hashed password
                string newHash = PasswordHelper.HashPassword(obj.Password);
                SqlDBHelper.SqlHelper.UpdateUserPasswordHash(Convert.ToInt32(dt.Rows[0]["LoginId"]), newHash);

                storedHash = newHash;
            }

            // Step 2: Call LoginVerify
            obj.Password = storedHash;
            var dt1 = DLL.dll.LoginVerify(obj);
            if (dt1 == null || dt1.Rows.Count == 0)
                return Ok(new object[0]); // no user

            string loginVerifyCode = dt1.Rows[0][0].ToString(); // Assuming first col has code
            if (loginVerifyCode == "-11" || loginVerifyCode == "-1")
                return Ok(loginVerifyCode); // directly return error code

            // Step 3: Prepare safe response
            var user = new
            {
                LoginId = dt.Rows[0]["LoginId"],
                LastLogin = dt.Rows[0]["LastLogin"],
                CurrentLogin = dt.Rows[0]["CurrentLogin"],
                LoginType = dt.Rows[0]["LoginType"],
                BranchCode = dt.Rows[0]["BranchCode"],
                Name = dt.Rows[0]["Name"],
                BranchName = dt.Rows[0]["BranchName"],
                ContactNo = dt.Rows[0]["ContactNo"],
                Desig = dt.Rows[0]["Desig"],
                CreatedOn = dt.Rows[0]["CreatedOn"],
                BranchAddress = dt.Rows[0]["BranchAddress"],
                MapId = dt.Rows[0]["MapId"],
                MapUser = dt.Rows[0]["MapUser"],
                Photo = dt.Rows[0]["Photo"],
                UserName = dt.Rows[0]["UserName"],
                SessionId = dt.Rows[0]["SessionId"],
                EmailId = dt.Rows[0]["EmailId"]
            };

            return Ok(new[] { user });
        }




        [HttpPost]
        [Route("Api/LoginApi/chkUserId")]
        public async Task<IHttpActionResult> chkUserId(LoginBAL obj)
        {
            var result = await Task.Run(() => DLL.dll.LoginVerify(obj));
            return Json(result); // This will return plain JSON. 
        }

        [HttpPost]
        public async Task<string> UrlAccessPermission(BCommon obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DLL.dll.GetUrlAccessPermission(obj)));
            return result;
        }

    }
}