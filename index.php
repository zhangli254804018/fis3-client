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
    <script type="text/javascript" src="js/dist/vendor.min.js"></script>
    <?php if ($debug) {?>
    <link rel="stylesheet" type="text/css" href="assets/css/main.css?v=<?php echo $v; ?>">
     <script type="text/javascript" src="js/dist/bundle.js?v=<?php echo $v; ?>"></script>
    <?php } else {?>
    <link rel="stylesheet" type="text/css" href="assets/css/main.min.css?v=<?php echo $v; ?>">
    <script type="text/javascript" src="js/dist/bundle.min.js?v=<?php echo $v; ?>"></script>
    <?php }?>
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
            <div class="banner">
                <div class="sliders-tv" id="myDynamicContent"></div>
                <ul class="slides clearfix slides-container">
                     <% _.each(bannerSet,function(e,i,a){ %>
                        <li>
                            <% if(!isNaN(e.url)) { %>
                                <!--<a class="icon-play" href="javascript:;" onclick= "window.open('http://rcshow.tv/live/?uid=<%= e.url %>');_ga('send','event','showuser','click','default')"></a>-->
                                <!--<div class="sliders-tv" id="myDynamicContent"></div>-->
                            <%}%>
                            <a href='javascript:;' class="sliders-banner link-banner"  data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>" target="_blank">
                                <img src="<%= serverConfig.rc_assets %>img/live/alpha.png" style="background: url(<%= e.big_img %>) no-repeat top center">
                                <img src="<%= $.addMathroundParam(e.show_report_url) %>" alt="" style="display:none">
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
            <div class="slider-item slider-live" data-keys="sess_music">
                <div class="banner">
                    <ul class="slides clearfix">
                        <% _.each(sess_music,function(e,i,a){ %>
                        <li>
                            <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                <img src="<%= serverConfig. rc_assets%>img/live/alpha.png" style="background: url(<%= e.img %>) no-repeat top center">
                                <img src="<%= $.addMathroundParam(e.show_report_url) %>" alt="" style="display:none">
                            </a>
                        </li>
                        <% }) %>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-live" data-keys="sess_game">
                <div class="banner">
                    <ul class="slides">
                        <li>
                             <% _.each(sess_game,function(e,i,a){ %>
                                <li>
                                    <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>" >
                                        <img src="<%= serverConfig. rc_assets%>img/live/alpha.png" style="background: url(<%= e.img %>) no-repeat top center">
                                        <img src="<%= $.addMathroundParam(e.show_report_url) %>" alt="" style="display:none">
                                    </a>
                                </li>
                             <% }) %>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-live" data-keys="sess_show">
                <div class="banner">
                    <ul class="slides">
                        <% _.each(sess_show,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png" style="background: url(<%= e.img %>) no-repeat top center">
                                    <img src="<%= $.addMathroundParam(e.show_report_url) %>" alt="" style="display:none">
                                </a>
                            </li>
                        <% }) %>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-show" data-keys="top_banners_show">
                <div class="banner">
                    <ul class="slides">
                       <% _.each(top_banners_show,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png" style="background: url(<%= e.img %>) no-repeat top center">
                                    <img src="<%= $.addMathroundParam(e.show_report_url) %>" alt="" style="display:none">
                                </a>
                            </li>
                        <% }) %>
                    </ul>
                </div>
            </div>
            <div class="slider-item slider-game" data-keys="top_banners_game">
                <div class="banner">
                    <ul class="slides">
                         <% _.each(top_banners_game,function(e,i,a){ %>
                            <li>
                                <a href="javascript:;" class="link-banner" data-click="<%= e.click_report_url %>"  data-url="<%= e.url %>">
                                    <img src="<%= serverConfig. rc_assets%>img/live/alpha.png" style="background: url(<%= e.img %>) no-repeat top center">
                                    <img src="<%= $.addMathroundParam(e.show_report_url) %>" alt="" style="display:none">
                                </a>
                            </li>
                         <% }) %>
                    </ul>
                </div>
                <!--<ol id="bannerCtrl" class="flex-control-nav flex-control-paging">
                    <% if(top_banners_game && top_banners_game.length > 1) _.each(top_banners_game,function(e,i,a){ %>
                        <li class=""><a></a></li>
                    <% }) %>
                </ol>-->
            </div>
        </div>
    </script>
    <!--tab按鈕-->
    <script type="text/template" id="tpl_tab">
        <a href="javascript:;" class="link-tab icon-normal icon-singer <% if(tab.current == 'anchor'){ %> active <% }%>" data-tab="anchor"><span>主播推薦</span></a>
        <a href="javascript:;" class="link-tab icon-normal icon-game <% if(tab.current == 'game'){ %> active <% }%>" data-tab="game"><span>遊戲推薦</span></a>
        <a href="javascript:;" class="link-tab icon-normal icon-team hot <% if(tab.current == 'team'){ %> active <% }%>" data-tab="team"><span>推薦群</span></a>
    </script>
    <!--主播推薦列表-->
    <script type="text/template" id="tpl_anchor">
       <!--<div class="rc-rec singer-rec game-rec" id="rc-rec"></div>-->
        <ul class="clearfix">
            <% _.each(anclist,function(e,i,a){ %>
            <li>
                <a href="javascript:;" class="link-rec active" data-sid="<%= e.sid %>" data-uid="<%= e.uid %>"
                onclick="<% if(e.live==1){ %>external.enterServer(<%= e.sid %>,<%= e.cid %>,6);<% }else{ %>window.open('http://rcshow.tv/live/?uid=<%= e.uid %>');<% } %>_ga('send','event','showuser','click','default')"
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
                        <img class="img" src="<%= e.program_img ? e.program_img : e.face %>"
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
                        <em class="icon-desc desc-position fr">
                            <span><%= e.area_type != 0 ? e.areaName: '' %></span>
                        </em>
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
                 <% if(e.game_type == 1 ){ %>
                    <a href="javascript:;" class="link-rec" data-sid="<%= e.sid %>" data-uid="<%= e.uid %>"
                    onclick="_ga('send','event','game','click');window.external.startGamebox('<%= e.play_code %>')">
                <% }else{ %>
                    <a href="javascript:;" class="link-rec" data-sid="<%= e.sid %>" data-uid="<%= e.uid %>"
                    onclick="_ga('send','event','game','click');window.open('<%= e.play_code %>')">
                <% } %>
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
                        <img class="img" src="<%= e.game_cover %>" onerror="this.src='<%= serverConfig. rc_assets%>img/live/img_error_s.jpg'" alt="">
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
                <a href="javascript:;" class="link-rec" data-sid="<%= e.sid %>" data-uid="<%= e.uid %>"
                onclick="external.enterServer(<%= e.sid %>,0,6);_ga('send','event','family','click')">
                    <div class="res-imap">
                        <div class="rec-mark">
                            <% if(e.live) { %>
                            <em class="ic-mask mark-live">
                                <img src="<%= serverConfig. rc_assets%>img/live/ico_live.png" >
                            </em>
                            <% } %>
                        </div>
                        <img class="img" src="<%= e.img %>"
                        onerror="this.src='<%= serverConfig. rc_assets%>img/live/img_rc.jpg'" alt="">
                    </div>
                    <div class="res-title tl">
                        <h3 class="tl"><%= e.name %></h3>
                    </div>
                    <div class="res-desc clearfix">
                        <em class="icon-desc desc-personl fl">
                            <span><%= e.onlines %></span>
                        </em>
                        <em class="icon-desc desc-id fr">
                            <span><%= e.sid %></span>
                        </em>
                    </div>
                </a>
            </li>
            <% }) %>
        </ul>
        <% if(page.current < page.total && page.total > 0){%>
        <div class="btn-more tc">
            <a class="go-more" data-current="<%= page.current %>">加載更多</a>
        </div>
        <%}%>
    </script>
    <!-- 左右廣告 -->
    <script type="text/template" id="tpl_ad">
        <div class="img" title="<%= title %>">
            <a target="_blank" href="javascript:;" onclick= "window.open('<%= url %>');_ga('send','event','showad','click','default')" >
                <img src="<%= img %>" alt="">
            </a>
            <img src="<%= show_report_url %>" style="display:none;">
        </div>
    </script>
