const fs = require("fs");
/**
 * 扩展Date的Format函数
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * @param {[type]} fmt [description]
 */
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function nobyda() {
    const start = Date.now();
    const node = (() => {
        const request = require('request');
        const fs = require("fs");
        return ({
            request,
            fs
        });
    })();
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status;
            } else if (response.statusCode) {
                response["status"] = response.statusCode;
            }
        }
        return response;
    };
    const get = (options, callback) => {
        options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)';
        node.request(options, (error, response, body) => {
            callback(error, adapterStatus(response), body);
        });

    };
    const post = (options, callback) => {
        options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)';
        if (options.body)
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        node.request.post(options, (error, response, body) => {
            callback(error, adapterStatus(response), body);
        });
    };
    const AnError = (name, keyname, er, resp, body) => {
        if (typeof (merge) != "undefined" && keyname) {
            if (!merge[keyname].notify) {
                merge[keyname].notify = `${name}: 异常, 已输出日志 ‼️`;
            } else {
                merge[keyname].notify += `\n${name}: 异常, 已输出日志 ‼️ (2)`;
            }
            merge[keyname].error = 1;
        }
        return resolve(`\n‼️${name}发生错误\n‼️名称: ${er.name}\n‼️描述: ${er.message}${JSON.stringify(er).match(/\"line\"/) ? `\n‼️行列: ${JSON.stringify(er)}` : ``}${resp && resp.status ? `\n‼️状态: ${resp.status}` : ``}${body ? `\n‼️响应: ${resp && resp.status != 503 ? body : `Omit.`}` : ``}`);
    };
    const time = () => {
        const end = ((Date.now() - start) / 1000).toFixed(2);
        return resolve('\n签到用时: ' + end + ' 秒');
    };
    const log2File = async (msg) => {
        await fs.appendFileSync('./log.txt', new Date().Format("yyyy-MM-dd hh:mm:ss:S") + ':' + msg);
    }
    return {
        AnError,
        get,
        post,
        time,
        log2File
    };
}
exports.nobyda = new nobyda();
