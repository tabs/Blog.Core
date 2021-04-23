using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Models
{
    ///<summary>
    ///
    ///</summary>
    [SugarTable("JDCookiesInfo", "WMBLOG_MSSQL_1")]
    public class JDCookiesInfo : RootEntityTkey<int>
    {
        public JDCookiesInfo()
        {
        }
        /// <summary>
        /// Desc:用户名
        /// Default:
        /// Nullable:False
        /// </summary>
        [SugarColumn(ColumnDataType = "nvarchar", Length = 200, IsNullable = true)]
        public string jJDUserName { get; set; }
        /// <summary>
        /// Desc:cookie
        /// Default:
        /// Nullable:False
        /// </summary>
        [SugarColumn(ColumnDataType = "nvarchar", Length = 200, IsNullable = true)]
        public string jJDCookie { get; set; }
        /// <summary>
        /// Desc:描述信息
        /// Default:
        /// Nullable:True
        /// </summary>
        public string jDesc { get; set; }
        /// <summary>
        /// Desc:创建人
        /// Default:
        /// Nullable:False
        /// </summary>
        public int jCreateId { get; set; }
        /// <summary>
        /// Desc:状态
        /// Default:
        /// Nullable:True
        /// </summary>
        public int? jStatus { get; set; }
        /// <summary>
        /// Desc:更新时间
        /// Default:
        /// Nullable:True
        /// </summary>
        public DateTime? jUpdateTime { get; set; }
        /// <summary>
        /// Desc:创建时间
        /// Default:
        /// Nullable:True
        /// </summary>
        public DateTime? jCreateTime { get; set; }
        /// <summary>
        /// Desc:备注信息
        /// Default:
        /// Nullable:True
        /// </summary>
        public string jRemark { get; set; }
        /// <summary>
        /// Desc:手机号
        /// Default:
        /// Nullable:True
        /// </summary>
        public string jPhone { get; set; }
    }

}
