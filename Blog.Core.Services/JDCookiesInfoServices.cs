
using Blog.Core.IServices;
using Blog.Core.Model.Models;
using Blog.Core.Services.BASE;
using Blog.Core.IRepository.Base;

namespace Blog.Core.Services
{
    public class JDCookiesInfoServices : BaseServices<JDCookiesInfo>, IJDCookiesInfoServices
    {
        private readonly IBaseRepository<JDCookiesInfo> _dal;
        public JDCookiesInfoServices(IBaseRepository<JDCookiesInfo> dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }
    }
}