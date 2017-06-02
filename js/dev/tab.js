var SINGER_CONFIG = require('../api/config.js');
var RCanchor = require('./anchor.js');
var RCgame = require('./game.js');
var RCteam = require('./team.js');
var conf = window.serverConfig;
var RCtabData = Backbone.Model.extend({
    defaults: {
        tab: {
            loaded: [], //'game', 'team'
            current: ''
        }
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
        this.on('change', this.tabChange);
    },
    //格式化數據
    tabChange: function() {
        return {
            tab: this.get('tab')
        }
    }
});

var RCtabcview = Backbone.View.extend({
    tagName: 'div',
    id: 'rc-tab',
    className: 'rc-tab clearfix',
    initialize: function() {
        var _shuffle = _.sample(['game', 'team', 'anchor']);
        var _path = [];
        var _tab = this.model.get('tab');
        var modelJson = this.model.tabChange()['tab'];
        _tab.current = _shuffle;
        this.initTab(modelJson.current, modelJson);
        this.listenTo(this.model, 'change', this.render);
        this.model.set(_tab);
    },
    events: {
        'click #rc-tab a.link-tab': 'clickTab'
    },
    render: function() {
        var modelJson = this.model.tabChange();
        this.template = _.template($('#tpl_tab').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        return this;
    },
    initTab: function(tab, tabData) {
        if (!tab) return;
        var lastIndexFind = _.findLastIndex(tabData.loaded, function(item) {
            return item === tab
        });
        //加載變量等
        var param = $.extend({}, tabData, {
            current: tab
        });
        //未加載過數據
        if (lastIndexFind == -1) {
            if (tab == 'game') {
                var rcgame = new RCgame.View({
                    model: new RCgame.Model()
                });
                $('#rc-content-game').html(rcgame.el);
                $('#rc-content-game').showLoading();
            } else if (tab == 'team') {
                var rcteam = new RCteam.View({
                    model: new RCteam.Model()
                });
                $('#rc-content-team').html(rcteam.el);
                $('#rc-content-team').showLoading();
            } else if (tab == 'anchor') {
                $('#rc-content-anchor').html($.rcanchor.el);
                $('#rc-content-anchor').showLoading();
                _.delay(function() {
                    $('#rc-content-anchor').showLoading('hide');
                }, 300);
            }
            tabData.loaded.push(tab);
            $.extend(param, {
                loaded: tabData.loaded
            })
        };
        $('#rc-content-' + tab).removeClass('hide').siblings().addClass('hide');
        this.model.set({
            tab: param
        });
        $.initImagesLazyLoad('.rc-rec');
    },
    clickTab: function(e) {
        var vm = $(e.currentTarget);
        var tab = vm.data('tab');
        var tabData = this.model.get('tab');
        // vm.addClass('active').siblings().removeClass('active');
        this.initTab(tab, tabData);
        window.customScrollbarAppend();
    }
});

var RCs = {
    View: RCtabcview,
    Model: RCtabData
}

module.exports = RCs;