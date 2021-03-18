var httpUtils = require("./nobyda")

function jdsign() {
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
          // httpUtils.AnError("京东商城-京豆", "JDBean", eor, response, data)
        } finally {
          resolve("finally");
        }
      })
    });
  });
  const JingDongStore = ((ck) => {
    return new Promise((resolve, reject) => {
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
  const JingRongSteel = ((ck) => {
    return new Promise((resolve, reject) => {
      const JRSUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/hy/h5/m/signIn1',
        headers: {
          Cookie: ck
        },
        body: "reqData=%7B%22channelSource%22%3A%22JRAPP6.0%22%2C%22riskDeviceParam%22%3A%22%7B%7D%22%7D"
      };
      httpUtils.nobyda.post(JRSUrl, function (error, response, data) {
        try {
          if (error) throw new Error(error)
          const cc = JSON.parse(data)
          if (data.match(/\"resBusiCode\":0/)) {

            const leng = cc.resultData.resBusiData.actualTotalRewardsValue
            const spare = cc.resultData.resBusiData.baseReward
            var detail = leng ? leng > 9 ? `0.${leng}` : `0.0${leng}` : spare ? spare : 0
            resolve("\n" + `京东金融-钢镚签到成功 京东金融-钢镚: 成功, 明细: ${detail || `无`}钢镚 💰`)
          } else {
            if (data.match(/已经领取|\"resBusiCode\":15/)) {
              resolve("京东金融-钢镚: 失败, 原因: 已签过 ⚠️")
            } else if (data.match(/未实名/)) {
              resolve("京东金融-钢镚: 失败, 账号未实名 ⚠️")
            } else if (data.match(/(\"resultCode\":3|请先登录)/)) {
              resolve("京东金融-钢镚: 失败, 原因: Cookie失效‼️")
            } else {
              resolve("京东金融-钢镚: 失败, 原因: 未知 ⚠️")
            }
          }
        } catch (eor) {
          httpUtils.AnError("京东金融-钢镚", "JRSteel", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JingDongTurn = ((ck) => {
    return new Promise((resolve, reject) => {
      const JDTUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=wheelSurfIndex&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%7D&appid=ld',
        headers: {
          Cookie: ck,
        }
      };
      httpUtils.nobyda.get(JDTUrl, async function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data).data.lotteryCode
            if (cc) {
              console.log("\n" + "京东商城-转盘查询成功 ")
              return resolve(cc)
            } else {
              console.log("\n" + "京东商城-转盘查询失败 ")
            }
          }
        } catch (eor) {
          httpUtils.AnError("京东转盘-查询", "JDTurn", eor, response, data)
        } finally {
          reject()
        }
      })
    }).then(data => {
      return JingDongTurnSign(ck, data);
    }, () => {});
  });
  const JingDongTurnSign = ((ck, code) => {
    var desc, bean;
    return new Promise((resolve, reject) => {
      const JDTUrl = {
        url: `https://api.m.jd.com/client.action?functionId=lotteryDraw&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%2C%22lotteryCode%22%3A%22${code}%22%7D&appid=ld`,
        headers: {
          Cookie: ck,
        }
      };
      httpUtils.nobyda.get(JDTUrl, async function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            const also = desc ? true : false
            if (cc.code == 3) {
              desc = "京东商城-转盘: 失败, 原因: Cookie失效‼️"
              resolve(desc);
            } else if (data.match(/(\"T216\"|活动结束)/)) {
              desc = "京东商城-转盘: 失败, 原因: 活动结束 ⚠️"
              resolve(desc);
            } else if (data.match(/(京豆|\"910582\")/)) {
              console.log("\n" + "京东商城-转盘签到成功 ")
              bean += Number(cc.data.prizeSendNumber) || 0
              desc += `${also?`\n`:``}京东商城-转盘: ${also?`多次`:`成功`}, 明细: ${cc.data.prizeSendNumber||`无`}京豆 🐶`
              resolve(desc);
              if (cc.data.chances != "0") {
                await JingDongTurnSign(ck, code)
              }
            } else if (data.match(/未中奖/)) {
              desc += `${also?`\n`:``}京东商城-转盘: ${also?`多次`:`成功`}, 状态: 未中奖 🐶`
              resolve(desc);
              if (cc.data.chances != "0") {
                await JingDongTurnSign(ck, code)
              }
            } else {
              console.log("\n" + "京东商城-转盘签到失败 ")
              if (data.match(/(T215|次数为0)/)) {
                desc = "京东商城-转盘: 失败, 原因: 已转过 ⚠️"
                resolve(desc);
              } else if (data.match(/(T210|密码)/)) {
                desc = "京东商城-转盘: 失败, 原因: 无支付密码 ⚠️"
                resolve(desc);
              } else {
                desc += `${also?`\n`:``}京东商城-转盘: 失败, 原因: 未知 ⚠️${also?` (多次)`:``}`
                resolve(desc);
              }
            }
          }
        } catch (eor) {
          httpUtils.AnError("京东商城-转盘", "JDTurn", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    })
  });
  const JDFlashSale = ((ck) => {
    var bean = 0,
      desc = '';
    return new Promise(resolve => {
      const JDPETUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdSgin',
        headers: {
          Cookie: ck
        },
        body: "body=%7B%22version%22%3A%22v2%22%7D&client=apple&clientVersion=9.0.8&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=6768e2cf625427615dd89649dd367d41&st=1597248593305&sv=121"
      };
      httpUtils.nobyda.post(JDPETUrl, async function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            if (cc.result && cc.result.code == 0) {
              console.log("\n" + "京东商城-闪购签到成功 ")
              bean = cc.result.jdBeanNum || 0
              desc = "京东商城-闪购: 成功, 明细: " + (bean || "无") + "京豆 🐶"
              resolve(desc)
            } else {
              console.log("\n" + "京东商城-闪购签到失败 ")
              if (data.match(/(已签到|已领取|\"2005\")/)) {
                desc = "京东商城-闪购: 失败, 原因: 已签过 ⚠️"
                resolve(desc)
              } else if (data.match(/不存在|已结束|\"2008\"|\"3001\"/)) {
                await FlashSaleDivide(ck); //瓜分京豆
                return
              } else if (data.match(/(\"code\":\"3\"|\"1003\")/)) {
                desc = "京东商城-闪购: 失败, 原因: Cookie失效‼️"
                resolve(desc)
              } else {
                const msg = data.match(/\"msg\":\"([\u4e00-\u9fa5].+?)\"/)
                desc = `京东商城-闪购: 失败, ${msg ? msg[1] : `原因: 未知`} ⚠️`
                resolve(desc)
              }
            }
          }
        } catch (eor) {
          httpUtils.AnError("京东商城-闪购", "JDFSale", eor, response, data)
        } finally {
          resolve()
        }
      })
    })
  });
  const FlashSaleDivide = ((ck) => {
    var bean = 0,
      desc = '';
    return new Promise((resolve, reject) => {
      const Url = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdShare',
        headers: {
          Cookie: ck
        },
        body: "body=%7B%22version%22%3A%22v2%22%7D&client=apple&clientVersion=9.0.8&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=49baa3b3899b02bbf06cdf41fe191986&st=1597682588351&sv=111"
      };
      httpUtils.nobyda.post(Url, function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            if (cc.result.code == 0) {
              bean = cc.result.jdBeanNum || 0
              desc = "京东闪购-瓜分: 成功, 明细: " + (bean || "无") + "京豆 🐶"
              resolve(desc);
              console.log("\n" + "京东闪购-瓜分签到成功 ")
            } else {
              console.log("\n" + "京东闪购-瓜分签到失败 ")
              if (data.match(/已参与|已领取|\"2006\"/)) {
                desc = "京东闪购-瓜分: 失败, 原因: 已瓜分 ⚠️"
                resolve(desc);
              } else if (data.match(/不存在|已结束|未开始|\"2008\"|\"2012\"/)) {
                desc = "京东闪购-瓜分: 失败, 原因: 活动已结束 ⚠️"
                resolve(desc);
              } else if (data.match(/\"code\":\"1003\"|未获取/)) {
                desc = "京东闪购-瓜分: 失败, 原因: Cookie失效‼️"
                resolve(desc);
              } else {
                const msg = data.match(/\"msg\":\"([\u4e00-\u9fa5].+?)\"/)
                desc = `京东闪购-瓜分: 失败, ${msg ? msg[1] : `原因: 未知`} ⚠️`
                resolve(desc);
              }
            }
          }
        } catch (eor) {
          httpUtils.AnError("京东闪购-瓜分", "JDFSale", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JingDongCash = ((ck) => {
    var Cash, desc;
    return new Promise((resolve, reject) => {
      const JDCAUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=ccSignInNew',
        headers: {
          Cookie: ck
        },
        body: "body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22monitorSource%22%3A%22cc_sign_ios_index_config%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&scope=11&screen=1242%2A2208&sign=1cce8f76d53fc6093b45a466e93044da&st=1581084035269&sv=102"
      };
      httpUtils.nobyda.post(JDCAUrl, function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            if (cc.busiCode == "0") {
              console.log("\n" + "京东现金-红包签到成功 ")
              Cash = cc.result.signResult.signData.amount || 0
              desc = `京东现金-红包: 成功, 明细: ${Cash || `无`}红包 🧧`
              resolve(desc)
            } else {
              console.log("\n" + "京东现金-红包签到失败 ")
              if (data.match(/(\"busiCode\":\"1002\"|完成签到)/)) {
                desc = "京东现金-红包: 失败, 原因: 已签过 ⚠️"
                resolve(desc)
              } else if (data.match(/(不存在|已结束)/)) {
                desc = "京东现金-红包: 失败, 原因: 活动已结束 ⚠️"
                resolve(desc)
              } else if (data.match(/(\"busiCode\":\"3\"|未登录)/)) {
                desc = "京东现金-红包: 失败, 原因: Cookie失效‼️"
                resolve(desc)
              } else {
                desc = "京东现金-红包: 失败, 原因: 未知 ⚠️"
                resolve(desc)
              }
            }
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东现金-红包", "JDCash", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JDMagicCube = ((ck, sign) => {
    return new Promise((resolve, reject) => {
      const JDUrl = {
        url: `https://api.m.jd.com/client.action?functionId=getNewsInteractionInfo&appid=smfe${sign?`&body=${encodeURIComponent(`{"sign":${sign}}`)}`:``}`,
        headers: {
          Cookie: ck,
        }
      };
      httpUtils.nobyda.get(JDUrl, (error, response, data) => {
        try {
          if (error) throw new Error(error)
          console.log(`\n京东魔方-尝试查询活动(${sign})`)
          if (data.match(/\"interactionId\":\d+/)) {
            resolve({
              id: data.match(/\"interactionId\":(\d+)/)[1],
              sign: sign || null
            })
          } else if (data.match(/配置异常/) && sign) {
            return resolve(JDMagicCube(ck, sign == 2 ? 1 : null))
          } else {
            return resolve(null)
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东魔方-查询", "JDCube", eor, response, data)
          reject()
        }
      })
    }).then((data) => {
      return JDMagicCubeSign(ck, data)
    }, () => {});
  });
  const JDMagicCubeSign = ((ck, id) => {
    var bean, desc;
    return new Promise((resolve, reject) => {
      const JDMCUrl = {
        url: `https://api.m.jd.com/client.action?functionId=getNewsInteractionLotteryInfo&appid=smfe${id?`&body=${encodeURIComponent(`{${id.sign?`"sign":${id.sign},`:``}"interactionId":${id.id}}`)}`:``}`,
        headers: {
          Cookie: ck,
        }
      };
      httpUtils.nobyda.get(JDMCUrl, function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            if (data.match(/(\"name\":)/)) {
              console.log("\n" + "京东商城-魔方签到成功 ")
              if (data.match(/(\"name\":\"京豆\")/)) {
                bean = cc.result.lotteryInfo.quantity || 0
                desc = `京东商城-魔方: 成功, 明细: ${bean || `无`}京豆 🐶`
                resolve(desc)
              } else {
                desc = `京东商城-魔方: 成功, 明细: ${cc.result.lotteryInfo.name || `未知`} 🎉`
                resolve(desc)
              }
            } else {
              console.log("\n" + "京东商城-魔方签到失败 ")
              if (data.match(/(一闪而过|已签到|已领取)/)) {
                desc = "京东商城-魔方: 失败, 原因: 无机会 ⚠️"
                resolve(desc)
              } else if (data.match(/(不存在|已结束)/)) {
                desc = "京东商城-魔方: 失败, 原因: 活动已结束 ⚠️"
                resolve(desc)
              } else if (data.match(/(\"code\":3)/)) {
                desc = "京东商城-魔方: 失败, 原因: Cookie失效‼️"
                resolve(desc)
              } else {
                desc = "京东商城-魔方: 失败, 原因: 未知 ⚠️"
                resolve(desc)
              }
            }
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东商城-魔方", "JDCube", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JingDongGetCash = ((ck) => {
    var Money, desc;
    return new Promise((resolve, reject) => {
      const GetCashUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=cash_sign&body=%7B%22remind%22%3A0%2C%22inviteCode%22%3A%22%22%2C%22type%22%3A0%2C%22breakReward%22%3A0%7D&client=apple&clientVersion=9.0.8&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=7e2f8bcec13978a691567257af4fdce9&st=1596954745073&sv=111',
        headers: {
          Cookie: ck,
        }
      };
      httpUtils.nobyda.get(GetCashUrl, function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data);
            if (cc.data.success && cc.data.result) {
              console.log("\n" + "京东商城-现金签到成功 ")
              Money = cc.data.result.signCash || 0
              desc = `京东商城-现金: 成功, 明细: ${Money||`无`}现金 💰`
              resolve(desc)
            } else {
              console.log("\n" + "京东商城-现金签到失败 ")
              if (data.match(/\"bizCode\":201|已经签过/)) {
                desc = "京东商城-现金: 失败, 原因: 已签过 ⚠️"
                resolve(desc)
              } else if (data.match(/\"code\":300|退出登录/)) {
                desc = "京东商城-现金: 失败, 原因: Cookie失效‼️"
                resolve(desc)
              } else {
                desc = "京东商城-现金: 失败, 原因: 未知 ⚠️"
                resolve(desc)
              }
            }
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东商城-现金", "JDGetCash", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JingDongSubsidy = ((ck) => {
    var subsidy, desc;
    return new Promise((resolve, reject) => {
      const subsidyUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/uc/h5/m/signIn7',
        headers: {
          Referer: "https://active.jd.com/forever/cashback/index",
          Cookie: ck
        }
      };
      httpUtils.nobyda.get(subsidyUrl, function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            if (cc.resultCode == 0 && cc.resultData.data.thisAmount) {
              console.log("\n" + "京东商城-金贴签到成功 ")
              subsidy = cc.resultData.data.thisAmountStr
              desc = `京东商城-金贴: 成功, 明细: ${subsidy||`无`}金贴 💰`
              resolve(desc)
            } else {
              console.log("\n" + "京东商城-金贴签到失败 ")
              if (data.match(/已存在|"thisAmount":0/)) {
                desc = "京东商城-金贴: 失败, 原因: 已签过 ⚠️"
                resolve(desc)
              } else if (data.match(/请先登录/)) {
                desc = "京东商城-金贴: 失败, 原因: Cookie失效‼️"
                resolve(desc)
              } else {
                desc = "京东商城-金贴: 失败, 原因: 未知 ⚠️"
                resolve(desc)
              }
            }
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东商城-金贴", "subsidy", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JingDongShake = ((ck) => {
    var bean, desc;
    return new Promise((resolve, reject) => {
      const JDSh = {
        url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
        headers: {
          Cookie: ck,
        }
      };
      httpUtils.nobyda.get(JDSh, async function (error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            const also = desc ? true : false
            if (data.match(/prize/)) {
              console.log("\n" + "京东商城-摇一摇签到成功 ")
              if (cc.data.prizeBean) {
                bean += cc.data.prizeBean.count || 0
                desc += `${also?`\n`:``}京东商城-摇摇: ${also?`多次`:`成功`}, 明细: ${bean || `无`}京豆 🐶`
                resolve(desc)
              } else if (cc.data.prizeCoupon) {
                desc += `${also?`\n`:``}京东商城-摇摇: ${also?`多次, `:``}获得满${cc.data.prizeCoupon.quota}减${cc.data.prizeCoupon.discount}优惠券→ ${cc.data.prizeCoupon.limitStr}`
                resolve(desc)
              } else {
                desc += `${also?`\n`:``}京东商城-摇摇: 成功, 明细: 未知 ⚠️${also?` (多次)`:``}`
                resolve(desc)
              }
              if (cc.data.luckyBox.freeTimes != 0) {
                await JingDongShake(s)
              }
            } else {
              console.log("\n" + "京东商城-摇一摇签到失败 ")
              if (data.match(/true/)) {
                desc += `${also?`\n`:``}京东商城-摇摇: 成功, 明细: 无奖励 🐶${also?` (多次)`:``}`
                resolve(desc)
                if (cc.data.luckyBox.freeTimes != 0) {
                  await JingDongShake(s)
                }
              } else {
                if (data.match(/(无免费|8000005|9000005)/)) {
                  desc = "京东商城-摇摇: 失败, 原因: 已摇过 ⚠️"
                  resolve(desc)
                } else if (data.match(/(未登录|101)/)) {
                  desc = "京东商城-摇摇: 失败, 原因: Cookie失效‼️"
                  resolve(desc)
                } else {
                  desc += `${also?`\n`:``}京东商城-摇摇: 失败, 原因: 未知 ⚠️${also?` (多次)`:``}`
                  resolve(desc)
                }
              }
            }
          }
        } catch (eor) {
          httpUtils.nobyda.AnError("京东商城-摇摇", "JDShake", eor, response, data)
          reject(eor)
        } finally {
          resolve()
        }
      })
    });
  });
  const JDSecKilling = ((ck) => {
    var Cash, desc;
    return new Promise((resolve, reject) => {
      httpUtils.nobyda.post({
        url: 'https://api.m.jd.com/client.action',
        headers: {
          Cookie: ck,
          Origin: 'https://h5.m.jd.com'
        },
        body: 'functionId=freshManHomePage&body=%7B%7D&client=wh5&appid=SecKill2020'
      }, (error, response, data) => {
        try {
          if (error) throw new Error(error);
          const cc = JSON.parse(data);
          if (cc.code == 203 || cc.code == 3 || cc.code == 101) {
            desc = `京东秒杀-红包: 失败, 原因: Cookie失效‼️`;
          } else if (cc.result && cc.result.projectId && cc.result.taskId) {
            console.log(`\n京东秒杀-红包查询成功`)
            return resolve({
              projectId: cc.result.projectId,
              taskId: cc.result.taskId
            })
          } else {
            desc = `京东秒杀-红包: 失败, 暂无有效活动 ⚠️`;
          }
          console.log(`\n京东秒杀-红包查询失败`)
          reject()
        } catch (eor) {
          httpUtils.nobyda.AnError("京东秒杀-查询", "JDSecKill", eor, response, data)
          reject()
        }
      })
    }).then((id) => {
      return new Promise((resolve, reject) => {
        httpUtils.nobyda.post({
          url: 'https://api.m.jd.com/client.action',
          headers: {
            Cookie: ck,
            Origin: 'https://h5.m.jd.com'
          },
          body: `functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${id.projectId}%22%2C%22encryptAssignmentId%22%3A%22${id.taskId}%22%2C%22completionFlag%22%3Atrue%7D&client=wh5&appid=SecKill2020`
        }, (error, response, data) => {
          try {
            if (error) throw new Error(error);
            const cc = JSON.parse(data);
            if (cc.msg == 'success' && cc.subCode == 0) {
              console.log(`\n京东秒杀-红包签到成功`);
              const qt = data.match(/"discount":(\d.*?),/);
              Cash = qt ? qt[1] : 0;
              desc = `京东秒杀-红包: 成功, 明细: ${Cash||`无`}红包 🧧`;
              resolve(desc)
            } else {
              console.log(`\n京东秒杀-红包签到失败`);
              desc = `京东秒杀-红包: 失败, ${cc.subCode==103?`原因: 已领取`:cc.msg?cc.msg:`原因: 未知`} ⚠️`;
              resolve(desc)
            }
          } catch (eor) {
            httpUtils.nobyda.AnError("京东秒杀-领取", "JDSecKill", eor, response, data);
            reject(eor)
          } finally {
            resolve();
          }
        })
      })
    }, () => {});
  });
  return {
    //京东京豆
    JingDongBean,
    //京东超市
    JingDongStore,
    //金融钢镚
    JingRongSteel,
    //京东转盘
    JingDongTurn,
    //京东闪购
    JDFlashSale,
    //现金红包
    JingDongCash,
    //京东小魔方
    JDMagicCube,
    //京东领现金
    JingDongGetCash,
    //京东金贴
    JingDongSubsidy,
    //京东摇一摇
    JingDongShake,
    //京东秒杀
    JDSecKilling
  }
}


exports.jdsign = new jdsign();