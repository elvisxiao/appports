// 常用命令：
// 启动: pm2 start pm2.config.js
// 删除所有进程: pm2 delete all 
// 重新加载资源: pm2 reload csc 
// 查看log: pm2 log
// 查看进程运行情况以及资源占用: pm2 list

module.exports = {
    apps : [
        {
            name        : "appports",
            script      : "./app.js",
            watch       : false,
            instances   : 1,
            exec_mode   : "cluster"
        }
    ]
}

