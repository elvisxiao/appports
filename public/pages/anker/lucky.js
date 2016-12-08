var luckyDraw =  {
    // groupPrized: {},
    prizeList:[],
    restPerson: [],
    
    // init data from localStorage -------------------------------------------------
    init: function(){
        if(!window.localStorage){
            alert('sorry, your browser is not support localStorage, please choose a new one.');
            return;
        }

        if(window.localStorage.lucky) {
             var initData  = $.parseJSON(window.localStorage.lucky);
             this.prizeList  = initData.prizeList || [];
             this.restPerson = initData.restPerson|| [];
             // this.groupPrized = initData.groupPrized || {};
        }
        else {
            this.restPerson = $.extend([], OCSTUFF);
            this.restPerson.sort(function(a, b) {
                return Math.random() - 0.5;
            });
        }
    }, 
    
    //get the lucky from restPerson -----------------------------------------
    getLucky: function(count, prize){
        if(!count){
            return [];
        }
        var luckyPersonList = this.randSeed(count, prize);

        return luckyPersonList;
    },

    //get some diffrent person  --------------------------------------
    randSeed: function(count, prize){
        var ret = [];

        while(ret.length < count){
            var len = this.restPerson.length;
            var seed = Math.random();
            var index = Math.floor(seed * len);
            var person = this.restPerson[index];
            // var groupId = person.group.toString();
            // var currentSize = this.groupPrized[groupId] || 0;
            // if(currentSize >= 2 && this.prizeList.length < 40){
            //     continue;
            // }
            
            // this.groupPrized[groupId] = currentSize + 1;
            person.prizeTitle = prize.title;
            person.prizeName = prize.name;
            ret.push(person);
            this.prizeList.push(person);
            this.restPerson.splice(index, 1);
            console.log('恭喜中奖：', person);
        }
        this.saveData();

        return ret;
    },
    saveData: function(){
        var lucky = {
            prizeList: this.prizeList,
            restPerson: this.restPerson
            // groupPrized: this.groupPrized
        }
        var luckyString =  JSON.stringify(lucky);
        window.localStorage.lucky = luckyString;
    },

    testSeed: function(count) {
        var ret = [];
        while(count--) {
            var seed = Math.random();
            var index = Math.floor(seed * 20);
            ret.push(index);  
        }
        
        var len = ret.length;
        var map = {};
        
        for(var i = 0; i < len; i ++) {
            var number = ret[i];
            if(map[number]) {
                map[number]++;
            }
            else {
                map[number] = 1;
            }
        }
        for(var key in map) {
            console.log(key + ' ----- ' + map[key] / len);
        }
    }
}