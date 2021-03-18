var funJdsign = require("./jdsign");
var fucGetCookie = require("./getJdCookie");
var httpUtils = require("./nobyda")
var ck = "pt_key=AAJgNGWFADBm4Mq59IDGlbSSyymLJrlLDIjGGipr4q8dpbkJ8iWF2tr_TghsXkdlQI2I8zQIEpo;pt_pin=jd_624f191cc0540;";




funJdsign.jdsign.JDSecKilling(ck).then(function (res) {
    var msg = res;
    console.log(msg);
  }, function (err) {
    console.log(err);
  })

//链式调用
// funJdsign.jdsign.JingDongBean(ck).then(function (res) {
//   var msg = res;
//   console.log(msg);
//   return funJdsign.jdsign.JingDongStore(ck);
// }, function (err) {
//   console.log(err);
// }).then(function (res) {
//   var msg = res;
//   console.log(msg);
// }, function (err) {
//   console.log(err);
// })

//异步调用

let fun = undefined;
let userid = 0;
var jdfunc = {
  all: async function (ck) {
    return await Promise.all([
      funJdsign.jdsign.JingDongBean(ck),
      funJdsign.jdsign.JingDongStore(ck),
      funJdsign.jdsign.JingRongSteel(ck),
      funJdsign.jdsign.JingDongTurn(ck),
      funJdsign.jdsign.JDFlashSale(ck),
      funJdsign.jdsign.JingDongCash(ck),
      funJdsign.jdsign.JDMagicCube(ck,1),
      funJdsign.jdsign.JingDongGetCash(ck),
      funJdsign.jdsign.JingDongSubsidy(ck),
      funJdsign.jdsign.JingDongShake(ck),
      funJdsign.jdsign.JDSecKilling(ck)
    ]);
  },
  jdsign: function (callback, ckid, ck) {
    // httpUtils.nobyda.log2File(`ckid:${ckid}\n`);
    jdfunc.all(ck).then(function (msg) {
      var allMsg = '';
      for (var i = 0; i < msg.length; i++) {
        allMsg += msg[i] + '\n';
      }
      var retvalue = {
        id: ckid,
        msg: allMsg,
        ck: ck
      }
      callback(null, retvalue);
    }).catch((result) => {
      console.log(result)
    })
  },
  getQrCode: function (callback, uid) {
    userid = uid;
    fun = new fucGetCookie();
    fun.loginEntrance(uid).then(function () {
      return fun.generateQrcode();
    }).then(function (data) {
      var qrcode = data;
      httpUtils.nobyda.log2File(qrcode.qrUrl + '\n');
      callback(null, qrcode);
    });
  },
  getCookie: function (callback) {
    if (fun) {
      fun.getCookie(function (data) {
        callback(null, data);
        fun = null
        userid = 0;
        // process.exit(0);
      })
    } else {
      var retvalue = {
        ck: '',
        userName: '',
        userId: userid,
        desc: 'fun:null'
      }
      callback(null, retvalue);
    }
  }
}

module.exports = jdfunc;