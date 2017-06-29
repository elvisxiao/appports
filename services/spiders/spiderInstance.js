const Spider = require('node-spider');
const spider = new Spider({
    // How many requests can be run in parallel 
    concurrent: 5,
    // How long to wait after each request 
    delay: 0,
    // A stream to where internal logs are sent, optional 
    logs: process.stderr,
    // Re-visit visited URLs, false by default 
    allowDuplicates: false,
    // If `true` all queued handlers will be try-catch'd, errors go to `error` callback 
    catchErrors: true,
    // If `true` the spider will set the Referer header automatically on subsequent requests 
    addReferrer: false,
    // If `true` adds the X-Requested-With:XMLHttpRequest header 
    xhr: false,
    // If `true` adds the Connection:keep-alive header and forever option on request module 
    keepAlive: false,
    // Called when there's an error, throw will be used if none is provided 
    error: function(err, url) {
        console.log('error:', err);
    },
    // Called when there are no more requests 
    done: function() {
    },
 
    //- All options are passed to `request` module, for example: 
    headers: { 
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4',
        'Connection': 'keep-alive',
        'Cookie': 'pgv_pvi=5947113472; Hm_lvt_e850b980d029480b092fdd7503c3f8de=1498195495,1498548633,1498614006; Hm_lpvt_e850b980d029480b092fdd7503c3f8de=1498614006; pgv_si=s9695413248; UM_distinctid=15cec5b2b26a28-0b56825496cfb1-30637808-13c680-15cec5b2b277d7; Hm_lvt_7cfe91ffbbad21e23fd7b4fa1bf576be=1498614718,1498616738,1498622312,1498622314; Hm_lpvt_7cfe91ffbbad21e23fd7b4fa1bf576be=1498647080; _ga=GA1.2.979554410.1498614269; _gid=GA1.2.283402213.1498614269; _gat=1',
        'Upgrade-Insecure-Requests': 1,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36', 
    },
    encoding: 'utf8'
});

module.exports = spider;