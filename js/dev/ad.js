var SINGER_CONFIG = require('../api/config.js');
var conf = window.serverConfig;
var RCadData = Backbone.Model.extend({
    defaults: {
        ad: {
            url: conf.ad.rc_adurl,
            img: conf.rc_assets + 'img/ad/live_event.png',
            banbg: conf.rc_assets + 'img/ad/live_bg.png',
            bg: conf.rc_assets + 'img/ad/live_bg_repeat.png',
            show_report_url: '',
            title: conf.ad.rc_adtitle
        }
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
        this.on('change', this.adChange);
    },
    //格式化數據
    adChange: function() {
        return {
            ad: this.get('ad')
        }
    }
});

var RCadviewFl = Backbone.View.extend({
    tagName: 'div',
    id: 'rc-ad-fl',
    className: 'rc-ad rc-ad-fl',
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    events: {
        'click #rc-content-game a.link-rec': 'clickRec'
    },
    render: function() {
        var modelJson = this.model.adChange()['ad'];
        var self = this;
        var img = new Image();
        img.src = modelJson.img;
        img.onload = function() {
            self.$el.adSize('#rc-banner');
        };
        this.template = _.template($('#tpl_ad').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        return this;
    },
    clickRec: function(e) {
        var vm = $(e.currentTarget);
    }
});

var RCadviewFr = Backbone.View.extend({
    tagName: 'div',
    id: 'rc-ad-fr',
    className: 'rc-ad rc-ad-fr',
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    events: {
        'click #rc-content-game a.link-rec': 'clickRec'
    },
    render: function() {
        var modelJson = this.model.adChange()['ad'];
        var self = this;
        var img = new Image();
        img.src = modelJson.img;
        img.onload = function() {
            self.$el.adSize('#rc-banner');
        };
        this.template = _.template($('#tpl_ad').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        return this;
    },
    clickRec: function(e) {
        var vm = $(e.currentTarget);
    }
});

var RCs = {
    ViewFr: RCadviewFr,
    ViewFl: RCadviewFl,
    Model: RCadData
}

module.exports = RCs;