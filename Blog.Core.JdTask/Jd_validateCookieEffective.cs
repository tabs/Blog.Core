using Blog.Core.Common.Helper;
using Blog.Core.IServices;
using Blog.Core.Model.Models;
using Blog.Core.Tasks;
using Microsoft.AspNetCore.NodeServices;
using Quartz;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blog.Core.TaskJd
{
    public class Jd_validateCookieEffective : JobBase, IJob
    {
        private readonly INodeServices _nodeServices;
        private readonly IJDCookiesInfoServices _cookiesInfoServices;
        private readonly IJDLogsInfoServices _logsInfoServices;

        public Jd_validateCookieEffective(IJDCookiesInfoServices cookiesInfoServices, ITasksQzServices tasksQzServices, INodeServices nodeServices,
            IJDLogsInfoServices logsInfoServices)
        {
            _cookiesInfoServices = cookiesInfoServices;
            _logsInfoServices = logsInfoServices;
            _nodeServices = nodeServices;
            _tasksQzServices = tasksQzServices;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            var jobKey = context.JobDetail.Key;
            var jobId = jobKey.Name;
            var executeLog = await ExecuteJob(context, async () => await Run(context, jobId.ObjToInt()));
        }
        class retValue
        {
            public int id { get; set; }
            public string msg { get; set; }
            public string ck { get; set; }
        }
        public async Task Run(IJobExecutionContext context, int jobid)
        {
            try
            {

                var list = await _cookiesInfoServices.Query();
                List<Task<retValue>> tasks = new List<Task<retValue>>();
                if(list.Count != 0)
                {
                    foreach (var ck in list)
                    {
                        var task = _nodeServices.InvokeExportAsync<retValue>("./jdjs/index.js", "jdchkck", ck.Id, ck.jJDCookie);
                        tasks.Add(task);
                        
                    }
                    foreach (var t in tasks)
                    {
                        retValue ret = await t;
                        JDCookiesInfo cookieInfo = await _cookiesInfoServices.QueryById(ret.id);
                        if (ret.msg.Contains("失效"))
                        {
                            cookieInfo.jValidation = false;
                        }
                        else
                        {
                            cookieInfo.jValidation = true;
                        }
                        await _cookiesInfoServices.Update(cookieInfo);
                    }
                }
                if (jobid > 0)
                {
                    var model = await _tasksQzServices.QueryById(jobid);
                    if (model != null)
                    {
                        model.RunTimes += 1;
                        var separator = "<br>";
                        model.Remark =
                            $"【{DateTime.Now}】执行任务【Id：{context.JobDetail.Key.Name}，组别：{context.JobDetail.Key.Group}】【执行成功】:{separator}"
                            + string.Join(separator, StringHelper.GetTopDataBySeparator(model.Remark, separator, 9));

                        await _tasksQzServices.Update(model);
                    }

                }
                //retQrModel qrresult = await _nodeServices.InvokeExportAsync<retQrModel>("./jdjs/index.js", "getQrCode", 10);

                //Console.WriteLine(qrresult.qrUrl);
                //await Console.Out.WriteLineAsync(result);
                //RetCkModel ckresult = await _nodeServices.InvokeExportAsync<RetCkModel>("./jdjs/index.js", "getCookie");
                //await Console.Out.WriteLineAsync(ckresult.userId.ToString());

            }
            catch (Exception ex)
            {

                throw;
            }

        }
    }
}
