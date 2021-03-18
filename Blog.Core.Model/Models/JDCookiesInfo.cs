using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Models
{
    public class JDCookiesInfo : RootEntityTkey<int>
    {
        [SugarColumn(ColumnDataType = "nvarchar", Length = 200, IsNullable = true)]
        public string jJDUserName { get; set; }

        [SugarColumn(ColumnDataType = "nvarchar", Length = 200, IsNullable = true)]
        public string jJDCookie { get; set; }

        [SugarColumn(ColumnDataType = "nvarchar", Length = 200, IsNullable = true)]
        public string jDesc { get; set; }
        /// <summary>
        /// 创建ID
        /// </summary>
        [SugarColumn(IsNullable = true)]
        public int? jCreateId { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int jStatus { get; set; }
        /// <summary> 
        /// 修改时间
        /// </summary>
        public DateTime jUpdateTime { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public System.DateTime jCreateTime { get; set; }
    }
}
