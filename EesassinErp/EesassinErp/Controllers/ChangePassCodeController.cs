using BAL;
using DAL;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace EesassinErp.Controllers
{
    [ValidateSession]
    public class ChangePassCodeController : Controller
    {
        // GET: ChangePassCode
        public ActionResult ChangePassCode()
        {
            return View();
        }

        //public async Task<string> UploadPhoto(LoginBAL obj)
        //{
        //    if (!string.IsNullOrEmpty(obj.Photo))
        //    {
        //        if (obj.Photo.Contains("data:image/"))
        //        {
        //            obj.Photo = Regex.Replace(obj.Photo, @"^data:image\/[a-zA-Z]+;base64,", string.Empty);
        //            string NewFileName = "";
        //            string strPassword = Guid.NewGuid().ToString("N").Substring(0, 4);
        //            NewFileName += strPassword;
        //            NewFileName += DateTime.Now.Year.ToString();
        //            NewFileName += DateTime.Now.Month.ToString();
        //            NewFileName += DateTime.Now.Day.ToString();
        //            NewFileName += DateTime.Now.Hour.ToString();
        //            NewFileName += DateTime.Now.Minute.ToString();
        //            NewFileName += DateTime.Now.Second.ToString();
        //            NewFileName += DateTime.Now.Millisecond.ToString();
        //            byte[] data = Convert.FromBase64String(obj.Photo);
        //            var imageStream = new MemoryStream(data, false);
        //            string extention = ".jpeg";
        //            string uploadpath = "../DownloadMat/ProfilePhoto/" + NewFileName + extention;
        //            string filePath = System.Web.HttpContext.Current.Server.MapPath(uploadpath);
        //            FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
        //            imageStream.WriteTo(file);
        //            file.Close();
        //            imageStream.Close();
        //            obj.Photo = uploadpath;
        //        }
        //    }
        //    string result = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(DAL.DLL.dll.UploadPhoto(obj)));
        //    return result;
        //}
        public async Task<JsonResult> UploadPhoto(LoginBAL obj)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(obj.Photo))
                    return Json(new { Result = "Invalid Image" }, JsonRequestBehavior.AllowGet);

                if (!obj.Photo.StartsWith("data:image/"))
                    return Json(new { Result = "Invalid Format" }, JsonRequestBehavior.AllowGet);

                string base64 = Regex.Replace(obj.Photo, @"^data:image\/[a-zA-Z]+;base64,", "");
                byte[] bytes = Convert.FromBase64String(base64);

                if (bytes.Length > 2 * 1024 * 1024)
                    return Json(new { Result = "Image must be less than 2MB" }, JsonRequestBehavior.AllowGet);

                using (var ms = new MemoryStream(bytes))
                using (var img = System.Drawing.Image.FromStream(ms))
                {
                    if (img.Width > 2000 || img.Height > 2000)
                        return Json(new { Result = "Max dimension allowed 2000x2000" }, JsonRequestBehavior.AllowGet);

                    string fileName = Guid.NewGuid() + ".jpg";
                    string relativePath = "/DownloadMat/ProfilePhoto/" + fileName;
                    string fullPath = Server.MapPath("~" + relativePath);

                    img.Save(fullPath, System.Drawing.Imaging.ImageFormat.Jpeg);

                    obj.Photo = relativePath;
                }

                await Task.Run(() => DAL.DLL.dll.UploadPhoto(obj));

                return Json(new { Result = "2" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { Result = "Invalid Image Data" }, JsonRequestBehavior.AllowGet);
            }
        }
        public async Task<string>checkPassCode(LoginBAL obj)
        { 
            var dt = DLL.dll.GetUserByUserName(obj.UserName);
            if (dt == null || dt.Rows.Count == 0)
                return "-2"; // user not found

            string storedHash = dt.Rows[0]["PasswordHash"]?.ToString() ?? "";

            bool isValid = false;

            // 2️⃣ Hash verify
            if (storedHash.StartsWith("$2"))
            {
                isValid = PasswordHelper.VerifyPassword(obj.OldPassword, storedHash);
            }
            else
            {
                // legacy plain password support
                isValid = storedHash == obj.Password;

                // optional: upgrade to hash
                if (isValid)
                {
                    string newHash = PasswordHelper.HashPassword(obj.Password);
                    SqlDBHelper.SqlHelper.UpdateUserPasswordHash(
                        Convert.ToInt32(dt.Rows[0]["LoginId"]),
                        newHash
                    );
                }
            }

            if (!isValid)
                return "-1"; // invalid password

            // 3️⃣ Success
            return "1";
        }


        public async Task<JsonResult> ModifyPassCode(LoginBAL obj)
        {
            if (obj.NewPassword == obj.OldPassword)
            {
                return Json(new
                {
                    Result = "New password cannot be same as current password."
                }, JsonRequestBehavior.AllowGet);
            } 

            var data = await Task.Factory.StartNew(() => DAL.DLL.dll.ModifyPassCode(obj));

            return Json(new
            {
                Result = data.Result
            }, JsonRequestBehavior.AllowGet);
        }
    }
}