 //定義下初始化接口地址
 (function(conf) {
     var conf = window.serverConfig;
     var SINGER_CONFIG = {
         'PATH': {
             'GET_SHOW': conf.apis.show, //type=0&size=15&page=1
             'GET_GAME': conf.apis.game, //type=0&size=15&page=1
             'GET_TEAM': conf.apis.team, //type=0&size=15&page=1
             'GET_LIVE': conf.apis.live, //uid=0
             'GET_SWF': conf.apis.swf //uid=0
         }
     };
     module.exports = SINGER_CONFIG;
 })(window.serverConfig);