</body>
<script type="text/javascript">
    var config = <?php  echo json_encode($config) ?>;
    window.serverConfig = {
        apiLogo: 'http://api2.raidtalk.com.tw/server/getimg.php?sid=%s&type=100',
        gameActivity: 'http://game.raidtalk.com.tw/storage/game_activitys/',
        sess_music:{
            img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/474473.jpg',
            big_img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/167715.jpg',
            url:'http://rcshow.tv/', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            link_type: 3, //1 http 2 gamebox 3 sess
            cid:'474473', //頻道id
            sid:'474473', //主播id
            live:1,  //1 直播 0 未开播
            show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        },
        sess_game:{
            img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/474473.jpg',
            big_img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/167715.jpg',
            url:'2853122', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            link_type: 3, //1 http 2 gamebox 3 sess
            cid:'474473', //頻道id
            sid:'474473', //主播id
            live:1,  //1 直播 0 未开播
            show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        },
        sess_show:{
            // img:'http://rcshow.tv/activity/cover_singer/22/img/4/header.png',
            // big_img:'http://rcshow.tv/activity/cover_singer/22/img/4/header.png',
            // url:'2078339', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            // show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            // click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        },
        top_banners_show:[{
            img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/167715.jpg',
            big_img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/167715.jpg',
            url:'http://rcshow.tv/live/st02580888', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        },{
            img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/474473.jpg',
            big_img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/474473.jpg',
            url:'http://rcshow.tv/live/st02580888', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        }],
        top_banners_game:[{
            link_type:1,
            img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/474473.jpg',
            big_img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/167715.jpg',
            url:'http://rcshow.tv/live/st02580888', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        },{
            img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/474473.jpg',
            big_img:'http://adimg.raidtalk.com.tw/ads/main_top_sess_1/167715.jpg',
            url:'http://rcshow.tv/live/st02580888', //這個根據不同值確定是什麼鏈接，數字為綁定的主播uid，http開頭的是http鏈接，gamebox開頭的是遊戲代碼
            show_report_url:"http://upload.raidcall.com.tw/statics/main_top_sess_1/830/8134121/70606/180.png", // 展示統計，每次展示請求一次，要求不重複請求
            click_report_url:"http://upload.raidtalk.com.tw/actstate.php?param=O3%3BCW%3B%24%3B_EGKIE7%2F2F0%25%5E%60%24yV_7Cll2%21bfp%7DFQ-zKR-eAu%3Dz.%3B%3C%7EyI8l%7BJ%2B%600Oka%3AOva43+KhJ%7E3gGse4W%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27O"  // 點擊統計，每次點擊請求一次，每次請求後面加隨機數據避免不能重複請求
        }],
        leftAds: {
            "id": 67,
            "img": "http:\/\/adimg.raidtalk.com.tw\/ads\/main_left\/178642.gif",
            "url": "gamebox:\/\/start\/?eyJnYW1lX2lkIjo5MywidHlwZSI6MSwiaWNvbiI6Imh0dHA6XC9cL2dhbWUucmFpZHRhbGsuY29tLnR3XC9zdG9yYWdlXC9nYW1lX2ltZ1wvdGh1bWIxOFwvNTY0MjExNDczNzU5NTAwLnBuZyIsInRpdGxlIjoiXHU2YjY2XHU3OTVlXHU4ZDk5XHU1YjUwXHU5ZjhkIiwidXJsIjoiaHR0cDpcL1wvZ2FtZS5yYWlkdGFsay5jb20udHdcL3BsYXlnYW1lXC9pbmRleFwvOTM\/YWQ9dW5rbm93JmFpZD02NyIsInJpZCI6NjcsInZlcnNpb24iOiJ1bmtub3cifQ==",
            "show_report_url": "http:\/\/ads.raidtalk.com.tw\/statics\/main_left\/820\/10355754\/51362\/67.png",
            "click_report_url": "http:\/\/upload.raidtalk.com.tw\/actstate.php?param=T8%3BCW%3B%24y%3CDGOf_HOeZ730N%28T%28F%22-FQQCOI%24u.G2%40xsP2%5E%7D%2C4cQ.DdM0CaMj%2AdFH%3FDT8%28gd8MVW%3C%22%3DB%3C%21%21Q%2B3VK%5B%2A%27C"
        },
        rightAds: {
            "id": 68,
            "img": "http:\/\/adimg.raidtalk.com.tw\/ads\/main_right\/697392.gif",
            "url": "gamebox:\/\/start\/?eyJnYW1lX2lkIjo5MywidHlwZSI6MSwiaWNvbiI6Imh0dHA6XC9cL2dhbWUucmFpZHRhbGsuY29tLnR3XC9zdG9yYWdlXC9nYW1lX2ltZ1wvdGh1bWIxOFwvNTY0MjExNDczNzU5NTAwLnBuZyIsInRpdGxlIjoiXHU2YjY2XHU3OTVlXHU4ZDk5XHU1YjUwXHU5ZjhkIiwidXJsIjoiaHR0cDpcL1wvZ2FtZS5yYWlkdGFsay5jb20udHdcL3BsYXlnYW1lXC9pbmRleFwvOTM\/YWQ9dW5rbm93JmFpZD02OCIsInJpZCI6NjgsInZlcnNpb24iOiJ1bmtub3cifQ==",
            "show_report_url": "http:\/\/ads.raidtalk.com.tw\/statics\/main_right\/820\/10355754\/37997\/68.png",
            "click_report_url": "http:\/\/upload.raidtalk.com.tw\/actstate.php?param=B%26%3BCW%3B%24y%3CDGOf_HOeZ730N%28T%28F%22-FQQCOI%24u.G2%40xsP2%5E%7D%2C4cQ.DdM0CaMk%5D%3AJlzx%5Cs3W%3A9Cm%60t%7EO%5B%264e%3F8%40BIk%25%2Cfn%5EZZ"
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
        start_time:config.start_time
    }
</script>
<?php if ($debug) {?>
<script type="text/javascript" src="js/dist/bundle.js?v=<?php echo $v; ?>"></script>
<?php } else {?>
<script type="text/javascript" src="js/dist/bundle.min.js?v=<?php echo $v; ?>"></script>
<?php }?>
<script async="async">
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
    ga('create', 'UA-65869892-1', 'auto');
    ga('send', 'pageview');
</script>
</html>