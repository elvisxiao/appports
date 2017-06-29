// target site: https://news.awesomes.cn/
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const spider = require('./spiderInstance');

var baseUrl = 'https://news.awesomes.cn';

module.exports = function(saveFn) {
    spider.queue(baseUrl, function(doc) {
        console.log('get awesomes list success');
        var dom = new JSDOM(doc.res.body);
        var doc = dom.window.document;
        var list = doc.querySelectorAll('body .repo-news');
        
        return Array.prototype.map.call(list, function(one, index) { 
            var title = one.querySelector('.middle article').innerHTML;
            var model = {
                title: title
            };
            saveFn(model);
        })
    });
}

