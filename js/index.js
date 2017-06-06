// 入口文件等
// require('../lib/jquery.custom-scrollbar2.js');
require('../lib/jquery.unslider.js');
require('./api/util.js');
require('./api/lazyload.js');
var RCbanner = require('./dev/banner.js');
var RCanchor = require('./dev/anchor.js');
var RCtab = require('./dev/tab.js');
var RCad = require('./dev/ad.js');
/***************************設置路由 start ********************************************** */
var RCWorkspace = Backbone.Router.extend({
    routes: {
        "": "singer"
    },
    initialize: function() {},
    singer: function() {
        var rcbanFl = new RCbanner.ViewFl({
            model: new RCbanner.Model()
        });
        $.rcbanFr = new RCbanner.ViewFr({
            model: rcbanFl.model
        });
        $.rcanchor = new RCanchor.View({
            model: new RCanchor.Model()
        });
        var rctab = new RCtab.View({
            model: new RCtab.Model()
        });
        var rcadFl = new RCad.ViewFl({
            model: new RCad.Model()
        });
        var rcadFr = new RCad.ViewFr({
            model: rcadFl.model
        });
        $('#rc-nav').append(rcadFl.el).prepend(rcadFr.el);
        $('#banfLTpl').html(rcbanFl.el);
        $('#banRLTpl').html($.rcbanFr.el);
        $('#rc-tabs').html(rctab.el);
        //$('#rc-content-anchor').html($.rcanchor.el);
    }
});
/***************************初始化路由 start ********************************************** */
$.app = new RCWorkspace();
Backbone.history.start();

var elemContainer = $('#app');
var customScrollbarInited = false;
var scrollBarTop = 0,
    scrollWrapTop = 0;

window.customScrollbar = function(toTop) {
    if (customScrollbarInited) {
        elemContainer.customScrollbar('resize', true);
    } else {
        elemContainer.customScrollbar({
            skin: 'default-skin',
            hScroll: false,
            updateOnWindowResize: true,
            animationSpeed: 500,
            onCustomScroll: function(event, scrollData) {
                $.initImagesLazyLoad(elemContainer);
            }
        });
        $('div.thumb', elemContainer).mousedown(function() {
            try { external.setCapture(); } catch (e) {}
        });
        customScrollbarInited = true;
    }
    if (toTop && $('div.scroll-bar', elemContainer).is(':visible')) {
        elemContainer.customScrollbar('scrollToY', 0);
    }
}

window.customScrollbarAppend = function() {
    scrollBarTop = $('.viewport .overview').css('top').replace('px', '') * 1;
    elemContainer.customScrollbar('resize', true);
    elemContainer.customScrollbar('scrollToY', scrollBarTop >= 0 ? scrollBarTop : -scrollBarTop);
}
$(function() {
    try {
        external.initComplete();
    } catch (e) {};

    customScrollbar(true);
    $(window).focus(function() {
        var _vm = $(this);
        _vm.trigger('resize');
        customScrollbar(true);
    });

    $(window).load(function() {

        // 獲取dom加載時間優先獲取到performance如沒有則獲取系統時間
        var end_time = _.now();
        var start_time = serverConfig.start_time;
        try {
            var timeSincePageLoad = Math.abs(Math.round(window.performance.now()));
        } catch (error) {
            var timeSincePageLoad = Math.abs(Math.round(end_time - start_time));
        }
        _ga('send', 'timing', 'dom', 'loaded', timeSincePageLoad, 'RC Live');
    });
})