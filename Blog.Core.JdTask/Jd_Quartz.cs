using Blog.Core.Common.Helper;
using Blog.Core.IServices;
using Blog.Core.Tasks;
using Microsoft.AspNetCore.NodeServices;
using Quartz;
using System;
using System.Threading.Tasks;

namespace Blog.Core.TaskJd
{
    public class Jd_Quartz : JobBase, IJob
    {
        private readonly INodeServices _nodeServices;
        private readonly IBlogArticleServices _blogArticleServices;


        public Jd_Quartz(IBlogArticleServices blogArticleServices, ITasksQzServices tasksQzServices, INodeServices nodeServices) : base(tasksQzServices)
        {
            _blogArticleServices = blogArticleServices;
            _nodeServices = nodeServices;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            var jobKey = context.JobDetail.Key;
            var jobId = jobKey.Name;
            var executeLog = await ExecuteJob(context, async () => await Run(context, jobId.ObjToInt()));
        }
        class retQrModel
        {
            public string qrUrl { get; set; }
            public int userId { get; set; }
        }

        class RetCkModel
        {
            public string ck { get; set; }
            public string userName { get; set; }
            public int userId { get; set; }
            public string desc { get; set; }
        }
        public async Task Run(IJobExecutionContext context, int jobid)
        {
            try
            {
                //string result = await _nodeServices.InvokeExportAsync<string>("./jdjs/index.js", "jdsign", "pt_key=AAJgNGWFADBm4Mq59IDGlbSSyymLJrlLDIjGGipr4q8dpbkJ8iWF2tr_TghsXkdlQI2I8zQIEpo;pt_pin=jd_624f191cc0540;");
                //await Console.Out.WriteLineAsync("jd" + result);

                retQrModel qrresult = await _nodeServices.InvokeExportAsync<retQrModel>("./jdjs/index.js", "getQrCode", 10);
                
                Console.WriteLine(qrresult.qrUrl);
                //await Console.Out.WriteLineAsync(result);
                RetCkModel ckresult = await _nodeServices.InvokeExportAsync<RetCkModel>("./jdjs/index.js", "getCookie");
                await Console.Out.WriteLineAsync(ckresult.userId.ToString());
                
            }
            catch (Exception ex)
            {

                throw;
            }

        }
    }
}
