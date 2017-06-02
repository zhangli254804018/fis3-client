(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 //定義下初始化接口地址
 (function(conf) {
     var conf = window.serverConfig;
     var SINGER_CONFIG = {
         'PATH': {
             'GET_SHOW': conf.apis.show, //type=0&size=15&page=1
             'GET_GAME': conf.apis.game, //type=0&size=15&page=1
             'GET_TEAM': conf.apis.team, //type=0&size=15&page=1
             'GET_LIVE': conf.apis.live, //uid=0
             'GET_SWF': conf.apis.swf //uid=0
         }
     };
     module.exports = SINGER_CONFIG;
 })(window.serverConfig);
},{}],2:[function(require,module,exports){
/*======================================================
************   Image Lazy Loading   ************
************   Based on solution by Marc Godard, https://github.com/MarcGodard   ************
************  將核心代碼改寫 適合項目使用不需要冗餘代碼 @lizhang  ************
======================================================*/
$.initImagesLazyLoad = function(pageContainer, params) {
    pageContainer = $(pageContainer);
    // Lazy images
    var lazyLoadImages;
    if (pageContainer.hasClass('lazy')) {
        lazyLoadImages = pageContainer;
        pageContainer = lazyLoadImages.parents('.page');
    } else {
        lazyLoadImages = pageContainer.find('.lazy');
    }
    if (lazyLoadImages.length === 0) return;
    if (!params) params = {};
    params = $.extend({}, {
        timeout: 100,
        imagesLazyLoadPlaceholder: null,
        imagesLazyLoadSequential: null,
        imagesLazyLoadThreshold: 10,
        height: 0,
        width: 0
    }, params);
    params.root = $(params.root || 'body');
    //設置初始化默認的圖標
    var placeholderSrc = serverConfig.rc_assets + 'img/live/img_rc.jpg';
    if (typeof params.imagesLazyLoadPlaceholder === 'string') {
        placeholderSrc = params.imagesLazyLoadPlaceholder;
    }
    if (params.imagesLazyLoadPlaceholder !== false) lazyLoadImages.each(function() {
        if ($(this).attr('data-src')) $(this).attr('src', placeholderSrc);
        if ($(this).attr('data-background')) $(this).css({
            'background': 'url(' + placeholderSrc + ') center center  no-repeat  #f3f3f5'
        });
    });

    // 加載圖片
    var imagesSequence = [];
    var imageIsLoading = false;

    //獲取size
    params.getSize = function() {
        var offset = params.root.offset();
        params.width = params.root[0].offsetWidth;
        params.height = params.root[0].offsetHeight;
        params.left = offset.left;
        params.top = offset.top;
    };

    //懶加載圖片
    function loadImage(el) {
        el = $(el);

        var bg = el.attr('data-background');
        var src = bg ? bg : el.attr('data-src');
        if (!src) return;

        function onLoad() {
            el.removeClass('lazy').addClass('lazy-loaded');
            if (bg) {
                el.css('background-image', 'url(' + src + ')');
            } else {
                el.attr('src', src);
            }

            if (params.imagesLazyLoadSequential) {
                imageIsLoading = false;
                if (imagesSequence.length > 0) {
                    loadImage(imagesSequence.shift());
                }
            }
        }

        function onError() {
            el.removeClass('lazy').addClass('lazy-loaded');
            if (bg) {
                el.css('background-image', 'url(' + placeholderSrc + ')');
            } else {
                el.attr('src', placeholderSrc);
            }

            if (params.imagesLazyLoadSequential) {
                imageIsLoading = false;
                if (imagesSequence.length > 0) {
                    loadImage(imagesSequence.shift());
                }
            }
        }

        if (params.imagesLazyLoadSequential) {
            if (imageIsLoading) {
                if (imagesSequence.indexOf(el[0]) < 0) imagesSequence.push(el[0]);
                return;
            }
        }

        // 是否加載bool值
        imageIsLoading = true;

        var image = new Image();
        image.onload = onLoad;
        image.onerror = onError;
        image.src = src;
    }

    function lazyHandler() {
        lazyLoadImages = pageContainer.find('.lazy');
        lazyLoadImages.each(function(index, el) {
            setTimeout(function() {
                el = $(el);
                if (el.parents('.tab:not(.active)').length > 0) {
                    return;
                }
                if (isElementInViewport(el[0])) {
                    loadImage(el);
                }
            }, params.timeout * index);
        });
    }

    function isElementInViewport(el) {
        params.getSize();
        var rect = el ? el.getBoundingClientRect() : {
            top: 0,
            left: 0
        };
        var threshold = params.imagesLazyLoadThreshold || 0;
        var rectheight = params.height || document.documentElement.scrollTop || 0;
        var rectwidth = params.width || document.documentElement.scrollLeft || 0;
        return (
            rect.top >= (0 - threshold) &&
            rect.left >= (0 - threshold) &&
            rect.top <= (rectheight + threshold) &&
            rect.left <= (rectwidth + threshold)
        );
    }

    function attachEvents(destroy) {
        var method = destroy ? 'off' : 'on';
        lazyLoadImages[method]('lazy', lazyHandler);
        lazyLoadImages.parents('.tab')[method]('show', lazyHandler);
        pageContainer[method]('lazy', lazyHandler);
        pageContainer[method]('scroll', lazyHandler);
        //pagBody[method === 'on' ? 'onResize' : 'offResize'](lazyHandler);
    }

    function detachEvents() {
        attachEvents(true);
    }

    // 存儲方法
    pageContainer[0].f7DestroyImagesLazyLoad = detachEvents;

    // 增加事件操作
    attachEvents();

    lazyHandler();

};
$.destroyImagesLazyLoad = function(pageContainer) {
    pageContainer = $(pageContainer);
    if (pageContainer.length > 0 && pageContainer[0].f7DestroyImagesLazyLoad) {
        pageContainer[0].f7DestroyImagesLazyLoad();
    }
};
$.reinitImagesLazyLoad = function(pageContainer) {
    pageContainer = $(pageContainer);
    if (pageContainer.length > 0) {
        pageContainer.trigger('lazy');
    }
};
},{}],3:[function(require,module,exports){
/*
    定義全局的常用的方法api
    清晰的使用各種api方法
*/
(function($) {
    var delayBounceContainer;
    //擴展jq的api方法
    $.extend({
        //時間格式 value時間戳 type 返回的時間格式 如 yyyy-MM-dd
        formaTime: function(value, type) {
            if (!value) return null
            var time = value.toString().length > 10 ? new Date(parseInt(value)) : new Date(parseInt(value) * 1000)
            var formatTime = type ? type : 'yyyy-MM-dd'
            var date = {
                "M+": time.getMonth() + 1,
                "d+": time.getDate(),
                "h+": time.getHours(),
                "m+": time.getMinutes(),
                "s+": time.getSeconds(),
                "q+": Math.floor((time.getMonth() + 3) / 3),
                "S+": time.getMilliseconds()
            };
            if (/(y+)/i.test(formatTime)) {
                formatTime = formatTime.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(formatTime)) {
                    formatTime = formatTime.replace(RegExp.$1, RegExp.$1.length == 1 ?
                        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return formatTime;
        },
        MillisecondToDate: function(msd) {
            var time = parseFloat(msd);
            if (null != time && "" != time) {
                var timeFormt = '';
                if (time >= 0 && time < 60 * 60) {
                    timeFormt += "00:";
                    timeFormt += (parseInt(time / 60.0) >= 10 ? parseInt(time / 60.0) : ('0' + parseInt(time / 60.0))) + ":";
                    timeFormt += parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) >= 10 ? parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) :
                        '0' + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
                }
                // else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                else if (time >= 60 * 60) {
                    timeFormt += (parseInt(time / 3600.0) >= 10 ? '' : '0') + parseInt(time / 3600.0) + ":";
                    timeFormt += (parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) >= 10 ? '' : '0') + parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) + ":";
                    timeFormt += (parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) >= 10 ? '' : '0') + parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
                    // time = parseInt(time / 3600.0) + "时" + parseInt((parseFloat(time / 3600.0) -
                    //         parseInt(time / 3600.0)) * 60) + "分" +
                    //     parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    //         parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                } else {
                    timeFormt += '00:00:' + parseInt(time);
                }
            }
            return timeFormt;
        },
        formatNum: function(listS, listL, num) {
            if (!listS || !listL) return null;
            num = num ? num : 5;
            return listL.slice(0, Math.ceil(listS.length / num) * num)
        },
        //延遲請求執行事件 delayBounce(callback,500)
        delayBounce: function(action, idle) {
            function delayBounces() {
                var ctx = this,
                    args = arguments
                clearTimeout(delayBounceContainer)
                delayBounceContainer = setTimeout(function() {
                    action.apply(ctx, args)
                }, idle)
            }
            return delayBounces()
        },
        //設置自定義的彈框
        showAlert: function(title, text, button, callback, cancel, callbackFail) {
            if ($('#alert').length) return;
            var title = title ? title : '提示';
            var text = !text ? '' : text.replace(/\n/ig, '</br>');
            var button = button ? button : '確定';
            var html = '';
            html += '<div class="j-dialog j-buy-mount-view j-dialog-in" id="alert" ><div class="j-dialog-mask"></div>';
            html += '<div class="j-dialog-main"><h5 class="j-dialog-header">' + title + '</h5>';
            html += '<div class="j-dialog-content"><i class="j-dialog-icon-warning"></i><p class="desc">' + text + '</p></div>';
            html += '<div class="j-dialog-btn-wrap"><a class="j-dialog-btn-confirm">' + button + '</a>';
            if (cancel) html += '<a class="j-dialog-btn-cancel">取消</a>';
            html += '</div></div></div>';
            var alert = $(html).appendTo('body');
            alert.find('a').click(function() {
                alert.remove();
                if (typeof callback == 'function' && $(this).hasClass('j-dialog-btn-confirm')) {
                    callback && callback();
                }
                if (typeof callbackFail == 'function' && $(this).hasClass('j-dialog-btn-cancel')) {
                    callbackFail && callbackFail();
                }
                return false;
            });
            alert.find('span').click(function() {
                alert.remove();
            });
            return this
        },
        //toast提示框
        showToast: function(text, inditater, timer) {
            if ($('#alert').length) return;
            var title = title ? title : '提示';
            var text = !text ? '提示' : text.replace(/\n/ig, '</br>');
            var top = '<div class="toast-mask"></div><div class="toast-text"><h3>' + text + '</h3></div>';
            var toast = $('<div id="toast" class="toast">' + top + '</div>');
            if ($('#toast').length) {
                $('body').find('#toast').html(top);
                if (inditater) $('body').find('#toast').remove();
            } else {
                toast.appendTo('body');
                if (timer) {
                    var clearTimer = setTimeout(function() {
                        toast.remove();
                    }, timer ? timer : 1500)
                }
            }
        },
        //校驗表單正則
        verification: function(type, str) {
            var typeRegx = {
                title: /^[\u2E80-\uFE4F]{2,18}$/, //標題限定18個漢字
                desc: /^[\u2E80-\uFE4F]{2,200}$/ //簡介限定200個漢字
                    // identification_card: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
                    // card_no: /^(\d{12,19})$/,
                    // bank_name: /^[\u2E80-\uFE4F]{3,10}$/,
                    // mobile: /^([0-9]{11})?$/,
                    // card_no_input: /^\d+$/,
                    // code: /^(\d{6})$/
            };
            var regx = typeRegx[type];
            if (regx.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        //獲取url hash值
        getHash: function() {
            var match = window.location.href.match(/#(.*)/);
            return match ? match[1] : '';
        },
        //獲取地址欄的參數
        parseUrlQuery: function(url, type) {
            var url = url || location.href;
            var query = {},
                i, params, param;
            if (typeof url === 'string' && url.length) {
                url = (url.indexOf('#') > -1) ? url.split('#')[0] : url;
                if (!type) {
                    if (url.indexOf('?') > -1) url = url.split('?')[1];
                    else return query;
                }
                params = url.split('&');
                for (i = 0; i < params.length; i++) {
                    param = params[i].split('=');
                    query[param[0]] = param[1];
                }
            }
            return query;
        },
        //獲取地址欄的參數
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);

            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        //自動加上jsonp
        addCallbackParam: function(url) {
            url += '';
            return url + (/\?/.test(url) ? '&' : '?') + 'callback=?';
        },
        //自動加上jsonp
        addMathroundParam: function(url) {
            url += '';
            return url + (/\?/.test(url) ? '&' : '?') + 'v=' + Math.random();
        },
        //ajax請求方法
        httpGetApi: function(url, parameter, resolveCall) {
            var self = this;
            // var parameter = _.extend({}, self.parseUrlQuery(), parameter);
            var ajaxFn = function() {
                $.ajax({
                    method: "get",
                    async: true,
                    url: url,
                    dataType: 'json',
                    timeout: 3 * 1000,
                    data: parameter,
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            if (resolveCall) resolveCall(data);
                        } else if (data.code == 1) {
                            RC.login();
                        } else {
                            //self.showAlert(data.msg)
                            self.showToast(data.msg, false, 1500);
                        }
                    },
                    error: function(data) {
                        //self.showToast('數據請求異常,請稍後重試', false, 1500);
                    }
                });
            }
            return new ajaxFn()
        },
        //ajax請求方法
        httpPostApi: function(url, parameter, resolveCall) {
            var self = this;
            // var parameter = $.extend({}, $.parseUrlQuery(), parameter);
            var ajaxFn = function() {
                return $.ajax({
                    type: 'post',
                    url: url,
                    data: parameter,
                    cache: false,
                    async: false, // 同步
                    dataType: "json",
                    timeout: 300, //todo 超时的话，只能认为该分片未上传过
                    success: function(data) {
                        if (data.code == 0) {
                            if (resolveCall) resolveCall(data.data);
                        } else if (data.code == 1) {
                            RC.login();
                        } else {
                            //sellf.showAlert(data.msg)
                            self.showToast(data.msg, false, 1500);
                        }
                    },
                    error: function(data) {
                        //self.showToast('數據請求異常,請稍後重試', false, 1500);
                    }
                });
            }
            return new ajaxFn()
        },
        //定義頁面分頁方法
        //item:{}  len: len,start: start,list: pathPage,current: current
        // list 數組
        //total總數
        pageFormat: function(item, list, total) {
            var len = item.len ? item.len : 5;
            var current = item.current ? item.current : 1;
            var start = item.start ? item.start : 1;
            var total = total ? total : Math.ceil(list.length / item.len);
            var maxPage = (total - current) >= 5 ? 3 : (total - current);
            var pathPage = [];
            if (maxPage >= 3 && (current - 2) > 0) {
                for (var i = current - 2; i < maxPage + current; i++) {
                    pathPage.push(i)
                }
            } else if (maxPage >= 0) {
                for (var i = current; i <= maxPage + current; i++) {
                    pathPage.push(i)
                }
            }
            return {
                len: len,
                start: start,
                total: total,
                list: pathPage,
                current: current
            }
        },
        //限制字符長度
        substrLen: function(str, len) {
            return (str && str.length > len) ? str.substr(0, len ? len : str.length) + "……" : str
        },
        //滾動
        Slider: function(container, options) {
            /*
            options = {
                auto: true,
                time: 3000,
                event: 'hover' | 'click',
                mode: 'slide | fade',
                controller: $(),
                activeControllerCls: 'className',
                exchangeEnd: $.noop
            }
            */
            if (!container) return;
            var slider;
            slider = function(options, container) {
                var options = options || {},
                    currentIndex = 0,
                    cls = options.activeControllerCls,
                    delay = options.delay,
                    isAuto = options.auto,
                    controller = options.controller,
                    event = options.event,
                    interval,
                    slidesWrapper = container.children().first(),
                    slides = slidesWrapper.children(),
                    length = slides.length,
                    childWidth = container.width(),
                    totalWidth = childWidth * slides.length,
                    id = options.id ? options.id : 0;
                // interval = 't' + Date.now();

                function init() {
                    var controlItem = controller.children();

                    mode();

                    event == 'hover' ? controlItem.mouseover(function() {
                        stop();
                        var index = $(this).index();

                        play(index, options.mode);
                    }).mouseout(function() {
                        isAuto && autoPlay();
                    }) : controlItem.click(function() {
                        stop();
                        var index = $(this).index();

                        play(index, options.mode);
                        isAuto && autoPlay();
                    });

                    isAuto && autoPlay();
                }

                //animate mode
                function mode() {
                    var wrapper = container.children().first();

                    options.mode == 'slide' ? wrapper.width(totalWidth) : wrapper.children().css({
                            'position': 'absolute',
                            'left': 0,
                            'top': 0
                        })
                        .first().siblings().hide();
                }

                //auto play
                function autoPlay() {
                    interval = setInterval(function() {
                        triggerPlay(currentIndex);
                    }, options.time);
                }

                //trigger play
                function triggerPlay(cIndex) {
                    var index;

                    (cIndex == length - 1) ? index = 0: index = cIndex + 1;
                    play(index, options.mode);
                }

                //play
                function play(index, mode) {
                    slidesWrapper.stop(true, true);
                    slides.stop(true, true);

                    mode == 'slide' ? (function() {
                        if (index > currentIndex) {
                            slidesWrapper.animate({
                                left: '-=' + Math.abs(index - currentIndex) * childWidth + 'px'
                            }, delay);
                        } else if (index < currentIndex) {
                            slidesWrapper.animate({
                                left: '+=' + Math.abs(index - currentIndex) * childWidth + 'px'
                            }, delay);
                        } else {
                            return;
                        }
                    })() : (function() {
                        if (slidesWrapper.children(':visible').index() == index) return;
                        slidesWrapper.children().fadeOut(delay).eq(index).fadeIn(delay);
                    })();

                    try {
                        controller.children('.' + cls).removeClass(cls);
                        controller.children().eq(index).addClass(cls);
                    } catch (e) {}

                    currentIndex = index;

                    options.exchangeEnd && typeof options.exchangeEnd == 'function' && options.exchangeEnd.call(this, currentIndex);
                }

                //stop
                function stop() {
                    clearInterval(interval);
                }

                //prev frame
                function prev() {
                    stop();

                    currentIndex == 0 ? triggerPlay(length - 2) : triggerPlay(currentIndex - 2);

                    isAuto && autoPlay();
                }

                //next frame
                function next() {
                    stop();

                    currentIndex == length - 1 ? triggerPlay(-1) : triggerPlay(currentIndex);

                    isAuto && autoPlay();
                }

                //init
                init();

                //expose the Slider API
                return {
                    prev: function() {
                        prev();
                    },
                    next: function() {
                        next();
                    }
                }
            }
            new slider(options, container)
        },
        //分類
        kindFormat: function(kind, list) {
            var listExend = _.union([], [{
                    'type': 0,
                    'name': '遊戲',
                    'class': 'game'
                },
                {
                    'type': 1,
                    'name': '娛樂',
                    'class': 'disport'
                },
                {
                    'type': 2,
                    'name': '綜合',
                    'class': 'multiple'
                }
            ]);
            var findLastIndex = _.findLastIndex(listExend, function(item) {
                return item.type === kind
            });
            return (findLastIndex !== -1) ? listExend[findLastIndex] : '綜合'
        },
        //過濾出全部的數組列表1-1
        userListFormat: function(userList) {
            var _path = [];
            var sess_musicList = _.each(userList.sess_music, function(item) {
                item.status = 'sess_music';
            });
            var sess_gameList = _.each(userList.sess_game, function(item) {
                item.status = 'sess_game';
            });
            var sess_showList = _.each(userList.sess_show, function(item) {
                item.status = 'sess_show';
            });
            var top_banners_showList = _.each(userList.top_banners_show, function(item) {
                item.status = 'top_banners_show';
            });
            var top_banners_gameList = _.each(userList.top_banners_game, function(item) {
                item.status = 'top_banners_game';
            });
            var userAllList = _.union(sess_musicList, sess_gameList, sess_showList, top_banners_showList, top_banners_gameList);
            return _.isArray(userAllList) ? userAllList : _.toArray(userAllList);
        }
    });

    //擴展jq的fn方法
    $.fn.extend({
        //錯誤提示
        showError: function(text, validator) {
            var self = this;
            var error = $('<div id="error" class="error"><div><h6>' + (text ? text : '輸入格式不正確') + '</h6></div></div>');
            if ($(self).find(error).length) {
                if (validator) $(self).find(error).remove();
            } else {
                $(self).appendTo(error);
            }
        },
        //下拉菜單
        //[{text, button, callback,}]
        showDropDown: function(list, callback) {
            if (!list.length) return;
            var self = this;
            var html = '';
            html += '<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
            $.each(list, function(index, item) {
                html += '<li role="presentation"><a role="menuitem" class="btn-confirm" href="javascript:;" data-click="' + item.callback + '">';
                html += '<h3>' + item.text + '</h3>';
                if (item.button) html += '<p>' + item.button + '</p>';
                html += '</a></li>';
            });
            html += '</ul>';
            var dropDown = $(html);
            // if ($(self).parents('body').find('#menu1').length) {
            //     $(self).parents('body').find('#menu1').remove();
            //     $(self).removeClass('open');
            //     $(self).addClass('open').append(dropDown);
            // } else {
            //     $(self).addClass('open').append(dropDown);
            // };
            $(self).parents('body').find('#menu1').remove();
            $(self).removeClass('open');
            $(self).addClass('open').append(dropDown);
            //循環賦值給下拉菜單執行函數
            $.each(list, function(index, item) {
                dropDown.find('a.btn-confirm').eq(index).click(function() {
                    dropDown.remove();
                    var callback = item.callback;
                    if (typeof callback == 'function') {
                        callback && callback();
                    }
                    return false;
                })
            });
            $(self).parent().parent().not('a.btn-confirm').click(function() {
                $(self).removeClass('open');
                dropDown.remove();
            });
        },
        //展示loading
        showLoading: function(mode) {
            var self = this;
            var $loading = $('<div class="no-data tc">加載中···</div>');
            var $top = $(self).height() > 200 ? true : false;
            var $style = {
                position: 'absolute',
                top: ($top ? 'auto' : 0),
                left: 0,
                right: 0,
                bottom: '20px',
                margin: '40% auto',
                height: '40px',
                width: '200px'
            };
            var mode = mode ? mode : 'show';
            $(self).css({ position: 'relative' });
            if (!$(self).find('.no-data').length) {
                $(self).append($loading);
                $(self).find($loading).css($style);
            } else {
                if (mode == 'hide') $(self).find('.no-data').remove();
            }
        },
        adSize: function(container) {
            var self = $(this);
            $(window).resize(function(e) {
                var cd = $('body,html').width();
                var ch = $('body,html').height();
                var mx = $(container).width();
                var oLeft = $(container).offset().left;
                var oRight = $(container).offset().right;
                var swd = self.width() ? self.width() : 200;
                if (cd < (mx + swd * 2 + 40)) {
                    self.hide();
                } else {
                    self.fadeIn();
                }
            }).trigger('resize');
        },
        adActive: function(container) {
            var self = $(this);
            var sliderActive = $('<div class="slider-item-active"></div>');
            var banRLTpl = container ? container : $('#banRLTpl').find('.slider-rank');
            var position = self.offset();
            if (banRLTpl.find('.slider-item-active').length) {
                banRLTpl.find('.slider-item-active').animate({
                    top: (position.top - 12),
                    left: '-7px'
                })
            } else {
                banRLTpl.append(sliderActive);
            }
        },
        adOverflow: function(container, time) {
            var self = $(this);
            var _setInter, _time = time ? time : 800;
            var _text = self.text();
            var _content = ('<em class="over-title" style="white-space:nowrap;color:#fff">' + _text + '</em');
            var _hidden = function() {
                self.show();
                //self.css('visibility', 'visible');
                self.parent().find('.over-title').remove();
                window.clearInterval(_setInter);
            }
            var _show = function() {
                // self.css('visibility', 'hidden');
                self.hide();
                var _title = self.parent().find('.over-title');
                if (!_title.length) self.parent().append(_content);
                var _title = self.parent().find('.over-title');
                var _md = self.parent().width();
                var _cd = _title.width();
                var _wd = Math.max(_cd - _md, 0);
                //_time = _wd ? _wd * 10 : _time;
                if (_wd < 5) return
                _setInter = window.setInterval(function() {
                    _title.css({
                        position: 'absolute',
                        'white-space': 'nowrap',
                        'top': 0
                    }).animate({ 'left': 0 }, _time, 'swing', function() {
                        _title.animate({
                            'left': -_wd
                        }, _time * 2);
                    });
                }, _time * 2)
            }
            self.parent().css({
                'position': 'relative',
                'overflow': 'hidden'
            }).hover(function() {
                _show();
            }, function() {
                _hidden();
            });
        }
    });

    //定義全局ga統計代碼
    window._ga = function() {
        if (typeof ga == 'function') {
            ga.apply(window, Array.prototype.slice.call(arguments, 0));
        }
    };
})(window.jQuery);
},{}],4:[function(require,module,exports){
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
        if (!modelJson.url) return;
        var self = this;
        var img = new Image();
        img.src = modelJson.img;
        img.onload = function() {
            self.$el.adSize('#rc-banner');
        };
        this.template = _.template($('#tpl_ad').html());
        this.$el.html(this.template(modelJson)).hide();
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
        if (!modelJson.url) return;
        var self = this;
        var img = new Image();
        img.src = modelJson.img;
        img.onload = function() {
            self.$el.adSize('#rc-banner');
        };
        this.template = _.template($('#tpl_ad').html());
        this.$el.html(this.template(modelJson)).hide();
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
},{"../api/config.js":1}],5:[function(require,module,exports){
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
        }).first().value();
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
},{"../api/config.js":1}],6:[function(require,module,exports){
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
        this.listenTo(this.model, 'change', this.render);
    },
    events: {
        'click #banfLTpl .slides a.link-banner': 'ClickBanner'
    },
    render: function() {
        var modelJosn = this.model.banChange();
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
            $.initImagesLazyLoad(self.$el, {
                timeout: 100
            });
        }, 500);
        $.delayBounce(function() {
            //獲取初始化隨機的播放右側tab
            var findBannerIndex = self.secBanner();
            self.ClickSlider('', '[data-keys=' + findBannerIndex['status'] + ']');
        }, 500);
        return this;
    },
    ClickBLink: function(index) {
        $('.slider-focus .banner')._move(stopParam, index ? index : 0);
    },
    ClickBanner: function(e, _this) {
        if (e) e.stopPropagation();
        var vm = e ? $(e.currentTarget) : $(_this);
        $.initImagesLazyLoad(vm.add($('#banfLTpl')), {
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
        if (_.has(dataList, key)) {
            var dataKey = dataList[key];
            var bannerLive = _.chain(dataKey).filter(function(item) {
                return item.live && item.link_type == 3
            }).sample().value();
            _index = _.findLastIndex(dataKey, function(item) {
                return item === bannerLive
            });
            param = $.extend({}, param, {
                bannerSet: dataList[key],
                bannerLive: bannerLive ? bannerLive : {}
            });
        };
        $.when(this.model.set(param)).then(this.livePlayer())
            .then(this.ClickBanner(e, _this)).then(
                vm.addClass('active').siblings().removeClass('active')
            ).done(this.ClickBLink(index));
        vm.siblings('.slider-live').find('.banner')._always(autuParam);
        if (key.indexOf('sess_') > -1 && _.has(bannerLive, 'live')) {
            _.delay(function() {
                vm.find('.banner')._slide(autuParam, _index);
            }, 500);
        };
    },
    livePlayer: function(e) {
        var bannerSet = this.model.banChange()['bannerSet'];
        var bannerLive = this.model.banChange()['bannerLive'];
        var bannerPlayer = bannerLive ? bannerLive : bannerSet;
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
                    tips: tips,
                    time: 60 * 1000 * 1
                };
                swfobject.embedSWF(conf.rc_swf, 'myDynamicContent', "560", "420", "9.0.0", conf.rc_express, flashvars);
                _ga('send', 'event', 'showuser', 'click', '左側tab主播視頻');
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
},{"../api/config.js":1}],7:[function(require,module,exports){
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
        'click #rc-content-game ul>li a.link-rec': 'clickRec',
        'click #rc-content-game a.go-more': 'clickMore',
        'mouseout #rc-content-game ul>li a.link-rec': 'clickRecOut'
    },
    render: function() {
        var modelJson = this.model.gameChange();
        this.template = _.template($('#tpl_game').html());
        this.$el.html(this.template(modelJson));
        this.delegateEvents();
        $('body').customScrollbar('scrollToY', 0);
        if (!this.btnLoad) $(window).trigger('resize');
        this.btnLoad = true;
        $.initImagesLazyLoad(this.$el.find('.link-rec'));
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
        var gametype = vm.data('gametype');
        var playcode = vm.data('playcode');
        if (gametype == 1) {
            try {
                window.external.startGamebox(playcode);
            } catch (error) {}
        } else {
            location.href(playcode);
        };
    },
    clickRecOut: function(e) {
        var vm = $(e.currentTarget);
        //vm.parent().removeClass('active');
    },
    clickMore: function(e) {
        // if (this.btnLoad) return
        // this.btnLoad = true;
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
        })).then(this.fetch());
    }
});

