using Blog.Core.Common.Helper;
using Blog.Core.Common.HttpContextUser;
using Blog.Core.Hubs;
using Blog.Core.IServices;
using Blog.Core.Model;
using Blog.Core.Model.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Drawing.Imaging;
using System.IO;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Blog.Core.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Permissions.Name)]

    
    public class JDCookiesInfoController : Controller
    {
        public class retQrModel
        {
            public string qrUrl { get; set; }
            public int userId { get; set; }
        }
        public class retCkModel
        {
            public string ck { get; set; }
            public string userName { get; set; }
            public int userId { get; set; }
            public string desc { get; set; }
        }


        /// <summary>
        /// 服务器接口，因为是模板生成，所以首字母是大写的，自己可以重构下
        /// </summary>
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IJDCookiesInfoServices _jDCookiesInfoServices;
        private readonly INodeServices _nodeServices;
        private readonly IQRCode _iQRCode;
        private readonly IUser _user;

        public JDCookiesInfoController(IHubContext<ChatHub> hubContext,IJDCookiesInfoServices JDCookiesInfoServices, INodeServices nodeServices, IQRCode iQRCode, IUser user)
        {
            _hubContext = hubContext;
            _jDCookiesInfoServices = JDCookiesInfoServices;
            _nodeServices = nodeServices;
            _iQRCode = iQRCode;
            _user = user;
        }

        [HttpGet]
        public async Task<MessageModel<PageModel<JDCookiesInfo>>> Get(int page = 1, string key = "", int intPageSize = 50)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrWhiteSpace(key))
            {
                key = "";
            }

            Expression<Func<JDCookiesInfo, bool>> whereExpression = n => n.jCreateId == _user.ID;

            return new MessageModel<PageModel<JDCookiesInfo>>()
            {
                msg = "获取成功",
                success = true,
                response = await _jDCookiesInfoServices.QueryPage(whereExpression, page, intPageSize)
            };

        }

        [HttpGet("{id}")]
        public async Task<MessageModel<JDCookiesInfo>> Get(string id)
        {
            return new MessageModel<JDCookiesInfo>()
            {
                msg = "获取成功",
                success = true,
                response = await _jDCookiesInfoServices.QueryById(id)
            };
        }

        [HttpPost]
        public async Task<MessageModel<string>> Post([FromBody] JDCookiesInfo request)
        {
            var data = new MessageModel<string>();

            var id = await _jDCookiesInfoServices.Add(request);
            if (data.success)
            {
                data.response = id.ObjToString();
                data.msg = "添加成功";
            }

            return data;
        }

        [HttpPut]
        public async Task<MessageModel<string>> Put([FromBody] JDCookiesInfo request)
        {
            var data = new MessageModel<string>();
            data.success = await _jDCookiesInfoServices.Update(request);
            if (data.success)
            {
                data.msg = "更新成功";
                data.response = request?.Id.ObjToString();
            }

            return data;
        }

        [HttpDelete("{id}")]
        public async Task<MessageModel<string>> Delete(string id)
        {
            var data = new MessageModel<string>();
            data.success = await _jDCookiesInfoServices.DeleteById(id);
            if (data.success)
            {
                data.msg = "删除成功";
                data.response = id;
            }

            return data;
        }

        /// <summary>
        /// 获取二维码
        /// </summary>
        /// <returns></returns>
        [HttpGet("/api/JDCookiesInfo/qrcode")]
        public async Task GetQRCode()
        {
            Response.ContentType = "image/jpeg";
            retQrModel qrresult = await _nodeServices.InvokeExportAsync<retQrModel>("./jdjs/index.js", "getQrCode", _user.ID);
            Task<retCkModel> ckTask = _nodeServices.InvokeExportAsync<retCkModel>("./jdjs/index.js", "getCookie");
            ckTask.GetAwaiter().OnCompleted(async () =>
            {
                if(!ckTask.IsFaulted)
                {
                    var result = ckTask.Result;
                    if (!string.IsNullOrEmpty(result.ck))
                    {
                        var resultck = await _jDCookiesInfoServices.Query(n => n.jJDUserName == result.userName);
                        if (resultck.Count > 0)
                        {
                            var cookiesInfo = resultck[0];
                            cookiesInfo.jUpdateTime = DateTime.Now;
                            cookiesInfo.jJDCookie = result.ck;
                            cookiesInfo.jCreateId = result.userId;
                            cookiesInfo.jDesc = result.desc;
                            await _jDCookiesInfoServices.Update(cookiesInfo);
                        }
                        else
                        {
                            JDCookiesInfo cookiesInfo = new JDCookiesInfo();
                            cookiesInfo.jCreateTime = DateTime.Now;
                            cookiesInfo.jUpdateTime = DateTime.Now;
                            cookiesInfo.jJDCookie = result.ck;
                            cookiesInfo.jDesc = result.desc;
                            cookiesInfo.jJDUserName = result.userName;
                            cookiesInfo.jStatus = 0;
                            cookiesInfo.jCreateId = result.userId;
                            await _jDCookiesInfoServices.Add(cookiesInfo);
                        }
                        _hubContext.Clients.All.SendAsync("ReceiveMessage", result.userId, JsonHelper.GetJSON<retCkModel>(result)).Wait();
                    }
                    else
                    {
                        _hubContext.Clients.All.SendAsync("ReceiveMessage", result.userId, JsonHelper.GetJSON<retCkModel>(result)).Wait();
                    }
                }
            });
            var bitmap = _iQRCode.GetQRCode(qrresult.qrUrl, 4);
            MemoryStream ms = new MemoryStream();
            bitmap.Save(ms, ImageFormat.Jpeg);
            await Response.Body.WriteAsync(ms.GetBuffer(), 0, Convert.ToInt32(ms.Length));
        }
        /// <summary>
        /// 获取ck
        /// </summary>
        /// <returns></returns>
        [HttpGet("/api/JDCookiesInfo/GetJDCk")]
        public async Task<MessageModel<retCkModel>> GetJdCk()
        {
            
            retCkModel ckresult = await _nodeServices.InvokeExportAsync<retCkModel>("./jdjs/index.js", "getCookie");
            var data = new MessageModel<retCkModel>();
            data.success = ckresult.userId > 0;
            if (data.success)
            {
                data.response = ckresult;
                data.msg = "获取成功";
            }
            else
            {
                data.msg = ckresult.desc;
            }
            return data;
        }

        
    }
}