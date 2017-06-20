var SINGER_CONFIG = require('../api/config.js');
var conf = window.serverConfig;
var RCteamData = Backbone.Model.extend({
    defaults: {
        teamList: [],
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
            var teamList = this.get('teamList');
            var teamExtend = _.union([], teamList, res.data);
            obj = {
                teamList: teamExtend,
                page: $.pageFormat(page, teamExtend)
            }
        }
        return obj;
    },
    //類似初始化的加載函數
    initialize: function() {
        // var len = (this.get('page').len ? this.get('page').len : 20);
        // this.url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_TEAM + '?type=0&size=' + len + '&page=1');
        // this.fetch({
        //     success: function() {
        //         $('#rc-content-team').showLoading('hide');
        //     },
        //     error: function() {
        //         $('#rc-content-team').showLoading('hide');
        //     }
        // });
        this.on('change', this.gameChange);
    },
    //格式化數據
    gameChange: function() {
        var teamList = this.get('teamList');
        var page = this.get('page');
        var pageLen = page.current ? page.len * (page.current) : 20;
        var teamListN = _.chain(teamList).filter(function(item) {

            return (item.onlines >= 10)
        }).value();
        return {
            teamList: teamListN.slice(0, pageLen),
            page: page
        }
    }
});

var RCteamview = Backbone.View.extend({
    tagName: 'div',
    id: 'rc-rec',
    className: 'rc-rec singer-rec team-rec',
    initialize: function() {
        this.btnLoad = false;
        this.fetch();
        this.listenTo(this.model, 'change', this.render);
        // this.render();
    },
    events: {
        'click #rc-content-team ul>li a.link-rec': 'clickRec',
        'click #rc-content-team a.go-more': 'clickMore'
    },
    render: function() {
        var modelJson = this.model.gameChange();
        this.template = _.template($('#tpl_team').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        $('body').customScrollbar('scrollToY', 0);
        if (!this.btnLoad) $(window).trigger('resize');
        this.btnLoad = true;
        $.initImagesLazyLoad(this.$el.find('.link-rec'));
        return this;
    },
    fetch: function() {
        $('#rc-content-team').showLoading();
        var len = (this.model.get('page').len ? this.model.get('page').len : 20);
        var page = (this.model.get('page').current ? this.model.get('page').current : 1);
        this.model.url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_TEAM + '?type=0&size=' + len + '&page=' + page);
        this.model.fetch({
            success: function() {
                $('#rc-content-team').showLoading('hide');
            },
            error: function() {
                $('#rc-content-team').showLoading('hide');
            }
        });
        // this.model.on('change', this.model.gameChange);
    },
    clickRec: function(e) {
        var vm = $(e.currentTarget);
        var sid = vm.data('sid');
        try {
            external.enterServer(sid, 0, 6);
        } catch (error) {}
    },
    clickMore: function(e) {
        // if (this.btnLoad) return
        // this.btnLoad = true;
        var vm = $(e.currentTarget);
        var currentPage = vm.data('current');
        currentPage++;
        var teamList = this.model.get('teamList');
        var page = this.model.get('page');
        var param = $.extend({}, page, {
            current: currentPage
        })
        $.when(this.model.set({
            teamList: teamList,
            page: param
        })).then(this.fetch());
    },
    hoverRec: function(e) {
        var vm = $(e.currentTarget);
        //$(vm).children().children('h3').adOverflow();
        // e.stopPropagation();
    }
});

var RCs = {
    View: RCteamview,
    Model: RCteamData
}

module.exports = RCs;