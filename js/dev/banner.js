var SINGER_CONFIG = require('../api/config.js');
var conf = window.serverConfig;
var autuParam = {
    autoplay: true, //是否自動輪播
    speed: 500, //  輪播的速度
    delay: 4000, //  間隔輪播的時間
    complete: function() {}, //  輪播一個bnner函數之後回調函數
    dots: true, //  是否顯示點輪播指示燈
    fluid: false //  是否支持自適應
};
var stopParam = $.extend({}, autuParam, {
    autoplay: false //是否自動輪播
});
var alink = $('<a href="javascript:;" class="slider-link"></a>');
var cover = $('<div class="banner-cover"></div>');
var RCbanData = Backbone.Model.extend({
    defaults: {
        banner: {
            sess_music: {},
            sess_game: {},
            sess_show: {},
            top_banners_show: [],
            top_banners_game: [],
            sess_index: {
                game: 0,
                show: 0,
                music: 0
            }
        },
        bannerLive: {},
        bannerSet: undefined
    },
    parse: function(res) {
        var obj = {};
        if (res.code === 0) {
            obj = res.data
        }
        return obj;
    },
    //類似初始化的加載函數
    initialize: function() {
        // this.banChange();
        this.on('change', this.banChange);
    },
    banData: function() {
        //進行判斷是否存在show推薦綜藝 如果有直接使用第一個如果沒有則從主播列表隨機選擇在線播放的
        var banner = this.get('banner');
        var bannerSet = this.get('bannerSet');
        var bannerLive = this.get('bannerLive');
        var keys = _.keys(banner);
        $.each(keys, function(index, item) {
            if (!_.isArray(banner[item])) {
                var path = [];
                var items = banner[item];
                path.push(items);
                banner[item] = path;
            }
        });
        var param = {};
        var showPath = [];
        var musicPath = [];
        var banners = $.extend({}, banner);
        var uninlist = $.userListFormat(banner);
        var sessmusicList = _.chain(uninlist).filter(function(item) {
            return item.status === 'sess_music' && item.live && item.link_type == 3
        }).value();
        var sessshowList = _.chain(uninlist).filter(function(item) {
            return item.status === 'sess_show'
        }).value();
        if (conf.anchorListM) {
            var anclistrm = conf.anchorListM ? conf.anchorListM :
                $.rcanchor.model.anChange().anclistrm;
            $.extend(param, anclistrm)
        };
        //热门live出现：综艺那边后台没有上传有效时间内的bn时出现，此时展示热门live的bn（唯一）
        if (!sessshowList.length) {
            // var paths = [];
            // if (banner.sess_show.length > 0) {
            //     var paramShow = $.extend({}, param);
            //     var sampleShow = _.chain(banner.sess_show).sample().value();
            //     $.extend(sampleShow ? sampleShow : banner.sess_show[0], paramShow);
            //     paths.push(paramShow);
            //     banners = $.extend({}, banner, {
            //         sess_show: banner.sess_show
            //     });
            // } else {
            //     var paramShow = $.extend({}, {
            //         img: conf.rc_assets + 'img/ic_hot_rec.png'
            //     }, param);
            //     banners = $.extend({}, banner, {
            //         sess_show: paramShow
            //     });
            // }
            var paramShow = $.extend({
                img: conf.rc_assets + 'img/ic_hot_rec.png'
            }, param);
            showPath.push(paramShow);
            var paramShowList = _.union(banner.sess_show ? banner.sess_show : [], showPath)
            $.extend(banners, banner, {
                sess_show: paramShowList
            });
        };
        //音乐房：只有一个规则，3个推荐位都没视频播时播“热门live”，综艺位播了热门live就不需要再在这边播了。播热门live时展示热门live的bn（固定唯一）
        if (!sessmusicList.length && !showPath.length && conf.anchorListM) {
            // if (banner.sess_music.length > 0) {
            //     var path = [];
            //     var paramMusic = $.extend({}, param);
            //     var sampleMusic = _.chain(banner.sess_show).sample().value();
            //     $.extend(sampleMusic ? sampleMusic : banner.sess_music[0], paramMusic);
            //     path.push(paramMusic);
            //     banners = $.extend({}, banner, {
            //         sess_music: banner.sess_music
            //     });
            // } else {
            //     var paramMusic = $.extend({}, {
            //         img: conf.rc_assets + 'img/ic_hot_rec.png'
            //     }, param);
            //     banners = $.extend({}, banner, {
            //         sess_music: paramMusic
            //     });
            // }
            var paramMusic = $.extend({
                img: conf.rc_assets + 'img/ic_hot_rec.png'
            }, param);
            musicPath.push(paramMusic);
            var paramMusicList = _.union(banner.sess_music ? banner.sess_music : [], musicPath)
            $.extend(banners, banner, {
                sess_music: paramMusicList
            });
        };
        this.set($.extend({}, {
            banner: banner,
            bannerSet: bannerSet,
            bannerLive: bannerLive
        }, {
            banner: banners
        }));
    },
    //格式化數據
    banChange: function() {
        this.banData();
        var banner = this.get('banner');
        var bannerSet = this.get('bannerSet');
        var bannerLive = this.get('bannerLive');
        return {
            banner: banner,
            bannerSet: bannerSet ? bannerSet : banner['sess_music'],
            bannerLive: bannerLive
        }
    }
});

