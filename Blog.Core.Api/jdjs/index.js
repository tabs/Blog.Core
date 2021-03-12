var fucUtils = require("./testjd");
var fucGetCookie = require("./getJdCookie");
var httpUtils = require("./nobyda")
// var ck = "pt_key=AAJgNGWFADBm4Mq59IDGlbSSyymLJrlLDIjGGipr4q8dpbkJ8iWF2tr_TghsXkdlQI2I8zQIEpo;pt_pin=jd_624f191cc0540;";






//链式调用
// fucUtils.jdfuc.JingDongBean(ck).then(function (res) {
//   var msg = res;
//   console.log(msg);
//   return fucUtils.jdfuc.JingDongStore(ck);
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
      fucUtils.jdfuc.JingDongBean(ck),
      fucUtils.jdfuc.JingDongStore(ck)
    ]);
  },
  jdsign: function (callback, ck) {
    jdfunc.all(ck).then(function (msg) {
      var allMsg = '';
      for (var i = 0; i < msg.length; i++) {
        allMsg += msg[i] + '\n';
      }
      callback(null, allMsg);
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
// httpUtils.nobyda.log2File('dfsd\n');
// httpUtils.nobyda.log2File('sdgag\n');
// jdfunc.getQrCode(function(err,data){
//   console.log(data);
// })
// jdfunc.getCookie((er, data) => {
//   console.log(data);
// })
// console.log("test");
// setTimeout(function(){
//   console.log("done");
// },10000);
module.exports = jdfunc;