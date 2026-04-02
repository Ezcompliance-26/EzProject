using BAL;
using DAL;
using Newtonsoft.Json;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace EesassinErp.Controllers
{
    public class LoginController : Controller
    {
        public string CaptchaImage()
        {
            bool noisy = true;
            string base64;
            var rand = new Random((int)DateTime.Now.Ticks);
            //generate new question 
            int a = rand.Next(10, 99);
            int b = rand.Next(0, 9);
            var captcha = string.Format("{0} + {1} = ?", a, b);

            //store answer 
            Session["Captcha"] = a + b;

            //image stream 
            FileContentResult img = null;

            using (var mem = new MemoryStream())
            using (var bmp = new Bitmap(130, 30))
            using (var gfx = Graphics.FromImage((Image)bmp))
            {
                gfx.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
                gfx.SmoothingMode = SmoothingMode.AntiAlias;
                gfx.FillRectangle(Brushes.White, new Rectangle(0, 0, bmp.Width, bmp.Height));

                //add noise 
                if (noisy)
                {
                    int i, r, x, y;
                    var pen = new Pen(Color.Yellow);
                    for (i = 1; i < 10; i++)
                    {
                        pen.Color = Color.FromArgb(
                        (rand.Next(0, 255)),
                        (rand.Next(0, 255)),
                        (rand.Next(0, 255)));

                        r = rand.Next(0, (130 / 3));
                        x = rand.Next(0, 130);
                        y = rand.Next(0, 30);

                        gfx.DrawEllipse(pen, x - r, y - r, r, r);
                    }
                }

                //add question 
                gfx.DrawString(captcha, new Font("Tahoma", 15), Brushes.Gray, 2, 3);

                //render as Jpeg 
                bmp.Save(mem, System.Drawing.Imaging.ImageFormat.Jpeg);
                img = this.File(mem.GetBuffer(), "image/Jpeg");
                base64 = Convert.ToBase64String(mem.ToArray());
            }
            return "data:image/jpeg;base64," + base64;
        }
        // GET: Login
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Login1()
        {
            return View();
        }

        public ActionResult forget()
        {
            return View();
        }
        public ActionResult Welcome()
        {
            return View();
        }
        public ActionResult ClearCookies()
        {
            if (Request.Cookies != null)
            {
                foreach (var cookieKey in Request.Cookies.AllKeys)
                {
                    HttpCookie cookie = new HttpCookie(cookieKey)
                    {
                        Expires = DateTime.Now.AddDays(-1), // Expire the cookie
                        Value = null
                    };
                    Response.Cookies.Add(cookie);
                }
            }

            return Json(new { success = true, message = "All cookies cleared!" });
        }

        public async Task<string> SendGeneralSMS(SMSBAL obj)
        {

            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DLL.dll.SendGeneralSMS(obj)));
            return result;
        }



        //public async Task<string> GetUserId(LoginBAL obj)
        //{
        //    if (Session["Captcha"] == null) return "0";
        //    if (obj.Captcha == Session["Captcha"].ToString())
        //    {
        //        string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DLL.dll.LoginVerify(obj)));
        //        return result;
        //    }
        //    else
        //    {
        //        return "89";
        //    }
        //}

        public async Task<string> GetUserId(LoginBAL obj)
        {
            // Step 1: Captcha check
            if (Session["Captcha"] == null)
                return "0";

            if (obj.Captcha != Session["Captcha"].ToString())
                return "89";
          
       
        
            // Step 3: Fetch user by username
            var dt = DLL.dll.GetUserByUserName(obj.UserName);
            if (dt == null || dt.Rows.Count == 0)
                return JsonConvert.SerializeObject(new object[0]); // no user

            string storedHash = dt.Rows[0]["PasswordHash"]?.ToString() ?? "";

            bool isHashed = storedHash.StartsWith("$2a$") || storedHash.StartsWith("$2b$") || storedHash.StartsWith("$2y$");

            if (isHashed)
            {
                // Case 1: Hashed password in DB
                if (!PasswordHelper.VerifyPassword(obj.Password, storedHash))
                    return "-1";// JsonConvert.SerializeObject(new object[0]); // invalid password
            }
            else
            {
                // Case 2: Plain password in DB
                if (storedHash != obj.Password)
                    return "-1";//   return JsonConvert.SerializeObject(new object[0]); // invalid password

                // Update DB with hashed password
                string newHash = PasswordHelper.HashPassword(obj.Password);
                SqlDBHelper.SqlHelper.UpdateUserPasswordHash(Convert.ToInt32(dt.Rows[0]["LoginId"]), newHash);

                storedHash = newHash;
            }
            // Step 2: Call LoginVerify
            obj.Password = storedHash;
            var dt1 = DLL.dll.LoginVerify(obj);
            if (dt1 == null || dt1.Rows.Count == 0)
                return JsonConvert.SerializeObject(new object[0]); // no user

            string loginVerifyCode = dt1.Rows[0][0].ToString(); // Assuming first col has code
            if (loginVerifyCode == "-11" || loginVerifyCode == "-1")
                return loginVerifyCode; // directly return error code


            // Step 4: Prepare safe response
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
                SessionId = dt1.Rows[0]["SessionId"],
                EmailId = dt.Rows[0]["EmailId"]
            };

            return JsonConvert.SerializeObject(new[] { user });
        }



        public async Task<string> chkUserId(LoginBAL obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DLL.dll.LoginVerify(obj)));
            return result;

        }
        public async Task<string> UrlAccessPermission(BCommon obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DLL.dll.GetUrlAccessPermission(obj)));
            return result;
        }
        public async Task<string> GetModulePermission(BCommon obj)
        {
            string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DLL.dll.GetModulePermission(obj)));
            return result;
        }

    }
}