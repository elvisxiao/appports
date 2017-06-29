var News = require('../../models').News;

var saveNewsItem = function(one, cb) {
	let keywords = one.title || one.content;
	News.findOne({ $or:[{ title: keywords },{ content: keywords }] }, function(err, doc) {
		if(err) {
			console.log('database error:', err);
			cb && cb();
			return;
		}
		if(!doc) {
			var instance = new News(one);
            instance.save( (err, doc) => {
                if(err) {
                    console.error('添加News失败:', err);
                }
                console.info('添加News成功', (doc.title || doc.content).slice(0, 30));

                cb && cb();
            });
		}
	})
}

module.exports = () => {
	console.log('获取News任务启动'  + new Date().toString());
	require('./aotu')(saveNewsItem)
	require('./qiutc')(saveNewsItem)
	require('./awesomes')(saveNewsItem)
	require('./thunder')(saveNewsItem, 1)
}

// 首次全部抓取9页，以后每次只抓1页数据-----
// require('./thunder')(saveNewsItem, 9)