var RCbanFLview = Backbone.View.extend({
    tagName: 'div',
    className: 'ban-fl',
    initialize: function() {
        this.listenTo(this.model, 'change:bannerSet', this.render);
        // this.loaded = false;
    },
    events: {
        'click #banfLTpl .slides a.link-banner': 'ClickBanner'
    },
    render: function() {
        var modelJosn = this.model.banChange();
        // if (this.loaded && _.has(modelJosn, 'bannerSet')) {
        //     $.each(modelJosn.bannerSet, function(index, item) {
        //         item.loaded = true;
        //     })
        // };
        this.template = _.template($('#tpl_banfL').html())
        this.$el.html(this.template(modelJosn));
        this.delegateEvents();
        var self = this;
        self.$el.find('.slider-focus .banner').unslider(stopParam);
        $.each(modelJosn.bannerSet, function(index, item) {
            self.$el.find('.sliders-banner.link-banner').eq(index).data('banner', item);
        });
        $.initImagesLazyLoad(this.$el, {
            timeout: 1000
        });
        $.delayBounce(function() {
            _.delay(function() {
                var bannerLiveKey = modelJosn.bannerSet;
                $.each(bannerLiveKey, function(index, item) {
                    item.loaded = true
                });
                var param = $.extend({}, modelJosn, {
                    bannerSet: bannerLiveKey
                });
                self.model.set(param);
            }, 500);
        }, 500)

        // if (!this.loaded) this.loaded = true;
        return this;
    },
    ClickBanner: function(e) {
        e.stopPropagation();
        var elem = $(e.currentTarget);
        var banner = elem.data('banner');
        var img = new Image();
        img.src = $.addMathroundParam(banner.click_report_url);
        $.rcbanFr.live({
            url: banner.url,
            link_type: banner.link_type,
            uid: banner.uid,
            cid: banner.cid,
            sid: banner.sid,
            rawSid: banner.rawSid,
            live: banner.live,
            report: banner.report,
            url_open: 0
        });
    }
});

