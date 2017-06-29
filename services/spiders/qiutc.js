const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const spider = require('./spiderInstance');

var baseUrl = 'https://qiutc.me';


module.exports = function(saveFn) {
    spider.queue(baseUrl, function(doc) {
        console.log('get qiutc list success');
        var dom = new JSDOM(doc.res.body);
        var doc = dom.window.document;
        var list = doc.querySelectorAll('body .post-list li.post-item');
        
        return Array.prototype.map.call(list, function(one, index) {
            var link = one.querySelector('.post-content-link').href;
            
            var model = {
                creator: 'Qiutc',
                link: link,
                title: one.querySelector('.post-title>a').innerHTML,
                brief: one.querySelector('.post-content-link').innerHTML + '...'
            }
            
            spider.queue(baseUrl + link, (itemDoc) => {
                var itemDom = new JSDOM(itemDoc.res.body);
                var itemDoc = itemDom.window.document;
                // console.log('content:', model.title, itemDoc.querySelector('.news-view-content.typo').innerHTML);
                var element = itemDoc.querySelector('#article');
                if(element) {
                    var content = element.innerHTML;
                    model.content = content;
                    saveFn(model);
                }
            });
        })
    });
}
