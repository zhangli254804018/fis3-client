<?php

$v = "1.10";

$debug = isset($_GET["debug"]);
//$debug = true;

$defaultUser = $debug ? "fion0210" : "";
$user = isset($_GET["u"]) ? $_GET["u"] : $defaultUser;
$source = isset($_GET["source"]) ? $_GET["source"] : "";
$uid = isset($_SESSION['uid']) ? $_SESSION['uid'] : 0;

// // 首頁頻道推薦位[音樂]
// $sess_music = top_banners_830($uid, 'main_top_sess_1', true);
// // 首頁頻道推薦位[遊戲]
// $sess_game = top_banners_830($uid, 'main_top_sess_2', true);
// // 首頁頻道推薦位[綜藝]
// $sess_show = top_banners_830($uid, 'main_top_sess_3', true);
// // 首頁小banner[秀場]
// $top_banners_show = top_banners_830($uid, 'main_top_bn_1');
// // 首頁小banner[遊戲]
// $top_banners_game = top_banners_830($uid, 'main_top_bn_2');

// 首页两侧广告
// $left_ads = common_img_ads($uid, 'main_left', 2);
//$right_ads = common_img_ads($uid, 'main_right', 2);
// $left_ad_id = isset($left_ads['id']) ? intval($left_ads['id']) : 0;
// $right_ads = right_ads_by_left($uid, $left_ad_id);
// if (!$left_ads) {
// 	$left_ads = null;
// }
// if (!$right_ads) {
// 	$right_ads = null;
// }

$apiLogo = "http://api2.raidtalk.com.tw/server/getimg.php?sid=%s&type=100";
$gameActivity = "http://game.raidtalk.com.tw/storage/game_activitys/";
$rc_game = "//game.raidtalk.com.tw/api/games";
$rc_showhome = "//showhome.raidtalk.com.tw/new.php";
$rc_team = "//ads.raidtalk.com.tw/api/get_sess_sorts.php";
$rc_live = "//rcshow.tv/index.php?c=newHome&a=topFlashList";
$rc_swf = "assets/swf/HomeShow.swf";
$rc_express = "assets/swf/expressInstall.swf";
$rc_assets = "assets/";
$rc_static = "./";
$rc_adurl = "";
$rc_adtitle = "音樂達人LIVE秀";

$config = array(
    "debug" => $debug,
    "user" => $user,
    "uid" => $uid,
    "apiLogo" =>$apiLogo,
    "gameActivity" =>$gameActivity,
    "rc_swf"  =>$rc_swf,
    "rc_express"=>$rc_express,
    "rc_assets"=>$rc_assets,
    //  "start_time" => round(microtime(true)*1000),
    // "start_time" => round(time()*1000),
    // "sess_music" => $sess_music,
    // "sess_game" =>$sess_game,
    // "sess_show" => $sess_show,
    // "top_banners_show" => $top_banners_show,
    // "top_banners_game" => $top_banners_game,
    // "live_sess_list" => $live_sess_list,
    // "left_ads" =>  $left_ads,
    // "right_ads"  => $right_ads,
    "ad" => array(
        "rc_adurl" =>$rc_adurl,
        "rc_adtitle" =>$rc_adtitle
    ),
    "apis" => array(
        "show" => $rc_showhome,
        "game" => $rc_game,
        "team" => $rc_team,
        "live" =>$rc_live
    ),
    "langCode" => "zh-tw",
    "areas" => array(
        "zh-tw" => array("保密不顯示", "澳大利亞", "中國大陸", "加拿大", "美國", "馬來西亞", "日本", "台灣", "香港", "新加坡", "英國"),
        "zh-cn" => array("保密不显示", "澳大利亞", "中国大陆", "加拿大", "美国", "马来西亚", "日本", "台湾", "香港", "新加坡", "英国")
    ),
    "appFiles" => array(
        "android" => "//rcshow.tv/apps/download/getApp.php?type=android&source=$source",
        "ios" => "//rcshow.tv/apps/download/getApp.php?type=ios&source=$source",
        "pc" => "//rcshow.tv/apps/download/"
    )
);

?>