var RCs = {
    View: RCgameview,
    Model: RCgameData
}

module.exports = RCs;
},{"../api/config.js":1}],8:[function(require,module,exports){
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
},{"../api/config.js":1,"./anchor.js":5,"./game.js":7,"./team.js":9}],9:[function(require,module,exports){
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
},{"../api/config.js":1}],10:[function(require,module,exports){
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
                $.initImagesLazyLoad(elemContainer.find('.rc-content').add('#rc-banner'));
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
},{"../lib/jquery.unslider.js":11,"./api/lazyload.js":2,"./api/util.js":3,"./dev/ad.js":4,"./dev/anchor.js":5,"./dev/banner.js":6,"./dev/tab.js":8}],11:[function(require,module,exports){
/**
 *   Unslider by @idiot
 */

(function($, f) {
    //  If there's no jQuery, Unslider can't work, so kill the operation.
    if (!$) return f;

    var Unslider = function() {
        //  Set up our elements
        this.el = f;
        this.items = f;

        //  Dimensions
        this.sizes = [];
        this.max = [0, 0];

        //  Current inded
        this.current = 0;

        //  Start/stop timer
        this.interval = f;

        //  Set some options
        this.opts = {
            autoplay: false,
            speed: 500,
            delay: 3000, // f for no autoplay
            complete: f, // when a slide's finished
            keys: !f, // keyboard shortcuts - disable if it breaks things
            dots: f, // display ••••o• pagination
            fluid: f // is it a percentage width?,
        };

        //  Create a deep clone for methods where context changes
        var _ = this;

        this.init = function(el, opts) {
            this.el = el;
            this.ul = el.children('ul');
            this.max = [el.outerWidth(), el.outerHeight()];
            this.items = this.ul.children('li').each(this.calculate);
            //  Check whether we're passing any options in to Unslider
            this.opts = $.extend({}, this.opts, opts);

            if (!this.items || this.items.length < 2) return;
            //  Set up the Unslider
            this.setup();

            return this;
        };

        //  Get the width for an element
        //  Pass a jQuery element as the context with .call(), and the index as a parameter: Unslider.calculate.call($('li:first'), 0)
        this.calculate = function(index) {
            var me = $(this),
                width = me.outerWidth(),
                height = me.outerHeight();

            //  Add it to the sizes list
            _.sizes[index] = [width, height];

            //  Set the max values
            if (width > _.max[0]) _.max[0] = width;
            if (height > _.max[1]) _.max[1] = height;
        };

        //  Work out what methods need calling
        this.setup = function() {
            //  Set the main element
            this.el.css({
                overflow: 'hidden',
                width: _.max[0],
                height: this.items.first().outerHeight()
            });

            //  Set the relative widths
            this.ul.css({ width: (this.items.length * 100) + '%', position: 'relative', left: 0 });
            this.items.css('width', (100 / this.items.length) + '%');

            for (var index = 0; index < this.items.length; index++) {
                $(this.items[index]).attr('data-index', index)
            }

            if (this.opts.delay) {
                this.el.hover(this.stop, this.start);
            }

            if (this.opts.autoplay) {
                this.start();
            } else {
                this.stop();
            }

            //  Custom keyboard support
            this.opts.keys && $(document).keydown(this.keys);

            //  Dot pagination
            this.opts.dots && this.dots();

            //  Little patch for fluid-width sliders. Screw those guys.
            if (this.opts.fluid) {
                var resize = function() {
                    _.el.css('width', Math.min(Math.round((_.el.outerWidth() / _.el.parent().outerWidth()) * 100), 100) + '%');
                };

                resize();
                $(window).resize(resize);
            }

            if (this.opts.arrows) {
                this.el.append('<p class="arrows"><span class="prev"><</span><span class="next">></span></p>')
                    .find('.arrows span').click(function() {
                        $.isFunction(_[this.className]) && _[this.className]();
                    });
            };

            //  Swipe support
            if ($.event.swipe) {
                this.el.on('swipeleft', _.prev).on('swiperight', _.next);
            }
        };

        //  Move Unslider to a slide index
        this.move = function(index, cb) {
            //  If it's out of bounds, go to the first slide
            if (!this.items.eq(index).length) index = 0;
            if (index < 0) index = (this.items.length - 1);

            var target = this.items.eq(index);
            var obj = { height: target.outerHeight() };
            var speed = cb ? 5 : this.opts.speed;
            if (!this.ul.is(':animated')) {
                //  Handle those pesky dots
                _.el.find('.dot:eq(' + index + ')').addClass('active').siblings().removeClass('active');
                this.el.animate(obj, speed).attr('data-index', index) && this.ul.animate($.extend({ left: '-' + index + '00%' }, obj), speed, function(data) {
                    _.current = index;
                    $.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
                });
            }
        };

        //  Autoplay functionality
        this.start = function() {
            if (_.opts.autoplay !== f) {
                _.interval = setInterval(function() {
                    _.move(_.current + 1);
                }, _.opts.delay);
            }
        };

        //  Stop autoplay
        this.stop = function() {
            _.interval = clearInterval(_.interval);
            return _;
        };

        //  Keypresses
        this.keys = function(e) {
            var key = e.which;
            var map = {
                //  Prev/next
                37: _.prev,
                39: _.next,

                //  Esc
                27: _.stop
            };

            if ($.isFunction(map[key])) {
                map[key]();
            }
        };

        //  Arrow navigation
        this.next = function() { return _.stop().move(_.current + 1) };
        this.prev = function() { return _.stop().move(_.current - 1) };

        this.dots = function() {
            //  Create the HTML
            var html = '<ol class="dots">';
            $.each(this.items, function(index) { html += '<li class="dot' + (index < 1 ? ' active' : '') + '">' + '</li>'; });
            html += '</ol>';

            //  Add it to the Unslider
            if (this.el.find('.dots').length) return;
            this.el.addClass('has-dots').append(html).find('.dot').click(function() {
                _.move($(this).index());
            });
        };
    };

    //新增擴展方法等
    $.fn._move = function(o, index) {
        // $(this).unslider();
        var me = $(this);
        try {
            var unsliders = me.data('unslider');
            unsliders.move(index);
        } catch (error) {}
    };

    //新增擴展方法等
    $.fn._slide = function(o, index) {
        // $(this).unslider();
        var me = $(this);
        try {
            var unsliders = me.data('unslider');
            unsliders.stop().move(index);
            _.delay(function() {
                unsliders.interval = 0;
                unsliders.stop();
            }, 300);
        } catch (error) {}
    };

    //新增擴展方法等
    $.fn._always = function(o) {
        // $(this).unslider();
        try {
            return this.each(function(index, item) {
                //  Cache a copy of $(this), so it
                var me = $(item);
                if (me.hasClass('has-dots')) {
                    var unsliders = me.data('unslider');
                    unsliders.stop();
                    unsliders.start();
                }
            });
        } catch (error) {}
    };

    //  Create a jQuery plugin
    $.fn.unslider = function(o) {
        var len = this.length;

        //  Enable multiple-slider support
        return this.each(function(index) {
            //  Cache a copy of $(this), so it
            var me = $(this);
            var instance = (new Unslider).init(me, o);

            //  Invoke an Unslider instance
            me.data('unslider' + (len > 1 ? '-' + (index + 1) : ''), instance);
            me.data('unslider', instance);
        });
    };
})(window.jQuery, false);
},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwianMvYXBpL2NvbmZpZy5qcyIsImpzL2FwaS9sYXp5bG9hZC5qcyIsImpzL2FwaS91dGlsLmpzIiwianMvZGV2L2FkLmpzIiwianMvZGV2L2FuY2hvci5qcyIsImpzL2Rldi9iYW5uZXIuanMiLCJqcy9kZXYvZ2FtZS5qcyIsImpzL2Rldi90YWIuanMiLCJqcy9kZXYvdGVhbS5qcyIsImpzL2luZGV4LmpzIiwibGliL2pxdWVyeS51bnNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIC8v5a6a576p5LiL5Yid5aeL5YyW5o6l5Y+j5Zyw5Z2AXHJcbiAoZnVuY3Rpb24oY29uZikge1xyXG4gICAgIHZhciBjb25mID0gd2luZG93LnNlcnZlckNvbmZpZztcclxuICAgICB2YXIgU0lOR0VSX0NPTkZJRyA9IHtcclxuICAgICAgICAgJ1BBVEgnOiB7XHJcbiAgICAgICAgICAgICAnR0VUX1NIT1cnOiBjb25mLmFwaXMuc2hvdywgLy90eXBlPTAmc2l6ZT0xNSZwYWdlPTFcclxuICAgICAgICAgICAgICdHRVRfR0FNRSc6IGNvbmYuYXBpcy5nYW1lLCAvL3R5cGU9MCZzaXplPTE1JnBhZ2U9MVxyXG4gICAgICAgICAgICAgJ0dFVF9URUFNJzogY29uZi5hcGlzLnRlYW0sIC8vdHlwZT0wJnNpemU9MTUmcGFnZT0xXHJcbiAgICAgICAgICAgICAnR0VUX0xJVkUnOiBjb25mLmFwaXMubGl2ZSwgLy91aWQ9MFxyXG4gICAgICAgICAgICAgJ0dFVF9TV0YnOiBjb25mLmFwaXMuc3dmIC8vdWlkPTBcclxuICAgICAgICAgfVxyXG4gICAgIH07XHJcbiAgICAgbW9kdWxlLmV4cG9ydHMgPSBTSU5HRVJfQ09ORklHO1xyXG4gfSkod2luZG93LnNlcnZlckNvbmZpZyk7IiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKioqKioqKioqKioqICAgSW1hZ2UgTGF6eSBMb2FkaW5nICAgKioqKioqKioqKioqXHJcbioqKioqKioqKioqKiAgIEJhc2VkIG9uIHNvbHV0aW9uIGJ5IE1hcmMgR29kYXJkLCBodHRwczovL2dpdGh1Yi5jb20vTWFyY0dvZGFyZCAgICoqKioqKioqKioqKlxyXG4qKioqKioqKioqKiogIOWwh+aguOW/g+S7o+eivOaUueWvqyDpganlkIjpoIXnm67kvb/nlKjkuI3pnIDopoHlhpfppJjku6PnorwgQGxpemhhbmcgICoqKioqKioqKioqKlxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4kLmluaXRJbWFnZXNMYXp5TG9hZCA9IGZ1bmN0aW9uKHBhZ2VDb250YWluZXIsIHBhcmFtcykge1xyXG4gICAgcGFnZUNvbnRhaW5lciA9ICQocGFnZUNvbnRhaW5lcik7XHJcbiAgICAvLyBMYXp5IGltYWdlc1xyXG4gICAgdmFyIGxhenlMb2FkSW1hZ2VzO1xyXG4gICAgaWYgKHBhZ2VDb250YWluZXIuaGFzQ2xhc3MoJ2xhenknKSkge1xyXG4gICAgICAgIGxhenlMb2FkSW1hZ2VzID0gcGFnZUNvbnRhaW5lcjtcclxuICAgICAgICBwYWdlQ29udGFpbmVyID0gbGF6eUxvYWRJbWFnZXMucGFyZW50cygnLnBhZ2UnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGF6eUxvYWRJbWFnZXMgPSBwYWdlQ29udGFpbmVyLmZpbmQoJy5sYXp5Jyk7XHJcbiAgICB9XHJcbiAgICBpZiAobGF6eUxvYWRJbWFnZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICBpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcbiAgICBwYXJhbXMgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgIHRpbWVvdXQ6IDEwMCxcclxuICAgICAgICBpbWFnZXNMYXp5TG9hZFBsYWNlaG9sZGVyOiBudWxsLFxyXG4gICAgICAgIGltYWdlc0xhenlMb2FkU2VxdWVudGlhbDogbnVsbCxcclxuICAgICAgICBpbWFnZXNMYXp5TG9hZFRocmVzaG9sZDogMTAsXHJcbiAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgIHdpZHRoOiAwXHJcbiAgICB9LCBwYXJhbXMpO1xyXG4gICAgcGFyYW1zLnJvb3QgPSAkKHBhcmFtcy5yb290IHx8ICdib2R5Jyk7XHJcbiAgICAvL+ioree9ruWIneWni+WMlum7mOiqjeeahOWcluaomVxyXG4gICAgdmFyIHBsYWNlaG9sZGVyU3JjID0gc2VydmVyQ29uZmlnLnJjX2Fzc2V0cyArICdpbWcvbGl2ZS9pbWdfcmMuanBnJztcclxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmltYWdlc0xhenlMb2FkUGxhY2Vob2xkZXIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcGxhY2Vob2xkZXJTcmMgPSBwYXJhbXMuaW1hZ2VzTGF6eUxvYWRQbGFjZWhvbGRlcjtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuaW1hZ2VzTGF6eUxvYWRQbGFjZWhvbGRlciAhPT0gZmFsc2UpIGxhenlMb2FkSW1hZ2VzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1zcmMnKSkgJCh0aGlzKS5hdHRyKCdzcmMnLCBwbGFjZWhvbGRlclNyYyk7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1iYWNrZ3JvdW5kJykpICQodGhpcykuY3NzKHtcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAndXJsKCcgKyBwbGFjZWhvbGRlclNyYyArICcpIGNlbnRlciBjZW50ZXIgIG5vLXJlcGVhdCAgI2YzZjNmNSdcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOWKoOi8ieWclueJh1xyXG4gICAgdmFyIGltYWdlc1NlcXVlbmNlID0gW107XHJcbiAgICB2YXIgaW1hZ2VJc0xvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvL+eNsuWPlnNpemVcclxuICAgIHBhcmFtcy5nZXRTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IHBhcmFtcy5yb290Lm9mZnNldCgpO1xyXG4gICAgICAgIHBhcmFtcy53aWR0aCA9IHBhcmFtcy5yb290WzBdLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHBhcmFtcy5oZWlnaHQgPSBwYXJhbXMucm9vdFswXS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgcGFyYW1zLmxlZnQgPSBvZmZzZXQubGVmdDtcclxuICAgICAgICBwYXJhbXMudG9wID0gb2Zmc2V0LnRvcDtcclxuICAgIH07XHJcblxyXG4gICAgLy/mh7bliqDovInlnJbniYdcclxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShlbCkge1xyXG4gICAgICAgIGVsID0gJChlbCk7XHJcblxyXG4gICAgICAgIHZhciBiZyA9IGVsLmF0dHIoJ2RhdGEtYmFja2dyb3VuZCcpO1xyXG4gICAgICAgIHZhciBzcmMgPSBiZyA/IGJnIDogZWwuYXR0cignZGF0YS1zcmMnKTtcclxuICAgICAgICBpZiAoIXNyYykgcmV0dXJuO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbkxvYWQoKSB7XHJcbiAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCdsYXp5JykuYWRkQ2xhc3MoJ2xhenktbG9hZGVkJyk7XHJcbiAgICAgICAgICAgIGlmIChiZykge1xyXG4gICAgICAgICAgICAgICAgZWwuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgc3JjICsgJyknKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsLmF0dHIoJ3NyYycsIHNyYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaW1hZ2VzTGF6eUxvYWRTZXF1ZW50aWFsKSB7XHJcbiAgICAgICAgICAgICAgICBpbWFnZUlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGltYWdlc1NlcXVlbmNlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkSW1hZ2UoaW1hZ2VzU2VxdWVuY2Uuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoKSB7XHJcbiAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCdsYXp5JykuYWRkQ2xhc3MoJ2xhenktbG9hZGVkJyk7XHJcbiAgICAgICAgICAgIGlmIChiZykge1xyXG4gICAgICAgICAgICAgICAgZWwuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgcGxhY2Vob2xkZXJTcmMgKyAnKScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWwuYXR0cignc3JjJywgcGxhY2Vob2xkZXJTcmMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmltYWdlc0xhenlMb2FkU2VxdWVudGlhbCkge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VJc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChpbWFnZXNTZXF1ZW5jZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZEltYWdlKGltYWdlc1NlcXVlbmNlLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmltYWdlc0xhenlMb2FkU2VxdWVudGlhbCkge1xyXG4gICAgICAgICAgICBpZiAoaW1hZ2VJc0xvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbWFnZXNTZXF1ZW5jZS5pbmRleE9mKGVsWzBdKSA8IDApIGltYWdlc1NlcXVlbmNlLnB1c2goZWxbMF0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmmK/lkKbliqDovIlib29s5YC8XHJcbiAgICAgICAgaW1hZ2VJc0xvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWFnZS5vbmxvYWQgPSBvbkxvYWQ7XHJcbiAgICAgICAgaW1hZ2Uub25lcnJvciA9IG9uRXJyb3I7XHJcbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxhenlIYW5kbGVyKCkge1xyXG4gICAgICAgIGxhenlMb2FkSW1hZ2VzID0gcGFnZUNvbnRhaW5lci5maW5kKCcubGF6eScpO1xyXG4gICAgICAgIGxhenlMb2FkSW1hZ2VzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBlbCA9ICQoZWwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsLnBhcmVudHMoJy50YWI6bm90KC5hY3RpdmUpJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpc0VsZW1lbnRJblZpZXdwb3J0KGVsWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRJbWFnZShlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHBhcmFtcy50aW1lb3V0ICogaW5kZXgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQoZWwpIHtcclxuICAgICAgICBwYXJhbXMuZ2V0U2l6ZSgpO1xyXG4gICAgICAgIHZhciByZWN0ID0gZWwgPyBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IHtcclxuICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICBsZWZ0OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdGhyZXNob2xkID0gcGFyYW1zLmltYWdlc0xhenlMb2FkVGhyZXNob2xkIHx8IDA7XHJcbiAgICAgICAgdmFyIHJlY3RoZWlnaHQgPSBwYXJhbXMuaGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgMDtcclxuICAgICAgICB2YXIgcmVjdHdpZHRoID0gcGFyYW1zLndpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IDA7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcmVjdC50b3AgPj0gKDAgLSB0aHJlc2hvbGQpICYmXHJcbiAgICAgICAgICAgIHJlY3QubGVmdCA+PSAoMCAtIHRocmVzaG9sZCkgJiZcclxuICAgICAgICAgICAgcmVjdC50b3AgPD0gKHJlY3RoZWlnaHQgKyB0aHJlc2hvbGQpICYmXHJcbiAgICAgICAgICAgIHJlY3QubGVmdCA8PSAocmVjdHdpZHRoICsgdGhyZXNob2xkKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXR0YWNoRXZlbnRzKGRlc3Ryb3kpIHtcclxuICAgICAgICB2YXIgbWV0aG9kID0gZGVzdHJveSA/ICdvZmYnIDogJ29uJztcclxuICAgICAgICBsYXp5TG9hZEltYWdlc1ttZXRob2RdKCdsYXp5JywgbGF6eUhhbmRsZXIpO1xyXG4gICAgICAgIGxhenlMb2FkSW1hZ2VzLnBhcmVudHMoJy50YWInKVttZXRob2RdKCdzaG93JywgbGF6eUhhbmRsZXIpO1xyXG4gICAgICAgIHBhZ2VDb250YWluZXJbbWV0aG9kXSgnbGF6eScsIGxhenlIYW5kbGVyKTtcclxuICAgICAgICBwYWdlQ29udGFpbmVyW21ldGhvZF0oJ3Njcm9sbCcsIGxhenlIYW5kbGVyKTtcclxuICAgICAgICAvL3BhZ0JvZHlbbWV0aG9kID09PSAnb24nID8gJ29uUmVzaXplJyA6ICdvZmZSZXNpemUnXShsYXp5SGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGV0YWNoRXZlbnRzKCkge1xyXG4gICAgICAgIGF0dGFjaEV2ZW50cyh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlrZjlhLLmlrnms5VcclxuICAgIHBhZ2VDb250YWluZXJbMF0uZjdEZXN0cm95SW1hZ2VzTGF6eUxvYWQgPSBkZXRhY2hFdmVudHM7XHJcblxyXG4gICAgLy8g5aKe5Yqg5LqL5Lu25pON5L2cXHJcbiAgICBhdHRhY2hFdmVudHMoKTtcclxuXHJcbiAgICBsYXp5SGFuZGxlcigpO1xyXG5cclxufTtcclxuJC5kZXN0cm95SW1hZ2VzTGF6eUxvYWQgPSBmdW5jdGlvbihwYWdlQ29udGFpbmVyKSB7XHJcbiAgICBwYWdlQ29udGFpbmVyID0gJChwYWdlQ29udGFpbmVyKTtcclxuICAgIGlmIChwYWdlQ29udGFpbmVyLmxlbmd0aCA+IDAgJiYgcGFnZUNvbnRhaW5lclswXS5mN0Rlc3Ryb3lJbWFnZXNMYXp5TG9hZCkge1xyXG4gICAgICAgIHBhZ2VDb250YWluZXJbMF0uZjdEZXN0cm95SW1hZ2VzTGF6eUxvYWQoKTtcclxuICAgIH1cclxufTtcclxuJC5yZWluaXRJbWFnZXNMYXp5TG9hZCA9IGZ1bmN0aW9uKHBhZ2VDb250YWluZXIpIHtcclxuICAgIHBhZ2VDb250YWluZXIgPSAkKHBhZ2VDb250YWluZXIpO1xyXG4gICAgaWYgKHBhZ2VDb250YWluZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHBhZ2VDb250YWluZXIudHJpZ2dlcignbGF6eScpO1xyXG4gICAgfVxyXG59OyIsIi8qXHJcbiAgICDlrprnvqnlhajlsYDnmoTluLjnlKjnmoTmlrnms5VhcGlcclxuICAgIOa4heaZsOeahOS9v+eUqOWQhOeormFwaeaWueazlVxyXG4qL1xyXG4oZnVuY3Rpb24oJCkge1xyXG4gICAgdmFyIGRlbGF5Qm91bmNlQ29udGFpbmVyO1xyXG4gICAgLy/mk7TlsZVqceeahGFwaeaWueazlVxyXG4gICAgJC5leHRlbmQoe1xyXG4gICAgICAgIC8v5pmC6ZaT5qC85byPIHZhbHVl5pmC6ZaT5oizIHR5cGUg6L+U5Zue55qE5pmC6ZaT5qC85byPIOWmgiB5eXl5LU1NLWRkXHJcbiAgICAgICAgZm9ybWFUaW1lOiBmdW5jdGlvbih2YWx1ZSwgdHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gbnVsbFxyXG4gICAgICAgICAgICB2YXIgdGltZSA9IHZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID4gMTAgPyBuZXcgRGF0ZShwYXJzZUludCh2YWx1ZSkpIDogbmV3IERhdGUocGFyc2VJbnQodmFsdWUpICogMTAwMClcclxuICAgICAgICAgICAgdmFyIGZvcm1hdFRpbWUgPSB0eXBlID8gdHlwZSA6ICd5eXl5LU1NLWRkJ1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIFwiTStcIjogdGltZS5nZXRNb250aCgpICsgMSxcclxuICAgICAgICAgICAgICAgIFwiZCtcIjogdGltZS5nZXREYXRlKCksXHJcbiAgICAgICAgICAgICAgICBcImgrXCI6IHRpbWUuZ2V0SG91cnMoKSxcclxuICAgICAgICAgICAgICAgIFwibStcIjogdGltZS5nZXRNaW51dGVzKCksXHJcbiAgICAgICAgICAgICAgICBcInMrXCI6IHRpbWUuZ2V0U2Vjb25kcygpLFxyXG4gICAgICAgICAgICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKCh0aW1lLmdldE1vbnRoKCkgKyAzKSAvIDMpLFxyXG4gICAgICAgICAgICAgICAgXCJTK1wiOiB0aW1lLmdldE1pbGxpc2Vjb25kcygpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICgvKHkrKS9pLnRlc3QoZm9ybWF0VGltZSkpIHtcclxuICAgICAgICAgICAgICAgIGZvcm1hdFRpbWUgPSBmb3JtYXRUaW1lLnJlcGxhY2UoUmVnRXhwLiQxLCAodGltZS5nZXRGdWxsWWVhcigpICsgJycpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm9ybWF0VGltZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXRUaW1lID0gZm9ybWF0VGltZS5yZXBsYWNlKFJlZ0V4cC4kMSwgUmVnRXhwLiQxLmxlbmd0aCA9PSAxID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVtrXSA6IChcIjAwXCIgKyBkYXRlW2tdKS5zdWJzdHIoKFwiXCIgKyBkYXRlW2tdKS5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0VGltZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIE1pbGxpc2Vjb25kVG9EYXRlOiBmdW5jdGlvbihtc2QpIHtcclxuICAgICAgICAgICAgdmFyIHRpbWUgPSBwYXJzZUZsb2F0KG1zZCk7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRpbWUgJiYgXCJcIiAhPSB0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZUZvcm10ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZSA+PSAwICYmIHRpbWUgPCA2MCAqIDYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZUZvcm10ICs9IFwiMDA6XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZUZvcm10ICs9IChwYXJzZUludCh0aW1lIC8gNjAuMCkgPj0gMTAgPyBwYXJzZUludCh0aW1lIC8gNjAuMCkgOiAoJzAnICsgcGFyc2VJbnQodGltZSAvIDYwLjApKSkgKyBcIjpcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lRm9ybXQgKz0gcGFyc2VJbnQoKHBhcnNlRmxvYXQodGltZSAvIDYwLjApIC0gcGFyc2VJbnQodGltZSAvIDYwLjApKSAqIDYwKSA+PSAxMCA/IHBhcnNlSW50KChwYXJzZUZsb2F0KHRpbWUgLyA2MC4wKSAtIHBhcnNlSW50KHRpbWUgLyA2MC4wKSkgKiA2MCkgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnMCcgKyBwYXJzZUludCgocGFyc2VGbG9hdCh0aW1lIC8gNjAuMCkgLSBwYXJzZUludCh0aW1lIC8gNjAuMCkpICogNjApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gZWxzZSBpZiAodGltZSA+PSA2MCAqIDYwICYmIHRpbWUgPCA2MCAqIDYwICogMjQpIHtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRpbWUgPj0gNjAgKiA2MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtdCArPSAocGFyc2VJbnQodGltZSAvIDM2MDAuMCkgPj0gMTAgPyAnJyA6ICcwJykgKyBwYXJzZUludCh0aW1lIC8gMzYwMC4wKSArIFwiOlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtdCArPSAocGFyc2VJbnQoKHBhcnNlRmxvYXQodGltZSAvIDM2MDAuMCkgLSBwYXJzZUludCh0aW1lIC8gMzYwMC4wKSkgKiA2MCkgPj0gMTAgPyAnJyA6ICcwJykgKyBwYXJzZUludCgocGFyc2VGbG9hdCh0aW1lIC8gMzYwMC4wKSAtIHBhcnNlSW50KHRpbWUgLyAzNjAwLjApKSAqIDYwKSArIFwiOlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtdCArPSAocGFyc2VJbnQoKHBhcnNlRmxvYXQoKHBhcnNlRmxvYXQodGltZSAvIDM2MDAuMCkgLSBwYXJzZUludCh0aW1lIC8gMzYwMC4wKSkgKiA2MCkgLSBwYXJzZUludCgocGFyc2VGbG9hdCh0aW1lIC8gMzYwMC4wKSAtIHBhcnNlSW50KHRpbWUgLyAzNjAwLjApKSAqIDYwKSkgKiA2MCkgPj0gMTAgPyAnJyA6ICcwJykgKyBwYXJzZUludCgocGFyc2VGbG9hdCgocGFyc2VGbG9hdCh0aW1lIC8gMzYwMC4wKSAtIHBhcnNlSW50KHRpbWUgLyAzNjAwLjApKSAqIDYwKSAtIHBhcnNlSW50KChwYXJzZUZsb2F0KHRpbWUgLyAzNjAwLjApIC0gcGFyc2VJbnQodGltZSAvIDM2MDAuMCkpICogNjApKSAqIDYwKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aW1lID0gcGFyc2VJbnQodGltZSAvIDM2MDAuMCkgKyBcIuaXtlwiICsgcGFyc2VJbnQoKHBhcnNlRmxvYXQodGltZSAvIDM2MDAuMCkgLVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcGFyc2VJbnQodGltZSAvIDM2MDAuMCkpICogNjApICsgXCLliIZcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHBhcnNlSW50KChwYXJzZUZsb2F0KChwYXJzZUZsb2F0KHRpbWUgLyAzNjAwLjApIC0gcGFyc2VJbnQodGltZSAvIDM2MDAuMCkpICogNjApIC1cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHBhcnNlSW50KChwYXJzZUZsb2F0KHRpbWUgLyAzNjAwLjApIC0gcGFyc2VJbnQodGltZSAvIDM2MDAuMCkpICogNjApKSAqIDYwKSArIFwi56eSXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtdCArPSAnMDA6MDA6JyArIHBhcnNlSW50KHRpbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aW1lRm9ybXQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXROdW06IGZ1bmN0aW9uKGxpc3RTLCBsaXN0TCwgbnVtKSB7XHJcbiAgICAgICAgICAgIGlmICghbGlzdFMgfHwgIWxpc3RMKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgbnVtID0gbnVtID8gbnVtIDogNTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RMLnNsaWNlKDAsIE1hdGguY2VpbChsaXN0Uy5sZW5ndGggLyBudW0pICogbnVtKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/lu7bpgbLoq4vmsYLln7fooYzkuovku7YgZGVsYXlCb3VuY2UoY2FsbGJhY2ssNTAwKVxyXG4gICAgICAgIGRlbGF5Qm91bmNlOiBmdW5jdGlvbihhY3Rpb24sIGlkbGUpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVsYXlCb3VuY2VzKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0eCA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRlbGF5Qm91bmNlQ29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgZGVsYXlCb3VuY2VDb250YWluZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5hcHBseShjdHgsIGFyZ3MpXHJcbiAgICAgICAgICAgICAgICB9LCBpZGxlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZWxheUJvdW5jZXMoKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/oqK3nva7oh6rlrprnvqnnmoTlvYjmoYZcclxuICAgICAgICBzaG93QWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCB0ZXh0LCBidXR0b24sIGNhbGxiYWNrLCBjYW5jZWwsIGNhbGxiYWNrRmFpbCkge1xyXG4gICAgICAgICAgICBpZiAoJCgnI2FsZXJ0JykubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRpdGxlID8gdGl0bGUgOiAn5o+Q56S6JztcclxuICAgICAgICAgICAgdmFyIHRleHQgPSAhdGV4dCA/ICcnIDogdGV4dC5yZXBsYWNlKC9cXG4vaWcsICc8L2JyPicpO1xyXG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gYnV0dG9uID8gYnV0dG9uIDogJ+eiuuWumic7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJqLWRpYWxvZyBqLWJ1eS1tb3VudC12aWV3IGotZGlhbG9nLWluXCIgaWQ9XCJhbGVydFwiID48ZGl2IGNsYXNzPVwiai1kaWFsb2ctbWFza1wiPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJqLWRpYWxvZy1tYWluXCI+PGg1IGNsYXNzPVwiai1kaWFsb2ctaGVhZGVyXCI+JyArIHRpdGxlICsgJzwvaDU+JztcclxuICAgICAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cImotZGlhbG9nLWNvbnRlbnRcIj48aSBjbGFzcz1cImotZGlhbG9nLWljb24td2FybmluZ1wiPjwvaT48cCBjbGFzcz1cImRlc2NcIj4nICsgdGV4dCArICc8L3A+PC9kaXY+JztcclxuICAgICAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cImotZGlhbG9nLWJ0bi13cmFwXCI+PGEgY2xhc3M9XCJqLWRpYWxvZy1idG4tY29uZmlybVwiPicgKyBidXR0b24gKyAnPC9hPic7XHJcbiAgICAgICAgICAgIGlmIChjYW5jZWwpIGh0bWwgKz0gJzxhIGNsYXNzPVwiai1kaWFsb2ctYnRuLWNhbmNlbFwiPuWPlua2iDwvYT4nO1xyXG4gICAgICAgICAgICBodG1sICs9ICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xyXG4gICAgICAgICAgICB2YXIgYWxlcnQgPSAkKGh0bWwpLmFwcGVuZFRvKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIGFsZXJ0LmZpbmQoJ2EnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nICYmICQodGhpcykuaGFzQ2xhc3MoJ2otZGlhbG9nLWJ0bi1jb25maXJtJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFja0ZhaWwgPT0gJ2Z1bmN0aW9uJyAmJiAkKHRoaXMpLmhhc0NsYXNzKCdqLWRpYWxvZy1idG4tY2FuY2VsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0ZhaWwgJiYgY2FsbGJhY2tGYWlsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhbGVydC5maW5kKCdzcGFuJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL3RvYXN05o+Q56S65qGGXHJcbiAgICAgICAgc2hvd1RvYXN0OiBmdW5jdGlvbih0ZXh0LCBpbmRpdGF0ZXIsIHRpbWVyKSB7XHJcbiAgICAgICAgICAgIGlmICgkKCcjYWxlcnQnKS5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGl0bGUgPyB0aXRsZSA6ICfmj5DnpLonO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9ICF0ZXh0ID8gJ+aPkOekuicgOiB0ZXh0LnJlcGxhY2UoL1xcbi9pZywgJzwvYnI+Jyk7XHJcbiAgICAgICAgICAgIHZhciB0b3AgPSAnPGRpdiBjbGFzcz1cInRvYXN0LW1hc2tcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9hc3QtdGV4dFwiPjxoMz4nICsgdGV4dCArICc8L2gzPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIHZhciB0b2FzdCA9ICQoJzxkaXYgaWQ9XCJ0b2FzdFwiIGNsYXNzPVwidG9hc3RcIj4nICsgdG9wICsgJzwvZGl2PicpO1xyXG4gICAgICAgICAgICBpZiAoJCgnI3RvYXN0JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuZmluZCgnI3RvYXN0JykuaHRtbCh0b3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGl0YXRlcikgJCgnYm9keScpLmZpbmQoJyN0b2FzdCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9hc3QuYXBwZW5kVG8oJ2JvZHknKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbGVhclRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGltZXIgPyB0aW1lciA6IDE1MDApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5qCh6amX6KGo5Zau5q2j5YmHXHJcbiAgICAgICAgdmVyaWZpY2F0aW9uOiBmdW5jdGlvbih0eXBlLCBzdHIpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGVSZWd4ID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IC9eW1xcdTJFODAtXFx1RkU0Rl17MiwxOH0kLywgLy/mqJnpoYzpmZDlrpoxOOWAi+a8ouWtl1xyXG4gICAgICAgICAgICAgICAgZGVzYzogL15bXFx1MkU4MC1cXHVGRTRGXXsyLDIwMH0kLyAvL+ewoeS7i+mZkOWumjIwMOWAi+a8ouWtl1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlkZW50aWZpY2F0aW9uX2NhcmQ6IC9eKFxcZHsxNX0kfF5cXGR7MTh9JHxeXFxkezE3fShcXGR8WHx4KSkkLyxcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYXJkX25vOiAvXihcXGR7MTIsMTl9KSQvLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhbmtfbmFtZTogL15bXFx1MkU4MC1cXHVGRTRGXXszLDEwfSQvLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vYmlsZTogL14oWzAtOV17MTF9KT8kLyxcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYXJkX25vX2lucHV0OiAvXlxcZCskLyxcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb2RlOiAvXihcXGR7Nn0pJC9cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIHJlZ3ggPSB0eXBlUmVneFt0eXBlXTtcclxuICAgICAgICAgICAgaWYgKHJlZ3gudGVzdChzdHIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/njbLlj5Z1cmwgaGFzaOWAvFxyXG4gICAgICAgIGdldEhhc2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvIyguKikvKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v542y5Y+W5Zyw5Z2A5qyE55qE5Y+D5pW4XHJcbiAgICAgICAgcGFyc2VVcmxRdWVyeTogZnVuY3Rpb24odXJsLCB0eXBlKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSB1cmwgfHwgbG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0ge30sXHJcbiAgICAgICAgICAgICAgICBpLCBwYXJhbXMsIHBhcmFtO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVybCA9PT0gJ3N0cmluZycgJiYgdXJsLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gKHVybC5pbmRleE9mKCcjJykgPiAtMSkgPyB1cmwuc3BsaXQoJyMnKVswXSA6IHVybDtcclxuICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmwuaW5kZXhPZignPycpID4gLTEpIHVybCA9IHVybC5zcGxpdCgnPycpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHF1ZXJ5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gdXJsLnNwbGl0KCcmJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgICAgICAgICBxdWVyeVtwYXJhbVswXV0gPSBwYXJhbVsxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+eNsuWPluWcsOWdgOashOeahOWPg+aVuFxyXG4gICAgICAgIGdldFF1ZXJ5U3RyaW5nOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiKF58JilcIiArIG5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XHJcbiAgICAgICAgICAgIHZhciByID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmVzY2FwZShyWzJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v6Ieq5YuV5Yqg5LiKanNvbnBcclxuICAgICAgICBhZGRDYWxsYmFja1BhcmFtOiBmdW5jdGlvbih1cmwpIHtcclxuICAgICAgICAgICAgdXJsICs9ICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyAnY2FsbGJhY2s9Pyc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+iHquWLleWKoOS4impzb25wXHJcbiAgICAgICAgYWRkTWF0aHJvdW5kUGFyYW06IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICAgICAgICB1cmwgKz0gJyc7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gJyYnIDogJz8nKSArICd2PScgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy9hamF46KuL5rGC5pa55rOVXHJcbiAgICAgICAgaHR0cEdldEFwaTogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXIsIHJlc29sdmVDYWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgLy8gdmFyIHBhcmFtZXRlciA9IF8uZXh0ZW5kKHt9LCBzZWxmLnBhcnNlVXJsUXVlcnkoKSwgcGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgdmFyIGFqYXhGbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAzICogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBwYXJhbWV0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlQ2FsbCkgcmVzb2x2ZUNhbGwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJDLmxvZ2luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuc2hvd0FsZXJ0KGRhdGEubXNnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93VG9hc3QoZGF0YS5tc2csIGZhbHNlLCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNob3dUb2FzdCgn5pW45pOa6KuL5rGC55Ww5bi4LOiri+eojeW+jOmHjeippicsIGZhbHNlLCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IGFqYXhGbigpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL2FqYXjoq4vmsYLmlrnms5VcclxuICAgICAgICBodHRwUG9zdEFwaTogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXIsIHJlc29sdmVDYWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgLy8gdmFyIHBhcmFtZXRlciA9ICQuZXh0ZW5kKHt9LCAkLnBhcnNlVXJsUXVlcnkoKSwgcGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgdmFyIGFqYXhGbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHBhcmFtZXRlcixcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLCAvLyDlkIzmraVcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMzAwLCAvL3RvZG8g6LaF5pe255qE6K+d77yM5Y+q6IO96K6k5Li66K+l5YiG54mH5pyq5LiK5Lyg6L+HXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlQ2FsbCkgcmVzb2x2ZUNhbGwoZGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNvZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUkMubG9naW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsbGYuc2hvd0FsZXJ0KGRhdGEubXNnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93VG9hc3QoZGF0YS5tc2csIGZhbHNlLCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLnNob3dUb2FzdCgn5pW45pOa6KuL5rGC55Ww5bi4LOiri+eojeW+jOmHjeippicsIGZhbHNlLCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IGFqYXhGbigpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+Wumue+qemggemdouWIhumggeaWueazlVxyXG4gICAgICAgIC8vaXRlbTp7fSAgbGVuOiBsZW4sc3RhcnQ6IHN0YXJ0LGxpc3Q6IHBhdGhQYWdlLGN1cnJlbnQ6IGN1cnJlbnRcclxuICAgICAgICAvLyBsaXN0IOaVuOe1hFxyXG4gICAgICAgIC8vdG90YWznuL3mlbhcclxuICAgICAgICBwYWdlRm9ybWF0OiBmdW5jdGlvbihpdGVtLCBsaXN0LCB0b3RhbCkge1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gaXRlbS5sZW4gPyBpdGVtLmxlbiA6IDU7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gaXRlbS5jdXJyZW50ID8gaXRlbS5jdXJyZW50IDogMTtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gaXRlbS5zdGFydCA/IGl0ZW0uc3RhcnQgOiAxO1xyXG4gICAgICAgICAgICB2YXIgdG90YWwgPSB0b3RhbCA/IHRvdGFsIDogTWF0aC5jZWlsKGxpc3QubGVuZ3RoIC8gaXRlbS5sZW4pO1xyXG4gICAgICAgICAgICB2YXIgbWF4UGFnZSA9ICh0b3RhbCAtIGN1cnJlbnQpID49IDUgPyAzIDogKHRvdGFsIC0gY3VycmVudCk7XHJcbiAgICAgICAgICAgIHZhciBwYXRoUGFnZSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAobWF4UGFnZSA+PSAzICYmIChjdXJyZW50IC0gMikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gY3VycmVudCAtIDI7IGkgPCBtYXhQYWdlICsgY3VycmVudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aFBhZ2UucHVzaChpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1heFBhZ2UgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGN1cnJlbnQ7IGkgPD0gbWF4UGFnZSArIGN1cnJlbnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhQYWdlLnB1c2goaSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbGVuOiBsZW4sXHJcbiAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcbiAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwsXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBwYXRoUGFnZSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/pmZDliLblrZfnrKbplbfluqZcclxuICAgICAgICBzdWJzdHJMZW46IGZ1bmN0aW9uKHN0ciwgbGVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoc3RyICYmIHN0ci5sZW5ndGggPiBsZW4pID8gc3RyLnN1YnN0cigwLCBsZW4gPyBsZW4gOiBzdHIubGVuZ3RoKSArIFwi4oCm4oCmXCIgOiBzdHJcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5ru+5YuVXHJcbiAgICAgICAgU2xpZGVyOiBmdW5jdGlvbihjb250YWluZXIsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGF1dG86IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiAzMDAwLFxyXG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdob3ZlcicgfCAnY2xpY2snLFxyXG4gICAgICAgICAgICAgICAgbW9kZTogJ3NsaWRlIHwgZmFkZScsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAkKCksXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVDb250cm9sbGVyQ2xzOiAnY2xhc3NOYW1lJyxcclxuICAgICAgICAgICAgICAgIGV4Y2hhbmdlRW5kOiAkLm5vb3BcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVyO1xyXG4gICAgICAgICAgICBzbGlkZXIgPSBmdW5jdGlvbihvcHRpb25zLCBjb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gb3B0aW9ucyB8fCB7fSxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGNscyA9IG9wdGlvbnMuYWN0aXZlQ29udHJvbGxlckNscyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheSA9IG9wdGlvbnMuZGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgaXNBdXRvID0gb3B0aW9ucy5hdXRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBvcHRpb25zLmNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQgPSBvcHRpb25zLmV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1dyYXBwZXIgPSBjb250YWluZXIuY2hpbGRyZW4oKS5maXJzdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlcyA9IHNsaWRlc1dyYXBwZXIuY2hpbGRyZW4oKSxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBzbGlkZXMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkV2lkdGggPSBjb250YWluZXIud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFdpZHRoID0gY2hpbGRXaWR0aCAqIHNsaWRlcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBvcHRpb25zLmlkID8gb3B0aW9ucy5pZCA6IDA7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnRlcnZhbCA9ICd0JyArIERhdGUubm93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29udHJvbEl0ZW0gPSBjb250cm9sbGVyLmNoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQgPT0gJ2hvdmVyJyA/IGNvbnRyb2xJdGVtLm1vdXNlb3ZlcihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5KGluZGV4LCBvcHRpb25zLm1vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLm1vdXNlb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0F1dG8gJiYgYXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSA6IGNvbnRyb2xJdGVtLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXkoaW5kZXgsIG9wdGlvbnMubW9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQXV0byAmJiBhdXRvUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpc0F1dG8gJiYgYXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGUgbW9kZVxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbW9kZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IGNvbnRhaW5lci5jaGlsZHJlbigpLmZpcnN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubW9kZSA9PSAnc2xpZGUnID8gd3JhcHBlci53aWR0aCh0b3RhbFdpZHRoKSA6IHdyYXBwZXIuY2hpbGRyZW4oKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsZWZ0JzogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0b3AnOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpLnNpYmxpbmdzKCkuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vYXV0byBwbGF5XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhdXRvUGxheSgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyUGxheShjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy90cmlnZ2VyIHBsYXlcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRyaWdnZXJQbGF5KGNJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgKGNJbmRleCA9PSBsZW5ndGggLSAxKSA/IGluZGV4ID0gMDogaW5kZXggPSBjSW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXkoaW5kZXgsIG9wdGlvbnMubW9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wbGF5XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwbGF5KGluZGV4LCBtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzV3JhcHBlci5zdG9wKHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlcy5zdG9wKHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RlID09ICdzbGlkZScgPyAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzV3JhcHBlci5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnLT0nICsgTWF0aC5hYnMoaW5kZXggLSBjdXJyZW50SW5kZXgpICogY2hpbGRXaWR0aCArICdweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzV3JhcHBlci5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnKz0nICsgTWF0aC5hYnMoaW5kZXggLSBjdXJyZW50SW5kZXgpICogY2hpbGRXaWR0aCArICdweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKCkgOiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZXNXcmFwcGVyLmNoaWxkcmVuKCc6dmlzaWJsZScpLmluZGV4KCkgPT0gaW5kZXgpIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzV3JhcHBlci5jaGlsZHJlbigpLmZhZGVPdXQoZGVsYXkpLmVxKGluZGV4KS5mYWRlSW4oZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuY2hpbGRyZW4oJy4nICsgY2xzKS5yZW1vdmVDbGFzcyhjbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLmNoaWxkcmVuKCkuZXEoaW5kZXgpLmFkZENsYXNzKGNscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXhjaGFuZ2VFbmQgJiYgdHlwZW9mIG9wdGlvbnMuZXhjaGFuZ2VFbmQgPT0gJ2Z1bmN0aW9uJyAmJiBvcHRpb25zLmV4Y2hhbmdlRW5kLmNhbGwodGhpcywgY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL3N0b3BcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN0b3AoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wcmV2IGZyYW1lXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmV2KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3AoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID09IDAgPyB0cmlnZ2VyUGxheShsZW5ndGggLSAyKSA6IHRyaWdnZXJQbGF5KGN1cnJlbnRJbmRleCAtIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpc0F1dG8gJiYgYXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL25leHQgZnJhbWVcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggPT0gbGVuZ3RoIC0gMSA/IHRyaWdnZXJQbGF5KC0xKSA6IHRyaWdnZXJQbGF5KGN1cnJlbnRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlzQXV0byAmJiBhdXRvUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vaW5pdFxyXG4gICAgICAgICAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vZXhwb3NlIHRoZSBTbGlkZXIgQVBJXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXY6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXcgc2xpZGVyKG9wdGlvbnMsIGNvbnRhaW5lcilcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5YiG6aGeXHJcbiAgICAgICAga2luZEZvcm1hdDogZnVuY3Rpb24oa2luZCwgbGlzdCkge1xyXG4gICAgICAgICAgICB2YXIgbGlzdEV4ZW5kID0gXy51bmlvbihbXSwgW3tcclxuICAgICAgICAgICAgICAgICAgICAndHlwZSc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAn6YGK5oiyJyxcclxuICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnZ2FtZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICduYW1lJzogJ+Wom+aogicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2Rpc3BvcnQnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICd0eXBlJzogMixcclxuICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICfntpzlkIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdtdWx0aXBsZSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHZhciBmaW5kTGFzdEluZGV4ID0gXy5maW5kTGFzdEluZGV4KGxpc3RFeGVuZCwgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0udHlwZSA9PT0ga2luZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIChmaW5kTGFzdEluZGV4ICE9PSAtMSkgPyBsaXN0RXhlbmRbZmluZExhc3RJbmRleF0gOiAn57ac5ZCIJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/pgY7mv77lh7rlhajpg6jnmoTmlbjntYTliJfooagxLTFcclxuICAgICAgICB1c2VyTGlzdEZvcm1hdDogZnVuY3Rpb24odXNlckxpc3QpIHtcclxuICAgICAgICAgICAgdmFyIF9wYXRoID0gW107XHJcbiAgICAgICAgICAgIHZhciBzZXNzX211c2ljTGlzdCA9IF8uZWFjaCh1c2VyTGlzdC5zZXNzX211c2ljLCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9ICdzZXNzX211c2ljJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBzZXNzX2dhbWVMaXN0ID0gXy5lYWNoKHVzZXJMaXN0LnNlc3NfZ2FtZSwgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSAnc2Vzc19nYW1lJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBzZXNzX3Nob3dMaXN0ID0gXy5lYWNoKHVzZXJMaXN0LnNlc3Nfc2hvdywgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSAnc2Vzc19zaG93JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciB0b3BfYmFubmVyc19zaG93TGlzdCA9IF8uZWFjaCh1c2VyTGlzdC50b3BfYmFubmVyc19zaG93LCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9ICd0b3BfYmFubmVyc19zaG93JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciB0b3BfYmFubmVyc19nYW1lTGlzdCA9IF8uZWFjaCh1c2VyTGlzdC50b3BfYmFubmVyc19nYW1lLCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9ICd0b3BfYmFubmVyc19nYW1lJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciB1c2VyQWxsTGlzdCA9IF8udW5pb24oc2Vzc19tdXNpY0xpc3QsIHNlc3NfZ2FtZUxpc3QsIHNlc3Nfc2hvd0xpc3QsIHRvcF9iYW5uZXJzX3Nob3dMaXN0LCB0b3BfYmFubmVyc19nYW1lTGlzdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmlzQXJyYXkodXNlckFsbExpc3QpID8gdXNlckFsbExpc3QgOiBfLnRvQXJyYXkodXNlckFsbExpc3QpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8v5pO05bGVanHnmoRmbuaWueazlVxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIC8v6Yyv6Kqk5o+Q56S6XHJcbiAgICAgICAgc2hvd0Vycm9yOiBmdW5jdGlvbih0ZXh0LCB2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSAkKCc8ZGl2IGlkPVwiZXJyb3JcIiBjbGFzcz1cImVycm9yXCI+PGRpdj48aDY+JyArICh0ZXh0ID8gdGV4dCA6ICfovLjlhaXmoLzlvI/kuI3mraPnoronKSArICc8L2g2PjwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICBpZiAoJChzZWxmKS5maW5kKGVycm9yKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3IpICQoc2VsZikuZmluZChlcnJvcikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHNlbGYpLmFwcGVuZFRvKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/kuIvmi4noj5zllq5cclxuICAgICAgICAvL1t7dGV4dCwgYnV0dG9uLCBjYWxsYmFjayx9XVxyXG4gICAgICAgIHNob3dEcm9wRG93bjogZnVuY3Rpb24obGlzdCwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gJzx1bCBpZD1cIm1lbnUxXCIgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wNFwiPic7XHJcbiAgICAgICAgICAgICQuZWFjaChsaXN0LCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSAnPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIj48YSByb2xlPVwibWVudWl0ZW1cIiBjbGFzcz1cImJ0bi1jb25maXJtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtY2xpY2s9XCInICsgaXRlbS5jYWxsYmFjayArICdcIj4nO1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSAnPGgzPicgKyBpdGVtLnRleHQgKyAnPC9oMz4nO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uYnV0dG9uKSBodG1sICs9ICc8cD4nICsgaXRlbS5idXR0b24gKyAnPC9wPic7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9ICc8L2E+PC9saT4nO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaHRtbCArPSAnPC91bD4nO1xyXG4gICAgICAgICAgICB2YXIgZHJvcERvd24gPSAkKGh0bWwpO1xyXG4gICAgICAgICAgICAvLyBpZiAoJChzZWxmKS5wYXJlbnRzKCdib2R5JykuZmluZCgnI21lbnUxJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKHNlbGYpLnBhcmVudHMoJ2JvZHknKS5maW5kKCcjbWVudTEnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgLy8gICAgICQoc2VsZikucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgLy8gICAgICQoc2VsZikuYWRkQ2xhc3MoJ29wZW4nKS5hcHBlbmQoZHJvcERvd24pO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgJChzZWxmKS5hZGRDbGFzcygnb3BlbicpLmFwcGVuZChkcm9wRG93bik7XHJcbiAgICAgICAgICAgIC8vIH07XHJcbiAgICAgICAgICAgICQoc2VsZikucGFyZW50cygnYm9keScpLmZpbmQoJyNtZW51MScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAkKHNlbGYpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICQoc2VsZikuYWRkQ2xhc3MoJ29wZW4nKS5hcHBlbmQoZHJvcERvd24pO1xyXG4gICAgICAgICAgICAvL+W+queSsOizpuWAvOe1puS4i+aLieiPnOWWruWft+ihjOWHveaVuFxyXG4gICAgICAgICAgICAkLmVhY2gobGlzdCwgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGRyb3BEb3duLmZpbmQoJ2EuYnRuLWNvbmZpcm0nKS5lcShpbmRleCkuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJvcERvd24ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gaXRlbS5jYWxsYmFjaztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoc2VsZikucGFyZW50KCkucGFyZW50KCkubm90KCdhLmJ0bi1jb25maXJtJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHNlbGYpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICBkcm9wRG93bi5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL+WxleekumxvYWRpbmdcclxuICAgICAgICBzaG93TG9hZGluZzogZnVuY3Rpb24obW9kZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciAkbG9hZGluZyA9ICQoJzxkaXYgY2xhc3M9XCJuby1kYXRhIHRjXCI+5Yqg6LyJ5LitwrfCt8K3PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHZhciAkdG9wID0gJChzZWxmKS5oZWlnaHQoKSA+IDIwMCA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyICRzdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgdG9wOiAoJHRvcCA/ICdhdXRvJyA6IDApLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMjBweCcsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46ICc0MCUgYXV0bycsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBtb2RlID0gbW9kZSA/IG1vZGUgOiAnc2hvdyc7XHJcbiAgICAgICAgICAgICQoc2VsZikuY3NzKHsgcG9zaXRpb246ICdyZWxhdGl2ZScgfSk7XHJcbiAgICAgICAgICAgIGlmICghJChzZWxmKS5maW5kKCcubm8tZGF0YScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJChzZWxmKS5hcHBlbmQoJGxvYWRpbmcpO1xyXG4gICAgICAgICAgICAgICAgJChzZWxmKS5maW5kKCRsb2FkaW5nKS5jc3MoJHN0eWxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChtb2RlID09ICdoaWRlJykgJChzZWxmKS5maW5kKCcubm8tZGF0YScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZFNpemU6IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNkID0gJCgnYm9keSxodG1sJykud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIHZhciBjaCA9ICQoJ2JvZHksaHRtbCcpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG14ID0gJChjb250YWluZXIpLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb0xlZnQgPSAkKGNvbnRhaW5lcikub2Zmc2V0KCkubGVmdDtcclxuICAgICAgICAgICAgICAgIHZhciBvUmlnaHQgPSAkKGNvbnRhaW5lcikub2Zmc2V0KCkucmlnaHQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3dkID0gc2VsZi53aWR0aCgpID8gc2VsZi53aWR0aCgpIDogMjAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNkIDwgKG14ICsgc3dkICogMiArIDQwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZhZGVJbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkQWN0aXZlOiBmdW5jdGlvbihjb250YWluZXIpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVyQWN0aXZlID0gJCgnPGRpdiBjbGFzcz1cInNsaWRlci1pdGVtLWFjdGl2ZVwiPjwvZGl2PicpO1xyXG4gICAgICAgICAgICB2YXIgYmFuUkxUcGwgPSBjb250YWluZXIgPyBjb250YWluZXIgOiAkKCcjYmFuUkxUcGwnKS5maW5kKCcuc2xpZGVyLXJhbmsnKTtcclxuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gc2VsZi5vZmZzZXQoKTtcclxuICAgICAgICAgICAgaWYgKGJhblJMVHBsLmZpbmQoJy5zbGlkZXItaXRlbS1hY3RpdmUnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGJhblJMVHBsLmZpbmQoJy5zbGlkZXItaXRlbS1hY3RpdmUnKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IChwb3NpdGlvbi50b3AgLSAxMiksXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJy03cHgnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYmFuUkxUcGwuYXBwZW5kKHNsaWRlckFjdGl2ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkT3ZlcmZsb3c6IGZ1bmN0aW9uKGNvbnRhaW5lciwgdGltZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBfc2V0SW50ZXIsIF90aW1lID0gdGltZSA/IHRpbWUgOiA4MDA7XHJcbiAgICAgICAgICAgIHZhciBfdGV4dCA9IHNlbGYudGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgX2NvbnRlbnQgPSAoJzxlbSBjbGFzcz1cIm92ZXItdGl0bGVcIiBzdHlsZT1cIndoaXRlLXNwYWNlOm5vd3JhcDtjb2xvcjojZmZmXCI+JyArIF90ZXh0ICsgJzwvZW0nKTtcclxuICAgICAgICAgICAgdmFyIF9oaWRkZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgLy9zZWxmLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBhcmVudCgpLmZpbmQoJy5vdmVyLXRpdGxlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChfc2V0SW50ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBfc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsZi5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBfdGl0bGUgPSBzZWxmLnBhcmVudCgpLmZpbmQoJy5vdmVyLXRpdGxlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIV90aXRsZS5sZW5ndGgpIHNlbGYucGFyZW50KCkuYXBwZW5kKF9jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHZhciBfdGl0bGUgPSBzZWxmLnBhcmVudCgpLmZpbmQoJy5vdmVyLXRpdGxlJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgX21kID0gc2VsZi5wYXJlbnQoKS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIF9jZCA9IF90aXRsZS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIF93ZCA9IE1hdGgubWF4KF9jZCAtIF9tZCwgMCk7XHJcbiAgICAgICAgICAgICAgICAvL190aW1lID0gX3dkID8gX3dkICogMTAgOiBfdGltZTtcclxuICAgICAgICAgICAgICAgIGlmIChfd2QgPCA1KSByZXR1cm5cclxuICAgICAgICAgICAgICAgIF9zZXRJbnRlciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGl0bGUuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aGl0ZS1zcGFjZSc6ICdub3dyYXAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndG9wJzogMFxyXG4gICAgICAgICAgICAgICAgICAgIH0pLmFuaW1hdGUoeyAnbGVmdCc6IDAgfSwgX3RpbWUsICdzd2luZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGl0bGUuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCc6IC1fd2RcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgX3RpbWUgKiAyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIF90aW1lICogMilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLnBhcmVudCgpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAncG9zaXRpb24nOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbidcclxuICAgICAgICAgICAgfSkuaG92ZXIoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBfc2hvdygpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIF9oaWRkZW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy/lrprnvqnlhajlsYBnYee1seioiOS7o+eivFxyXG4gICAgd2luZG93Ll9nYSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZ2EgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBnYS5hcHBseSh3aW5kb3csIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHdpbmRvdy5qUXVlcnkpOyIsInZhciBTSU5HRVJfQ09ORklHID0gcmVxdWlyZSgnLi4vYXBpL2NvbmZpZy5qcycpO1xyXG52YXIgY29uZiA9IHdpbmRvdy5zZXJ2ZXJDb25maWc7XHJcbnZhciBSQ2FkRGF0YSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIGFkOiB7XHJcbiAgICAgICAgICAgIHVybDogY29uZi5hZC5yY19hZHVybCxcclxuICAgICAgICAgICAgaW1nOiBjb25mLnJjX2Fzc2V0cyArICdpbWcvYWQvbGl2ZV9ldmVudC5wbmcnLFxyXG4gICAgICAgICAgICBiYW5iZzogY29uZi5yY19hc3NldHMgKyAnaW1nL2FkL2xpdmVfYmcucG5nJyxcclxuICAgICAgICAgICAgYmc6IGNvbmYucmNfYXNzZXRzICsgJ2ltZy9hZC9saXZlX2JnX3JlcGVhdC5wbmcnLFxyXG4gICAgICAgICAgICBzaG93X3JlcG9ydF91cmw6ICcnLFxyXG4gICAgICAgICAgICB0aXRsZTogY29uZi5hZC5yY19hZHRpdGxlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIHVybDogJ2h0dHA6Ly8xOTIuMTY4LjU2LjE6MzAwMC9pbmRleC9hY3QvdXNlclByb2ZpbGU/Y2FsbGJhY2s9JyArIF8ubm93KCksIC8v6Kit572u6KuL5rGC55qEdXJs5o6l5Y+j5Zyw5Z2AXHJcbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChyZXMuY29kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvYmogPSByZXMuZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuICAgIC8v6aGe5Ly85Yid5aeL5YyW55qE5Yqg6LyJ5Ye95pW4XHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLm9uKCdjaGFuZ2UnLCB0aGlzLmFkQ2hhbmdlKTtcclxuICAgIH0sXHJcbiAgICAvL+agvOW8j+WMluaVuOaTmlxyXG4gICAgYWRDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFkOiB0aGlzLmdldCgnYWQnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNhZHZpZXdGbCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICAgIHRhZ05hbWU6ICdkaXYnLFxyXG4gICAgaWQ6ICdyYy1hZC1mbCcsXHJcbiAgICBjbGFzc05hbWU6ICdyYy1hZCByYy1hZC1mbCcsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH0sXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgICAnY2xpY2sgI3JjLWNvbnRlbnQtZ2FtZSBhLmxpbmstcmVjJzogJ2NsaWNrUmVjJ1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1vZGVsSnNvbiA9IHRoaXMubW9kZWwuYWRDaGFuZ2UoKVsnYWQnXTtcclxuICAgICAgICBpZiAoIW1vZGVsSnNvbi51cmwpIHJldHVybjtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5zcmMgPSBtb2RlbEpzb24uaW1nO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZi4kZWwuYWRTaXplKCcjcmMtYmFubmVyJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdHBsX2FkJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUobW9kZWxKc29uKSkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBjbGlja1JlYzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNhZHZpZXdGciA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICAgIHRhZ05hbWU6ICdkaXYnLFxyXG4gICAgaWQ6ICdyYy1hZC1mcicsXHJcbiAgICBjbGFzc05hbWU6ICdyYy1hZCByYy1hZC1mcicsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH0sXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgICAnY2xpY2sgI3JjLWNvbnRlbnQtZ2FtZSBhLmxpbmstcmVjJzogJ2NsaWNrUmVjJ1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1vZGVsSnNvbiA9IHRoaXMubW9kZWwuYWRDaGFuZ2UoKVsnYWQnXTtcclxuICAgICAgICBpZiAoIW1vZGVsSnNvbi51cmwpIHJldHVybjtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5zcmMgPSBtb2RlbEpzb24uaW1nO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZi4kZWwuYWRTaXplKCcjcmMtYmFubmVyJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdHBsX2FkJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUobW9kZWxKc29uKSkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBjbGlja1JlYzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNzID0ge1xyXG4gICAgVmlld0ZyOiBSQ2Fkdmlld0ZyLFxyXG4gICAgVmlld0ZsOiBSQ2Fkdmlld0ZsLFxyXG4gICAgTW9kZWw6IFJDYWREYXRhXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUkNzOyIsInZhciBTSU5HRVJfQ09ORklHID0gcmVxdWlyZSgnLi4vYXBpL2NvbmZpZy5qcycpO1xyXG52YXIgY29uZiA9IHdpbmRvdy5zZXJ2ZXJDb25maWc7XHJcbnZhciBSQ2FuY0RhdGEgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xyXG4gICAgZGVmYXVsdHM6IHtcclxuICAgICAgICBhbmNob3JMaXN0OiBbXSxcclxuICAgICAgICBwYWdlOiB7XHJcbiAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICBjdXJyZW50OiAwLFxyXG4gICAgICAgICAgICBsZW46IDE1XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIHVybDogJ2h0dHA6Ly8xOTIuMTY4LjU2LjE6MzAwMC9pbmRleC9hY3QvdXNlclByb2ZpbGU/Y2FsbGJhY2s9JyArIF8ubm93KCksIC8v6Kit572u6KuL5rGC55qEdXJs5o6l5Y+j5Zyw5Z2AXHJcbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChyZXMuY29kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvYmogPSByZXMuZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXy5pc0FycmF5KHJlcykpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldCgncGFnZScpXHJcbiAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgIGFuY2hvckxpc3Q6IHJlcyxcclxuICAgICAgICAgICAgICAgIHBhZ2U6ICQucGFnZUZvcm1hdChwYWdlLCByZXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sXHJcbiAgICAvL+mhnuS8vOWIneWni+WMlueahOWKoOi8ieWHveaVuFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSAkLmFkZENhbGxiYWNrUGFyYW0oU0lOR0VSX0NPTkZJRy5QQVRILkdFVF9TSE9XICsgJz90eXBlPTAmc2l6ZT0yMCZwYWdlPTEnKTtcclxuICAgICAgICAvLyB0aGlzLmZldGNoKCk7XHJcbiAgICAgICAgdGhpcy5vbignY2hhbmdlJywgdGhpcy5hbkNoYW5nZSk7XHJcbiAgICB9LFxyXG4gICAgLy/moLzlvI/ljJbmlbjmk5pcclxuICAgIGFuQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYW5jaG9yTGlzdCA9IHRoaXMuZ2V0KCdhbmNob3JMaXN0Jyk7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldCgncGFnZScpO1xyXG4gICAgICAgIHZhciBwYWdlTGVuID0gcGFnZS5jdXJyZW50ID8gcGFnZS5sZW4gKiAocGFnZS5jdXJyZW50KSA6IDE1O1xyXG4gICAgICAgIHZhciBhbmNob3JMaXN0RiA9IF8uY2hhaW4oYW5jaG9yTGlzdCkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIChpdGVtLmxpdmUgfHwgaXRlbS5sYWJlbClcclxuICAgICAgICB9KS5zb3J0QnkoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIWl0ZW0ubHZOdW1cclxuICAgICAgICB9KS5zb3J0QnkoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIWl0ZW0ubGFiZWxcclxuICAgICAgICB9KS52YWx1ZSgpO1xyXG4gICAgICAgIHZhciBhbmNob3JMaXN0TiA9IGFuY2hvckxpc3RGLmNvbmNhdChfLmNoYWluKGFuY2hvckxpc3QpLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhaXRlbS5saXZlXHJcbiAgICAgICAgfSkuc29ydEJ5KGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpdGVtLmx2TnVtICYmICFpdGVtLm9ubGluZVxyXG4gICAgICAgIH0pLnZhbHVlKCkpO1xyXG4gICAgICAgIHZhciBhbmNob3JMaXN0TSA9IGNvbmYuYW5jaG9yTGlzdE0gPSBfLmNoYWluKGFuY2hvckxpc3QpLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmxpdmUpIGl0ZW0ubGlua190eXBlID0gMztcclxuICAgICAgICAgICAgcmV0dXJuICFpdGVtLmNhdGUgJiYgaXRlbS5saXZlID09IDEgJiYgIWl0ZW0ubGFiZWxcclxuICAgICAgICB9KS5zb3J0QnkoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLWl0ZW0ud2VpZ2h0XHJcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ud2VpZ2h0ID49IDUwXHJcbiAgICAgICAgfSkuZmlyc3QoKS52YWx1ZSgpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFuY2xpc3RybTogYW5jaG9yTGlzdE0sXHJcbiAgICAgICAgICAgIGFuY2xpc3Q6IGFuY2hvckxpc3RGLmxlbmd0aCA+PSAxNSA/ICQuZm9ybWF0TnVtKGFuY2hvckxpc3RGLCBhbmNob3JMaXN0TikgOiBhbmNob3JMaXN0Ti5zbGljZSgwLCBwYWdlTGVuKSxcclxuICAgICAgICAgICAgcGFnZTogcGFnZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNhbmN2aWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gICAgdGFnTmFtZTogJ2RpdicsXHJcbiAgICBpZDogJ3JjLXJlYycsXHJcbiAgICBjbGFzc05hbWU6ICdyYy1yZWMgc2luZ2VyLXJlYyBzaW5nZXJzLXJlYycsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmJ0bkxvYWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5mZXRjaCgpO1xyXG4gICAgfSxcclxuICAgIGV2ZW50czoge1xyXG4gICAgICAgICdjbGljayAjcmMtcmVjIHVsPmxpIGEubGluay1yZWMnOiAnY2xpY2tSZWMnLFxyXG4gICAgICAgICdjbGljayAjcmMtcmVjIGEuZ28tbW9yZSc6ICdjbGlja01vcmUnLFxyXG4gICAgICAgICdtb3VzZW91dCAjcmMtcmVjIHVsPmxpIGEubGluay1yZWMnOiAnY2xpY2tSZWNPdXQnXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbW9kZWxKc29uID0gdGhpcy5tb2RlbC5hbkNoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoJyN0cGxfYW5jaG9yJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUobW9kZWxKc29uKSk7XHJcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xyXG4gICAgICAgICQuaW5pdEltYWdlc0xhenlMb2FkKHRoaXMuJGVsLmZpbmQoJy5saW5rLXJlYycpKTtcclxuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgY2xpY2tSZWM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgdm0gPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgdmFyIGxpdmUgPSB2bS5kYXRhKCdsaXZlJyk7XHJcbiAgICAgICAgdmFyIGNpZCA9IHZtLmRhdGEoJ2NpZCcpO1xyXG4gICAgICAgIHZhciB1aWQgPSB2bS5kYXRhKCd1aWQnKTtcclxuICAgICAgICB2YXIgc2lkID0gdm0uZGF0YSgnc2lkJyk7XHJcbiAgICAgICAgLy92bS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgaWYgKGxpdmUgPT0gMSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWwuZW50ZXJTZXJ2ZXIoc2lkLCBjaWQsIDYpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cub3BlbignLy9yY3Nob3cudHYvbGl2ZS8/dWlkPScgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjbGlja1JlY091dDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAvL3ZtLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0sXHJcbiAgICBjbGlja01vcmU6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5idG5Mb2FkKSByZXR1cm5cclxuICAgICAgICB0aGlzLmJ0bkxvYWQgPSB0cnVlO1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgY3VycmVudFBhZ2UgPSB2bS5kYXRhKCdjdXJyZW50Jyk7XHJcbiAgICAgICAgY3VycmVudFBhZ2UrK1xyXG4gICAgICAgIHZhciBhbmNob3JMaXN0ID0gdGhpcy5tb2RlbC5nZXQoJ2FuY2hvckxpc3QnKTtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMubW9kZWwuZ2V0KCdwYWdlJyk7XHJcbiAgICAgICAgdmFyIHBhcmFtID0gJC5leHRlbmQoe30sIHBhZ2UsIHtcclxuICAgICAgICAgICAgY3VycmVudDogY3VycmVudFBhZ2VcclxuICAgICAgICB9KVxyXG4gICAgICAgICQud2hlbih0aGlzLm1vZGVsLnNldCh7XHJcbiAgICAgICAgICAgIGFuY2hvckxpc3Q6IGFuY2hvckxpc3QsXHJcbiAgICAgICAgICAgIHBhZ2U6IHBhcmFtXHJcbiAgICAgICAgfSkpLnRoZW4odGhpcy5idG5Mb2FkID0gZmFsc2UpXHJcbiAgICB9LFxyXG4gICAgaG92ZXJSZWM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgdm0gPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgLy8kKHZtKS5jaGlsZHJlbigpLmNoaWxkcmVuKCdoMycpLmFkT3ZlcmZsb3coKTtcclxuICAgICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBSQ3MgPSB7XHJcbiAgICBWaWV3OiBSQ2FuY3ZpZXcsXHJcbiAgICBNb2RlbDogUkNhbmNEYXRhXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUkNzOyIsInZhciBTSU5HRVJfQ09ORklHID0gcmVxdWlyZSgnLi4vYXBpL2NvbmZpZy5qcycpO1xyXG52YXIgY29uZiA9IHdpbmRvdy5zZXJ2ZXJDb25maWc7XHJcbnZhciBhdXR1UGFyYW0gPSB7XHJcbiAgICBhdXRvcGxheTogdHJ1ZSwgLy/mmK/lkKboh6rli5XovKrmkq1cclxuICAgIHNwZWVkOiA1MDAsIC8vICDovKrmkq3nmoTpgJ/luqZcclxuICAgIGRlbGF5OiA0MDAwLCAvLyAg6ZaT6ZqU6Lyq5pKt55qE5pmC6ZaTXHJcbiAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7fSwgLy8gIOi8quaSreS4gOWAi2JubmVy5Ye95pW45LmL5b6M5Zue6Kq/5Ye95pW4XHJcbiAgICBkb3RzOiB0cnVlLCAvLyAg5piv5ZCm6aGv56S66bue6Lyq5pKt5oyH56S654eIXHJcbiAgICBmbHVpZDogZmFsc2UgLy8gIOaYr+WQpuaUr+aMgeiHqumBqeaHiVxyXG59O1xyXG52YXIgc3RvcFBhcmFtID0gJC5leHRlbmQoe30sIGF1dHVQYXJhbSwge1xyXG4gICAgYXV0b3BsYXk6IGZhbHNlIC8v5piv5ZCm6Ieq5YuV6Lyq5pKtXHJcbn0pO1xyXG52YXIgYWxpbmsgPSAkKCc8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJzbGlkZXItbGlua1wiPjwvYT4nKTtcclxudmFyIGNvdmVyID0gJCgnPGRpdiBjbGFzcz1cImJhbm5lci1jb3ZlclwiPjwvZGl2PicpO1xyXG52YXIgUkNiYW5EYXRhID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgYmFubmVyOiB7XHJcbiAgICAgICAgICAgIHNlc3NfbXVzaWM6IHt9LFxyXG4gICAgICAgICAgICBzZXNzX2dhbWU6IHt9LFxyXG4gICAgICAgICAgICBzZXNzX3Nob3c6IHt9LFxyXG4gICAgICAgICAgICB0b3BfYmFubmVyc19zaG93OiBbXSxcclxuICAgICAgICAgICAgdG9wX2Jhbm5lcnNfZ2FtZTogW10sXHJcbiAgICAgICAgICAgIHNlc3NfaW5kZXg6IHtcclxuICAgICAgICAgICAgICAgIGdhbWU6IDAsXHJcbiAgICAgICAgICAgICAgICBzaG93OiAwLFxyXG4gICAgICAgICAgICAgICAgbXVzaWM6IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmFubmVyTGl2ZToge30sXHJcbiAgICAgICAgYmFubmVyU2V0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChyZXMuY29kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvYmogPSByZXMuZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuICAgIC8v6aGe5Ly85Yid5aeL5YyW55qE5Yqg6LyJ5Ye95pW4XHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyB0aGlzLmJhbkNoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMub24oJ2NoYW5nZScsIHRoaXMuYmFuQ2hhbmdlKTtcclxuICAgIH0sXHJcbiAgICBiYW5EYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL+mAsuihjOWIpOaWt+aYr+WQpuWtmOWcqHNob3fmjqjolqbntpzol50g5aaC5p6c5pyJ55u05o6l5L2/55So56ys5LiA5YCL5aaC5p6c5rKS5pyJ5YmH5b6e5Li75pKt5YiX6KGo6Zqo5qmf6YG45pOH5Zyo57ea5pKt5pS+55qEXHJcbiAgICAgICAgdmFyIGJhbm5lciA9IHRoaXMuZ2V0KCdiYW5uZXInKTtcclxuICAgICAgICB2YXIgYmFubmVyU2V0ID0gdGhpcy5nZXQoJ2Jhbm5lclNldCcpO1xyXG4gICAgICAgIHZhciBiYW5uZXJMaXZlID0gdGhpcy5nZXQoJ2Jhbm5lckxpdmUnKTtcclxuICAgICAgICB2YXIga2V5cyA9IF8ua2V5cyhiYW5uZXIpO1xyXG4gICAgICAgICQuZWFjaChrZXlzLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoIV8uaXNBcnJheShiYW5uZXJbaXRlbV0pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gYmFubmVyW2l0ZW1dO1xyXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKGl0ZW1zKTtcclxuICAgICAgICAgICAgICAgIGJhbm5lcltpdGVtXSA9IHBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcGFyYW0gPSB7fTtcclxuICAgICAgICB2YXIgc2hvd1BhdGggPSBbXTtcclxuICAgICAgICB2YXIgbXVzaWNQYXRoID0gW107XHJcbiAgICAgICAgdmFyIGJhbm5lcnMgPSAkLmV4dGVuZCh7fSwgYmFubmVyKTtcclxuICAgICAgICB2YXIgdW5pbmxpc3QgPSAkLnVzZXJMaXN0Rm9ybWF0KGJhbm5lcik7XHJcbiAgICAgICAgdmFyIHNlc3NtdXNpY0xpc3QgPSBfLmNoYWluKHVuaW5saXN0KS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5zdGF0dXMgPT09ICdzZXNzX211c2ljJyAmJiBpdGVtLmxpdmUgJiYgaXRlbS5saW5rX3R5cGUgPT0gM1xyXG4gICAgICAgIH0pLnZhbHVlKCk7XHJcbiAgICAgICAgdmFyIHNlc3NzaG93TGlzdCA9IF8uY2hhaW4odW5pbmxpc3QpLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnN0YXR1cyA9PT0gJ3Nlc3Nfc2hvdydcclxuICAgICAgICB9KS52YWx1ZSgpO1xyXG4gICAgICAgIGlmIChjb25mLmFuY2hvckxpc3RNKSB7XHJcbiAgICAgICAgICAgIHZhciBhbmNsaXN0cm0gPSBjb25mLmFuY2hvckxpc3RNID8gY29uZi5hbmNob3JMaXN0TSA6XHJcbiAgICAgICAgICAgICAgICAkLnJjYW5jaG9yLm1vZGVsLmFuQ2hhbmdlKCkuYW5jbGlzdHJtO1xyXG4gICAgICAgICAgICAkLmV4dGVuZChwYXJhbSwgYW5jbGlzdHJtKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy/ng63pl6hsaXZl5Ye6546w77ya57u86Im66YKj6L655ZCO5Y+w5rKh5pyJ5LiK5Lyg5pyJ5pWI5pe26Ze05YaF55qEYm7ml7blh7rnjrDvvIzmraTml7blsZXnpLrng63pl6hsaXZl55qEYm7vvIjllK/kuIDvvIlcclxuICAgICAgICBpZiAoIXNlc3NzaG93TGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gdmFyIHBhdGhzID0gW107XHJcbiAgICAgICAgICAgIC8vIGlmIChiYW5uZXIuc2Vzc19zaG93Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gICAgIHZhciBwYXJhbVNob3cgPSAkLmV4dGVuZCh7fSwgcGFyYW0pO1xyXG4gICAgICAgICAgICAvLyAgICAgdmFyIHNhbXBsZVNob3cgPSBfLmNoYWluKGJhbm5lci5zZXNzX3Nob3cpLnNhbXBsZSgpLnZhbHVlKCk7XHJcbiAgICAgICAgICAgIC8vICAgICAkLmV4dGVuZChzYW1wbGVTaG93ID8gc2FtcGxlU2hvdyA6IGJhbm5lci5zZXNzX3Nob3dbMF0sIHBhcmFtU2hvdyk7XHJcbiAgICAgICAgICAgIC8vICAgICBwYXRocy5wdXNoKHBhcmFtU2hvdyk7XHJcbiAgICAgICAgICAgIC8vICAgICBiYW5uZXJzID0gJC5leHRlbmQoe30sIGJhbm5lciwge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHNlc3Nfc2hvdzogYmFubmVyLnNlc3Nfc2hvd1xyXG4gICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICB2YXIgcGFyYW1TaG93ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBpbWc6IGNvbmYucmNfYXNzZXRzICsgJ2ltZy9pY19ob3RfcmVjLnBuZydcclxuICAgICAgICAgICAgLy8gICAgIH0sIHBhcmFtKTtcclxuICAgICAgICAgICAgLy8gICAgIGJhbm5lcnMgPSAkLmV4dGVuZCh7fSwgYmFubmVyLCB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgc2Vzc19zaG93OiBwYXJhbVNob3dcclxuICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIHZhciBwYXJhbVNob3cgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBpbWc6IGNvbmYucmNfYXNzZXRzICsgJ2ltZy9pY19ob3RfcmVjLnBuZydcclxuICAgICAgICAgICAgfSwgcGFyYW0pO1xyXG4gICAgICAgICAgICBzaG93UGF0aC5wdXNoKHBhcmFtU2hvdyk7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbVNob3dMaXN0ID0gXy51bmlvbihiYW5uZXIuc2Vzc19zaG93ID8gYmFubmVyLnNlc3Nfc2hvdyA6IFtdLCBzaG93UGF0aClcclxuICAgICAgICAgICAgJC5leHRlbmQoYmFubmVycywgYmFubmVyLCB7XHJcbiAgICAgICAgICAgICAgICBzZXNzX3Nob3c6IHBhcmFtU2hvd0xpc3RcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+mfs+S5kOaIv++8muWPquacieS4gOS4quinhOWIme+8jDPkuKrmjqjojZDkvY3pg73msqHop4bpopHmkq3ml7bmkq3igJzng63pl6hsaXZl4oCd77yM57u86Im65L2N5pKt5LqG54Ot6ZeobGl2ZeWwseS4jemcgOimgeWGjeWcqOi/mei+ueaSreS6huOAguaSreeDremXqGxpdmXml7blsZXnpLrng63pl6hsaXZl55qEYm7vvIjlm7rlrprllK/kuIDvvIlcclxuICAgICAgICBpZiAoIXNlc3NtdXNpY0xpc3QubGVuZ3RoICYmICFzaG93UGF0aC5sZW5ndGggJiYgY29uZi5hbmNob3JMaXN0TSkge1xyXG4gICAgICAgICAgICAvLyBpZiAoYmFubmVyLnNlc3NfbXVzaWMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyAgICAgdmFyIHBhdGggPSBbXTtcclxuICAgICAgICAgICAgLy8gICAgIHZhciBwYXJhbU11c2ljID0gJC5leHRlbmQoe30sIHBhcmFtKTtcclxuICAgICAgICAgICAgLy8gICAgIHZhciBzYW1wbGVNdXNpYyA9IF8uY2hhaW4oYmFubmVyLnNlc3Nfc2hvdykuc2FtcGxlKCkudmFsdWUoKTtcclxuICAgICAgICAgICAgLy8gICAgICQuZXh0ZW5kKHNhbXBsZU11c2ljID8gc2FtcGxlTXVzaWMgOiBiYW5uZXIuc2Vzc19tdXNpY1swXSwgcGFyYW1NdXNpYyk7XHJcbiAgICAgICAgICAgIC8vICAgICBwYXRoLnB1c2gocGFyYW1NdXNpYyk7XHJcbiAgICAgICAgICAgIC8vICAgICBiYW5uZXJzID0gJC5leHRlbmQoe30sIGJhbm5lciwge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHNlc3NfbXVzaWM6IGJhbm5lci5zZXNzX211c2ljXHJcbiAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgIHZhciBwYXJhbU11c2ljID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBpbWc6IGNvbmYucmNfYXNzZXRzICsgJ2ltZy9pY19ob3RfcmVjLnBuZydcclxuICAgICAgICAgICAgLy8gICAgIH0sIHBhcmFtKTtcclxuICAgICAgICAgICAgLy8gICAgIGJhbm5lcnMgPSAkLmV4dGVuZCh7fSwgYmFubmVyLCB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgc2Vzc19tdXNpYzogcGFyYW1NdXNpY1xyXG4gICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgdmFyIHBhcmFtTXVzaWMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBpbWc6IGNvbmYucmNfYXNzZXRzICsgJ2ltZy9pY19ob3RfcmVjLnBuZydcclxuICAgICAgICAgICAgfSwgcGFyYW0pO1xyXG4gICAgICAgICAgICBtdXNpY1BhdGgucHVzaChwYXJhbU11c2ljKTtcclxuICAgICAgICAgICAgdmFyIHBhcmFtTXVzaWNMaXN0ID0gXy51bmlvbihiYW5uZXIuc2Vzc19tdXNpYyA/IGJhbm5lci5zZXNzX211c2ljIDogW10sIG11c2ljUGF0aClcclxuICAgICAgICAgICAgJC5leHRlbmQoYmFubmVycywgYmFubmVyLCB7XHJcbiAgICAgICAgICAgICAgICBzZXNzX211c2ljOiBwYXJhbU11c2ljTGlzdFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2V0KCQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIGJhbm5lcjogYmFubmVyLFxyXG4gICAgICAgICAgICBiYW5uZXJTZXQ6IGJhbm5lclNldCxcclxuICAgICAgICAgICAgYmFubmVyTGl2ZTogYmFubmVyTGl2ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYmFubmVyOiBiYW5uZXJzXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfSxcclxuICAgIC8v5qC85byP5YyW5pW45pOaXHJcbiAgICBiYW5DaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuYmFuRGF0YSgpO1xyXG4gICAgICAgIHZhciBiYW5uZXIgPSB0aGlzLmdldCgnYmFubmVyJyk7XHJcbiAgICAgICAgdmFyIGJhbm5lclNldCA9IHRoaXMuZ2V0KCdiYW5uZXJTZXQnKTtcclxuICAgICAgICB2YXIgYmFubmVyTGl2ZSA9IHRoaXMuZ2V0KCdiYW5uZXJMaXZlJyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYmFubmVyOiBiYW5uZXIsXHJcbiAgICAgICAgICAgIGJhbm5lclNldDogYmFubmVyU2V0ID8gYmFubmVyU2V0IDogYmFubmVyWydzZXNzX211c2ljJ10sXHJcbiAgICAgICAgICAgIGJhbm5lckxpdmU6IGJhbm5lckxpdmVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxudmFyIFJDYmFuRkx2aWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gICAgdGFnTmFtZTogJ2RpdicsXHJcbiAgICBjbGFzc05hbWU6ICdiYW4tZmwnLFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlJywgdGhpcy5yZW5kZXIpO1xyXG4gICAgfSxcclxuICAgIGV2ZW50czoge1xyXG4gICAgICAgICdjbGljayAjYmFuZkxUcGwgLnNsaWRlcyBhLmxpbmstYmFubmVyJzogJ0NsaWNrQmFubmVyJ1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1vZGVsSm9zbiA9IHRoaXMubW9kZWwuYmFuQ2hhbmdlKCk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RwbF9iYW5mTCcpLmh0bWwoKSlcclxuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUobW9kZWxKb3NuKSk7XHJcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLiRlbC5maW5kKCcuc2xpZGVyLWZvY3VzIC5iYW5uZXInKS51bnNsaWRlcihzdG9wUGFyYW0pO1xyXG4gICAgICAgICQuZWFjaChtb2RlbEpvc24uYmFubmVyU2V0LCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICBzZWxmLiRlbC5maW5kKCcuc2xpZGVycy1iYW5uZXIubGluay1iYW5uZXInKS5lcShpbmRleCkuZGF0YSgnYmFubmVyJywgaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJC5pbml0SW1hZ2VzTGF6eUxvYWQodGhpcy4kZWwsIHtcclxuICAgICAgICAgICAgdGltZW91dDogMTAwMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIENsaWNrQmFubmVyOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB2YXIgZWxlbSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgYmFubmVyID0gZWxlbS5kYXRhKCdiYW5uZXInKTtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLnNyYyA9ICQuYWRkTWF0aHJvdW5kUGFyYW0oYmFubmVyLmNsaWNrX3JlcG9ydF91cmwpO1xyXG4gICAgICAgICQucmNiYW5Gci5saXZlKHtcclxuICAgICAgICAgICAgdXJsOiBiYW5uZXIudXJsLFxyXG4gICAgICAgICAgICBsaW5rX3R5cGU6IGJhbm5lci5saW5rX3R5cGUsXHJcbiAgICAgICAgICAgIHVpZDogYmFubmVyLnVpZCxcclxuICAgICAgICAgICAgY2lkOiBiYW5uZXIuY2lkLFxyXG4gICAgICAgICAgICBzaWQ6IGJhbm5lci5zaWQsXHJcbiAgICAgICAgICAgIHJhd1NpZDogYmFubmVyLnJhd1NpZCxcclxuICAgICAgICAgICAgbGl2ZTogYmFubmVyLmxpdmUsXHJcbiAgICAgICAgICAgIHJlcG9ydDogYmFubmVyLnJlcG9ydCxcclxuICAgICAgICAgICAgdXJsX29wZW46IDBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNiYW5GUnZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICB0YWdOYW1lOiAnZGl2JyxcclxuICAgIGNsYXNzTmFtZTogJ2Jhbi1mcicsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2U6YmFubmVyJywgdGhpcy5yZW5kZXIpO1xyXG4gICAgICAgIHZhciBjb25EYXRhID0ge1xyXG4gICAgICAgICAgICBzZXNzX211c2ljOiBjb25mLnNlc3NfbXVzaWMsXHJcbiAgICAgICAgICAgIHNlc3NfZ2FtZTogY29uZi5zZXNzX2dhbWUsXHJcbiAgICAgICAgICAgIHNlc3Nfc2hvdzogY29uZi5zZXNzX3Nob3csXHJcbiAgICAgICAgICAgIHRvcF9iYW5uZXJzX3Nob3c6IGNvbmYudG9wX2Jhbm5lcnNfc2hvdyxcclxuICAgICAgICAgICAgdG9wX2Jhbm5lcnNfZ2FtZTogY29uZi50b3BfYmFubmVyc19nYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXRhID0gJC5leHRlbmQoe30sIHRoaXMubW9kZWwuZ2V0KCdiYW5uZXInKSwgY29uRGF0YSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoeyBiYW5uZXI6IGRhdGEgfSk7XHJcbiAgICAgICAgLy8gdGhpcy5yZW5kZXIoKTtcclxuICAgIH0sXHJcbiAgICBzZWN0TGlzdDogZnVuY3Rpb24odW5pbmxpc3QsIF9zdGF0dXMpIHtcclxuICAgICAgICB2YXIgc2ltcGxlTGFzdEl0ZW0gPSBfLmNoYWluKHVuaW5saXN0KS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5saXZlICYmIGl0ZW0ubGlua190eXBlID09IDNcclxuICAgICAgICB9KS5zYW1wbGUoKS52YWx1ZSgpO1xyXG4gICAgICAgIHZhciBmaW5kTGFzdEluZGV4ID0gXy5maW5kTGFzdEluZGV4KHVuaW5saXN0LCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtID09IHNpbXBsZUxhc3RJdGVtXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIF9zdGF0dXMgPSBfc3RhdHVzID8gX3N0YXR1cyA6ICgoKGZpbmRMYXN0SW5kZXggIT0gLTEpID8gdW5pbmxpc3RbZmluZExhc3RJbmRleF0uc3RhdHVzIDogJ3Nlc3NfbXVzaWMnKSk7XHJcbiAgICAgICAgdmFyIGZpbmRCYW5uZXJJbmRleCA9IF8uY2hhaW4odW5pbmxpc3QpLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnN0YXR1cyA9PSBfc3RhdHVzXHJcbiAgICAgICAgfSkuZmluZExhc3RJbmRleChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtID09IHVuaW5saXN0WyhmaW5kTGFzdEluZGV4ICE9IC0xKSA/IGZpbmRMYXN0SW5kZXggOiAwXVxyXG4gICAgICAgIH0pLnZhbHVlKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5kZXg6IChmaW5kQmFubmVySW5kZXggIT09IC0xID8gZmluZEJhbm5lckluZGV4IDogMCksXHJcbiAgICAgICAgICAgIHN0YXR1czogX3N0YXR1c1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZWNCYW5uZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYmFubmVyID0gdGhpcy5tb2RlbC5iYW5DaGFuZ2UoKVsnYmFubmVyJ107XHJcbiAgICAgICAgdmFyIG1vZGVsSm9zbiA9ICQuZXh0ZW5kKHt9LCBiYW5uZXIpO1xyXG4gICAgICAgIHZhciB1bmlubGlzdCA9ICQudXNlckxpc3RGb3JtYXQobW9kZWxKb3NuKTtcclxuICAgICAgICB2YXIgZmluZEJhbm5lckluZGV4ID0gdGhpcy5zZWN0TGlzdCh1bmlubGlzdCk7XHJcbiAgICAgICAgcmV0dXJuIGZpbmRCYW5uZXJJbmRleFxyXG4gICAgfSxcclxuICAgIGV2ZW50czoge1xyXG4gICAgICAgICdjbGljayAjYmFuUkxUcGwgLnNsaWRlci1pdGVtJzogJ0NsaWNrU2xpZGVyJyxcclxuICAgICAgICAnY2xpY2sgI2JhblJMVHBsIC5zbGlkZXItaXRlbSBhLmxpbmstYmFubmVyJzogJ0NsaWNrQmFubmVyJ1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBtb2RlbEpvc24gPSB0aGlzLm1vZGVsLmJhbkNoYW5nZSgpWydiYW5uZXInXTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdHBsX2JhblJMJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUobW9kZWxKb3NuKSk7XHJcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXItaXRlbScpLmFwcGVuZChjb3Zlcik7XHJcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYS5saW5rLWJhbm5lcicpLmFwcGVuZChhbGluayk7XHJcbiAgICAgICAgXy5kZWxheShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZi5zbGlkZXJzID0gJCgnLnNsaWRlci1pdGVtIC5iYW5uZXInKS51bnNsaWRlcihhdXR1UGFyYW0pO1xyXG4gICAgICAgICAgICBzZWxmLiRlbC5maW5kKCdhLmxpbmstYmFubmVyJykuYWRkKHNlbGYuc2xpZGVycy5maW5kKCcuZG90JykpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB2bS5oYXNDbGFzcygnbGluay1iYW5uZXInKSA/ICQoZS5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCdsaScpLmRhdGEoJ2luZGV4JykgOiB2bS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5DbGlja0JMaW5rKGluZGV4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQuaW5pdEltYWdlc0xhenlMb2FkKHNlbGYuJGVsLCB7XHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAkLmRlbGF5Qm91bmNlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL+eNsuWPluWIneWni+WMlumaqOapn+eahOaSreaUvuWPs+WBtHRhYlxyXG4gICAgICAgICAgICB2YXIgZmluZEJhbm5lckluZGV4ID0gc2VsZi5zZWNCYW5uZXIoKTtcclxuICAgICAgICAgICAgc2VsZi5DbGlja1NsaWRlcignJywgJ1tkYXRhLWtleXM9JyArIGZpbmRCYW5uZXJJbmRleFsnc3RhdHVzJ10gKyAnXScpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgQ2xpY2tCTGluazogZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAkKCcuc2xpZGVyLWZvY3VzIC5iYW5uZXInKS5fbW92ZShzdG9wUGFyYW0sIGluZGV4ID8gaW5kZXggOiAwKTtcclxuICAgIH0sXHJcbiAgICBDbGlja0Jhbm5lcjogZnVuY3Rpb24oZSwgX3RoaXMpIHtcclxuICAgICAgICBpZiAoZSkgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB2YXIgdm0gPSBlID8gJChlLmN1cnJlbnRUYXJnZXQpIDogJChfdGhpcyk7XHJcbiAgICAgICAgJC5pbml0SW1hZ2VzTGF6eUxvYWQodm0uYWRkKCQoJyNiYW5mTFRwbCcpKSwge1xyXG4gICAgICAgICAgICB0aW1lb3V0OiA1MFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIENsaWNrU2xpZGVyOiBmdW5jdGlvbihlLCBfdGhpcykge1xyXG4gICAgICAgIGlmIChlKSBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHZhciB2bSA9IGUgPyAkKGUuY3VycmVudFRhcmdldCkgOiAkKF90aGlzKTtcclxuICAgICAgICB2YXIga2V5ID0gdm0uZGF0YSgna2V5cycpO1xyXG4gICAgICAgIHZhciBkYXRhTGlzdCA9IHRoaXMubW9kZWwuYmFuQ2hhbmdlKClbJ2Jhbm5lciddO1xyXG4gICAgICAgIHZhciBkYXRhU2V0ID0gdGhpcy5tb2RlbC5iYW5DaGFuZ2UoKVsnYmFubmVyU2V0J107XHJcbiAgICAgICAgdmFyIHBhcmFtID0gJC5leHRlbmQoe30sIHsgYmFubmVyOiBkYXRhTGlzdCwgYmFubmVyU2V0OiBkYXRhU2V0IH0pO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHZtLmZpbmQoJy5oYXMtZG90cycpLmF0dHIoJ2RhdGEtaW5kZXgnKTtcclxuICAgICAgICB2YXIgX2luZGV4ID0gMDtcclxuICAgICAgICBpZiAoXy5oYXMoZGF0YUxpc3QsIGtleSkpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFLZXkgPSBkYXRhTGlzdFtrZXldO1xyXG4gICAgICAgICAgICB2YXIgYmFubmVyTGl2ZSA9IF8uY2hhaW4oZGF0YUtleSkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmxpdmUgJiYgaXRlbS5saW5rX3R5cGUgPT0gM1xyXG4gICAgICAgICAgICB9KS5zYW1wbGUoKS52YWx1ZSgpO1xyXG4gICAgICAgICAgICBfaW5kZXggPSBfLmZpbmRMYXN0SW5kZXgoZGF0YUtleSwgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gPT09IGJhbm5lckxpdmVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBhcmFtID0gJC5leHRlbmQoe30sIHBhcmFtLCB7XHJcbiAgICAgICAgICAgICAgICBiYW5uZXJTZXQ6IGRhdGFMaXN0W2tleV0sXHJcbiAgICAgICAgICAgICAgICBiYW5uZXJMaXZlOiBiYW5uZXJMaXZlID8gYmFubmVyTGl2ZSA6IHt9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJC53aGVuKHRoaXMubW9kZWwuc2V0KHBhcmFtKSkudGhlbih0aGlzLmxpdmVQbGF5ZXIoKSlcclxuICAgICAgICAgICAgLnRoZW4odGhpcy5DbGlja0Jhbm5lcihlLCBfdGhpcykpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICB2bS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgKS5kb25lKHRoaXMuQ2xpY2tCTGluayhpbmRleCkpO1xyXG4gICAgICAgIHZtLnNpYmxpbmdzKCcuc2xpZGVyLWxpdmUnKS5maW5kKCcuYmFubmVyJykuX2Fsd2F5cyhhdXR1UGFyYW0pO1xyXG4gICAgICAgIGlmIChrZXkuaW5kZXhPZignc2Vzc18nKSA+IC0xICYmIF8uaGFzKGJhbm5lckxpdmUsICdsaXZlJykpIHtcclxuICAgICAgICAgICAgXy5kZWxheShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZtLmZpbmQoJy5iYW5uZXInKS5fc2xpZGUoYXV0dVBhcmFtLCBfaW5kZXgpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgbGl2ZVBsYXllcjogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciBiYW5uZXJTZXQgPSB0aGlzLm1vZGVsLmJhbkNoYW5nZSgpWydiYW5uZXJTZXQnXTtcclxuICAgICAgICB2YXIgYmFubmVyTGl2ZSA9IHRoaXMubW9kZWwuYmFuQ2hhbmdlKClbJ2Jhbm5lckxpdmUnXTtcclxuICAgICAgICB2YXIgYmFubmVyUGxheWVyID0gYmFubmVyTGl2ZSA/IGJhbm5lckxpdmUgOiBiYW5uZXJTZXQ7XHJcbiAgICAgICAgYmFubmVyUGxheWVyLnVybF9vcGVuID0gMTtcclxuICAgICAgICB0aGlzLmxpdmUoYmFubmVyUGxheWVyKTtcclxuICAgIH0sXHJcbiAgICBsaXZlOiBmdW5jdGlvbihiYW5uZXJQbGF5ZXIpIHtcclxuICAgICAgICBpZiAoIWJhbm5lclBsYXllcikgcmV0dXJuO1xyXG4gICAgICAgIHZhciB1cmwgPSBiYW5uZXJQbGF5ZXIudXJsO1xyXG4gICAgICAgIHZhciBsaW5rX3R5cGUgPSBiYW5uZXJQbGF5ZXIubGlua190eXBlO1xyXG4gICAgICAgIHZhciB1aWQgPSBiYW5uZXJQbGF5ZXIudWlkO1xyXG4gICAgICAgIHZhciBjaWQgPSBiYW5uZXJQbGF5ZXIuY2lkO1xyXG4gICAgICAgIHZhciBzaWQgPSBiYW5uZXJQbGF5ZXIuc2lkO1xyXG4gICAgICAgIHZhciByYXdTaWQgPSBiYW5uZXJQbGF5ZXIucmF3U2lkO1xyXG4gICAgICAgIHZhciBsaXZlID0gYmFubmVyUGxheWVyLmxpdmU7XHJcbiAgICAgICAgdmFyIHJlcG9ydF91cmwgPSBiYW5uZXJQbGF5ZXIuY2xpY2tfcmVwb3J0X3VybDtcclxuICAgICAgICB2YXIgdGlwcyA9IGJhbm5lclBsYXllci50aXBzO1xyXG4gICAgICAgIHZhciB0b2tlbiA9ICQuZ2V0UXVlcnlTdHJpbmcoJ2Nvb2tpZScpO1xyXG4gICAgICAgIHZhciB1cmxfb3BlbiA9IGJhbm5lclBsYXllci51cmxfb3BlbjtcclxuICAgICAgICB2YXIgZWwgPSAkKCcjbXlEeW5hbWljQ29udGVudCcpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgbGlua3R5cGVGbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAobGlua190eXBlID09IDMgJiYgbGl2ZSAmJiB1cmxfb3BlbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbXlEeW5hbWljQ29udGVudCA9ICQoJzxkaXYgY2xhc3M9XCJzbGlkZXJzLXR2XCIgaWQ9XCJteUR5bmFtaWNDb250ZW50XCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYmFuZkxUcGwnKS5maW5kKCcuYmFubmVyJykuYXBwZW5kKG15RHluYW1pY0NvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB7IGlkOiBcIm15RHluYW1pY0NvbnRlbnRcIiwgbmFtZTogXCJteUR5bmFtaWNDb250ZW50XCIgfTtcclxuICAgICAgICAgICAgICAgIHZhciBsaXZlX3VybCA9ICQuYWRkQ2FsbGJhY2tQYXJhbShTSU5HRVJfQ09ORklHLlBBVEguR0VUX0xJVkUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHdtb2RlID0geyB3bW9kZTogJ3RyYW5zcGFyZW50JyB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGZsYXNodmFycyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjaWQ6IGNpZCxcclxuICAgICAgICAgICAgICAgICAgICBzaWQ6IHNpZCxcclxuICAgICAgICAgICAgICAgICAgICByYXdTaWQ6IHJhd1NpZCxcclxuICAgICAgICAgICAgICAgICAgICByZXBvcnRfdXJsOiAocmVwb3J0X3VybCA/IGVuY29kZVVSSUNvbXBvbmVudCgkLmFkZE1hdGhyb3VuZFBhcmFtKHJlcG9ydF91cmwpKSA6ICcnKSxcclxuICAgICAgICAgICAgICAgICAgICB0aXBzOiB0aXBzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IDYwICogMTAwMCAqIDFcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBzd2ZvYmplY3QuZW1iZWRTV0YoY29uZi5yY19zd2YsICdteUR5bmFtaWNDb250ZW50JywgXCI1NjBcIiwgXCI0MjBcIiwgXCI5LjAuMFwiLCBjb25mLnJjX2V4cHJlc3MsIGZsYXNodmFycyk7XHJcbiAgICAgICAgICAgICAgICBfZ2EoJ3NlbmQnLCAnZXZlbnQnLCAnc2hvd3VzZXInLCAnY2xpY2snLCAn5bem5YG0dGFi5Li75pKt6KaW6aC7Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGlua190eXBlID09IDEgJiYgaXNOYU4odXJsKSAmJiB1cmxfb3BlbiA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1cmwpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKHVybCkgJiYgbGlua190eXBlID09IDMgJiYgdXJsX29wZW4gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBleHRlcm5hbC5lbnRlclNlcnZlcihzaWQsIGNpZCwgNik7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc05hTih1cmwpICYmIGxpbmtfdHlwZSA9PSAyICYmIHVybF9vcGVuID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IHVybFxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgICQuZGVsYXlCb3VuY2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBsaW5rdHlwZUZuKCk7XHJcbiAgICAgICAgfSwgNjAwKTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNzID0ge1xyXG4gICAgVmlld0ZyOiBSQ2JhbkZSdmlldyxcclxuICAgIFZpZXdGbDogUkNiYW5GTHZpZXcsXHJcbiAgICBNb2RlbDogUkNiYW5EYXRhXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUkNzOyIsInZhciBTSU5HRVJfQ09ORklHID0gcmVxdWlyZSgnLi4vYXBpL2NvbmZpZy5qcycpO1xyXG52YXIgY29uZiA9IHdpbmRvdy5zZXJ2ZXJDb25maWc7XHJcbnZhciBSQ2dhbWVEYXRhID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgZ2FtZUxpc3Q6IFtdLFxyXG4gICAgICAgIHBhZ2U6IHtcclxuICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIGN1cnJlbnQ6IDAsXHJcbiAgICAgICAgICAgIGxlbjogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIHVybDogJ2h0dHA6Ly8xOTIuMTY4LjU2LjE6MzAwMC9pbmRleC9hY3QvdXNlclByb2ZpbGU/Y2FsbGJhY2s9JyArIF8ubm93KCksIC8v6Kit572u6KuL5rGC55qEdXJs5o6l5Y+j5Zyw5Z2AXHJcbiAgICBwYXJzZTogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChyZXMuY29kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvYmogPSByZXMuZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXy5pc0FycmF5KHJlcy5kYXRhKSkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0KCdwYWdlJyk7XHJcbiAgICAgICAgICAgIHZhciBnYW1lTGlzdCA9IHRoaXMuZ2V0KCdnYW1lTGlzdCcpO1xyXG4gICAgICAgICAgICB2YXIgZ2FtZUV4dGVuZCA9IF8udW5pb24oW10sIGdhbWVMaXN0LCByZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgIGdhbWVMaXN0OiBnYW1lRXh0ZW5kLFxyXG4gICAgICAgICAgICAgICAgcGFnZTogJC5wYWdlRm9ybWF0KHBhZ2UsIGdhbWVFeHRlbmQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sXHJcbiAgICAvL+mhnuS8vOWIneWni+WMlueahOWKoOi8ieWHveaVuFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5vbignY2hhbmdlJywgdGhpcy5nYW1lQ2hhbmdlKTtcclxuICAgIH0sXHJcbiAgICAvL+agvOW8j+WMluaVuOaTmlxyXG4gICAgZ2FtZUNoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGdhbWVMaXN0ID0gdGhpcy5nZXQoJ2dhbWVMaXN0Jyk7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldCgncGFnZScpO1xyXG4gICAgICAgIHZhciBwYWdlTGVuID0gcGFnZS5jdXJyZW50ID8gcGFnZS5sZW4gKiAocGFnZS5jdXJyZW50KSA6IDIwO1xyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgZ2FtZUxpc3QgPSBfLmNoYWluKGdhbWVMaXN0KS5zb3J0QnkoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKGl0ZW0uZ2FtZV90eXBlID09IDEpXHJcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZ2FtZV90eXBlID09IDEgJiYgaW5kZXggPCA1KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmhvdCA9IDE7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmdhbWVfdHlwZVxyXG4gICAgICAgIH0pLnZhbHVlKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2FtZUxpc3Q6IGdhbWVMaXN0LnNsaWNlKDAsIHBhZ2VMZW4pLFxyXG4gICAgICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBSQ2dhbWV2aWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gICAgdGFnTmFtZTogJ2RpdicsXHJcbiAgICBpZDogJ3JjLXJlYycsXHJcbiAgICBjbGFzc05hbWU6ICdyYy1yZWMgc2luZ2VyLXJlYyBnYW1lLXJlYycsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmJ0bkxvYWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XHJcbiAgICAgICAgdGhpcy5mZXRjaCgpO1xyXG4gICAgICAgIC8vIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9LFxyXG4gICAgZXZlbnRzOiB7XHJcbiAgICAgICAgJ2NsaWNrICNyYy1jb250ZW50LWdhbWUgdWw+bGkgYS5saW5rLXJlYyc6ICdjbGlja1JlYycsXHJcbiAgICAgICAgJ2NsaWNrICNyYy1jb250ZW50LWdhbWUgYS5nby1tb3JlJzogJ2NsaWNrTW9yZScsXHJcbiAgICAgICAgJ21vdXNlb3V0ICNyYy1jb250ZW50LWdhbWUgdWw+bGkgYS5saW5rLXJlYyc6ICdjbGlja1JlY091dCdcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtb2RlbEpzb24gPSB0aGlzLm1vZGVsLmdhbWVDaGFuZ2UoKTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdHBsX2dhbWUnKS5odG1sKCkpO1xyXG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZShtb2RlbEpzb24pKTtcclxuICAgICAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XHJcbiAgICAgICAgJCgnYm9keScpLmN1c3RvbVNjcm9sbGJhcignc2Nyb2xsVG9ZJywgMCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJ0bkxvYWQpICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICB0aGlzLmJ0bkxvYWQgPSB0cnVlO1xyXG4gICAgICAgICQuaW5pdEltYWdlc0xhenlMb2FkKHRoaXMuJGVsLmZpbmQoJy5saW5rLXJlYycpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBmZXRjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnI3JjLWNvbnRlbnQtZ2FtZScpLnNob3dMb2FkaW5nKCk7XHJcbiAgICAgICAgdmFyIGxlbiA9ICh0aGlzLm1vZGVsLmdldCgncGFnZScpLmxlbiA/IHRoaXMubW9kZWwuZ2V0KCdwYWdlJykubGVuIDogMjApO1xyXG4gICAgICAgIHZhciBwYWdlID0gKHRoaXMubW9kZWwuZ2V0KCdwYWdlJykuY3VycmVudCA/IHRoaXMubW9kZWwuZ2V0KCdwYWdlJykuY3VycmVudCA6IDEpO1xyXG4gICAgICAgIHRoaXMubW9kZWwudXJsID0gJC5hZGRDYWxsYmFja1BhcmFtKFNJTkdFUl9DT05GSUcuUEFUSC5HRVRfR0FNRSArICc/dHlwZT0tMSZzaXplPScgKyBsZW4gKyAnJnBhZ2U9JyArIHBhZ2UpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuZmV0Y2goe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoJyNyYy1jb250ZW50LWdhbWUnKS5zaG93TG9hZGluZygnaGlkZScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjcmMtY29udGVudC1nYW1lJykuc2hvd0xvYWRpbmcoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHRoaXMubW9kZWwub24oJ2NoYW5nZScsIHRoaXMubW9kZWwuZ2FtZUNoYW5nZSk7XHJcbiAgICB9LFxyXG4gICAgY2xpY2tSZWM6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgdm0gPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgdmFyIGdhbWV0eXBlID0gdm0uZGF0YSgnZ2FtZXR5cGUnKTtcclxuICAgICAgICB2YXIgcGxheWNvZGUgPSB2bS5kYXRhKCdwbGF5Y29kZScpO1xyXG4gICAgICAgIGlmIChnYW1ldHlwZSA9PSAxKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZXh0ZXJuYWwuc3RhcnRHYW1lYm94KHBsYXljb2RlKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZihwbGF5Y29kZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBjbGlja1JlY091dDogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAvL3ZtLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0sXHJcbiAgICBjbGlja01vcmU6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5idG5Mb2FkKSByZXR1cm5cclxuICAgICAgICAvLyB0aGlzLmJ0bkxvYWQgPSB0cnVlO1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgY3VycmVudFBhZ2UgPSB2bS5kYXRhKCdjdXJyZW50Jyk7XHJcbiAgICAgICAgY3VycmVudFBhZ2UrK1xyXG4gICAgICAgIHZhciBnYW1lTGlzdCA9IHRoaXMubW9kZWwuZ2V0KCdnYW1lTGlzdCcpO1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5tb2RlbC5nZXQoJ3BhZ2UnKTtcclxuICAgICAgICB2YXIgcGFyYW0gPSAkLmV4dGVuZCh7fSwgcGFnZSwge1xyXG4gICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50UGFnZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgJC53aGVuKHRoaXMubW9kZWwuc2V0KHtcclxuICAgICAgICAgICAgZ2FtZUxpc3Q6IGdhbWVMaXN0LFxyXG4gICAgICAgICAgICBwYWdlOiBwYXJhbVxyXG4gICAgICAgIH0pKS50aGVuKHRoaXMuZmV0Y2goKSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxudmFyIFJDcyA9IHtcclxuICAgIFZpZXc6IFJDZ2FtZXZpZXcsXHJcbiAgICBNb2RlbDogUkNnYW1lRGF0YVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJDczsiLCJ2YXIgU0lOR0VSX0NPTkZJRyA9IHJlcXVpcmUoJy4uL2FwaS9jb25maWcuanMnKTtcclxudmFyIFJDYW5jaG9yID0gcmVxdWlyZSgnLi9hbmNob3IuanMnKTtcclxudmFyIFJDZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZS5qcycpO1xyXG52YXIgUkN0ZWFtID0gcmVxdWlyZSgnLi90ZWFtLmpzJyk7XHJcbnZhciBjb25mID0gd2luZG93LnNlcnZlckNvbmZpZztcclxudmFyIFJDdGFiRGF0YSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIHRhYjoge1xyXG4gICAgICAgICAgICBsb2FkZWQ6IFtdLCAvLydnYW1lJywgJ3RlYW0nXHJcbiAgICAgICAgICAgIGN1cnJlbnQ6ICcnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBhcnNlOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICB2YXIgb2JqID0ge307XHJcbiAgICAgICAgaWYgKHJlcy5jb2RlID09PSAwKSB7XHJcbiAgICAgICAgICAgIG9iaiA9IHJlcy5kYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG4gICAgLy/poZ7kvLzliJ3lp4vljJbnmoTliqDovInlh73mlbhcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMub24oJ2NoYW5nZScsIHRoaXMudGFiQ2hhbmdlKTtcclxuICAgIH0sXHJcbiAgICAvL+agvOW8j+WMluaVuOaTmlxyXG4gICAgdGFiQ2hhbmdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0YWI6IHRoaXMuZ2V0KCd0YWInKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkN0YWJjdmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICAgIHRhZ05hbWU6ICdkaXYnLFxyXG4gICAgaWQ6ICdyYy10YWInLFxyXG4gICAgY2xhc3NOYW1lOiAncmMtdGFiIGNsZWFyZml4JyxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfc2h1ZmZsZSA9IF8uc2FtcGxlKFsnZ2FtZScsICd0ZWFtJywgJ2FuY2hvciddKTtcclxuICAgICAgICB2YXIgX3BhdGggPSBbXTtcclxuICAgICAgICB2YXIgX3RhYiA9IHRoaXMubW9kZWwuZ2V0KCd0YWInKTtcclxuICAgICAgICB2YXIgbW9kZWxKc29uID0gdGhpcy5tb2RlbC50YWJDaGFuZ2UoKVsndGFiJ107XHJcbiAgICAgICAgX3RhYi5jdXJyZW50ID0gX3NodWZmbGU7XHJcbiAgICAgICAgdGhpcy5pbml0VGFiKG1vZGVsSnNvbi5jdXJyZW50LCBtb2RlbEpzb24pO1xyXG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMucmVuZGVyKTtcclxuICAgICAgICB0aGlzLm1vZGVsLnNldChfdGFiKTtcclxuICAgIH0sXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgICAnY2xpY2sgI3JjLXRhYiBhLmxpbmstdGFiJzogJ2NsaWNrVGFiJ1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1vZGVsSnNvbiA9IHRoaXMubW9kZWwudGFiQ2hhbmdlKCk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RwbF90YWInKS5odG1sKCkpO1xyXG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZShtb2RlbEpzb24pKTtcclxuICAgICAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgaW5pdFRhYjogZnVuY3Rpb24odGFiLCB0YWJEYXRhKSB7XHJcbiAgICAgICAgaWYgKCF0YWIpIHJldHVybjtcclxuICAgICAgICB2YXIgbGFzdEluZGV4RmluZCA9IF8uZmluZExhc3RJbmRleCh0YWJEYXRhLmxvYWRlZCwgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbSA9PT0gdGFiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy/liqDovInororph4/nrYlcclxuICAgICAgICB2YXIgcGFyYW0gPSAkLmV4dGVuZCh7fSwgdGFiRGF0YSwge1xyXG4gICAgICAgICAgICBjdXJyZW50OiB0YWJcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL+acquWKoOi8iemBjuaVuOaTmlxyXG4gICAgICAgIGlmIChsYXN0SW5kZXhGaW5kID09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWIgPT0gJ2dhbWUnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmNnYW1lID0gbmV3IFJDZ2FtZS5WaWV3KHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbDogbmV3IFJDZ2FtZS5Nb2RlbCgpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJyNyYy1jb250ZW50LWdhbWUnKS5odG1sKHJjZ2FtZS5lbCk7XHJcbiAgICAgICAgICAgICAgICAkKCcjcmMtY29udGVudC1nYW1lJykuc2hvd0xvYWRpbmcoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YWIgPT0gJ3RlYW0nKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmN0ZWFtID0gbmV3IFJDdGVhbS5WaWV3KHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbDogbmV3IFJDdGVhbS5Nb2RlbCgpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJyNyYy1jb250ZW50LXRlYW0nKS5odG1sKHJjdGVhbS5lbCk7XHJcbiAgICAgICAgICAgICAgICAkKCcjcmMtY29udGVudC10ZWFtJykuc2hvd0xvYWRpbmcoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YWIgPT0gJ2FuY2hvcicpIHtcclxuICAgICAgICAgICAgICAgICQoJyNyYy1jb250ZW50LWFuY2hvcicpLmh0bWwoJC5yY2FuY2hvci5lbCk7XHJcbiAgICAgICAgICAgICAgICAkKCcjcmMtY29udGVudC1hbmNob3InKS5zaG93TG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgXy5kZWxheShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjcmMtY29udGVudC1hbmNob3InKS5zaG93TG9hZGluZygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YWJEYXRhLmxvYWRlZC5wdXNoKHRhYik7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHBhcmFtLCB7XHJcbiAgICAgICAgICAgICAgICBsb2FkZWQ6IHRhYkRhdGEubG9hZGVkXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcjcmMtY29udGVudC0nICsgdGFiKS5yZW1vdmVDbGFzcygnaGlkZScpLnNpYmxpbmdzKCkuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7XHJcbiAgICAgICAgICAgIHRhYjogcGFyYW1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkLmluaXRJbWFnZXNMYXp5TG9hZCgnLnJjLXJlYycpO1xyXG4gICAgfSxcclxuICAgIGNsaWNrVGFiOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIHZhciB0YWIgPSB2bS5kYXRhKCd0YWInKTtcclxuICAgICAgICB2YXIgdGFiRGF0YSA9IHRoaXMubW9kZWwuZ2V0KCd0YWInKTtcclxuICAgICAgICAvLyB2bS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgdGhpcy5pbml0VGFiKHRhYiwgdGFiRGF0YSk7XHJcbiAgICAgICAgd2luZG93LmN1c3RvbVNjcm9sbGJhckFwcGVuZCgpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBSQ3MgPSB7XHJcbiAgICBWaWV3OiBSQ3RhYmN2aWV3LFxyXG4gICAgTW9kZWw6IFJDdGFiRGF0YVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJDczsiLCJ2YXIgU0lOR0VSX0NPTkZJRyA9IHJlcXVpcmUoJy4uL2FwaS9jb25maWcuanMnKTtcclxudmFyIGNvbmYgPSB3aW5kb3cuc2VydmVyQ29uZmlnO1xyXG52YXIgUkN0ZWFtRGF0YSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICAgIHRlYW1MaXN0OiBbXSxcclxuICAgICAgICBwYWdlOiB7XHJcbiAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICBjdXJyZW50OiAwLFxyXG4gICAgICAgICAgICBsZW46IDEwMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyB1cmw6ICdodHRwOi8vMTkyLjE2OC41Ni4xOjMwMDAvaW5kZXgvYWN0L3VzZXJQcm9maWxlP2NhbGxiYWNrPScgKyBfLm5vdygpLCAvL+ioree9ruiri+axgueahHVybOaOpeWPo+WcsOWdgFxyXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICBpZiAocmVzLmNvZGUgPT09IDApIHtcclxuICAgICAgICAgICAgb2JqID0gcmVzLmRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF8uaXNBcnJheShyZXMuZGF0YSkpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldCgncGFnZScpO1xyXG4gICAgICAgICAgICB2YXIgdGVhbUxpc3QgPSB0aGlzLmdldCgndGVhbUxpc3QnKTtcclxuICAgICAgICAgICAgdmFyIHRlYW1FeHRlbmQgPSBfLnVuaW9uKFtdLCB0ZWFtTGlzdCwgcmVzLmRhdGEpO1xyXG4gICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICB0ZWFtTGlzdDogdGVhbUV4dGVuZCxcclxuICAgICAgICAgICAgICAgIHBhZ2U6ICQucGFnZUZvcm1hdChwYWdlLCB0ZWFtRXh0ZW5kKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG4gICAgLy/poZ7kvLzliJ3lp4vljJbnmoTliqDovInlh73mlbhcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHZhciBsZW4gPSAodGhpcy5nZXQoJ3BhZ2UnKS5sZW4gPyB0aGlzLmdldCgncGFnZScpLmxlbiA6IDIwKTtcclxuICAgICAgICAvLyB0aGlzLnVybCA9ICQuYWRkQ2FsbGJhY2tQYXJhbShTSU5HRVJfQ09ORklHLlBBVEguR0VUX1RFQU0gKyAnP3R5cGU9MCZzaXplPScgKyBsZW4gKyAnJnBhZ2U9MScpO1xyXG4gICAgICAgIC8vIHRoaXMuZmV0Y2goe1xyXG4gICAgICAgIC8vICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyAgICAgICAgICQoJyNyYy1jb250ZW50LXRlYW0nKS5zaG93TG9hZGluZygnaGlkZScpO1xyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAkKCcjcmMtY29udGVudC10ZWFtJykuc2hvd0xvYWRpbmcoJ2hpZGUnKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIHRoaXMub24oJ2NoYW5nZScsIHRoaXMuZ2FtZUNoYW5nZSk7XHJcbiAgICB9LFxyXG4gICAgLy/moLzlvI/ljJbmlbjmk5pcclxuICAgIGdhbWVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ZWFtTGlzdCA9IHRoaXMuZ2V0KCd0ZWFtTGlzdCcpO1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5nZXQoJ3BhZ2UnKTtcclxuICAgICAgICB2YXIgcGFnZUxlbiA9IHBhZ2UuY3VycmVudCA/IHBhZ2UubGVuICogKHBhZ2UuY3VycmVudCkgOiAyMDtcclxuICAgICAgICB2YXIgdGVhbUxpc3ROID0gXy5jaGFpbih0ZWFtTGlzdCkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIChpdGVtLm9ubGluZXMgPj0gMTApXHJcbiAgICAgICAgfSkudmFsdWUoKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZWFtTGlzdDogdGVhbUxpc3ROLnNsaWNlKDAsIHBhZ2VMZW4pLFxyXG4gICAgICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBSQ3RlYW12aWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gICAgdGFnTmFtZTogJ2RpdicsXHJcbiAgICBpZDogJ3JjLXJlYycsXHJcbiAgICBjbGFzc05hbWU6ICdyYy1yZWMgc2luZ2VyLXJlYyB0ZWFtLXJlYycsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmJ0bkxvYWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZldGNoKCk7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlJywgdGhpcy5yZW5kZXIpO1xyXG4gICAgICAgIC8vIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9LFxyXG4gICAgZXZlbnRzOiB7XHJcbiAgICAgICAgJ2NsaWNrICNyYy1jb250ZW50LXRlYW0gdWw+bGkgYS5saW5rLXJlYyc6ICdjbGlja1JlYycsXHJcbiAgICAgICAgJ2NsaWNrICNyYy1jb250ZW50LXRlYW0gYS5nby1tb3JlJzogJ2NsaWNrTW9yZSdcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtb2RlbEpzb24gPSB0aGlzLm1vZGVsLmdhbWVDaGFuZ2UoKTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdHBsX3RlYW0nKS5odG1sKCkpO1xyXG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZShtb2RlbEpzb24pKTtcclxuICAgICAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XHJcbiAgICAgICAgJCgnYm9keScpLmN1c3RvbVNjcm9sbGJhcignc2Nyb2xsVG9ZJywgMCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJ0bkxvYWQpICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICB0aGlzLmJ0bkxvYWQgPSB0cnVlO1xyXG4gICAgICAgICQuaW5pdEltYWdlc0xhenlMb2FkKHRoaXMuJGVsLmZpbmQoJy5saW5rLXJlYycpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBmZXRjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnI3JjLWNvbnRlbnQtdGVhbScpLnNob3dMb2FkaW5nKCk7XHJcbiAgICAgICAgdmFyIGxlbiA9ICh0aGlzLm1vZGVsLmdldCgncGFnZScpLmxlbiA/IHRoaXMubW9kZWwuZ2V0KCdwYWdlJykubGVuIDogMjApO1xyXG4gICAgICAgIHZhciBwYWdlID0gKHRoaXMubW9kZWwuZ2V0KCdwYWdlJykuY3VycmVudCA/IHRoaXMubW9kZWwuZ2V0KCdwYWdlJykuY3VycmVudCA6IDEpO1xyXG4gICAgICAgIHRoaXMubW9kZWwudXJsID0gJC5hZGRDYWxsYmFja1BhcmFtKFNJTkdFUl9DT05GSUcuUEFUSC5HRVRfVEVBTSArICc/dHlwZT0wJnNpemU9JyArIGxlbiArICcmcGFnZT0nICsgcGFnZSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5mZXRjaCh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCgnI3JjLWNvbnRlbnQtdGVhbScpLnNob3dMb2FkaW5nKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoJyNyYy1jb250ZW50LXRlYW0nKS5zaG93TG9hZGluZygnaGlkZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5tb2RlbC5nYW1lQ2hhbmdlKTtcclxuICAgIH0sXHJcbiAgICBjbGlja1JlYzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgc2lkID0gdm0uZGF0YSgnc2lkJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZXh0ZXJuYWwuZW50ZXJTZXJ2ZXIoc2lkLCAwLCA2KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgIH0sXHJcbiAgICBjbGlja01vcmU6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5idG5Mb2FkKSByZXR1cm5cclxuICAgICAgICAvLyB0aGlzLmJ0bkxvYWQgPSB0cnVlO1xyXG4gICAgICAgIHZhciB2bSA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgY3VycmVudFBhZ2UgPSB2bS5kYXRhKCdjdXJyZW50Jyk7XHJcbiAgICAgICAgY3VycmVudFBhZ2UrKztcclxuICAgICAgICB2YXIgdGVhbUxpc3QgPSB0aGlzLm1vZGVsLmdldCgndGVhbUxpc3QnKTtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMubW9kZWwuZ2V0KCdwYWdlJyk7XHJcbiAgICAgICAgdmFyIHBhcmFtID0gJC5leHRlbmQoe30sIHBhZ2UsIHtcclxuICAgICAgICAgICAgY3VycmVudDogY3VycmVudFBhZ2VcclxuICAgICAgICB9KVxyXG4gICAgICAgICQud2hlbih0aGlzLm1vZGVsLnNldCh7XHJcbiAgICAgICAgICAgIHRlYW1MaXN0OiB0ZWFtTGlzdCxcclxuICAgICAgICAgICAgcGFnZTogcGFyYW1cclxuICAgICAgICB9KSkudGhlbih0aGlzLmZldGNoKCkpO1xyXG4gICAgfSxcclxuICAgIGhvdmVyUmVjOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIC8vJCh2bSkuY2hpbGRyZW4oKS5jaGlsZHJlbignaDMnKS5hZE92ZXJmbG93KCk7XHJcbiAgICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUkNzID0ge1xyXG4gICAgVmlldzogUkN0ZWFtdmlldyxcclxuICAgIE1vZGVsOiBSQ3RlYW1EYXRhXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUkNzOyIsIi8vIOWFpeWPo+aWh+S7tuetiVxyXG4vLyByZXF1aXJlKCcuLi9saWIvanF1ZXJ5LmN1c3RvbS1zY3JvbGxiYXIyLmpzJyk7XHJcbnJlcXVpcmUoJy4uL2xpYi9qcXVlcnkudW5zbGlkZXIuanMnKTtcclxucmVxdWlyZSgnLi9hcGkvdXRpbC5qcycpO1xyXG5yZXF1aXJlKCcuL2FwaS9sYXp5bG9hZC5qcycpO1xyXG52YXIgUkNiYW5uZXIgPSByZXF1aXJlKCcuL2Rldi9iYW5uZXIuanMnKTtcclxudmFyIFJDYW5jaG9yID0gcmVxdWlyZSgnLi9kZXYvYW5jaG9yLmpzJyk7XHJcbnZhciBSQ3RhYiA9IHJlcXVpcmUoJy4vZGV2L3RhYi5qcycpO1xyXG52YXIgUkNhZCA9IHJlcXVpcmUoJy4vZGV2L2FkLmpzJyk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioq6Kit572u6Lev55SxIHN0YXJ0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxudmFyIFJDV29ya3NwYWNlID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XHJcbiAgICByb3V0ZXM6IHtcclxuICAgICAgICBcIlwiOiBcInNpbmdlclwiXHJcbiAgICB9LFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7fSxcclxuICAgIHNpbmdlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJjYmFuRmwgPSBuZXcgUkNiYW5uZXIuVmlld0ZsKHtcclxuICAgICAgICAgICAgbW9kZWw6IG5ldyBSQ2Jhbm5lci5Nb2RlbCgpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJC5yY2JhbkZyID0gbmV3IFJDYmFubmVyLlZpZXdGcih7XHJcbiAgICAgICAgICAgIG1vZGVsOiByY2JhbkZsLm1vZGVsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJC5yY2FuY2hvciA9IG5ldyBSQ2FuY2hvci5WaWV3KHtcclxuICAgICAgICAgICAgbW9kZWw6IG5ldyBSQ2FuY2hvci5Nb2RlbCgpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHJjdGFiID0gbmV3IFJDdGFiLlZpZXcoe1xyXG4gICAgICAgICAgICBtb2RlbDogbmV3IFJDdGFiLk1vZGVsKClcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcmNhZEZsID0gbmV3IFJDYWQuVmlld0ZsKHtcclxuICAgICAgICAgICAgbW9kZWw6IG5ldyBSQ2FkLk1vZGVsKClcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcmNhZEZyID0gbmV3IFJDYWQuVmlld0ZyKHtcclxuICAgICAgICAgICAgbW9kZWw6IHJjYWRGbC5tb2RlbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJyNyYy1uYXYnKS5hcHBlbmQocmNhZEZsLmVsKS5wcmVwZW5kKHJjYWRGci5lbCk7XHJcbiAgICAgICAgJCgnI2JhbmZMVHBsJykuaHRtbChyY2JhbkZsLmVsKTtcclxuICAgICAgICAkKCcjYmFuUkxUcGwnKS5odG1sKCQucmNiYW5Gci5lbCk7XHJcbiAgICAgICAgJCgnI3JjLXRhYnMnKS5odG1sKHJjdGFiLmVsKTtcclxuICAgICAgICAvLyQoJyNyYy1jb250ZW50LWFuY2hvcicpLmh0bWwoJC5yY2FuY2hvci5lbCk7XHJcbiAgICB9XHJcbn0pO1xyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioq5Yid5aeL5YyW6Lev55SxIHN0YXJ0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuJC5hcHAgPSBuZXcgUkNXb3Jrc3BhY2UoKTtcclxuQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpO1xyXG5cclxudmFyIGVsZW1Db250YWluZXIgPSAkKCcjYXBwJyk7XHJcbnZhciBjdXN0b21TY3JvbGxiYXJJbml0ZWQgPSBmYWxzZTtcclxudmFyIHNjcm9sbEJhclRvcCA9IDAsXHJcbiAgICBzY3JvbGxXcmFwVG9wID0gMDtcclxuXHJcbndpbmRvdy5jdXN0b21TY3JvbGxiYXIgPSBmdW5jdGlvbih0b1RvcCkge1xyXG4gICAgaWYgKGN1c3RvbVNjcm9sbGJhckluaXRlZCkge1xyXG4gICAgICAgIGVsZW1Db250YWluZXIuY3VzdG9tU2Nyb2xsYmFyKCdyZXNpemUnLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbUNvbnRhaW5lci5jdXN0b21TY3JvbGxiYXIoe1xyXG4gICAgICAgICAgICBza2luOiAnZGVmYXVsdC1za2luJyxcclxuICAgICAgICAgICAgaFNjcm9sbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHVwZGF0ZU9uV2luZG93UmVzaXplOiB0cnVlLFxyXG4gICAgICAgICAgICBhbmltYXRpb25TcGVlZDogNTAwLFxyXG4gICAgICAgICAgICBvbkN1c3RvbVNjcm9sbDogZnVuY3Rpb24oZXZlbnQsIHNjcm9sbERhdGEpIHtcclxuICAgICAgICAgICAgICAgICQuaW5pdEltYWdlc0xhenlMb2FkKGVsZW1Db250YWluZXIuZmluZCgnLnJjLWNvbnRlbnQnKS5hZGQoJyNyYy1iYW5uZXInKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCdkaXYudGh1bWInLCBlbGVtQ29udGFpbmVyKS5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRyeSB7IGV4dGVybmFsLnNldENhcHR1cmUoKTsgfSBjYXRjaCAoZSkge31cclxuICAgICAgICB9KTtcclxuICAgICAgICBjdXN0b21TY3JvbGxiYXJJbml0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHRvVG9wICYmICQoJ2Rpdi5zY3JvbGwtYmFyJywgZWxlbUNvbnRhaW5lcikuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICBlbGVtQ29udGFpbmVyLmN1c3RvbVNjcm9sbGJhcignc2Nyb2xsVG9ZJywgMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21TY3JvbGxiYXJBcHBlbmQgPSBmdW5jdGlvbigpIHtcclxuICAgIHNjcm9sbEJhclRvcCA9ICQoJy52aWV3cG9ydCAub3ZlcnZpZXcnKS5jc3MoJ3RvcCcpLnJlcGxhY2UoJ3B4JywgJycpICogMTtcclxuICAgIGVsZW1Db250YWluZXIuY3VzdG9tU2Nyb2xsYmFyKCdyZXNpemUnLCB0cnVlKTtcclxuICAgIGVsZW1Db250YWluZXIuY3VzdG9tU2Nyb2xsYmFyKCdzY3JvbGxUb1knLCBzY3JvbGxCYXJUb3AgPj0gMCA/IHNjcm9sbEJhclRvcCA6IC1zY3JvbGxCYXJUb3ApO1xyXG59XHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGV4dGVybmFsLmluaXRDb21wbGV0ZSgpO1xyXG4gICAgfSBjYXRjaCAoZSkge307XHJcblxyXG4gICAgY3VzdG9tU2Nyb2xsYmFyKHRydWUpO1xyXG4gICAgJCh3aW5kb3cpLmZvY3VzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfdm0gPSAkKHRoaXMpO1xyXG4gICAgICAgIF92bS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICBjdXN0b21TY3JvbGxiYXIodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy8g542y5Y+WZG9t5Yqg6LyJ5pmC6ZaT5YSq5YWI542y5Y+W5YiwcGVyZm9ybWFuY2XlpoLmspLmnInliYfnjbLlj5bns7vntbHmmYLplpNcclxuICAgICAgICB2YXIgZW5kX3RpbWUgPSBfLm5vdygpO1xyXG4gICAgICAgIHZhciBzdGFydF90aW1lID0gc2VydmVyQ29uZmlnLnN0YXJ0X3RpbWU7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHRpbWVTaW5jZVBhZ2VMb2FkID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkpKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB2YXIgdGltZVNpbmNlUGFnZUxvYWQgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGVuZF90aW1lIC0gc3RhcnRfdGltZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfZ2EoJ3NlbmQnLCAndGltaW5nJywgJ2RvbScsICdsb2FkZWQnLCB0aW1lU2luY2VQYWdlTG9hZCwgJ1JDIExpdmUnKTtcclxuICAgIH0pO1xyXG59KSIsIi8qKlxyXG4gKiAgIFVuc2xpZGVyIGJ5IEBpZGlvdFxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigkLCBmKSB7XHJcbiAgICAvLyAgSWYgdGhlcmUncyBubyBqUXVlcnksIFVuc2xpZGVyIGNhbid0IHdvcmssIHNvIGtpbGwgdGhlIG9wZXJhdGlvbi5cclxuICAgIGlmICghJCkgcmV0dXJuIGY7XHJcblxyXG4gICAgdmFyIFVuc2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gIFNldCB1cCBvdXIgZWxlbWVudHNcclxuICAgICAgICB0aGlzLmVsID0gZjtcclxuICAgICAgICB0aGlzLml0ZW1zID0gZjtcclxuXHJcbiAgICAgICAgLy8gIERpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLnNpemVzID0gW107XHJcbiAgICAgICAgdGhpcy5tYXggPSBbMCwgMF07XHJcblxyXG4gICAgICAgIC8vICBDdXJyZW50IGluZGVkXHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcclxuXHJcbiAgICAgICAgLy8gIFN0YXJ0L3N0b3AgdGltZXJcclxuICAgICAgICB0aGlzLmludGVydmFsID0gZjtcclxuXHJcbiAgICAgICAgLy8gIFNldCBzb21lIG9wdGlvbnNcclxuICAgICAgICB0aGlzLm9wdHMgPSB7XHJcbiAgICAgICAgICAgIGF1dG9wbGF5OiBmYWxzZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICAgICAgZGVsYXk6IDMwMDAsIC8vIGYgZm9yIG5vIGF1dG9wbGF5XHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmLCAvLyB3aGVuIGEgc2xpZGUncyBmaW5pc2hlZFxyXG4gICAgICAgICAgICBrZXlzOiAhZiwgLy8ga2V5Ym9hcmQgc2hvcnRjdXRzIC0gZGlzYWJsZSBpZiBpdCBicmVha3MgdGhpbmdzXHJcbiAgICAgICAgICAgIGRvdHM6IGYsIC8vIGRpc3BsYXkg4oCi4oCi4oCi4oCib+KAoiBwYWdpbmF0aW9uXHJcbiAgICAgICAgICAgIGZsdWlkOiBmIC8vIGlzIGl0IGEgcGVyY2VudGFnZSB3aWR0aD8sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gIENyZWF0ZSBhIGRlZXAgY2xvbmUgZm9yIG1ldGhvZHMgd2hlcmUgY29udGV4dCBjaGFuZ2VzXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbihlbCwgb3B0cykge1xyXG4gICAgICAgICAgICB0aGlzLmVsID0gZWw7XHJcbiAgICAgICAgICAgIHRoaXMudWwgPSBlbC5jaGlsZHJlbigndWwnKTtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSBbZWwub3V0ZXJXaWR0aCgpLCBlbC5vdXRlckhlaWdodCgpXTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMudWwuY2hpbGRyZW4oJ2xpJykuZWFjaCh0aGlzLmNhbGN1bGF0ZSk7XHJcbiAgICAgICAgICAgIC8vICBDaGVjayB3aGV0aGVyIHdlJ3JlIHBhc3NpbmcgYW55IG9wdGlvbnMgaW4gdG8gVW5zbGlkZXJcclxuICAgICAgICAgICAgdGhpcy5vcHRzID0gJC5leHRlbmQoe30sIHRoaXMub3B0cywgb3B0cyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXRlbXMgfHwgdGhpcy5pdGVtcy5sZW5ndGggPCAyKSByZXR1cm47XHJcbiAgICAgICAgICAgIC8vICBTZXQgdXAgdGhlIFVuc2xpZGVyXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vICBHZXQgdGhlIHdpZHRoIGZvciBhbiBlbGVtZW50XHJcbiAgICAgICAgLy8gIFBhc3MgYSBqUXVlcnkgZWxlbWVudCBhcyB0aGUgY29udGV4dCB3aXRoIC5jYWxsKCksIGFuZCB0aGUgaW5kZXggYXMgYSBwYXJhbWV0ZXI6IFVuc2xpZGVyLmNhbGN1bGF0ZS5jYWxsKCQoJ2xpOmZpcnN0JyksIDApXHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGUgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgbWUgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggPSBtZS5vdXRlcldpZHRoKCksXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBtZS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gIEFkZCBpdCB0byB0aGUgc2l6ZXMgbGlzdFxyXG4gICAgICAgICAgICBfLnNpemVzW2luZGV4XSA9IFt3aWR0aCwgaGVpZ2h0XTtcclxuXHJcbiAgICAgICAgICAgIC8vICBTZXQgdGhlIG1heCB2YWx1ZXNcclxuICAgICAgICAgICAgaWYgKHdpZHRoID4gXy5tYXhbMF0pIF8ubWF4WzBdID0gd2lkdGg7XHJcbiAgICAgICAgICAgIGlmIChoZWlnaHQgPiBfLm1heFsxXSkgXy5tYXhbMV0gPSBoZWlnaHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gIFdvcmsgb3V0IHdoYXQgbWV0aG9kcyBuZWVkIGNhbGxpbmdcclxuICAgICAgICB0aGlzLnNldHVwID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vICBTZXQgdGhlIG1haW4gZWxlbWVudFxyXG4gICAgICAgICAgICB0aGlzLmVsLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXy5tYXhbMF0sXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaXRlbXMuZmlyc3QoKS5vdXRlckhlaWdodCgpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gIFNldCB0aGUgcmVsYXRpdmUgd2lkdGhzXHJcbiAgICAgICAgICAgIHRoaXMudWwuY3NzKHsgd2lkdGg6ICh0aGlzLml0ZW1zLmxlbmd0aCAqIDEwMCkgKyAnJScsIHBvc2l0aW9uOiAncmVsYXRpdmUnLCBsZWZ0OiAwIH0pO1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLmNzcygnd2lkdGgnLCAoMTAwIC8gdGhpcy5pdGVtcy5sZW5ndGgpICsgJyUnKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLml0ZW1zW2luZGV4XSkuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLmRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLmhvdmVyKHRoaXMuc3RvcCwgdGhpcy5zdGFydCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuYXV0b3BsYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAgQ3VzdG9tIGtleWJvYXJkIHN1cHBvcnRcclxuICAgICAgICAgICAgdGhpcy5vcHRzLmtleXMgJiYgJChkb2N1bWVudCkua2V5ZG93bih0aGlzLmtleXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gIERvdCBwYWdpbmF0aW9uXHJcbiAgICAgICAgICAgIHRoaXMub3B0cy5kb3RzICYmIHRoaXMuZG90cygpO1xyXG5cclxuICAgICAgICAgICAgLy8gIExpdHRsZSBwYXRjaCBmb3IgZmx1aWQtd2lkdGggc2xpZGVycy4gU2NyZXcgdGhvc2UgZ3V5cy5cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0cy5mbHVpZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZWwuY3NzKCd3aWR0aCcsIE1hdGgubWluKE1hdGgucm91bmQoKF8uZWwub3V0ZXJXaWR0aCgpIC8gXy5lbC5wYXJlbnQoKS5vdXRlcldpZHRoKCkpICogMTAwKSwgMTAwKSArICclJyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShyZXNpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLmFycm93cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5hcHBlbmQoJzxwIGNsYXNzPVwiYXJyb3dzXCI+PHNwYW4gY2xhc3M9XCJwcmV2XCI+PDwvc3Bhbj48c3BhbiBjbGFzcz1cIm5leHRcIj4+PC9zcGFuPjwvcD4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuYXJyb3dzIHNwYW4nKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5pc0Z1bmN0aW9uKF9bdGhpcy5jbGFzc05hbWVdKSAmJiBfW3RoaXMuY2xhc3NOYW1lXSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gIFN3aXBlIHN1cHBvcnRcclxuICAgICAgICAgICAgaWYgKCQuZXZlbnQuc3dpcGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwub24oJ3N3aXBlbGVmdCcsIF8ucHJldikub24oJ3N3aXBlcmlnaHQnLCBfLm5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gIE1vdmUgVW5zbGlkZXIgdG8gYSBzbGlkZSBpbmRleFxyXG4gICAgICAgIHRoaXMubW92ZSA9IGZ1bmN0aW9uKGluZGV4LCBjYikge1xyXG4gICAgICAgICAgICAvLyAgSWYgaXQncyBvdXQgb2YgYm91bmRzLCBnbyB0byB0aGUgZmlyc3Qgc2xpZGVcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1zLmVxKGluZGV4KS5sZW5ndGgpIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgaW5kZXggPSAodGhpcy5pdGVtcy5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLml0ZW1zLmVxKGluZGV4KTtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHsgaGVpZ2h0OiB0YXJnZXQub3V0ZXJIZWlnaHQoKSB9O1xyXG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBjYiA/IDUgOiB0aGlzLm9wdHMuc3BlZWQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy51bC5pcygnOmFuaW1hdGVkJykpIHtcclxuICAgICAgICAgICAgICAgIC8vICBIYW5kbGUgdGhvc2UgcGVza3kgZG90c1xyXG4gICAgICAgICAgICAgICAgXy5lbC5maW5kKCcuZG90OmVxKCcgKyBpbmRleCArICcpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5hbmltYXRlKG9iaiwgc3BlZWQpLmF0dHIoJ2RhdGEtaW5kZXgnLCBpbmRleCkgJiYgdGhpcy51bC5hbmltYXRlKCQuZXh0ZW5kKHsgbGVmdDogJy0nICsgaW5kZXggKyAnMDAlJyB9LCBvYmopLCBzcGVlZCwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICQuaXNGdW5jdGlvbihfLm9wdHMuY29tcGxldGUpICYmICFjYiAmJiBfLm9wdHMuY29tcGxldGUoXy5lbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vICBBdXRvcGxheSBmdW5jdGlvbmFsaXR5XHJcbiAgICAgICAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRzLmF1dG9wbGF5ICE9PSBmKSB7XHJcbiAgICAgICAgICAgICAgICBfLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5tb3ZlKF8uY3VycmVudCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRzLmRlbGF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vICBTdG9wIGF1dG9wbGF5XHJcbiAgICAgICAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIF8uaW50ZXJ2YWwgPSBjbGVhckludGVydmFsKF8uaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gXztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAgS2V5cHJlc3Nlc1xyXG4gICAgICAgIHRoaXMua2V5cyA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2g7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgUHJldi9uZXh0XHJcbiAgICAgICAgICAgICAgICAzNzogXy5wcmV2LFxyXG4gICAgICAgICAgICAgICAgMzk6IF8ubmV4dCxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgRXNjXHJcbiAgICAgICAgICAgICAgICAyNzogXy5zdG9wXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG1hcFtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgbWFwW2tleV0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vICBBcnJvdyBuYXZpZ2F0aW9uXHJcbiAgICAgICAgdGhpcy5uZXh0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBfLnN0b3AoKS5tb3ZlKF8uY3VycmVudCArIDEpIH07XHJcbiAgICAgICAgdGhpcy5wcmV2ID0gZnVuY3Rpb24oKSB7IHJldHVybiBfLnN0b3AoKS5tb3ZlKF8uY3VycmVudCAtIDEpIH07XHJcblxyXG4gICAgICAgIHRoaXMuZG90cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyAgQ3JlYXRlIHRoZSBIVE1MXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxvbCBjbGFzcz1cImRvdHNcIj4nO1xyXG4gICAgICAgICAgICAkLmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaW5kZXgpIHsgaHRtbCArPSAnPGxpIGNsYXNzPVwiZG90JyArIChpbmRleCA8IDEgPyAnIGFjdGl2ZScgOiAnJykgKyAnXCI+JyArICc8L2xpPic7IH0pO1xyXG4gICAgICAgICAgICBodG1sICs9ICc8L29sPic7XHJcblxyXG4gICAgICAgICAgICAvLyAgQWRkIGl0IHRvIHRoZSBVbnNsaWRlclxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbC5maW5kKCcuZG90cycpLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmVsLmFkZENsYXNzKCdoYXMtZG90cycpLmFwcGVuZChodG1sKS5maW5kKCcuZG90JykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBfLm1vdmUoJCh0aGlzKS5pbmRleCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLy/mlrDlop7mk7TlsZXmlrnms5XnrYlcclxuICAgICQuZm4uX21vdmUgPSBmdW5jdGlvbihvLCBpbmRleCkge1xyXG4gICAgICAgIC8vICQodGhpcykudW5zbGlkZXIoKTtcclxuICAgICAgICB2YXIgbWUgPSAkKHRoaXMpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciB1bnNsaWRlcnMgPSBtZS5kYXRhKCd1bnNsaWRlcicpO1xyXG4gICAgICAgICAgICB1bnNsaWRlcnMubW92ZShpbmRleCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICB9O1xyXG5cclxuICAgIC8v5paw5aKe5pO05bGV5pa55rOV562JXHJcbiAgICAkLmZuLl9zbGlkZSA9IGZ1bmN0aW9uKG8sIGluZGV4KSB7XHJcbiAgICAgICAgLy8gJCh0aGlzKS51bnNsaWRlcigpO1xyXG4gICAgICAgIHZhciBtZSA9ICQodGhpcyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHVuc2xpZGVycyA9IG1lLmRhdGEoJ3Vuc2xpZGVyJyk7XHJcbiAgICAgICAgICAgIHVuc2xpZGVycy5zdG9wKCkubW92ZShpbmRleCk7XHJcbiAgICAgICAgICAgIF8uZGVsYXkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNsaWRlcnMuaW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgdW5zbGlkZXJzLnN0b3AoKTtcclxuICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgIH07XHJcblxyXG4gICAgLy/mlrDlop7mk7TlsZXmlrnms5XnrYlcclxuICAgICQuZm4uX2Fsd2F5cyA9IGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICAvLyAkKHRoaXMpLnVuc2xpZGVyKCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gIENhY2hlIGEgY29weSBvZiAkKHRoaXMpLCBzbyBpdFxyXG4gICAgICAgICAgICAgICAgdmFyIG1lID0gJChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGlmIChtZS5oYXNDbGFzcygnaGFzLWRvdHMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bnNsaWRlcnMgPSBtZS5kYXRhKCd1bnNsaWRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVuc2xpZGVycy5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5zbGlkZXJzLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyAgQ3JlYXRlIGEgalF1ZXJ5IHBsdWdpblxyXG4gICAgJC5mbi51bnNsaWRlciA9IGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8vICBFbmFibGUgbXVsdGlwbGUtc2xpZGVyIHN1cHBvcnRcclxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgIC8vICBDYWNoZSBhIGNvcHkgb2YgJCh0aGlzKSwgc28gaXRcclxuICAgICAgICAgICAgdmFyIG1lID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gKG5ldyBVbnNsaWRlcikuaW5pdChtZSwgbyk7XHJcblxyXG4gICAgICAgICAgICAvLyAgSW52b2tlIGFuIFVuc2xpZGVyIGluc3RhbmNlXHJcbiAgICAgICAgICAgIG1lLmRhdGEoJ3Vuc2xpZGVyJyArIChsZW4gPiAxID8gJy0nICsgKGluZGV4ICsgMSkgOiAnJyksIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgbWUuZGF0YSgndW5zbGlkZXInLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KSh3aW5kb3cualF1ZXJ5LCBmYWxzZSk7Il19
