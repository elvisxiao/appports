var fs = require('fs');
var csvParse = require('csv-parse');
var request = require('request');

var groupCount = 20;

var Instance = function() {
    this.sqlExportFile = __dirname + "/sqlData.csv";
    this.sqlTargetFile = __dirname + "/stuffsSQL.js";
    this.luckyFile = __dirname + "/2016年会抽奖名单.csv";
    this.luckyTargetFile = __dirname + "/stuff.js";
    this.portraitPath = __dirname + "/img/";

    this.stuffsSQL = [];
    this.luckyStuffs = [];
    
    var self = this;

    //员工信息------
    self.buildStuffFromSQL = function(cb) {
        if(fs.existsSync(self.sqlTargetFile)) {
            fs.unlinkSync(self.sqlTargetFile);
        }
        
        var stuffs = [];
        fs.createReadStream(self.sqlExportFile).pipe(csvParse())
        .on('data', function(line) {
            var id = line[0];
            if(isNaN(id)) {
                return;
            }
            id = parseInt(id);

            var stuff = {
                id: id,
                number: line[1],
                cnName: line[2],
                fullName: line[3],
                path: line[4]
            }
            if(!stuff.path || stuff.path == "\\N" || stuff.path == "\N" || stuff.path == "NULL") {
                stuff.path = "";
            }

            if(!stuff.number) {
                console.log(id + '没有number字段，自动忽略');
                return;
            }
            
            var finds = stuffs.filter(function(model) {
                return model.number == stuff.number;
            })
            if(finds.length === 0) {
                stuffs.push(stuff);   
            }
            else {
                console.log('sql中number重复, 自动忽略：', stuff);
            }
        })
        .on('end', function() {
            var string = 'module.exports = ' + JSON.stringify(stuffs);
            fs.writeFile(self.sqlTargetFile, string, function (err) {
                if (err) {
                    console.error('从mysql导出数据时发现异常:', err);
                    return;
                }
                console.log('从mysql中导出数据总数为：' + stuffs.length);
                self.stuffsSQL = require('./stuffsSQL');

                cb && cb();
            });
        })
    }

    self.findStuff = function(number, cnName, enName) {
        var finds = self.stuffsSQL.filter(function(model) {
            return model.number == number;
                // && model.cnName == cnName;
        })

        if(finds.length !== 1) {
            console.error('参与人员信息错误，工号: ' + number + ', 找到的数量为：' + finds.length + ', 分别为：' + finds.map(function(one) {return one.fullName}).join('、'));
            return null;
        }
        else if(finds[0].cnName.toUpperCase() != cnName.toUpperCase()) {
            // console.log('参与人员信息错误，工号为：' + number + ', 中文名不匹配：(' + finds[0].cnName + ') VS (' + cnName + ')，英文名为：' + enName);
        }

        return finds[0];
    }
    
    //参与年会人员的信息-------
    self.buildLuckyStuff = function(cb) {
        self.stuffsSQL = require('./stuffsSQL');

        if(fs.existsSync(self.luckyTargetFile)) {
            fs.unlinkSync(self.luckyTargetFile);
        }

        var firstLine = true;

        self.luckyStuffs = [];

        var count = 0;
        fs.createReadStream(self.luckyFile)
        .pipe(csvParse())
        .on('data', function(data) {
            //去掉第一行数据-----
            if(firstLine) {
                firstLine = false;
                return;
            }
            count ++;
            var number = data[1];
            var cnName = data[2];
            var enName = data[3];

            var person = self.findStuff(number, cnName, enName);

            if(!person) {
                return;
            }

            var finds = self.luckyStuffs.filter(function(model) {
                return model.number == person.number;
            })
            if(finds.length > 0) {
                console.log('参与人员重复，工号：' + person.number + ', 已存在：' + finds[0].fullName + ', 目前要加入的：' + person.fullName);
            }
            else {
                self.luckyStuffs.push(person);   
            }
        })
        .on('end', function() {
            if(self.luckyStuffs.length === 0) {
                console.warn('注意：未设置参与人员，全员参与!!!');
                self.luckyStuffs = self.stuffsSQL;
            }
            console.log('抽奖名单csv读取完毕，共：' + self.luckyStuffs.length + ', count:' + count);
            cb && cb();
        })
    }

    //分组并保存为可用js文件-----
    self.saveLuckStuff = function() {
        if(!self.luckyStuffs.length) {
            console.error('尚未生成参加人员信息');
            return;
        }
        console.log(self.luckyStuffs.length);
        
        var length = self.luckyStuffs.length;
        
        var string = 'var OCSTUFF = ' + JSON.stringify(self.luckyStuffs) + '';
        fs.writeFileSync(self.luckyTargetFile, string);
        console.log('参与人员存储成功，一共'  + length + '人');
    }

    self.loadPortrait = function() {
        var folder_exists = fs.existsSync(self.portraitPath);
        
        //删除错误的文件----------
        if(folder_exists == true) {
            var fileList = fs.readdirSync(self.portraitPath);
            fileList.forEach(function(fileName) {
                var filePath = self.portraitPath + fileName;
                states = fs.statSync(filePath);   
                if(states.size === 0) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        try {
            for(var i = 0; i < self.luckyStuffs.length; i ++) {
                var one = self.luckyStuffs[i];
                if(!one.path || one.path == "NULL" || one.path == "UNDEFINED") {
                    continue;
                }

                var imgPath = self.portraitPath + one.number + '.jpg';
                if(fs.existsSync(imgPath)) {
                    continue;
                }
                
                console.log('Loading img: ' + one.path + ' : ' + one.number);
                request.get('http://m.oceanwing.com/product/util/accessory.jsp?id=' + one.path)
                .pipe(fs.createWriteStream(imgPath));
            }
        }
        catch(e) {
            console.log('Fetch img error, begin reload img: ', e);
            self.loadPortrait();
        }
    }
}

var instance = new Instance();

//分成多少组，由命令行传入-----
var cmd = process.argv.splice(2, 1);
console.log('cmd:' + cmd);
if(cmd == "sql") {
    instance.buildStuffFromSQL();
}
else {
    instance.buildLuckyStuff(function() {
        instance.saveLuckStuff();
        instance.loadPortrait();
    });
}

