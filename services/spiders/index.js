var News = require('../../models').News;

var saveNewsItem = function(one) {
	let keywords = one.title || one.content;
	News.findOne({ $or:[{ title: keywords },{ content: keywords }] }, function(err, doc) {
		if(err) {
			console.log('database error:', err);
			return;
		}
		if(!doc) {
			var instance = new News(one);
            instance.save( (err, doc) => {
                if(err) {
                    console.error('添加News失败:', err);
                }
                console.info('添加News成功', (doc.title || doc.content).slice(0, 30));
            });
		}
	})
}

module.exports = () => {
	console.log('获取News任务启动'  + new Date().toString());
	require('./aotu')(saveNewsItem)
	require('./awesomes')(saveNewsItem)
}