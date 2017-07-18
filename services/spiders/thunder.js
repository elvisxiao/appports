const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const spider = require('./spiderInstance');

var baseUrl = 'http://cued.xunlei.com/page/';


module.exports = function(saveFn, index) {
    var i = 1;
    var newsList = [];

    let fetchDetail = function() {
        if(newsList.length === 0) {
            return;
        }

        let item = newsList.pop();
        let model = {
            creator: 'Thunder',
            link: item.querySelector('h2>a').href,
            title: item.querySelector('h2>a').innerHTML,
            brief: item.querySelector('.wz_info>p').innerHTML,
            tags: [item.querySelector('.dc>a').innerHTML]
        }

        //过滤招聘信息
        if(!require('./filterTitle')(model.title)) {
            return;
        }

        spider.queue(model.link, (itemDoc) => {
            var itemDom = new JSDOM(itemDoc.res.body);
            var itemDoc = itemDom.window.document;
            var element = itemDoc.querySelector('.wz_info');
            if(element) {
                var content = element.innerHTML;
                model.content = content;
                saveFn(model, function() {
                    fetchDetail();
                });
            }
        });
    }

    let fetchOnePage = function() {
        spider.queue(baseUrl + i, function(doc) {
            var dom = new JSDOM(doc.res.body);
            var doc = dom.window.document;
            var list = doc.querySelectorAll('body .aclist');
            var arr = Array.prototype.map.call(list, function(one) {
                return one;
            });

            newsList = newsList.concat(arr);
            
            if(i < (index || 1)) {
                i ++;
                fetchOnePage();
            }
            else {
                fetchDetail();
            }
        });
    }

    fetchOnePage();
}
