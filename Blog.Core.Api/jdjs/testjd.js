var httpUtils = require("./nobyda")
function jdfuc() {
  const JingDongBean = ((ck) => {
    return new Promise((resolve, reject) => {
      const JDBUrl = {
        url: 'https://api.m.jd.com/client.action',
        headers: {
          Cookie: ck
        },
        body: 'functionId=signBeanIndex&appid=ld'
      };
      httpUtils.nobyda.post(JDBUrl, function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            const Details = "response:\n" + data;
            if (cc.code == 3) {
              resolve("\n" + "京东商城-京豆Cookie失效 ")
            } else if (data.match(/跳转至拼图/)) {
              resolve("京东商城-京豆: 失败, 需要拼图验证 ⚠️")
            } else if (data.match(/\"status\":\"?1\"?/)) {
              resolve("\n" + "京东商城-京豆签到成功 " + Details)
              if (data.match(/dailyAward/)) {
                resolve("京东商城-京豆: 成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 🐶");
              } else if (data.match(/continuityAward/)) {
                resolve("京东商城-京豆: 成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 🐶");
              } else if (data.match(/新人签到/)) {
                const quantity = data.match(/beanCount\":\"(\d+)\".+今天/)
                resolve("京东商城-京豆: 成功, 明细: " + (quantity ? quantity[1] : "无") + "京豆 🐶");
              } else {
                resolve("京东商城-京豆: 成功, 明细: 无京豆 🐶");
              }
            } else {
              if (data.match(/(已签到|新人签到)/)) {
                resolve("京东商城-京豆: 失败, 原因: 已签过 ⚠️");
              } else if (data.match(/人数较多|S101/)) {
                resolve("京东商城-京豆: 失败, 签到人数较多 ⚠️");
              } else {
                resolve("京东商城-京豆: 失败, 原因: 未知 ⚠️");
              }
            }
          }
        } catch (eor) {
          reject("出错");
          // $nobyda.AnError("京东商城-京豆", "JDBean", eor, response, data)
        } finally {
          resolve("finally");
        }
      })
    });
  });
  const JingDongStore = ((ck) => {
    return new Promise((resolve, reject)=> {
      httpUtils.nobyda.get({
        url: 'https://api.m.jd.com/api?appid=jdsupermarket&functionId=smtg_sign&clientVersion=8.0.0&client=m&body=%7B%7D',
        headers: {
          Cookie: ck,
          Origin: `https://jdsupermarket.jd.com`
        }
      }, (error, response, data) => {
        try {
          if (error) throw new Error(error);
          const cc = JSON.parse(data);
          if (cc.data && cc.data.success === true && cc.data.bizCode === 0) {
            resolve(`京东商城-超市: 成功🐶`);
          } else {
            if (!cc.data) cc.data = {}
            const tp = cc.data.bizCode == 811 ? `已签过` : cc.data.bizCode == 300 ? `Cookie失效` : `${cc.data.bizMsg || `未知`}`
            resolve(`京东商城-超市: 失败, 原因: ${tp}${cc.data.bizCode == 300 ? `‼️` : ` ⚠️`}`)
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东商城-超市", "JDGStore", eor, response, data);
          reject(eor);
        } finally {
          resolve()
        }
      })
    });
  });
  return {
    JingDongBean,
    JingDongStore
  }
}


exports.jdfuc = new jdfuc();