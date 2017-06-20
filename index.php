<?php
    include "config.php";
    
    // var_dump($data);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>RC語音</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <?php if ($debug) {?>
    <link rel="stylesheet" type="text/css" href="assets/css/main.css?v=<?php echo $v; ?>">
    <?php } else {?>
     <link rel="stylesheet" type="text/css" href="assets/css/main.min.css?v=<?php echo $v; ?>">
    <?php }?>
    <script type="text/javascript" src="js/dist/vendor.min.js"></script>
    <!--<link rel="stylesheet" type="text/css" href="assets/css/vendor/scrollable.css">-->
    <!--<script type="text/javascript" src="lib/jquery.1.7.1.js"></script>
    <script type="text/javascript" src="lib/jquery.custom-scrollbar.js"></script>
    <script type="text/javascript" src="lib/underscore.js"></script>
    <script type="text/javascript" src="lib/backbone.js"></script>
    <script type="text/javascript" src="lib/swfobject.js"></script>-->
</head>

<body>
    <div id="app">
        <div class="rclive">
            <div class="rclive-container">
                <div class="rc-header">
                    <div class="rclive-nav wauto" id="rc-nav">
                        <div class="rc-banner w800" id="rc-banner">
                            <div class="rc-banner-slider clearfix">
                                <div id="banfLTpl" class="fl"></div>
                                <div id="banRLTpl" class="fr"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rclive-content w800">
                    <div class="rc-tabs" id="rc-tabs"></div>
                    <div class="rc-content">
                        <div id="rc-content-anchor">
                        </div>
                        <div id="rc-content-game" class="hide">
                        </div>
                        <div id="rc-content-team" class="hide">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--banner左側-->
    <script type="text/template" id="tpl_banfL">
        <div class="slider-focus">
            <div class="banner" onclick="_ga('send', 'event', 'showuser', 'click', '左側tab主播視頻');" >
                <!--<div class="sliders-tv" id="myDynamicContent"></div>-->
                <ul class="slides clearfix slides-container">
                     <% _.each(bannerSet,function(e,i,a){ %>
                        <li>
                            <a href="javascript:;" class="sliders-banner link-banner"  data-click="<%= e.click_report_url %>"
                                data-url="<%= e.url %>" data-uid="<%= e.uid %>" data-cid="<%= e.cid %>" data-playcode="<%= e.play_code %>"
                                data-sid="<%= e.sid %>" data-rawSid="<%= e.rawSid %>" data-live="<%= e.live %>" data-type="<%= e.link_type %>">
                                <img src="<%= serverConfig. rc_assets%>img/live/alpha.png"
                                        data-background="<%= e.big_img %>" class="lazy"
                                        style="background: url() no-repeat top center">
                                <img src="<%= e.show_report_url  %>" alt="" style="display:none">
                            </a>
                        </li>
                    <% }) %>
                </ul>
            </div>
        </div>
    </script>
    <!--banner右側-->
    <script type="text/template" id="tpl_banRL">
        <div class="slider-rank">
            <div class="slider-item slider-live" data-keys="sess_music"
                onclick=" _ga('send', 'event', 'showuser', 'click', '右側熱門音樂頻道')">
                <div class="banner">
                    <ul class="slides clearfix">
                        <% _.each(sess_music,function(e,i,a){ %>
                        <li>
                            <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                <img src="<%= serverConfig. rc_assets%>img/live/alpha.png"
                                        data-background="<%= e.img %>" class="lazy"
                                        style="background: url() no-repeat top center">
                                <img src="<%= e.show_report_url %>" alt="" style="display:none">
                            </a>
                        </li>
                        <% }) %>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-live" data-keys="sess_game"
                onclick=" _ga('send', 'event', 'showuser', 'click', '右側熱門遊戲頻道')">
                    <div class="banner">
                        <ul class="slides clearfix">
                            <% _.each(sess_game,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png"
                                            data-background="<%= e.img %>" class="lazy"
                                            style="background: url() no-repeat top center">
                                    <img src="<%= e.show_report_url %>" alt="" style="display:none">
                                </a>
                            </li>
                            <% }) %>
                        </ul>
                    </div>
            </div>
            <div class="slider-item slider-live" data-keys="sess_show" "
               onclick=" _ga('send', 'event', 'showuser', 'click', '右側熱門綜藝頻道')">
                <div class="banner">
                    <ul class="slides">
                        <% _.each(sess_show,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png"
                                    data-background="<%= e.img %>" class="lazy"
                                    style="background: url() no-repeat top center">
                                    <img src="<%= e.show_report_url  %>" alt="" style="display:none">
                                </a>
                            </li>
                        <% }) %>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-show" data-keys="top_banners_show"
            onclick=" _ga('send', 'event', 'showuser', 'click', '右側tab直播輪播頻道')">
                <div class="banner">
                    <ul class="slides">
                       <% _.each(top_banners_show,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png"
                                    data-background="<%= e.img %>" class="lazy"
                                    style="background: url() no-repeat top center">
                                    <img src="<%= e.show_report_url  %>" alt="" style="display:none">
                                </a>
                            </li>
                        <% }) %>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-game" data-keys="top_banners_game"
            onclick=" _ga('send', 'event', 'showuser', 'click', '右側tab遊戲輪播頻道')">
                <div class="banner">
                    <ul class="slides">
                         <% _.each(top_banners_game,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png"
                                    data-background="<%= e.img %>" class="lazy"
                                    style="background: url() no-repeat top center">
                                    <img src="<%= e.show_report_url  %>" alt="" style="display:none">
                                </a>
                            </li>
                         <% }) %>
                    </ul>
                </div>
            </div>

        </div>
    </script>
    <!--tab按鈕-->
    <script type="text/template" id="tpl_tab">
        <ul>
            <li>
                <a href="javascript:;" onclick="_ga('send', 'event', 'tabs', 'click', '主播推荐tab')"
                class="link-tab icon-normal icon-singer <% if(tab.current == 'anchor'){ %> active <% }%>" data-tab="anchor">
                    <span>主播推薦</span>
                </a>
            </li>
            <li>
                <a href="javascript:;" onclick="_ga('send', 'event', 'tabs', 'click', '遊戲推薦tab')"
                class="link-tab icon-normal icon-game <% if(tab.current == 'game'){ %> active <% }%>" data-tab="game">
                    <span>遊戲推薦</span>
                </a>
            </li>
            <li>
                <a href="javascript:;" onclick="_ga('send', 'event', 'tabs', 'click', '推薦群tab')"
                class="link-tab icon-normal icon-team <% if(tab.current == 'team'){ %> active <% }%>" data-tab="team">
                    <span>推薦群</span>
                </a>
            </li>
        </ul>
    </script>
    <!--主播推薦列表-->
    <script type="text/template" id="tpl_anchor">
       <!--<div class="rc-rec singer-rec game-rec" id="rc-rec"></div>-->
        <ul class="clearfix">
            <% _.each(anclist,function(e,i,a){ %>
            <li>
                <a class="link-rec active" data-sid="<%= e.sid %>" data-uid="<%= e.uid %>" 
                data-live="<%= e.live %>"  data-cid="<%= e.cid %>" 
                onclick="_ga('send','event','showuser','click','主播推薦')"
                 title="<%= e.nick %>&#10;ID：<%= e.sid %>">
                    <div class="res-imap">
                            <div class="rec-mark">
                            <% if(e.label) { %>
                            <em class="ic-mask mark-song">
                                <span class="icon-singer-voice"><%= e.label %></span>
                            </em>
                            <% } %>
                            <% if(e.live && !e.label) { %>
                            <em class="ic-mask mark-live">
                                <img src="<%= serverConfig. rc_assets%>img/live/ico_live.png" >
                            </em>
                            <% } %>
                            <em class="ic-mask mark-video">
                                <img src="<%= serverConfig. rc_assets%>img/btn_player.png" >
                            </em>
                        </div>
                        <img class="img lazy" data-src="<%= e.program_img ? e.program_img :  e.face %>"
                        onerror="this.src='<%= serverConfig. rc_assets%>img/live/img_rc.jpg'" alt="">
                    </div>
                    <div class="res-title tl">
                        <% e.title = e.program_title ? e.program_title : e.title  %>
                        <h3><%= e.title ? e.title : e.nick %> &#10;ID：<%= e.sid %> </h3>
                    </div>
                    <div class="res-desc clearfix">
                        <em class="icon-desc desc-personl fl">
                            <span><%= e.online %></span>
                        </em>
                        <!--<em class="icon-desc desc-position fr">
                            <span><%= e.area_type != 0 ? e.areaName: '' %></span>
                        </em>-->
                    </div>
                </a>
            </li>
            <% }) %>
        </ul>
        <!--<% if(page.current < page.total){%>
        <div class="btn-more tc">
			<a class="go-more" data-current="<%= page.current %>">加載更多</a>
		</div>
        <%}%>-->
    </script>
    <!--遊戲推薦列表-->
    <script type="text/template" id="tpl_game">
       <!--<div class="rc-rec singer-rec game-rec" id="rc-rec"></div>-->
        <ul class="clearfix">
            <% _.each(gameList,function(e,i,a){ %>
            <li>
                 <a href="javascript:;" class="link-rec" data-sid="<%= e.sid %>" data-uid="<%= e.uid %>" 
                    data-playcode ="<%= e.play_code %>" data-gametype="<%= e.game_type %>"
                    onclick="_ga('send','event','game','click','遊戲推薦')">
                    <div class="res-imap">
                        <div class="rec-mark">
                            <% if(e.hot == 1  && e.game_type == 1){ %>
                            <em class="ic-mask mark-game">
                                 <img src="<%= serverConfig. rc_assets%>img/live/ico_hot.png" >
                            </em>
                            <% } %>
                            <% if(e.game_type == 2 ){ %>
                            <em class="ic-mask mark-game">
                                 <img src="<%= serverConfig. rc_assets%>img/ic_hot_shouyou.png" >
                            </em>
                            <% } %>
                        </div>
                        <img class="img lazy" data-src="<%= e.game_cover %>"
                         onerror="this.src='<%= serverConfig. rc_assets%>img/live/img_error_s.jpg'" alt="">
                    </div>
                    <div class="res-title tc">
                        <h3><%= e.game_name %></h3>
                        <% if(e.game_type == 1 ){ %>
                             <p><em class="col-yellow"><%= e.play_num %></em>人在玩 </p>
                             <% }else{ %>
                             <p><em class="col-yellow">RC手游</em> </p>
                        <% } %>
                    </div>
                </a>
            </li>
            <% }) %>
        </ul>
        <% if(page.current < page.total){%>
        <div class="btn-more tc">
			<a class="go-more" data-current="<%= page.current %>">加載更多</a>
		</div>
        <%}%>
    </script>
     <!--群推薦列表-->
    <script type="text/template" id="tpl_team">
       <!--<div class="rc-rec singer-rec game-rec" id="rc-rec"></div>-->
        <ul class="clearfix">
            <% _.each(teamList,function(e,i,a){ %>
            <li>
                <a href="javascript:;" class="link-item link-rec clearfix"  data-sid="<%= e.sid %>" data-uid="<%= e.uid %>"
                    onclick="_ga('send','event','family','click','群推薦')">
                    <div class="avater fl">
                        <img class="img lazy" data-src="<%= e.img %>"
                        onerror="this.src='<%= serverConfig. rc_assets%>img/live/img_rc.jpg'" alt="">
                    </div>
                    <div class="desc fl">
                        <h3><%= e.name %></h3>
                        <p><%= e.intro.length>35?e.intro.substr(0,33)+'...':e.intro %></p>
                        <div class="res-desc">
                            <label class="first"><span class="icon-desc desc-id"><%= e.sid %></span></label>
                            <label class="last"><span class="desc-personl"><%= e.onlines %></span></label>
                        </div>
                    </div>
                    <div class="tips">
                        <span class="link-tab <%= $.kindFormat(e.sess_type)['class'] %>"><%= $.kindFormat(e.sess_type)['name'] %></span>
                    </div>
                </a>
            </li>
            <% }) %>
        </ul>
        <!--<% if(page.current < page.total && page.total > 0){%>
            <div class="btn-more tc">
                <a class="go-more" data-current="<%= page.current %>">加載更多</a>
            </div>
        <%}%>-->
    </script>
    <!-- 左右廣告 -->
    <script type="text/template" id="tpl_ad">
        <div class="img" title="<%= title %>">
            <a target="_blank" href="<%= url %>" onclick= "_ga('send','event','showad','click','左右廣告')" >
                <img src="<%= img %>" alt="">
            </a>
            <img src="<%= show_report_url %>" style="display:none;">
        </div>
    </script>
