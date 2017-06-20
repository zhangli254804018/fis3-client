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
    //定義全局RC統計代碼
    //_ga('send', 'event', 'showuser', 'click', '左側tab主播視頻','uid');
    //_rc('page_version', 'event_type', 'uid');
    //http://ads.raidtalk.com.tw/main_statics/{page_version}/{event_type}/{uid}.png?r={radom}
    //  event_type：
    // 前端触发进频道事件（新首页）
    // 1.视频区点击“进入直播间”
    // promote_channel_enter
    // 2.主播推荐tab下的内容点击
    // recommended_artist_enter
    // 3.推荐群tab下的内容点击
    // recommend_sess_enter

    // 前端进群事件（旧首页）
    // 1.主播推荐下的内容点击
    // recommended_artist_enter
    // 2.娱乐社区下的内容点击
    // recommend_sess_enter
    // 3.活动好康下“今日活动”下的内容点击
    // recommend_event_enter
    // 搜索主播昵称进群
    // search_artist_enter
    window._rc = function() {
        var rc = function() {
            var args = arguments;
            var params = ''; //page_version+'/'+event_type+'/'+uid
            var url = '';
            var img = new Image();
            try {
                var param = $.extend({}, {
                    a: _.now(),
                    dl: location.href,
                    page_version: args[0],
                    event_type: args[1],
                    uid: args[2]
                })
                params = param.page_version + '/' + param.event_type + '/' + param.uid;
                url = 'http://ads.raidtalk.com.tw/main_statics/' + params + '.png';
                img.src = $.addMathroundParam(url);
            } catch (error) {};
        };
        if (typeof rc == 'function') {
            rc.apply(window, Array.prototype.slice.call(arguments, 0));
        }
    };
})(window.jQuery);