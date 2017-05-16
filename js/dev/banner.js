var SINGER_CONFIG = require('../api/config.js');
var conf = window.serverConfig;
var autuParam = {
    autoplay: true,
    speed: 500, //  The speed to animate each slide (in milliseconds)
    delay: 4000, //  The delay between slide animations (in milliseconds)
    complete: function() {}, //  A function that gets called after every slide animation
    dots: true, //  Display dot navigation
    fluid: false //  Support responsive design. May break non-responsive designs
}
var RCbanData = Backbone.Model.extend({
    defaults: {
        banner: {
            sess_music: {},
            sess_game: {},
            sess_show: {},
            top_banners_show: [],
            top_banners_game: []
        },
        bannerSet: undefined
    },
    // url: 'http://192.168.56.1:3000/index/act/userProfile?callback=' + _.now(), //設置請求的url接口地址
    parse: function(res) {
        var obj = {};
        if (res.code === 0) {
            obj = res.data
        }
        return obj;
    },
    //類似初始化的加載函數
    initialize: function() {
        this.on('change', this.banChange)
    },
    //格式化數據
    banChange: function() {
        var data = this.get('banner');
        var dataSet = this.get('bannerSet');
        var keys = _.keys(data);
        $.each(keys, function(index, item) {
            if (!_.isArray(data[item])) {
                var path = [];
                var items = data[item];
                path.push(items);
                data[item] = path;
            }
        });
        //進行判斷是否存在show推薦綜藝 如果有直接使用第一個如果沒有則從主播列表隨機選擇在線播放的
        var sess_show = _.isArray(data.sess_show) ? data.sess_show[0] : {};
        if (!_.has(sess_show, 'cid')) {
            var path = [];
            var param = {};
            if ($.rcanchor) {
                var anclistrm = $.rcanchor.model.anChange().anclistrm
                $.extend(param, anclistrm)
            };
            $.extend(param, {
                img: conf.rc_assets + 'img/ic_hot_rec.png'
            })
            path.push(param)
            data.sess_show = path
        }
        return {
            banner: data,
            bannerSet: dataSet ? dataSet : data['sess_music']
        }
    }
});

var RCbanFLview = Backbone.View.extend({
    tagName: 'div',
    className: 'ban-fl',
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        var conData = {
            sess_music: conf.sess_music,
            sess_game: conf.sess_game,
            sess_show: conf.sess_show,
            top_banners_show: conf.top_banners_show,
            top_banners_game: conf.top_banners_game
        }
        var data = $.extend({}, this.model.get('banner'), conData);
        this.model.set({ banner: data });
        // this.render();
    },
    events: {
        'click #banfLTpl .slides a.link-banner': 'ClickBanner'
            // 'hover #banfLTpl .slides a.link-banner': 'HoverBanner'
    },
    render: function() {
        var modelJosn = this.model.banChange();
        this.template = _.template($('#tpl_banfL').html())
        this.$el.html(this.template(modelJosn));
        this.delegateEvents();
        var self = this;
        self.$el.find('.slider-focus .banner').unslider(autuParam);
        return this;
    },
    ClickBanner: function(e) {
        var img = new Image(),
            elem = $(e.currentTarget);
        var url = elem.data('url');
        img.src = $.addMathroundParam(elem.data('click'));
        // if (isNaN(url)) {
        //     window.open(url)
        // } else {
        //     var flashvars = {};
        //     var attributes = { id: "myDynamicContent", name: "myDynamicContent" };
        //     var live_url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_LIVE);
        //     var el = $('#myDynamicContent');
        //     img.src = 'assets/swf/HomeShow2.swf';
        //     $.getJSON(live_url, { uid: url }, function(res) {
        //         $.extend(flashvars, res);
        //         swfobject.embedSWF(conf.rc_swf, 'myDynamicContent', "560", "420", "9.0.0", conf.rc_express, flashvars);
        //     })
        // }
    }
});

