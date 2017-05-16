var SINGER_CONFIG = require('../api/config.js');
var conf = window.serverConfig;
var RCgameData = Backbone.Model.extend({
    defaults: {
        gameList: [],
        page: {
            total: 0,
            current: 0,
            len: 100
        }
    },
    // url: 'http://192.168.56.1:3000/index/act/userProfile?callback=' + _.now(), //設置請求的url接口地址
    parse: function(res) {
        var obj = {};
        if (res.code === 0) {
            obj = res.data
        }
        if (_.isArray(res.data)) {
            var page = this.get('page');
            var gameList = this.get('gameList');
            var gameExtend = _.union([], gameList, res.data);
            obj = {
                gameList: gameExtend,
                page: $.pageFormat(page, gameExtend)
            }
        }
        return obj;
    },
    //類似初始化的加載函數
    initialize: function() {
        // this.url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_GAME + '?type=0&size=20&page=1');
        // this.fetch({
        //     success: function() {
        //         $('#rc-content-game').showLoading('hide');
        //     },
        //     error: function() {
        //         $('#rc-content-game').showLoading('hide');
        //     }
        // });
        this.on('change', this.gameChange);
    },
    //格式化數據
    gameChange: function() {
        var gameList = this.get('gameList');
        var page = this.get('page');
        var pageLen = page.current ? page.len * (page.current) : 20;
        var index = 0;
        gameList = _.chain(gameList).sortBy(function(item) {
            return (item.game_type == 1)
        }).filter(function(item) {
            if (item.game_type == 1 && index < 5) {
                item.hot = 1;
                index++
            };
            return item.game_type
        }).value();
        return {
            gameList: gameList.slice(0, pageLen),
            page: page
        }
    }
});

var RCgameview = Backbone.View.extend({
    tagName: 'div',
    id: 'rc-rec',
    className: 'rc-rec singer-rec game-rec',
    initialize: function() {
        this.btnLoad = false;
        this.listenTo(this.model, 'change', this.render);
        this.fetch();
        // this.render();
    },
    events: {
        'click #rc-content-game a.link-rec': 'clickRec',
        'click #rc-content-game a.go-more': 'clickMore'
    },
    render: function() {
        var modelJson = this.model.gameChange();
        this.template = _.template($('#tpl_game').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        $(window).trigger('resize');
        return this;
    },
    fetch: function() {
        $('#rc-content-game').showLoading();
        var len = (this.model.get('page').len ? this.model.get('page').len : 20);
        var page = (this.model.get('page').current ? this.model.get('page').current : 1);
        this.model.url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_GAME + '?type=-1&size=' + len + '&page=' + page);
        this.model.fetch({
            success: function() {
                $('#rc-content-game').showLoading('hide');
            },
            error: function() {
                $('#rc-content-game').showLoading('hide');
            }
        });
        // this.model.on('change', this.model.gameChange);
    },
    clickRec: function(e) {
        var vm = $(e.currentTarget);
        vm.parent().addClass('active').siblings().removeClass('active');
    },
    clickMore: function(e) {
        if (this.btnLoad) return
        this.btnLoad = true;
        var vm = $(e.currentTarget);
        var currentPage = vm.data('current');
        currentPage++
        var gameList = this.model.get('gameList');
        var page = this.model.get('page');
        var param = $.extend({}, page, {
            current: currentPage
        })
        $.when(this.model.set({
            gameList: gameList,
            page: param
        })).then(this.fetch()).done(this.btnLoad = false);
    }
});

var RCs = {
    View: RCgameview,
    Model: RCgameData
}

module.exports = RCs;