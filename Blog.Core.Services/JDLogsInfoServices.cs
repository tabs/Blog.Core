
using Blog.Core.IServices;
using Blog.Core.Model.Models;
using Blog.Core.Services.BASE;
using Blog.Core.IRepository.Base;

namespace Blog.Core.Services
{
    public class JDLogsInfoServices : BaseServices<JDLogsInfo>, IJDLogsInfoServices
    {
        private readonly IBaseRepository<JDLogsInfo> _dal;
        public JDLogsInfoServices(IBaseRepository<JDLogsInfo> dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }
    }
}