var RCbanFRview = Backbone.View.extend({
    tagName: 'div',
    className: 'ban-fr',
    initialize: function() {
        this.listenTo(this.model, 'change:banner', this.render);
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
    sectList: function(uninlist, _status) {
        var simpleLastItem = _.chain(uninlist).filter(function(item) {
            return item.live && item.link_type == 3
        }).sample().value();
        var findLastIndex = _.findLastIndex(uninlist, function(item) {
            return item == simpleLastItem
        });
        var _status = _status ? _status : (((findLastIndex != -1) ? uninlist[findLastIndex].status : 'sess_music'));
        var findBannerIndex = _.chain(uninlist).filter(function(item) {
            return item.status == _status
        }).findLastIndex(function(item) {
            return item == uninlist[(findLastIndex != -1) ? findLastIndex : 0]
        }).value();
        return {
            index: (findBannerIndex !== -1 ? findBannerIndex : 0),
            status: _status
        }
    },
    secBanner: function() {
        var self = this;
        var banner = this.model.banChange()['banner'];
        var modelJosn = $.extend({}, banner);
        var uninlist = $.userListFormat(modelJosn);
        var findBannerIndex = this.sectList(uninlist);
        return findBannerIndex
    },
    events: {
        'click #banRLTpl .slider-item': 'ClickSlider',
        'click #banRLTpl .slider-item a.link-banner': 'ClickBanner'
    },
    render: function() {
        var self = this;
        var modelJosn = this.model.banChange()['banner'];
        this.template = _.template($('#tpl_banRL').html());
        this.$el.html(this.template(modelJosn));
        this.delegateEvents();
        this.$el.find('.slider-item').append(cover);
        this.$el.find('a.link-banner').append(alink);
        _.delay(function() {
            self.sliders = $('.slider-item .banner').unslider(autuParam);
            self.$el.find('a.link-banner').add(self.sliders.find('.dot')).click(function(e) {
                e.stopPropagation();
                var vm = $(e.currentTarget);
                var index = vm.hasClass('link-banner') ? $(e.currentTarget).parents('li').data('index') : vm.index();
                self.ClickBLink(index);
            });
            $.delayBounce(function() {
                //獲取初始化隨機的播放右側tab
                var findBannerIndex = self.secBanner();
                self.ClickSlider('', '[data-keys=' + findBannerIndex['status'] + ']');
                $.initImagesLazyLoad(self.$el, {
                    timeout: 100
                });
            }, 500)
        }, 500);
        return this;
    },
    ClickBLink: function(index) {
        $('.slider-focus .banner')._move(stopParam, index ? index : 0);
    },
    ClickBanner: function(e, _this) {
        if (e) e.stopPropagation();
        var vm = e ? $(e.currentTarget) : $(_this);
        $.initImagesLazyLoad(this.$el, {
            timeout: 50
        });
    },
    ClickSlider: function(e, _this) {
        if (e) e.stopPropagation();
        var vm = e ? $(e.currentTarget) : $(_this);
        var key = vm.data('keys');
        var dataList = this.model.banChange()['banner'];
        var dataSet = this.model.banChange()['bannerSet'];
        var param = $.extend({}, { banner: dataList, bannerSet: dataSet });
        var index = vm.find('.has-dots').attr('data-index');
        var _index = 0;
        var self = this;
        var bannerLiveKey;
        if (_.has(dataList, key)) {
            var dataKey = bannerLiveKey = dataList[key];
            var bannerLive = _.chain(dataKey).filter(function(item) {
                return item.live && item.link_type == 3
            }).sample().value();
            _index = _.findLastIndex(dataKey, function(item) {
                return item === bannerLive
            });
            param = $.extend({}, param, {
                bannerSet: bannerLiveKey,
                bannerLive: bannerLive ? bannerLive : {}
            });
        };

        $.when(this.model.set(param)).then(this.ClickBanner(e, _this)).then(function() {
            vm.siblings('.slider-live').find('.banner')._always(autuParam);
            vm.addClass('active').siblings().removeClass('active');
        }).then(function() {
            self.ClickBLink(index);
            if (key.indexOf('sess_') > -1 && _.has(bannerLive, 'live')) {
                vm.find('.banner')._slide(autuParam, _index);
            };
        }).done(this.livePlayer());
    },
    livePlayer: function(e) {
        var bannerSet = this.model.banChange()['bannerSet'];
        var bannerLive = this.model.banChange()['bannerLive'];
        var bannerPlayer = bannerLive ? bannerLive : {};
        bannerPlayer.url_open = 1;
        this.live(bannerPlayer);
    },
    live: function(bannerPlayer) {
        if (!bannerPlayer) return;
        var url = bannerPlayer.url;
        var link_type = bannerPlayer.link_type;
        var uid = bannerPlayer.uid;
        var cid = bannerPlayer.cid;
        var sid = bannerPlayer.sid;
        var rawSid = bannerPlayer.rawSid;
        var live = bannerPlayer.live;
        var report_url = bannerPlayer.click_report_url;
        var tips = bannerPlayer.tips;
        var token = $.getQueryString('cookie');
        var url_open = bannerPlayer.url_open;
        var param = {
            page_version: 'index_830',
            event_type: 'promote_channel_enter',
            uid: conf.uid
        };
        var params = param.page_version + '/' + param.event_type + '/' + param.uid;
        var collect_url = 'http://ads.raidtalk.com.tw/main_statics/' + params + '.png';
        var el = $('#myDynamicContent');
        var self = this;
        var linktypeFn = function() {
            if (link_type == 3 && live && url_open == 1) {
                var myDynamicContent = $('<div class="sliders-tv" id="myDynamicContent"></div>');
                $('#banfLTpl').find('.banner').append(myDynamicContent);
                var attributes = { id: "myDynamicContent", name: "myDynamicContent" };
                var live_url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_LIVE);
                var wmode = { wmode: 'transparent' };
                var flashvars = {
                    cid: cid,
                    sid: sid,
                    rawSid: rawSid,
                    report_url: (report_url ? encodeURIComponent($.addMathroundParam(report_url)) : ''),
                    collect_url: (collect_url ? encodeURIComponent($.addMathroundParam(collect_url)) : ''),
                    tips: tips,
                    time: 60 * 1000 * 1
                };
                swfobject.embedSWF(conf.rc_swf, 'myDynamicContent', "560", "420", "9.0.0", conf.rc_express, flashvars);
                // _ga('send', 'event', 'showuser', 'click', '左側tab主播視頻');
            } else if (link_type == 1 && isNaN(url) && url_open == 0) {
                window.open(url);
            } else if (isNaN(url) && link_type == 3 && url_open == 0) {
                try {
                    external.enterServer(sid, cid, 6);
                } catch (error) {}
            } else if (isNaN(url) && link_type == 2 && url_open == 0) {
                try {
                    location.href = url
                } catch (error) {}
            }
        };
        $.delayBounce(function() {
            el.remove();
            linktypeFn();
        }, 600);
    }
});

var RCs = {
    ViewFr: RCbanFRview,
    ViewFl: RCbanFLview,
    Model: RCbanData
}

module.exports = RCs;