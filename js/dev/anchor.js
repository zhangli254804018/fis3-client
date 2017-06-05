var SINGER_CONFIG = require('../api/config.js');
var conf = window.serverConfig;
var RCancData = Backbone.Model.extend({
    defaults: {
        anchorList: [],
        page: {
            total: 0,
            current: 0,
            len: 15
        }
    },
    // url: 'http://192.168.56.1:3000/index/act/userProfile?callback=' + _.now(), //設置請求的url接口地址
    parse: function(res) {
        var obj = {};
        if (res.code === 0) {
            obj = res.data
        }
        if (_.isArray(res)) {
            var page = this.get('page')
            obj = {
                anchorList: res,
                page: $.pageFormat(page, res)
            }
        }
        return obj;
    },
    //類似初始化的加載函數
    initialize: function() {
        this.url = $.addCallbackParam(SINGER_CONFIG.PATH.GET_SHOW + '?type=0&size=20&page=1');
        // this.fetch();
        this.on('change', this.anChange);
    },
    //格式化數據
    anChange: function() {
        var anchorList = this.get('anchorList');
        var page = this.get('page');
        var pageLen = page.current ? page.len * (page.current) : 15;
        var anchorListF = _.chain(anchorList).filter(function(item) {
            return (item.live || item.label)
        }).sortBy(function(item) {
            return !item.lvNum
        }).sortBy(function(item) {
            return !item.label
        }).value();
        var anchorListN = anchorListF.concat(_.chain(anchorList).filter(function(item) {
            return !item.live
        }).sortBy(function(item) {
            return !item.lvNum && !item.online
        }).value());
        var anchorListM = conf.anchorListM = _.chain(anchorList).filter(function(item) {
            if (item.live) item.link_type = 3;
            return !item.cate && item.live == 1 && !item.label
        }).sortBy(function(item) {
            return -item.weight
        }).filter(function(item) {
            return item.weight >= 50
        }).sample().value();
        return {
            anclistrm: anchorListM,
            anclist: anchorListF.length >= 15 ? $.formatNum(anchorListF, anchorListN) : anchorListN.slice(0, pageLen),
            page: page
        }
    }
});

var RCancview = Backbone.View.extend({
    tagName: 'div',
    id: 'rc-rec',
    className: 'rc-rec singer-rec singers-rec',
    initialize: function() {
        this.btnLoad = false;
        this.listenTo(this.model, 'change', this.render);
        this.model.fetch();
    },
    events: {
        'click #rc-rec ul>li a.link-rec': 'clickRec',
        'click #rc-rec a.go-more': 'clickMore',
        'mouseout #rc-rec ul>li a.link-rec': 'clickRecOut'
    },
    render: function() {
        var modelJson = this.model.anChange();
        this.template = _.template($('#tpl_anchor').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        $.initImagesLazyLoad(this.$el.find('.link-rec'));
        $(window).trigger('resize');
        return this;
    },
    clickRec: function(e) {
        var vm = $(e.currentTarget);
        var live = vm.data('live');
        var cid = vm.data('cid');
        var uid = vm.data('uid');
        var sid = vm.data('sid');
        //vm.parent().addClass('active').siblings().removeClass('active');
        if (live == 1) {
            try {
                external.enterServer(sid, cid, 6);
            } catch (error) {}
        } else {
            window.open('//rcshow.tv/live/?uid=' + uid);
        }
    },
    clickRecOut: function(e) {
        var vm = $(e.currentTarget);
        //vm.parent().removeClass('active');
    },
    clickMore: function(e) {
        if (this.btnLoad) return
        this.btnLoad = true;
        var vm = $(e.currentTarget);
        var currentPage = vm.data('current');
        currentPage++
        var anchorList = this.model.get('anchorList');
        var page = this.model.get('page');
        var param = $.extend({}, page, {
            current: currentPage
        })
        $.when(this.model.set({
            anchorList: anchorList,
            page: param
        })).then(this.btnLoad = false)
    },
    hoverRec: function(e) {
        var vm = $(e.currentTarget);
        //$(vm).children().children('h3').adOverflow();
        // e.stopPropagation();
    }
});

var RCs = {
    View: RCancview,
    Model: RCancData
}

module.exports = RCs;