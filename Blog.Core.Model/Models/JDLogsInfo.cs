using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Models
{
    public class JDLogsInfo : RootEntityTkey<int>
    {

        [SugarColumn(ColumnDataType = "nvarchar", Length = 2000, IsNullable = true)]
        public string JDetail { get; set; }

        [SugarColumn(ColumnDataType = "nvarchar", Length = 2000, IsNullable = true)]
        public string jDesc { get; set; }
        /// <summary>
        /// 京东账户表主键ID
        /// </summary>
        [SugarColumn(IsNullable = true)]
        public int? jId { get; set; }

        [SugarColumn(IsNullable = true)]
        public bool JIsSendNotify { get; set; }

        [SugarColumn(IsNullable = true)]
        public bool JIsDelete { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime jCreateTime { get; set; }

        [SugarColumn(IsIgnore = true)]
        public JDCookiesInfo JCkInfo { get; set; }
    }
}
