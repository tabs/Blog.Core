﻿using System;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Blog.Core.Common.Helper;
using Blog.Core.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Core.Controllers
{
    /// <summary>
    /// 图片管理
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImgController : Controller
    {
        private IQRCode _iQRCode;

        public ImgController (IQRCode iQRCode)
        {
            _iQRCode = iQRCode;
        }

        /// <summary>
        /// 获取二维码
        /// </summary>
        /// <param name="url">存储内容</param>
        /// <param name="pixel">像素大小</param>
        /// <returns></returns>
        [HttpGet("/api/qrcode")]
        public async Task GetQRCode(string url, int pixel)
        {
            Response.ContentType = "image/jpeg";
            var bitmap = _iQRCode.GetQRCode(url, pixel);
            MemoryStream ms = new MemoryStream();
            bitmap.Save(ms, ImageFormat.Jpeg);
            await Response.Body.WriteAsync(ms.GetBuffer(), 0, Convert.ToInt32(ms.Length));
        }

        // GET: api/Download
        /// <summary>
        /// 下载图片（支持中文字符）
        /// </summary>
        /// <param name="environment"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("/images/Down/Pic")]
        public FileStreamResult DownImg([FromServices] IWebHostEnvironment environment)
        {
            string foldername = "";
            string filepath = Path.Combine(environment.WebRootPath, foldername, "测试下载中文名称的图片.png");
            var stream = System.IO.File.OpenRead(filepath);
            string fileExt = ".jpg";  // 这里可以写一个获取文件扩展名的方法，获取扩展名
            //获取文件的ContentType
            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            var memi = provider.Mappings[fileExt];
            var fileName = Path.GetFileName(filepath);


            return File(stream, memi, fileName);
        }

        /// <summary>
        /// 上传图片,多文件，可以使用 postman 测试，
        /// 如果是单文件，可以 参数写 IFormFile file1
        /// </summary>
        /// <param name="environment"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("/images/Upload/Pic")]
        public async Task<MessageModel<string>> InsertPicture([FromServices] IWebHostEnvironment environment)
        {
            var data = new MessageModel<string>();
            string path = string.Empty;
            string foldername = "images";
            IFormFileCollection files = null;


            // 获取提交的文件
            files = Request.Form.Files;
            // 获取附带的数据
            var max_ver = Request.Form["max_ver"].ObjToString();


            if (files == null || !files.Any()) { data.msg = "请选择上传的文件。"; return data; }
            //格式限制
            var allowType = new string[] { "image/jpg", "image/png", "image/jpeg" };

            string folderpath = Path.Combine(environment.WebRootPath, foldername);
            if (!Directory.Exists(folderpath))
            {
                Directory.CreateDirectory(folderpath);
            }

            if (files.Any(c => allowType.Contains(c.ContentType)))
            {
                if (files.Sum(c => c.Length) <= 1024 * 1024 * 4)
                {
                    //foreach (var file in files)
                    var file = files.FirstOrDefault();
                    string strpath = Path.Combine(foldername, DateTime.Now.ToString("MMddHHmmss") + Path.GetFileName(file.FileName));
                    path = Path.Combine(environment.WebRootPath, strpath);

                    using (var stream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                    {
                        await file.CopyToAsync(stream);
                    }

                    data = new MessageModel<string>()
                    {
                        response = strpath,
                        msg = "上传成功",
                        success = true,
                    };
                    return data;
                }
                else
                {
                    data.msg = "图片过大";
                    return data;
                }
            }
            else

            {
                data.msg = "图片格式错误";
                return data;
            }
        }



        [HttpGet]
        [Route("/images/Down/Bmd")]
        [AllowAnonymous]
        public FileStreamResult DownBmd([FromServices] IWebHostEnvironment environment, string filename)
        {
            if (string.IsNullOrEmpty(filename))
            {
                return null;
            }
            // 前端 blob 接收，具体查看前端admin代码
            string filepath = Path.Combine(environment.WebRootPath, Path.GetFileName(filename));
            if (System.IO.File.Exists(filepath))
            {
                var stream = System.IO.File.OpenRead(filepath);
                //string fileExt = ".bmd";
                //获取文件的ContentType
                var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
                //var memi = provider.Mappings[fileExt];
                var fileName = Path.GetFileName(filepath);

                HttpContext.Response.Headers.Add("fileName", fileName);

                return File(stream, "application/octet-stream", fileName);
            }
            else
            {
                return null;
            }
        }

        // POST: api/Img
        [HttpPost]
        public void Post([FromBody] object formdata)
        {
        }

        // PUT: api/Img/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

}
