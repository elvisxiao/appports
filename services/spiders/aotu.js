const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const spider = require('./spiderInstance');

var baseUrl = 'https://news.aotu.io';


module.exports = function(saveFn) {
    spider.queue(baseUrl + '/c/frontend', function(doc) {
        console.log('get aotu list success');
        var dom = new JSDOM(doc.res.body);
        var doc = dom.window.document;
        var list = doc.querySelectorAll('body .news-list ul li');
        
        return Array.prototype.map.call(list, function(one, index) {
            var link = one.querySelector('.news-item-content>a').href;
            var tagsElement = one.querySelectorAll('.news-item-tag');
            var tags = [];
            if(tagsElement.length) {
                tags = Array.prototype.map.call(tagsElement, function(tag) {
                    return tag.innerHTML;
                })
            }
            
            var model = {
                creator: one.querySelector('.news-item-origin').innerHTML,
                link: link,
                title: one.querySelector('.news-item-content>a').innerHTML,
                brief: one.querySelector('.new-item-description').innerHTML,
                tags: tags
            }
            
            spider.queue(baseUrl + link, (itemDoc) => {
                var itemDom = new JSDOM(itemDoc.res.body);
                var itemDoc = itemDom.window.document;
                // console.log('content:', model.title, itemDoc.querySelector('.news-view-content.typo').innerHTML);
                var element = itemDoc.querySelector('.news-view-content.typo');
                if(element) {
                    var content = element.innerHTML;
                    model.content = content;
                    saveFn(model);
                }
            });
        })
    });
}
