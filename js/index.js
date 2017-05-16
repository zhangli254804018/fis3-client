// 入口文件等
require('../lib/jquery.unslider.js');
require('./api/util.js');
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
        $.rcanchor = new RCanchor.View({
            model: new RCanchor.Model()
        });
        var rcbanFl = new RCbanner.ViewFl({
            model: new RCbanner.Model()
        });
        $.rcbanFr = new RCbanner.ViewFr({
            model: rcbanFl.model
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
        $('#rc-content-anchor').html($.rcanchor.el);
    }
});
/***************************初始化路由 start ********************************************** */
$(function() {
    $.app = new RCWorkspace();
    Backbone.history.stop();
    Backbone.history.start();
});

var elemContainer = $('body');
var customScrollbarInited = false;
var scrollBarTop = 0,
    scrollWrapTop = 0;

function customScrollbar(toTop) {
    window.setTimeout(function() {
        if (customScrollbarInited) {
            elemContainer.customScrollbar('resize');
        } else {
            elemContainer.customScrollbar({
                skin: 'default-skin',
                hScroll: false,
                updateOnWindowResize: true,
                animationSpeed: 500
            });
            $('div.thumb', elemContainer).mousedown(function() {
                try { external.setCapture(); } catch (e) {}
            });
            customScrollbarInited = true;
        }
        if (toTop && $('div.scroll-bar', elemContainer).is(':visible')) {
            elemContainer.customScrollbar('scrollToY', 0);
        }
    }, 500);
}

function customScrollbarAppend() {
    window.setTimeout(function() {
        scrollBarTop = $('.viewport .overview').css('top').replace('px', '') * 1;
        elemContainer.customScrollbar('resize');
        elemContainer.customScrollbar('scrollToY', scrollBarTop >= 0 ? scrollBarTop : -scrollBarTop);
    }, 100)
}
$(function() {
    try {
        external.initComplete();
    } catch (e) {};

    customScrollbar(true);
    $(window).focus(function() {
        customScrollbar(true);
    })
})