var express = require('express');
var router = express.Router();

var corpId = 'dingcd11234ee8e7457235c2f4657eb6378f';
              
var corpsecret = 'Ozo5eZB-COnPlGY_6XNan9bjzz4zCHMrvRp2CAxJkfVXnZT4eZGwHY_C7df3UfSG';
var agentid = '168144040';

var crypto = require('crypto');
var url = require('url');
const request = require('request');
var querystring = require('querystring');

function sign(params) {
    var origUrl = params.url;
    var origUrlObj =  url.parse(origUrl);
    delete origUrlObj['hash'];
    var newUrl = url.format(origUrlObj);
    var plain = 'jsapi_ticket=' + params.ticket +
        '&noncestr=' + params.nonceStr +
        '&timestamp=' + params.timeStamp +
        '&url=' + newUrl;

    console.log(plain);
    var sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    var signature = sha1.digest('hex');
    console.log('signature: ' + signature);
    return signature;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    // let url = decodeURIComponent(this.href);
    let url = decodeURIComponent('http://' + req.host + req.originalUrl)

    console.log('req url:', url);
    // 1. 获取 token
    const get_token_url = 'https://oapi.dingtalk.com/gettoken?corpid=' + corpId + '&corpsecret=' + corpsecret;
    request.get(get_token_url, (error, response, body) => {
        let token = JSON.parse(body).access_token;
        console.log('生成的 Token: ' + token)

        // 2. 获取 ticket
        let get_tiket_url = 'https://oapi.dingtalk.com/get_jsapi_ticket?access_token=' + token;
        request.get(get_tiket_url, (error, response, body) => {
            let ticket = JSON.parse(body).ticket;
            console.log('生成的 Ticket: ' + ticket)
            
            // 3. 生成签名
            var nonceStr = 'abcdefg';
            var timeStamp = new Date().getTime();
            // var plain_text = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + req.url;
            // var signature = sha1(plain_text);
            // console.log('生成的签名: ' + signature);
            
            var signature = sign({
                nonceStr: nonceStr,
                timeStamp: timeStamp,
                url: url,
                ticket: ticket
            });

            var config = {
                signature: signature,
                nonceStr: nonceStr,
                timeStamp: timeStamp,
                corpId: corpId,
                agentid: agentid
            };

            console.log('config info:', config);

            res.render('dingding', config);
            
        });
    });
});

router.get('/record', function(req, res, next) {
    var userId = req.session.user._id;
    userId = mongoose.Types.ObjectId(userId);
    Record.find({ user: userId }, function(err, docs) {
        if(err) {
            console.error('访问申请记录出错，err:', err);
            res.render('record', { docs: [] });
        }
        if(!docs) {
            res.redirect('/');
        }
        res.render('record', { docs: docs });
    });
});

module.exports = router;
