process.env.NODE_ENV="production",function(){var a={assert:!0,buffer:!0,child_process:!0,cluster:!0,crypto:!0,dgram:!0,dns:!0,events:!0,fs:!0,http:!0,https:!0,net:!0,os:!0,path:!0,punycode:!0,querystring:!0,readline:!0,repl:!0,string_decoder:!0,tls:!0,tty:!0,url:!0,util:!0,vm:!0,zlib:!0},b=function(a){var b={id:module.id,parent:module.parent,filename:module.filename,loaded:!1,children:[],paths:module.paths,exports:{}};return function(){if(!b.loaded&&!b.__isLoading){b.__isLoading=!0;try{a(b,b.exports),b.__isLoading=!1}catch(a){throw b.__isLoading=!1,a}b.loaded=!0}return b.exports}},c={"./config/config.js":b(function(a,b){"use strict";var c=(require("path"),require("lodash"));"production"===process.env.NODE_ENV?a.exports=c.extend(i("./env/all.js","/Users/michele/Sites/cloud-minera/client/config/config.js"),i("./env/production","/Users/michele/Sites/cloud-minera/client/config/config.js")):a.exports=c.extend(i("./env/all.js","/Users/michele/Sites/cloud-minera/client/config/config.js"),i("./env/"+(process.env.NODE_ENV||"development"),"/Users/michele/Sites/cloud-minera/client/config/config.js"))}),"./config/env/all.js":b(function(a,b){"use strict";a.exports={app:{name:"cloud-minera-client",title:"Cloud Minera Client Dev ENV"}}}),"./config/env/production.js":b(function(a,b){"use strict";a.exports={app:{name:"cloud-minera-client",title:"Cloud Minera Client",port:"14058"},server:{host:"app.socket.getminera.com",port:61337,options:{reconnection:!0,reconnectionDelay:1e3,reconnectionDelayMax:5e3,reconnectionAttempts:1e3},systemMessageIntervalDelay:3e4}}}),"./app/app.js":b(function(a,b){"use strict";var c=(require("lodash"),require("chalk")),d=i("../config/config","/Users/michele/Sites/cloud-minera/client/app/app.js"),e=[];require("console-stamp")(console,"yyyy-mm-dd HH:MM:ss"),a.exports=function(a,b){console.log(c.cyan("Starting ",d.app.title+"\n")),"production"!==process.env.NODE_ENV&&(console.log(c.gray("DEVELOPMENT ENV")),console.log(c.gray("Host: "+d.server.host+" | Port: "+d.server.port+"\n")));var f=process.argv.slice(2),g=!1;if(f.length&&(g=f[0],process.env.MINERA_ID=g),!process.env.MINERA_ID)return console.log(c.red("WARNING - Client can't start without MINERA_ID")),console.log(c.red("Create a system on https://app.getminera.com and start this command with the MINERA_ID obtained")),process.exit();a=i("./socket","/Users/michele/Sites/cloud-minera/client/app/app.js")(a,b,e);var h=i("./queue","/Users/michele/Sites/cloud-minera/client/app/app.js");h.start(a,b,e)}}),"./app/socket.js":b(function(a,b){"use strict";var c,d=require("chalk"),e=require("macaddress"),f=require("ip"),g=require("dns"),h=i("../config/config","/Users/michele/Sites/cloud-minera/client/app/socket.js"),j=i("./util","/Users/michele/Sites/cloud-minera/client/app/socket.js"),k=i("./queue","/Users/michele/Sites/cloud-minera/client/app/socket.js"),l=(require("lodash"),require("async")),m=i("./miner.js","/Users/michele/Sites/cloud-minera/client/app/socket.js"),n=process.env.MINERA_ID||null;a.exports=function(a,b,i){function o(b,c){g.resolve4(b,function(d,e){try{if(d){if(!f.isV4Format(b)&&!f.cidr(b))throw new Error("Error")}else b=e[0]+"/32";var g=require("evilscan"),h={target:b,port:c,status:"TROU",banner:!0,display:"json",concurrency:100},i=new g(h),j=[];i.on("result",function(a){"open"===a.status&&j.push(a)}),i.on("error",function(a){throw new Error(a.toString())}),i.on("done",function(){console.log("Network scan DONE"),a.emit("scanMessageResponse",{items:j})}),i.run()}catch(c){c&&console.log(c);var k=b+" isn't a valid network address, please use a valid IP, Network or Hostname address";return console.log(k),a.emit("scanMessageResponse",{err:k})}})}function p(b){return a.emit("systemMessage",{pid:process.pid,systemId:b,encryptedSystemId:n,data:j.getOsInfo(),miners:[]})}var q=e.one(function(a,b){return b});return b.Miner.find({monitor:!0},function(c,e){c&&console.log(d.red("Error ",c)),e&&l.each(e,function(c,d){k.manageIntervals(c,a,b,i)},function(){console.log(d.green("Success - All miner monitors started"))})}),a.on("systemMessage",function(c){return c.error?void console.log(d.red("ERROR: "+c.error)):(c&&c.updateNow&&c.mac&&p(c.mac),c&&c.encryptedSystemId&&b.System.update({encryptedSystemId:n},{systemId:q,encryptedSystemId:c.encryptedSystemId},{upsert:!0},function(a){a&&console.log(d.red("Error ",a)),console.log(d.green("System saved in DB"))}),c&&c.activeMiners&&c.activeMiners.length&&l.waterfall([function(a){b.Miner.remove({},function(b){b&&a(b),a()})},function(e){l.each(c.activeMiners,function(c,e){k.manageIntervals(c,a,b,i),b.Miner.update({_id:c._id},c,{upsert:!0},function(a){a&&console.log(a),console.log(d.green("Active miner "+c.name+" saved")),e()})},function(){e()})}],function(a){a&&console.log(d.red("Error ",a))}),void(c&&c.activeMiner&&b.Miner.update({_id:c.activeMiner._id},c.activeMiner,{upsert:!0},function(e){e&&console.log(e),k.manageIntervals(c.activeMiner,a,b,i),console.log(d.cyan("Active miner "+c.activeMiner.name+" updated"))})))}),a.on("scanMessage",function(a){console.log(d.gray("Socket SCAN message:",JSON.stringify(a))),a&&a.host&&a.port&&o(a.host,a.port)}),a.on("commandMiner",function(c){function e(c){console.log(c),b.Miner.findOne({_id:c.minerId},function(b,d){m.api(d,c.cmd,c.params,function(b,e){b&&(b=b.message||b,a.emit("commandMinerResponse",{minerId:d._id,error:b})),e||a.emit("commandMinerResponse",{minerId:d._id,error:"No results received"}),c.noresponse||a.emit("commandMinerResponse",{minerId:d._id,response:e,origin:c})})})}if(console.log(d.gray("Server asked to execute Miner command:",JSON.stringify(c))),!c&&!c.path&&!c.cmd)return a.emit("commandMinerResponse",{error:"Missing required arguments"});switch(c.cmd){case"help":j.getMinerHelp(c.path,function(b,c){return b?a.emit("commandMinerResponse",{error:b}):a.emit("commandMinerResponse",{response:c.toString()})});break;default:return e(c)}}),a.on("connect",function(){console.log(d.green("Socket connected")),clearInterval(c),a.emit("join",n+"-"+process.pid),p(q),c=setInterval(function(){p(q)},h.server.systemMessageIntervalDelay)}),a.on("leave",function(b){console.log(d.gray("Server disconnected client")),a.disconnect()}),a.on("reconnect",function(a){console.log(d.green("Socket reconnect attempt",a))}),a.on("connecting",function(){console.log(d.gray("Socket connecting"))}),a.on("reconnecting",function(a){console.log(d.yellow("Socket reconnecting attempt",a))}),a.on("connect_failed",function(){console.log(d.red("Socket connect failed"))}),a.on("reconnect_failed",function(){console.log(d.red("Socket reconnect failed"))}),a.on("error",function(a){console.log(d.red("Socket error",JSON.stringify(a)))}),a.on("reconnect_error",function(a){console.log(d.red("Socket reconnect error",JSON.stringify(a)))}),a.on("close",function(){console.log(d.gray("Socket close"))}),a.on("disconnect",function(){console.log(d.gray("Socket disconnect"))}),a}}),"./app/util.js":b(function(a,b){"use strict";var c=require("path"),d=require("lodash"),e=require("os"),f=require("fs"),g=(require("chalk"),require("child_process").execSync);b.getLocalIp=function(){var a=e.networkInterfaces(),b=0,c={},f="0.0.0.0";if(Object.keys(a).forEach(function(d){b=0,a[d].forEach(function(a){"IPv4"===a.family&&a.internal===!1&&(b>=1?c[d+":"+b]=a.address:c[d]=a.address,++b)})}),d.size(c)>0){if(c.en0)return c.en0;if(c.eth0)return c.eth0;if(c[Object.keys(c)[0]])return c[Object.keys(c)[0]]}return f},b.getOsInfo=function(){var a={arch:e.arch(),cpus:e.cpus(),freemem:e.freemem(),totalmem:e.totalmem(),hostname:e.hostname(),loadavg:e.loadavg(),networkInterfaces:e.networkInterfaces(),platform:e.platform(),release:e.release(),type:e.type(),uptime:e.uptime()};return a},b.getMiners=function(a){var b=c.resolve(__dirname,"../../bin"),d=[];f.readdir(b,function(e,f){return e?a(e):(f.forEach(function(a){var e={name:a,path:c.join(b,a)};e.version=g(e.path+" --version").toString(),e.version&&e.version.match(/\n/)&&(e.version=e.version.split("\n")[0]),d.push(e)}),void a(null,d))})},b.getMinerHelp=function(a,b){f.stat(a,function(c,d){if(c)return b(c);var e=g(a+" --help");b(null,e)})}}),"./app/queue.js":b(function(a,b){"use strict";var c,d=(require("path"),require("async")),e=require("chalk"),f=i("./miner.js","/Users/michele/Sites/cloud-minera/client/app/queue.js");b.start=function(a,b,e){b.Miner.find({},function(f,g){return f?console.log(f):void d.eachSeries(g,function(d,f){c(d,a,b,e),f()},function(){console.log("All jobs verified")})})},b.manageIntervals=c=function(a,b,c,d){c.Miner.findOne({_id:a._id},function(a,c){if(c)if(c.monitor){if(d[c._id])return void console.log("Job already loaded");d[c._id]=setInterval(function(){f.api(c,"summary+devs+pools",null,function(a,d){return a?(a=a.message||a,void b.emit("minerMonitor",{miner:c,error:a})):d?void b.emit("minerMonitor",{miner:c,stats:{results:d,lastseen:(new Date).toUTCString()}}):void b.emit("minerMonitor",{miner:c,error:"API results undefined"})})},c.pingDelay||3e3)}else if(d[c._id])return console.log(e.yellow("Job MinerPing stopped for %s"),c.name),clearInterval(d[c._id]),void delete d[c._id]})}}),"./app/miner.js":b(function(a,b){"use strict";var c=(require("path"),i("../config/config","/Users/michele/Sites/cloud-minera/client/app/miner.js"),require("lodash"),require("chalk"),require("q"),require("cgminer"));b.api=function(a,b,d,e){var f="127.0.0.1",g="4028";"network"===a.type&&(f=a.networkHost,g=a.networkPort);var h=new c({host:f,port:g});h.cmd(b,d).then(function(a){return e(null,a)},function(a){return e(a)})}})},d={"/users/michele/sites/cloud-minera/client/client.js":"/Users/michele/Sites/cloud-minera/client/client.js","/users/michele/sites/cloud-minera/client/config/config.js":"/Users/michele/Sites/cloud-minera/client/config/config.js","/users/michele/sites/cloud-minera/client/config/env/all.js":"/Users/michele/Sites/cloud-minera/client/config/env/all.js","/users/michele/sites/cloud-minera/client/config/env/production.js":"/Users/michele/Sites/cloud-minera/client/config/env/production.js","/users/michele/sites/cloud-minera/client/app/app.js":"/Users/michele/Sites/cloud-minera/client/app/app.js","/users/michele/sites/cloud-minera/client/app/socket.js":"/Users/michele/Sites/cloud-minera/client/app/socket.js","/users/michele/sites/cloud-minera/client/app/util.js":"/Users/michele/Sites/cloud-minera/client/app/util.js","/users/michele/sites/cloud-minera/client/app/queue.js":"/Users/michele/Sites/cloud-minera/client/app/queue.js","/users/michele/sites/cloud-minera/client/app/miner.js":"/Users/michele/Sites/cloud-minera/client/app/miner.js"},e=require("path"),f=function(a,b){var c=e.relative(a,b);return/^[\.\/\\]/.test(c)||/:\//.test(c)||(c="./"+c),c.indexOf(":")===-1&&(c=c.replace(/\\/g,"/")),c},g="/Users/michele/Sites/cloud-minera/client/client.js",h=function(a){var b=c.hasOwnProperty(a)?c[a]:null;return b||(a=d[a],a&&(b=c.hasOwnProperty(a)?c[a]:null)),b},i=function(b,c){if(!a.hasOwnProperty(b)){var d;c?(d=e.resolve(e.dirname(c),b),d=f(e.dirname(g),d)):d=f(__dirname,b);var i=h(d)||h(d+".js")||h(d+".json");if(i)return i();try{return require(d)}catch(a){}}return require(b)};this.__FAKE_REQUIRE__=i}();var config=__FAKE_REQUIRE__("./config/config","/Users/michele/Sites/cloud-minera/client/client.js"),chalk=require("chalk"),io=require("socket.io-client"),socket=io.connect("http://"+config.server.host+":"+config.server.port,config.server.options),db=require("linvodb3"),dbId=process.pid;db.dbPath="/tmp",db.System=new db("system-"+dbId),db.Miner=new db("miner-"+dbId),__FAKE_REQUIRE__("./app/app.js","/Users/michele/Sites/cloud-minera/client/client.js")(socket,db);