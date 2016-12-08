var PRIZE = [
    {
        title: '三等奖',
        name: 'Kindle Paperwhite 电子书阅读器',
        count: 10,
        each: 5,
        src: '3.jpg',
    },
    {
        title: '三等奖',
        name: '永久牌山地自行车',
        count: 10,
        each: 5,
        src: '2.jpg'
    },
    {
        title: '三等奖',
        name: '公司产品劵，用于17年Q1团购',
        count: 10,
        each: 5,
        src: '9.jpg'
    },
    {
        title: '二等奖',
        name: '极米家庭投影仪',
        count: 10,
        each: 5,
        src: '5.jpg'
    },
    {
        title: '二等奖',
        name: '小米净水器',
        count: 10,
        each: 5,
        src: '6.jpg'
    },
    {
        title: '一等奖',
        name: 'IPhone 7',
        count: 2,
        each: 2,
        src: '7.jpg'
    },
    {
        title: '特等奖',
        name: 'XX地双人游',
        count: 1,
        each: 1,
        src: '8.jpg'
    },
    // {
    //     title: '神秘大奖',
    //     name: '新增一个',
    //     count: 1,
    //     src: 'prizeDefault.png'
    // }
];

var getCurrentPrize = function(prizedPerson){
    var len = PRIZE.length;
    var total = 0;
    for(var i = 0; i < len; i++){
        var aPrize = PRIZE[i];
        var count = aPrize.count || 1;
        total += count;
        if(total > prizedPerson){
            return { prize: PRIZE[i], rest: total - prizedPerson};
        }
    }
    
    return null;
}
