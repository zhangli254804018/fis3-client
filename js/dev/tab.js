var SINGER_CONFIG = require('../api/config.js');
var RCgame = require('./game.js');
var RCteam = require('./team.js');
var conf = window.serverConfig;
var RCtabData = Backbone.Model.extend({
    defaults: {
        tab: {
            loaded: ['anchor'], //'game', 'team'
            current: 'anchor'
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
        this.on('change', this.tabChange)
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
        this.listenTo(this.model, 'change', this.render);
        this.render();
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
    clickTab: function(e) {
        var vm = $(e.currentTarget);
        var tab = vm.data('tab');
        var tabData = this.model.get('tab');
        // vm.addClass('active').siblings().removeClass('active');
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
                })
                $('#rc-content-team').html(rcteam.el);
                $('#rc-content-team').showLoading();
            }
            tabData.loaded.push(tab);
            $.extend(param, {
                loaded: tabData.loaded
            })
        };
        $('#rc-content-' + tab).removeClass('hide').siblings().addClass('hide');
        $(window).trigger('resize');
        this.model.set({
            tab: param
        });
    }
});

var RCs = {
    View: RCtabcview,
    Model: RCtabData
}

module.exports = RCs;