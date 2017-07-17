
module.exports = function(title) {
	var filterWords = ['招聘', '颁奖典礼', '毕业典礼', '诚招'];

	if(!title || filterWords.some(one => title.indexOf(one) !== -1)) {
		return false;
	}
	
	return true;
}