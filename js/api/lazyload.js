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