</body>
<script type="text/javascript">
    var config = <?php  echo json_encode($config) ?>;
    window.serverConfig = {
        "debug": true,
        "uid": "11480286",
        "apiLogo": "http://api2.raidtalk.com.tw/server/getimg.php?sid=%s&type=100",
        "gameActivity": "http://game.raidtalk.com.tw/storage/game_activitys/",
        "sess_music": [
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_1/438205.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_1/322445.jpg",
                "url": "enterServer(666,5,6)",
                "link_type": 3,
                "sid": 666,
                "rawSid": 27627237,
                "cid": 5,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_1/830/11480286/33496/192.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=N2%3BCW%3B%24y%3DFr%2B%5ED…aMkeHY%29_3T2%26HRR%3F8T8%28gc%21%3FdEt%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZO",
                "status": "sess_music",
                "url_open": 1
            },{
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_1/438205.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_1/322445.jpg",
                "url": "enterServer(666,5,6)",
                "link_type": 3,
                "sid": 665,
                "rawSid": 27627237,
                "cid": 5,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_1/830/11480286/33496/192.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=N2%3BCW%3B%24y%3DFr%2B%5ED…aMkeHY%29_3T2%26HRR%3F8T8%28gc%21%3FdEt%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZO",
                "status": "sess_music",
                "url_open": 1
            }
        ],
        "sess_game": [
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_2/175838.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_2/843428.jpg",
                "url": "enterServer(777,17010271,6)",
                "link_type": 3,
                "sid": 777,
                "rawSid": 120632,
                "cid": 17010271,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_2/830/11480286/90654/176.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=J.%3BCW%3B%24y%3DFr%2B%5ED…aMkeHY%29_3T2%26HRRC%3CT8%28gc%217u%5Et%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZV",
                "status": "sess_game"
            }, {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_2/175838.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_2/843428.jpg",
                "url": "enterServer(777,17010271,6)",
                "link_type": 3,
                "sid": 777,
                "rawSid": 120632,
                "cid": 17010271,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_2/830/11480286/90654/176.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=J.%3BCW%3B%24y%3DFr%2B%5ED…aMkeHY%29_3T2%26HRRC%3CT8%28gc%217u%5Et%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZV",
                "status": "sess_game"
            }
        ],
        "sess_show": [
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_3/586676.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_3/403901.jpg",
                "url": "enterServer(27123501,498,6)",
                "link_type": 3,
                "sid": 27123501,
                "rawSid": 27123501,
                "cid": 498,
                "live": 1,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_3/830/11480286/15737/226.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=B%26%3BCW%3B%24y%3DFr%2B%5…aMkeHY%29_3T2%26HRRG%40T8%28gc73%5B%5Et%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZT",
                "status": "sess_show"
            },{
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_3/586676.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_3/403901.jpg",
                "url": "enterServer(27123501,498,6)",
                "link_type": 3,
                "sid": 27123501,
                "rawSid": 27123501,
                "cid": 498,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_3/830/11480286/15737/226.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=B%26%3BCW%3B%24y%3DFr%2B%5…aMkeHY%29_3T2%26HRRG%40T8%28gc73%5B%5Et%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZT",
                "status": "sess_show"
            },{
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_3/586676.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_sess_3/403901.jpg",
                "url": "enterServer(27123501,498,6)",
                "link_type": 3,
                "sid": 27123501,
                "rawSid": 27123501,
                "cid": 498,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_sess_3/830/11480286/15737/226.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=B%26%3BCW%3B%24y%3DFr%2B%5…aMkeHY%29_3T2%26HRRG%40T8%28gc73%5B%5Et%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZT",
                "status": "sess_show"
            }
        ],
        "top_banners_show": [
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_1/993543.png",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_1/491260.png",
                "url": "http://rcshow.tv/activity/2017dw/",
                "link_type": 1,
                "sid": 0,
                "rawSid": 0,
                "cid": 0,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_bn_1/830/11480286/38638/216.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=B%26%3BCW%3B%24y%3DFr%2B%5…7D%2C4cQ.DdM0CaMkeHY%29_%22KN%240Ds3W%3A93AF7a%29tPd-xKCjq8%25%40B%24u%5EB",
                "status": "top_banners_show"
            },
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_1/597248.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_1/874142.jpg",
                "url": "http://rcshow.tv/activity/cover_singer/22/",
                "link_type": 1,
                "sid": 0,
                "rawSid": 0,
                "cid": 0,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_bn_1/830/11480286/57908/197.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=N2%3BCW%3B%24y%3DFr%2B%5ED…%2C4cQ.DdM0CaMkeHY%29_%22KN%240Ds3W%3A9%2FZcGq%29tPd-xKCjq8%25%40B%24u%5ES",
                "status": "top_banners_show"
            }
        ],
        "top_banners_game": [
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_2/505600.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_2/931024.jpg",
                "url": "http://forum.raidcall.com.tw/forum.php?mod=viewthread&tid=68819",
                "link_type": 1,
                "sid": 0,
                "rawSid": 0,
                "cid": 0,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_bn_2/830/11480286/30091/195.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=G%2B%3BCW%3B%24y%3DFr%2B%5…C4cQ.DdM0CaMkeHY%29_%22KN%241Es3W%3A9%2FZc%21K%29tPd-xKCjq8%25%40B%24u%5EU",
                "status": "top_banners_game"
            },
            {
                "img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_2/701571.jpg",
                "big_img": "http://adimg.raidtalk.com.tw/ads/main_top_bn_2/454076.jpg",
                "url": "http://forum.raidcall.com.tw/forum.php?mod=viewthread&tid=68791",
                "link_type": 1,
                "sid": 0,
                "rawSid": 0,
                "cid": 0,
                "live": 0,
                "show_report_url": "http://upload.raidcall.com.tw/statics/main_top_bn_2/830/11480286/54787/205.png",
                "click_report_url": "http://upload.raidtalk.com.tw/actstate.php?param=N2%3BCW%3B%24y%3DFr%2B%5ED…C4cQ.DdM0CaMkeHY%29_%22KN%241Es3W%3A93%40E%21K%29tPd-xKCjq8%25%40B%24u%5EF",
                "status": "top_banners_game"
            }
        ],
        "apis": {
            "show": "//showhome.raidtalk.com.tw/new.php",
            "game": "//game.raidtalk.com.tw/api/games",
            "team": "//ads.raidtalk.com.tw/api/get_sess_sorts.php",
            "live": "//rcshow.tv/index.php?c=newHome&a=topFlashList",
            "swf": "v830/assets/swf/HomeShow.swf?v=1.54331"
        },
        rc_swf:config.rc_swf,
        rc_express:config.rc_express,
        rc_assets:config.rc_assets,
        ad:{
            rc_adurl:config.ad.rc_adurl,
            rc_adtitle:config.ad.rc_adtitle
        },
        apis:{
            show:config.apis.show,
            game: config.apis.game,
            team: config.apis.team,
            live:config.apis.live,
            swf:config.apis.swf
        },
        start_time: new Date().getTime()
    }
</script>
<script>
    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    // ga('create', 'UA-6586989-', { userId: <?php echo $uid; ?>});
    ga('send', 'pageview');
</script>
<?php if ($debug) {?>
<script type="text/javascript" src="js/dist/bundle.js?v=<?php echo $v; ?>"></script>
<?php } else {?>
<script type="text/javascript" src="js/dist/bundle.min.js?v=<?php echo $v; ?>"></script>
<?php }?>
</html>