var RCbanFRview = Backbone.View.extend({
    tagName: 'div',
    className: 'ban-fr',
    initialize: function() {
        this.index = 0;
        this.listenTo(this.model, 'change:banner', this.render);
        this.render();
    },
    secBanner: function() {
        var modelJosn = this.model.banChange()['banner'];
        var uninlist = _.union(modelJosn.sess_music, modelJosn.sess_game, modelJosn.sess_show);
        var findLastIndex = _.findIndex(uninlist, function(item) {
            return item.live && item.link_type == 3
        })
        $('.slider-live').eq((findLastIndex != -1) ? findLastIndex : 2).trigger('click');
    },
    events: {
        'click #banRLTpl .slider-item': 'ClickSlider',
        'click #banRLTpl .slider-item a.link-banner': 'ClickBanner'
    },
    render: function() {
        var modelJosn = this.model.banChange()['banner'];
        this.template = _.template($('#tpl_banRL').html());
        this.$el.html(this.template(modelJosn));
        this.delegateEvents();
        var self = this;
        _.delay(function() {
            self.sliders_game = $('.slider-game .banner').unslider(autuParam);
            self.sliders = $('.slider-show .banner').unslider(autuParam);
            self.sliders.find('.dot').click(function(e) {
                e.stopPropagation();
                self.index = $(this).index();
                $('.slider-focus .banner')._move(autuParam, self.index);
                self.livePlayer();
            });
            self.sliders.find('.arrows>span').on('click', function(e) {
                // e.stopPropagation();
                var parent = $(this).parent().prev();
                self.index = parent.find('.active').index();
                $('.slider-focus .banner')._move(autuParam, self.index);
                self.livePlayer();
            });
            self.sliders_game.find('.dot').click(function(e) {
                e.stopPropagation();
                self.index = $(this).index();
                $('.slider-focus .banner')._move(autuParam, self.index);
            });
            self.secBanner();
        }, 500);
        return this;
    },
    ClickSlider: function(e) {
        e.stopPropagation();
        var param = $.extend({}, this.model);
        var vm = $(e.currentTarget);
        var key = vm.data('keys');
        var dataList = this.model.banChange()['banner'];
        var dataSet = this.model.banChange()['bannerSet'];
        //!== dataSet
        if (_.has(dataList, key) && dataList[key] != dataSet) {
            param = $.extend({}, param, {
                bannerSet: dataList[key]
            });
        };
        $.when(this.model.set(param)).then(
            function() {
                vm.addClass('active').siblings().removeClass('active');
            }
        ).then(this.livePlayer());
    },
    ClickBanner: function(e) {
        var img = new Image(),
            elem = $(e.currentTarget);
        var url = elem.data('url');
        img.src = $.addMathroundParam(elem.data('click'));
    },
    livePlayer: function(e) {
        var bannerSet = this.model.banChange()['bannerSet'];
        // var index = this.index ? this.index : 0;
        var bannerPlayer = bannerSet ? bannerSet[0] : '';
        if (!bannerPlayer) return;
        var url = bannerPlayer.url;
        var link_type = bannerPlayer.link_type;
        var uid = bannerPlayer.uid;
        var cid = bannerPlayer.cid;
        var sid = bannerPlayer.sid;
        var live = bannerPlayer.live;
        var token = $.getQueryString('cookie');
        // this.index = 0;
        if (link_type == 3 && live) {
            var flashvars = {};
            var attributes = { id: "myDynamicContent", name: "myDynamicContent" };
            var live_url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_LIVE);
            var el = $('#myDynamicContent');
            $.getJSON(live_url, { uid: uid, cid: cid, sid: sid, token: token }, function(res) {
                $.extend(flashvars, res);
                swfobject.embedSWF($.addMathroundParam(conf.rc_swf), 'myDynamicContent', "560", "420", "9.0.0", conf.rc_express, flashvars);
            })
        }
    }
});

var RCs = {
    ViewFr: RCbanFRview,
    ViewFl: RCbanFLview,
    Model: RCbanData
}

module.exports = RCs;