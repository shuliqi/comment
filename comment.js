//shixi_liqi6@staff.sina.com.cn 5759

//评论插件

//2016-11-20

//评论插件配置参数说明

// 1.所需参数，放在页面中

// __docConfig={

//  __content,

//  __mainPic,

//  __title,

//  __docUrl,

//  __cmntTotal,

//  __cmntListUrl,

//  __docUrl,

//  __suda

// }

// 2.使用方法：

// var oComment = new Comment({

//          main : $('#mainpage'), //默认$('#mainpage'), 整体页面的容器

//          cmtsmtCallBack : function(content, Success, _this){//发评论的回调

//              sendMessage(content, Success, _this);

//          }

// });

// function sendMessage(content, Success , _this){

//     $.ajax({

//  type: 'POST',

//  url: '',

//  data: data,

//  dataType: 'json',

//  timeout: 10000,

//  success: function(data){

//      Success && Success.call(_this);

//      },

//  error: function(xhr, type){

//  }

//     })

// }

// 另外还有两个公开方法：

// oComment.commentShow(); 显示输入框

// oComment.commentHide(); 隐藏输入框
var cmntFace = ["[→_→]", "[呵呵]", "[嘻嘻]", "[哈哈]", "[爱你]", "[挖鼻屎]", "[吃惊]", "[晕]", "[泪]", "[馋嘴]", "[抓狂]", "[哼]", "[可爱]", "[怒]", "[汗]", "[害羞]", "[睡觉]", "[钱]", "[偷笑]", "[笑cry]", "[doge]", "[喵喵]", "[酷]", "[衰]", "[闭嘴]", "[鄙视]", "[花心]", "[鼓掌]", "[悲伤]", "[思考]", "[生病]", "[亲亲]", "[怒骂]", "[太开心]", "[懒得理你]", "[右哼哼]", "[左哼哼]", "[嘘]", "[委屈]", "[吐]", "[可怜]", "[打哈气]", "[挤眼]", "[失望]", "[顶]", "[疑问]", "[困]", "[感冒]", "[拜拜]", "[黑线]", "[阴险]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[握手]", "[作揖]", "[赞]", "[耶]", "[good]", "[弱]", "[不要]", "[ok]", "[haha]", "[来]", "[威武]", "[鲜花]", "[钟]", "[浮云]", "[飞机]", "[月亮]", "[太阳]", "[微风]", "[下雨]", "[给力]", "[神马]", "[围观]", "[话筒]", "[奥特曼]", "[草泥马]", "[萌]", "[囧]", "[织]", "[礼物]", "[喜]", "[围脖]", "[音乐]", "[绿丝带]", "[蛋糕]", "[蜡烛]", "[干杯]", "[男孩儿]", "[女孩儿]", "[肥皂]", "[照相机]", "[浪]", "[沙尘暴]"];

var commentConfig = {

    sendcomments : 'http://site.proc.sina.cn/cmnt/post_ajax.php', //评论的接口（必须）

    user :{

    usernick :  ''  //用户的信息登录状态下出现  （登录状态下必须,未登录为空）

    },

    logout : {

        switchurl : 'http://passport.sina.cn/signin/signin?entry=wapsso&revalid=2&r=' + encodeURIComponent(__docConfig.__docUrl), //登出和切换的链接登录状态下出现 （登录状态下必须,未登录为空）

        logouturl:'http://passport.sina.cn/sso/logout?entry=wapsso&r=' + encodeURIComponent(__docConfig.__docUrl)//登出和切换的链接登录状态下出现 （登录状态下必须,未登录为空）

    },

    login : {

        loginurl : 'http://passport.sina.cn/signin/signin?entry=wapsso&r=' + encodeURIComponent(__docConfig.__docUrl) + '&backTitle=' + encodeURIComponent(__docConfig.__title), //登录注册的链接 未登录的状态下出现(未登录状态下必须，登录为空)

        signup : 'http://passport.sina.cn/signup/signup?r=' + encodeURIComponent(__docConfig.__docUrl)//登录注册的链接 未登录的状态下出现(未登录状态下必须，登录为空)

    },

    // closefloatlayer : true, //如果不需要底部浮层为true,需要底部浮层false,默认为false(非必须)

    comt :{ //评论按钮/跳页（除神短评外必须）

        show : true, //不需要到评论页的话给false url给空

        url : __docConfig.__cmntListUrl,

        comt_num : __docConfig.__cmntTotal //评论数

    },

    favor : {

        show : false

    },

    share : { //分享按钮/跳页  (非必须)

        show : true ,

        url : 'http://share.sina.cn/callback?url=' + encodeURIComponent(__docConfig.__docUrl) + '&title='  + encodeURIComponent(__docConfig.__title) + '&pic=' + __docConfig.__mainPic + '&content='+ encodeURIComponent(__docConfig.__content) //分享页

    },

    suda: __docConfig.__suda ||''

};

function Comment(options)

{

    //为了继承

    var _this = this

    this.oCmtFace = cmntFace;

    if(!arguments.length)return;

    window.ishare = window.ishare||false;

    _this.shareBtn = window.ishare?'j_shareBtn':'j_share_btn';

    _this.options = options || {};

    _this.options.main = $('body');

    _this.mid = null; 

    _this.tp = false;

    _this.nick = null; 

    _this.scro = 0;

    _this.wb_content = null;

    _this.wbname = null;

    _this.oLoader = $('html'),

    _this.page = _this.oLoader.attr('data-page') || 1;

   _this.review = $('.kcmnt_review');

   _this.input = $('#j_cmnt_input');

   _this.reviewoTextarea = $('.kcmnt_review .kcmnt_fixed_reply_input')[0];

   _this.mainoTextarea = $('.kcmnt_main .kcmnt_fixed_reply_input')[0];

   _this.slider = null;

   _this.Juge = false;

    // _this.options.main = options.main || $('body');

    _this.options.closefloatlayer = commentConfig.closefloatlayer || false;

    _this.options.commentCallBack = options.commentCallBack || null; //评论回调

    _this.options.commentPageCallBack = options.commentPageCallBack || null; //跳页回调

    _this.options.shareCallBack = options.shareCallBack || null; //分享回调

    _this.options.cmtsmtCallBack = options.cmtsmtCallBack || null; //发评论回调

    _this.options.cmtcancelCallBack = options.cmtcancelCallBack || null; //取消回调

    _this.options.setTop=options.setTop || false;

    _this.options.screenScroll = 0;

    commentConfig.dnick = '手机新浪网用户';

    commentConfig.dface = 'http://mjs.sinaimg.cn/wap/module/short_comment/201506041400/images/dface.gif';

    

    _this.sending = 0;

    commentConfig.comt = commentConfig.comt || {};

    commentConfig.favor = commentConfig.favor || {};

    commentConfig.share = commentConfig.share || {};

    commentConfig.comt.comt_num = commentConfig.comt.comt_num || '0';

    commentConfig.comtTitle = commentConfig.comtTitle || '说说你的看法';

    commentConfig.closeComment = commentConfig.closeComment || false;

    if(window.__if_cmnt){

        commentConfig.share.show = false;

        commentConfig.comt.show = false;

        commentConfig.favor.show = false;

    }else{

        commentConfig.comt.show = commentConfig.comt.show || false;

        commentConfig.favor.show = commentConfig.favor.show || false;   

        commentConfig.share.show = commentConfig.share.show || false;

    }

    

    commentConfig.login = commentConfig.login ||{};

    commentConfig.login.loginurl = commentConfig.login.loginurl||'';

    commentConfig.login.signup = commentConfig.login.signup || '';

    commentConfig.logout = commentConfig.logout || {};

    commentConfig.logout.switchurl = commentConfig.logout.switchurl || '';

    commentConfig.logout.logouturl = commentConfig.logout.logouturl || '';

    if(!window.__userConfig__){

        __userConfig__={};

        __userConfig__.__isLogin = commentConfig.user.isLogin || globalConfig.islogin;

    }

    if(commentConfig.closeComment)return;

    commentConfig.suda = commentConfig.suda || 'comment' ;

    _this.ua = window.navigator.userAgent.toLowerCase();

    // _this._addcss();

    //生成元素

    _this._createDOM();

    //添加事件

    _this._addEvent();

    var mySwiperRview = new Swiper('.swiper-container',{

        pagination : '.swiper-pagination',

        paginationClickable: true,

        longSwipesRatio: 0.3,

        touchRatio:1,

        observer:true,//修改swiper自己或子元素时，自动初始化swiper

        observeParents:true,//修改swiper的父元素时，自动初始化swiper

    });

    // var mySwiperMain = new Swiper('.kcmnt_main .swiper-container',{

    //                     pagination : '.swiper-pagination',

    //                     paginationClickable: true,

    //                     longSwipesRatio: 0.3,

    //                     touchRatio:1,

    //                     observer:true,//修改swiper自己或子元素时，自动初始化swiper

    //                     observeParents:true,//修改swiper的父元素时，自动初始化swiper

    // });

}

Comment.prototype.commentHide = function(){

    $('.foot_comment').css({"display":"none"});

}

Comment.prototype.commentShow = function(){

    $('.foot_comment').css({"display":"block"});

}

var oMeta=document.getElementsByName('viewport')[0];

Comment.prototype._addcss=function (){

    // var oLink=document.createElement('link');

    // oLink.rel='stylesheet';

    // oLink.type='text/css';

    // // oLink.href='http://dpool.dev.sina.cn/yuanyuan/short_comment/css/addComment.css';

    // oLink.href='http://mjs.sinaimg.cn/wap/module/short_comment/201505220900/css/addComment.css';

    // document.getElementsByTagName('head')[0].appendChild(oLink);

}

// 创建dom

Comment.prototype._createDOM=function ()

{

    window._this=this;

    var arr = [];

    // 底部浮层

    if(!this.options.closefloatlayer){

        arr.push('<aside>');

        arr.push('<div class="foot_comment">');

        arr.push('<div class="foot_commentcont">');

        arr.push('<div  class="foot_cmt_input j_cmt_btn" data-sudaclick="'+ commentConfig.suda+'_cmt_btn"><p>'+ commentConfig.comtTitle +'</p>');

        arr.push('</div>');

        // 如果需要收藏

        if(commentConfig.favor.show){

            arr.push('<div class="foot_cmt_favor j_iadd_btn"></div>');

        }

        // 如果需要评论跳页

        if(commentConfig.comt.show){

            arr.push('<div class="foot_cmt_num j_p_comt">');

            arr.push('<a title="" data-sudaclick="'+ commentConfig.suda+'_comt">');

            arr.push('<span class="cmt_num_t">'+ commentConfig.comt.comt_num +'</span></a></div>');

        }

        if(commentConfig.share.show){

            arr.push('<div class="foot_cmt_share '+ this.shareBtn +'"></div>');

            

        }

        // 如果右边都不要的话显示评论数

        if(!commentConfig.comt.show && !commentConfig.share.show && !commentConfig.favor.show){

            arr.push('<div class="foot_cmt_num j_cmt_btn">');

            arr.push('<a href="javascript:;" title="">');

            arr.push('<span class="cmt_num_t" data-sudaclick="'+ commentConfig.suda+'_cmt_btn">'+ commentConfig.comt.comt_num +'</span></a></div>');

        }

        arr.push('</div></div></aside>');

    }

    //评论页和查看对话

    arr.push('<div data-id=" " class="cmtList">');

    arr.push(' <header class="comment_header"><span class="header_back icon_back_1"></span><h2 class="kcmnt_header_tit">评论(0)</h2></header>')

    arr.push('<section class="kcmnt_list">');

    arr.push('<img class="looaImg" src="http://mjs.sinaimg.cn/wap/online/dpool/wemedia/images/load.gif"/>');

    arr.push('</section>');

    

    arr.push('</div>');

    $('body').parent().append(arr.join(''));

    var html = [];

   //回复

    html.push('<section style="display:none;"class="kcmnt_review"><div class="kcmnt_fixed_reply"><div class="kcmnt_fixed_reply_box"><textarea  class="kcmnt_fixed_reply_input" placeholder="说说你的看法:"></textarea><div class="send"><span type="button" biao="false" class="biaoqing"></span><label class="label"><input type="checkbox" class="myShar" id="checkbox-1"><label for="checkbox-1"><span class="check"></span></label><span class="weibo">同时分享到微博</span></label><input data-com="false" class="rviewSend" type="button" value="发表"></div></div><a href="javascript:;" class="kcmnt_fixed_close icon_close_1 kcmnt_view_closekcmnt_view_close"></a></div></section>');

    

    $('body').parent().append(html.join(''));

    var commen = [];

     commen.push('<section style="display:block;"class="kcmnt_guding"><div class="kcmnt_fixed_reply_gu"><div class="kcmnt_fixed_reply_box_gu"><input type="text" class="kcmnt_fixed_reply_input_gu" placeholder="说说你的看法:"></div></section>');

    commen.push('<section style="display:none;"class="kcmnt_main"><div class="kcmnt_fixed_reply"><div class="kcmnt_fixed_reply_box"><textarea  class="kcmnt_fixed_reply_input" placeholder="回复奶黄包:"></textarea><div class="send"><span type="button" biao="false" class="biaoqing"></span><label class="label"><input type="checkbox" class="myShar"  id="checkbox-2"><label for="checkbox-2"><span class="check"></span></label><span class="weibo">同时分享到微博</span></label><input class="rviewSend" type="button" value="发表"></div></div><a href="javascript:;" class="kcmnt_view_close icon_close_1 "></a></div></section>');

    $('body').parent().find(".cmtList").append(commen.join(''));

    var con = [];

    var more = [];

    more.push('<div class="comment_more"><img src="http://mjs.sinaimg.cn/wap/online/dpool/wemedia/images/load.gif"></div>');

    $('.cmtList').append(more.join(' '));

    con.push('<aside id="tipsCeng" class="tipsCeng">');

    con.push('<div class="comment_remind animation_marker">');

    con.push('<p class="marker_t">您已发送成功！</p>');

    con.push('</div>');

    con.push('</aside>');

    $('body').parent().append(con.join(''));

    //举报

    var jubao = [];

    jubao.push(' <section class="fixed_box">');

    jubao.push(' <div class="f_shield f_shield_top">');

    jubao.push(' <ul class="f_shield_list">');

    jubao.push(' <li type="1" class="f_shield_list_li">');

    jubao.push(' <a href="javascript:;" class="f_shield_list_link">反动言论</a>');

    jubao.push(' </li>');

    jubao.push(' <li type="2" class="f_shield_list_li">');

    jubao.push(' <a href="javascript:;" class="f_shield_list_link">广告营销</a>');

    jubao.push(' </li>');

    jubao.push(' <li type="3" class="f_shield_list_li">');

    jubao.push(' <a href="javascript:;" class="f_shield_list_link">淫秽色情</a>');

    jubao.push(' </li>');

    jubao.push(' <li type="4" class="f_shield_list_li">');

    jubao.push(' <a href="javascript:;" class="f_shield_list_link">人身攻击</a>');

    jubao.push(' </li>');

    jubao.push(' <li type="5" class="f_shield_list_li">');

    jubao.push(' <a href="javascript:;" class="f_shield_list_link">虚假中奖</a>');

    jubao.push(' </li>');

    jubao.push(' </ul>');

    jubao.push(' <div class="f_shield_op">');

    jubao.push(' <a href="javascript:;" class="f_shield_cancel">取　消</a>');

    jubao.push(' <a href="javascript:;" class="f_shield_sure">确定</a>');

    jubao.push(' </div>');

    jubao.push(' </div>');

    jubao.push(' </section>');

    $('body').parent().append(jubao.join(''));

    var biao = _this.biaoqing();

    $('.kcmnt_review .kcmnt_fixed_reply').append(biao.join(''));

    $('.kcmnt_main .kcmnt_fixed_reply').append(biao.join(''));

}

Comment.prototype.login = function(cb) {

    try {

        checkLogin

    } catch (e) {

        checkLogin = '';

    }

    //判断是否登陆，登陆后开启评论组件功能

    if (checkLogin && !checkLogin()) {

        window.oLogin = window.oLogin ? window.oLogin : (typeof(WapLogin) == 'function') ? (new WapLogin()) : this;

        

        window.oLogin.login(false, function(rs) {

            cb && cb();

            cb = null;

            ev.preventDefault();

        });

    } else {

            cb && cb();

    }

}

Comment.prototype.biaoqing = function(){

    var html = [];

    html.push('<div class="cmnt_tablist j_cmnt_tablist">');

    html.push('<div class="swiper-container swiper-container-horizontal cmnt_faces j_cmnt_faces active">');

    html.push('<div class="swiper-wrapper">');

    html.push('<div class="content-tab-face swiper-slide"><i data-face="[→_→]" class="face_1 face icon_0" data-sudaclick="comment_send_face"></i><i data-face="[呵呵]" class="face_1 face icon_1" data-sudaclick="comment_send_face"></i><i data-face="[嘻嘻]" class="face_1 face icon_2" data-sudaclick="comment_send_face"></i><i data-face="[哈哈]" class="face_1 face icon_3" data-sudaclick="comment_send_face"></i><i data-face="[爱你]" class="face_1 face icon_4" data-sudaclick="comment_send_face"></i><i data-face="[挖鼻屎]" class="face_1 face icon_5" data-sudaclick="comment_send_face"></i><i data-face="[吃惊]" class="face_1 face icon_6" data-sudaclick="comment_send_face"></i><i data-face="[晕]" class="face_1 face icon_7" data-sudaclick="comment_send_face"></i><i data-face="[泪]" class="face_1 face icon_8" data-sudaclick="comment_send_face"></i><i data-face="[馋嘴]" class="face_1 face icon_9" data-sudaclick="comment_send_face"></i><i data-face="[抓狂]" class="face_1 face icon_10" data-sudaclick="comment_send_face"></i><i data-face="[哼]" class="face_1 face icon_11" data-sudaclick="comment_send_face"></i><i data-face="[可爱]" class="face_1 face icon_12" data-sudaclick="comment_send_face"></i><i data-face="[怒]" class="face_1 face icon_13" data-sudaclick="comment_send_face"></i><i data-face="[汗]" class="face_1 face icon_14" data-sudaclick="comment_send_face"></i><i data-face="[害羞]" class="face_1 face icon_15" data-sudaclick="comment_send_face"></i><i data-face="[睡觉]" class="face_1 face icon_16" data-sudaclick="comment_send_face"></i><i data-face="[钱]" class="face_1 face icon_17" data-sudaclick="comment_send_face"></i><i data-face="[偷笑]" class="face_1 face icon_18" data-sudaclick="comment_send_face"></i><i data-face="[笑cry]" class="face_1 face icon_19" data-sudaclick="comment_send_face"></i><i data-face="[doge]" class="face_1 face icon_20" data-sudaclick="comment_send_face"></i></div>')

    html.push('<div class="content-tab-face swiper-slide"><i data-face="[喵喵]" class="face_1 face icon_21" data-sudaclick="comment_send_face"></i><i data-face="[酷]" class="face_1 face icon_22" data-sudaclick="comment_send_face"></i><i data-face="[衰]" class="face_1 face icon_23" data-sudaclick="comment_send_face"></i><i data-face="[闭嘴]" class="face_1 face icon_24" data-sudaclick="comment_send_face"></i><i data-face="[鄙视]" class="face_1 face icon_25" data-sudaclick="comment_send_face"></i><i data-face="[花心]" class="face_1 face icon_26" data-sudaclick="comment_send_face"></i><i data-face="[鼓掌]" class="face_1 face icon_27" data-sudaclick="comment_send_face"></i><i data-face="[悲伤]" class="face_2 face icon_0" data-sudaclick="comment_send_face"></i><i data-face="[思考]" class="face_2 face icon_1" data-sudaclick="comment_send_face"></i><i data-face="[生病]" class="face_2 face icon_2" data-sudaclick="comment_send_face"></i><i data-face="[亲亲]" class="face_2 face icon_3" data-sudaclick="comment_send_face"></i><i data-face="[怒骂]" class="face_2 face icon_4" data-sudaclick="comment_send_face"></i><i data-face="[太开心]" class="face_2 face icon_5" data-sudaclick="comment_send_face"></i><i data-face="[懒得理你]" class="face_2 face icon_6" data-sudaclick="comment_send_face"></i><i data-face="[右哼哼]" class="face_2 face icon_7" data-sudaclick="comment_send_face"></i><i data-face="[左哼哼]" class="face_2 face icon_8" data-sudaclick="comment_send_face"></i><i data-face="[嘘]" class="face_2 face icon_9" data-sudaclick="comment_send_face"></i><i data-face="[委屈]" class="face_2 face icon_10" data-sudaclick="comment_send_face"></i><i data-face="[吐]" class="face_2 face icon_11" data-sudaclick="comment_send_face"></i><i data-face="[可怜]" class="face_2 face icon_12" data-sudaclick="comment_send_face"></i><i data-face="[打哈气]" class="face_2 face icon_13" data-sudaclick="comment_send_face"></i></div>');

    html.push('<div class="content-tab-face swiper-slide"><i data-face="[挤眼]" class="face_2 face icon_14" data-sudaclick="comment_send_face"></i><i data-face="[失望]" class="face_2 face icon_15" data-sudaclick="comment_send_face"></i><i data-face="[顶]" class="face_2 face icon_16" data-sudaclick="comment_send_face"></i><i data-face="[疑问]" class="face_2 face icon_17" data-sudaclick="comment_send_face"></i><i data-face="[困]" class="face_2 face icon_18" data-sudaclick="comment_send_face"></i><i data-face="[感冒]" class="face_2 face icon_19" data-sudaclick="comment_send_face"></i><i data-face="[拜拜]" class="face_2 face icon_20" data-sudaclick="comment_send_face"></i><i data-face="[黑线]" class="face_2 face icon_21" data-sudaclick="comment_send_face"></i><i data-face="[阴险]" class="face_2 face icon_22" data-sudaclick="comment_send_face"></i><i data-face="[互粉]" class="face_2 face icon_23" data-sudaclick="comment_send_face"></i><i data-face="[心]" class="face_2 face icon_24" data-sudaclick="comment_send_face"></i><i data-face="[伤心]" class="face_2 face icon_25" data-sudaclick="comment_send_face"></i><i data-face="[猪头]" class="face_2 face icon_26" data-sudaclick="comment_send_face"></i><i data-face="[熊猫]" class="face_2 face icon_27" data-sudaclick="comment_send_face"></i><i data-face="[兔子]" class="face_3 face icon_0" data-sudaclick="comment_send_face"></i><i data-face="[握手]" class="face_3 face icon_1" data-sudaclick="comment_send_face"></i><i data-face="[作揖]" class="face_3 face icon_2" data-sudaclick="comment_send_face"></i><i data-face="[赞]" class="face_3 face icon_3" data-sudaclick="comment_send_face"></i><i data-face="[耶]" class="face_3 face icon_4" data-sudaclick="comment_send_face"></i><i data-face="[good]" class="face_3 face icon_5" data-sudaclick="comment_send_face"></i><i data-face="[弱]" class="face_3 face icon_6" data-sudaclick="comment_send_face"></i></div>');

    html.push('<div class="content-tab-face swiper-slide"><i data-face="[不要]" class="face_3 face icon_7" data-sudaclick="comment_send_face"></i><i data-face="[ok]" class="face_3 face icon_8" data-sudaclick="comment_send_face"></i><i data-face="[haha]" class="face_3 face icon_9" data-sudaclick="comment_send_face"></i><i data-face="[来]" class="face_3 face icon_10" data-sudaclick="comment_send_face"></i><i data-face="[威武]" class="face_3 face icon_11" data-sudaclick="comment_send_face"></i><i data-face="[鲜花]" class="face_3 face icon_12" data-sudaclick="comment_send_face"></i><i data-face="[钟]" class="face_3 face icon_13" data-sudaclick="comment_send_face"></i><i data-face="[浮云]" class="face_3 face icon_14" data-sudaclick="comment_send_face"></i><i data-face="[飞机]" class="face_3 face icon_15" data-sudaclick="comment_send_face"></i><i data-face="[月亮]" class="face_3 face icon_16" data-sudaclick="comment_send_face"></i><i data-face="[太阳]" class="face_3 face icon_17" data-sudaclick="comment_send_face"></i><i data-face="[微风]" class="face_3 face icon_18" data-sudaclick="comment_send_face"></i><i data-face="[下雨]" class="face_3 face icon_19" data-sudaclick="comment_send_face"></i><i data-face="[给力]" class="face_3 face icon_20" data-sudaclick="comment_send_face"></i><i data-face="[神马]" class="face_3 face icon_21" data-sudaclick="comment_send_face"></i><i data-face="[围观]" class="face_3 face icon_22" data-sudaclick="comment_send_face"></i><i data-face="[话筒]" class="face_3 face icon_23" data-sudaclick="comment_send_face"></i><i data-face="[奥特曼]" class="face_3 face icon_24" data-sudaclick="comment_send_face"></i><i data-face="[草泥马]" class="face_3 face icon_25" data-sudaclick="comment_send_face"></i><i data-face="[萌]" class="face_3 face icon_26" data-sudaclick="comment_send_face"></i><i data-face="[囧]" class="face_3 face icon_27" data-sudaclick="comment_send_face"></i></div>');

    html.push('<div class="content-tab-face swiper-slide"><i data-face="[织]" class="face_4 face icon_0" data-sudaclick="comment_send_face"></i><i data-face="[礼物]" class="face_4 face icon_1" data-sudaclick="comment_send_face"></i><i data-face="[喜]" class="face_4 face icon_2" data-sudaclick="comment_send_face"></i><i data-face="[围脖]" class="face_4 face icon_3" data-sudaclick="comment_send_face"></i><i data-face="[音乐]" class="face_4 face icon_4" data-sudaclick="comment_send_face"></i><i data-face="[绿丝带]" class="face_4 face icon_5" data-sudaclick="comment_send_face"></i><i data-face="[蛋糕]" class="face_4 face icon_6" data-sudaclick="comment_send_face"></i><i data-face="[蜡烛]" class="face_4 face icon_7" data-sudaclick="comment_send_face"></i><i data-face="[干杯]" class="face_4 face icon_8" data-sudaclick="comment_send_face"></i><i data-face="[男孩儿]" class="face_4 face icon_9" data-sudaclick="comment_send_face"></i><i data-face="[女孩儿]" class="face_4 face icon_10" data-sudaclick="comment_send_face"></i><i data-face="[肥皂]" class="face_4 face icon_11" data-sudaclick="comment_send_face"></i><i data-face="[照相机]" class="face_4 face icon_12" data-sudaclick="comment_send_face"></i><i data-face="[浪]" class="face_4 face icon_13" data-sudaclick="comment_send_face"></i><i data-face="[沙尘暴]" class="face_4 face icon_14" data-sudaclick="comment_send_face"></i></div>');

    html.push('</div>');

    html.push('<div class="swiper-pagination"></div>');

    html.push('</div>');

    html.push('</div>');

    return html;

}

Comment.prototype.noScroll = {

        y: 0 ,//手指走过的距离

        disY:0,//记录每次触touchmove时的初始距离

        scrollTop:0,

        startBool:false,

        init:function(s_float,scroll_float,noscroll_float){

            var self = this; 

            self.touchstart(s_float,scroll_float);            

            noscroll_float.on("touchmove",function(e){//禁止背景层的滚动

                e.preventDefault();

                e.stopPropagation();          

            });

        },

        touchstart:function(s_float,scroll_float){

            var self = this;                                

            if(!self.startBool){//保证在一次touchstart未结束时，不能开启第二次start，也就是解决两个手指以上会乱跳的问题

                scroll_float.bind("touchstart",function(e){

                    self.y = 0;//手指划过的距离清空

                    self.startBool = true;

                    self.scrollTop = scroll_float[0].scrollTop

                    self.disY =e.changedTouches[0].pageY;

                    self.touchmove(s_float,scroll_float);

                    self.touchend(s_float,scroll_float);

                       

                });

            }

        },

        touchmove:function(s_float,scroll_float){

            var  self = this;

            scroll_float.bind("touchmove",function(e){

                e.preventDefault();

                e.stopPropagation(); 

                self.y += e.changedTouches[0].pageY - self.disY;    

                if(scroll_float.height()+scroll_float.get(0).scrollTop>=scroll_float.get(0).scrollHeight&&self.y<0) {

                    //滑到底部

                    self.y = 0;

                    return;

                    

                }else if(scroll_float.get(0).scrollTop === 0&&self.y>0){

                    //滑到顶部

                    self.y = 0;

                    return ;

                }else{

                    self.v0 = (e.changedTouches[0].pageY - self.disY)/5;

                    scroll_float[0].scrollTop=self.scrollTop-self.y ;   

                    

                    self.disY = e.changedTouches[0].pageY; 

                }                                

            });

        },

        touchend:function(s_float,scroll_float){

 

            scroll_float.bind('touchend', function(e) {

                scroll_float.unbind('touchmove');

                scroll_float.unbind('touchend');

            }); 

            _this.noScroll. startBool = false;

        }        

    }

Comment.prototype.commentList = function() {

    _this.login(_commentList);

    function _commentList() {

        this.screenScroll = document.body.scrollTop || document.documentElement.scrollTop;

        window.scrollTo(0, 1);

        var cmtList = $('.cmtList');

        $('.cmtList').show();

        // $('.foot_comment').hide();

        $('.kcmnt_list').css({"min-height":"800px"});

        cmtList.addClass("animate");

        cmtList.css({"left":"0"});

        _this.author = __docConfig.__docid.split('-')[0];

        _this.page = _this.oLoader.attr('data-page') || 1;

        $.ajax({

            type: "GET",

            cache: false,

            url: "http://cmnt.sina.cn/aj/v2/index",

            // data: {

            //     product: "comos", 

            //     group: 0,

            //     index: "fxwztrt0012691",

            //     page: 2

            // },

            data: {

                product: CMNT.product, 

                group: CMNT.index,

                index: (CMNT.index || __docConfig.__docId),

                page: _this.page

            },

            dataType: "jsonp",

            jsonp:"_callback",

            jsonpCallback: "Getjsonp",

            success:function(data){

                    _this.Juge = false;

                    _this.oLoader.attr('data-page', parseInt(_this.page) + 1);

                    var sTop = 0;

                    var cmtList = $('.cmtList');

                    cmtList.attr('data-id','yes');

                    _this.oImg = $('.looaImg');

               

                    var sum= data.data.total;

                    var data = data.data.data;

                    _this.html = [];

                    var total = data.length;

                    var sum = '评论('+ sum +')';

                    $('.kcmnt_header_tit').html(sum)

                    if (total>0) {

                        _this._templt(total,data);

                    }else{

                         setTimeout(function(){

                            $('.kcmnt_list').html('<div class="noComment">暂无评论！</div>')

                        },1000);

                    }

                    

                    $('body').hide();

                    cmtList.css({"position":"relative !important"});

                    _this.oMore = $('.comment_more');

                    var kcmntListview = $('.kcmntListview');

                    /*

                        监听页面的滚动事件

                     */

                    document.addEventListener('scroll',_this._judgeMore,false);

                    document.addEventListener('scroll',function(){

                        sTop = document.body.scrollTop || document.documentElement.scrollTop;

                        if (sTop<100 ) {

                            _this._pullClose()

                        }else{

                        }

                    },false);

                   $('.kcmnt_fixed_reply_input_gu').on('click',function(){
                    // alert("shu");

                       $('.kcmnt_review  .rviewSend').attr('data-com','true');

                       $('.kcmnt_review').css({"display":"block"})

                       _this.changSize();

                       $('.kcmnt_review .kcmnt_fixed_reply_input')[0].focus();

                   });

                   $(".kcmnt_list").delegate(".j_favor_single","click",function(){

                        var self = $(this);

                        var zan = self.attr('zan');

                        var cmntItem = self.parents('.kcmnt_list_item'),

                            mid = cmntItem.attr('data-mid');

                        var sum = parseInt(self.find('.cmnt_good_num').html());

                        var num = self.find('.cmnt_good_num');

                        self.find('.icon_ding').css({"color":"rgb(243, 203, 203)"});

                        $.ajax({

                            type: "POST",

                            cache: false,

                            url: "http://cmnt.sina.cn/aj/cmnt/vote?tj_ch=ent",

                            data: { product: CMNT.product, index: (CMNT.index || __docConfig.__docId), csrfcode: CMNT.csrfcode, csrftime: CMNT.csrftime,  mid: mid },

                            

                            xhrFields: {

                                withCredentials: true

                             },

                            success:function(data){

                                if (data.data) {

                                    if (zan === 'false') {

                                        num.html(sum+1);

                                        self.attr('zan','true');

                                    }

                                   

                                    // _this._tipShow('点赞成功');

                                }else{

                                    _this._tipShow(data.data);

                                }

                                

                            },

                            error:function(f){

                            }

                        });

                    });

                   $('.kcmnt_main').delegate('.kcmnt_fixed_reply_input','focus',function(){

                        $('.kcmnt_main .cmnt_tablist').css({"display":"none"});

                        $('.kcmnt_main .kcmnt_fixed_reply').css({"height":"250px;"});

                    });

                   $('.kcmnt_main').delegate('.kcmnt_fixed_reply_input','blur',function(){

                        _this.changSize();

                    });

                

                    $(".kcmnt_list").delegate(".kcmnt_list_view","click",function(e){

                        _this.Juge = true;

                        var parents = $(this).parents('.kcmnt_list_item');

                        _this.noScroll.init('kcmntListview',parents.find('.kcmntListview'),$('.kcmnt_list'));

                        parents.find('.kcmnt_view').show();

                        parents.find(".kcmnt_fixed_view").show();

                        parents.find(".kcmnt_fixed_view").addClass("fixedAnimate");

                        parents.find(".kcmnt_fixed_view").css({"bottom":"0"});

                        window.event?e.cancelBubble=true:e.stopPropagation()

                    });

                     $('.fixed_box').on('click',function(e){

                        _this.shield_cancel(e);

                    })

                    $(".f_shield_list").delegate(".f_shield_list_li","click",function(e){

                        var parents = $(this).parent('.f_shield_list');

                        parents.find('.f_shield_list_link').css({

                            "color":"#444",

                            "border":"1px solid #e4e4e4"

                        })

                        _this.tp =  $(this).attr('type');

                        $(this).find('.f_shield_list_link').css({

                            "color":"#ff5a60",

                            "border":"1px solid #ff5a60"

                        });

                        if (e.stopPropagation) { 

                            //W3C 

                            e.stopPropagation(); 

                        } 

                        else { 

                            //IE 

                            e.cancelBubble = true; 

                        }

                    });

                    $(".kcmnt_list").delegate(".j_report","click",function(e){

                        var targetY = getY(e);

                        var parents = $(this).parents('.kcmnt_list_item');

                        _this.mid = parents.attr('data-mid');

                        _this.cont = parents.attr('data-wb_content');

                        _this.comment = parents.attr('data-content');

                        var cHeight = document.documentElement.clientHeight;

                        var fixed_box = $('.fixed_box');

                        var targetBotton = cHeight - targetY;

                        var f_shield  = $('.f_shield');

                         fixed_box.show();

                        _this.noScroll.init('f_shield',$('.f_shield'),$('.fixed_box'));

                        if(targetBotton<200){

                            f_shield.removeClass('f_shield_top');

                            f_shield.addClass('f_shield_top_other');

                            f_shield.css({"top":cHeight - (targetBotton + 130)});

                           

                        }else if(targetBotton>200){

                            f_shield.removeClass('f_shield_top_other');

                            f_shield.addClass('f_shield_top');

                            f_shield.css({

                                "top":targetY,

                            }); 

                        }

                       

                        function mousePosition(evt){

                            evt = evt || window.event;

                            //Mozilla 

                            if(evt.offsetLeft || evt.offsetTop){

                                return { x : evt.offsetLeft,y : evt.offsetTop}

                            }

                            //IE 

                            return {

                                x : evt.clientX ,

                                y : evt.clientY 

                            }

                        }

                        //获取X轴坐标 

                        function getX(evt){

                            evt = evt || window.event;

                            return mousePosition(evt).x;

                        }

                        //获取Y轴坐标 

                        function getY(evt){

                            evt = evt || window.event;

                            return mousePosition(evt).y;

                        }

                    });

                    $('.f_shield_cancel').on('click',function(e){

                        _this.shield_cancel(e);

                    })

                    $('.f_shield_sure').on('click',function(){

                        _this.url = window.location.href;

                        if (!_this.tp) {

                            _this._tipShow('选择一个举报类型');

                        }else{

                            $.ajax({

                                type: "GET",

                                cache: false,

                                url: "http://o.cmnt.sina.cn/v2/charge",

                                data: {

                                    mid: _this.mid, 

                                    content: _this.cont,

                                    url:_this.url,

                                    csrfcode:CMNT.csrfcode, 

                                    csrftime: CMNT.csrftime,

                                    type:_this.tp

                                },

                                dataType: "jsonp",

                                jsonp:"_callback",

                                jsonpCallback: "Getjsonp",

                                success:function(data){

                                    if(data.status == 1){

                                        

                                        _this._tipShow('举报成功')

                                    }

                                    setTimeout(function(){

                                        $('.fixed_box').hide();

                                        _this.tp = false;

                                    },1000)

                                    

                                    

                                },

                                error:function(f){

                                    

                                _this._tipShow('举报失败')

                                setTimeout(function(){

                                    $('.fixed_box').hide();

                                },1000)

                                }

                            });

                        }

                        $('.f_shield_list .f_shield_list_link').css({

                            "color":"#444",

                            "border":"1px solid #e4e4e4"

                        })

                    });

                     $('.kcmnt_main .kcmnt_fixed_reply_input').limitTextarea(_this.mainTextarea);

                    //下拉关闭功能

                    _this._pullClose()

            },

            error:function(){

                setTimeout(function(){

                    $('.kcmnt_list').html('<div class="noComment">请求出错</div>')

                },1000);

                

            }

        });

    };

};

Comment.prototype.shield_cancel = function(e){

    var fixed_box = $('.fixed_box');

    $('.f_shield_list').find('.f_shield_list_link').css({

        "color":"#444",

        "border":"1px solid #e4e4e4"

    })

    if (!_this.Juge) {

        $('.kcmnt_list').unbind('touchmove');

    }

    _this.tp = false;

    fixed_box.hide();

    if (e.stopPropagation) { 

                            //W3C 

        e.stopPropagation(); 

    } 

    else { 

                            //IE 

        e.cancelBubble = true; 

    }

}

Comment.prototype._articleComment = function(e){

    _this.login(_articleComment);

    function _articleComment(){

        $(' .kcmnt_review .kcmnt_fixed_reply_input').attr('placeholder', "说说你的看法");

        $('.kcmnt_review').show();

        $('.kcmnt_review .kcmnt_fixed_reply_input')[0].focus();

    }

}

Comment.prototype._cmtListClose = function(){

    $('.cmtList').attr('data-id',' '); 

    $('.foot_comment').css('display')

    var dis = $('.foot_comment').css('display');

    if(dis &&  dis ==='none'){

        $('.foot_comment').hide();

    }else{

        $('.foot_comment').show();

    }

    $('body').show();

    _this.oLoader.attr('data-page',1);

    $('.cmtList').removeClass("animate");

    $('.kcmnt_list').css({"min-height":"0px"})

    $('.cmtList').css({"left":"-540px"});

    $('.cmtList').hide();

    $('.kcmnt_list').html(" ");

    var img = [];

    img.push('<img class="looaImg" src="http://mjs.sinaimg.cn/wap/online/dpool/wemedia/images/load.gif">');

    $('.kcmnt_list').append(img.join(''));

    var moreImg = [];

    moreImg.push('<img src="http://mjs.sinaimg.cn/wap/online/dpool/wemedia/images/load.gif">');

    _this.oMore.html(" ");

    _this.oMore.append(moreImg.join(' '));

    document.removeEventListener('scroll', _this._judgeMore, false);

}

Comment.prototype._pullClose = function(){

    _this.oCmtList = $('.kcmnt_list')[0];

    _this.header = $('.comment_header')[0];

    _this.cmtList  = $('.cmtList');

    _this.slider = {

        //判断设备是否支持touch事件

        touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,

        slider:$('.cmtList')[0],

        //事件

        events:{

            index:0, //显示元素的索引

            slider:this.slider, //this为slider对

        handleEvent:function(event){

            var self = this; //this指events对象

            if(event.type == 'touchstart'){

                self.start(event);

            }else if(event.type == 'touchmove'){

                self.move(event);

            }else if(event.type == 'touchend'){

                self.end(event);

            }

        },

        //滑动开始

        start:function(event){

            var touch = event.targetTouches[0];

            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date}; 

            isScrolling = 0; 

            _this.oCmtList.addEventListener('touchmove',this,false);

            _this.oCmtList.addEventListener('touchend',this,false);

            _this.header.addEventListener('touchmove',this,false);

            _this.header.addEventListener('touchend',this,false);

        },

        move:function(event){

            sTop = document.body.scrollTop || document.documentElement.scrollTop;

            if (sTop < 100) {

                if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;

                var touch = event.targetTouches[0];

                endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};

                isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;

                if(isScrolling === 1){

                    if(endPos.y>0){

                        var speed = endPos.y/9;

                        speed = speed = speed>0?Math.ceil(speed):Math.floor(speed);

                        event.preventDefault();

                        _this.cmtList.css({"top":speed+"px"});

                    }else{

                        _this.cmtList.css({"top":"0px"})

                    }

                }

            }else{

                _this.oCmtList.removeEventListener('touchmove',this,false);

                _this.oCmtList.removeEventListener('touchend',this,false);

                _this.oCmtList.removeEventListener('touchstart',this,false);

                _this.header.removeEventListener('touchmove',this,false);

                _this.header.removeEventListener('touchend',this,false);

                _this.header.removeEventListener('touchstart',this,false);

            }

                

        },

        end:function(event){

            var duration = +new Date - startPos.time; 

            if(isScrolling === 1){ 

                if(Number(duration) > 10){

                    if(endPos.y < 100){

                       _this.cmtList.css({"top":"0px"});

                    }

                    else if(endPos.y > 100){

                        _this._cmtListClose();

                        _this.cmtList.css({"top":"0px"});

                    }

                }

            }

            _this.oCmtList.removeEventListener('touchmove',this,false);

            _this.oCmtList.removeEventListener('touchend',this,false);

            _this.header.removeEventListener('touchmove',this,false);

            _this.header.removeEventListener('touchend',this,false);

        }

        },

        init:function(){

            var self = this; 

            if(!!self.touch){

                _this.oCmtList.addEventListener('touchstart',self.events,false);

                _this.header.addEventListener('touchstart',self.events,false);

            } 

        }

    };

    _this.slider.init();

}           

Comment.prototype._addFloat =function(){

    if($('.cmnt_wrap').length>0){

        return;

    }

    var arr=[];

    arr.push('<div class="cmnt_wrap">');

    arr.push('<div class="cmnt_tp">');

    arr.push('<span class="fl"><a href="javascript:void(0);" class="cmnt_cancel" id="j_cmnt_cancel" data-sudaclick="'+ commentConfig.suda+'_send_cancel">取消</a></span>');

    arr.push('<span class="fr"><a href="javascript:void(0);" class="cmnt_smt" id="j_cmnt_smt" data-sudaclick="'+ commentConfig.suda+'_send_cmnt">发送</a></span>');

    arr.push('</div>');

    arr.push('<div class="cmnt_login">');

    arr.push('<span class="fl"><img src="'+ commentConfig.user.userface +'">'+ commentConfig.user.usernick +'</span>');

    arr.push('<span class="fr"><a href="'+ commentConfig.logout.switchurl +'">切换账号</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;<a href="'+ commentConfig.logout.logouturl +'">登出</a>');

    arr.push('</span></div>');

    arr.push('<div class="cmntarea">');

    arr.push('<textarea id="j_cmnt_input" class="newarea" name="" placeholder="'+ commentConfig.comtTitle +'"></textarea>');

    arr.push('</div>');

    arr.push('<div class="cmnt_bm">');

    arr.push('<span class="fl"><input type="checkbox" id="j_wb_sendcont" name="" value="1" checked>&nbsp;&nbsp;同时转发到微博</span>');

    arr.push('</div></div>');

    this.oCmtArea.append(arr.join(''));

    this.oTextarea=$('#j_cmnt_input');

    this.oWb_sendcont = $('#j_wb_sendcont');

    var _this =this;

    if(_this.oWb_sendcont.length>0){

        

        if(getCookie('commentCheck')=='0'){

            

        

            _this.oWb_sendcont[0].checked = '';

        }

        

        

        if($('#j_input_check').length>0){

            $('#j_input_check').on('click',function(){

                if(this.checked){

                    setCookie('commentCheck','1');

                    _this.oWb_sendcont[0].checked = 'checked';

                }

                else{

                    setCookie('commentCheck','0');

                    _this.oWb_sendcont[0].checked = '';

                }

            })

        }

        _this.oWb_sendcont.on('click',function(){

            if(this.checked){

                

                setCookie('commentCheck', '1', 999);

                if($('#j_input_check').length>0){

                    $('#j_input_check')[0].checked = 'checked';

                }

            }

            else{

                

                setCookie('commentCheck','0', 999);

                if($('#j_input_check').length>0){

                    $('#j_input_check')[0].checked = '';

                }

            }

        })

        function setCookie(name, value, expires, path, domain, secure) {

            var oDate=new Date();

            oDate.setDate(oDate.getDate()+expires);

           

            

            document.cookie = name + "=" + escape(value) +

                ((expires) ? "; expires=" + oDate : "") +

                "; path=/" +

                "; domain=sina.cn";

        }

        function getCookie (ckName) {

            if (undefined == ckName || "" == ckName) {

                return false;

            }

            return stringSplice(document.cookie, ckName, ";", "");

        }

        function stringSplice(src, k, e, sp) {

            if (src == "") { return ""; }

            sp = (sp == "") ? "=" : sp;

            k += sp;

            var ps = src.indexOf(k);

            if (ps < 0) {

                return "";

            }

            ps += k.length;

            var pe = src.indexOf(e, ps);

            if (pe < ps) {

                pe = src.length;

            }

            return src.substring(ps, pe);

        }

    }

}

Comment.prototype._tipShow = function(txt) {

    var oTips = $('#tipsCeng');

     oTips.find('.marker_t').html(txt);

     oTips.show();

    setTimeout(function() {

       oTips.hide();

    }, 1000)

};

Comment.prototype._templt = function(total,data){

    var html = [];

    var comment = null;

    var huifu = null;

    if(total== 0){

        setTimeout(function(){

               _this.oMore.html("没有更多了");

        },2000)

  

        document.removeEventListener('scroll',_this._judgeMore,false);

    }else{

        for (var i = 0; i < total; i++) {

           comment = _this.resolveFace(data[i].main.content);

           html.push(' <div data-mid="'+data[i].main.mid+'"  data-wb_content="'+data[i].main.content+'" data-nick="'+data[i].main.nick+'" data-wbname="'+data[i].main.wbname+'" data-wbuser="'+data[i].main.wbname+'"class="kcmnt_list_item">');

           html.push(' <img src="' + data[i].main.face +'" class="kcmnt_list_face" alt="">');

           html.push(' <h2 class="kcmnt_list_h2"><strong class="kcmnt_list_name">' + data[i].main.nick + '</strong>');

           if (data[i].main.uid === _this.author) {

               html.push('<mark class="kcmnt_list_author">作者</mark>')

            }

           html.push('</h2>')

           html.push(' <time class="kcmnt_list_time">' + data[i].main.time + '</time>');

           html.push(' <p class="kcmnt_list_txt">' + comment + '</p>')

           html.push(' <div class="kcmnt_list_op">');

           html.push('<a href="javascript:void(0);" class="cmnt_report j_report">举报</a>');

           var reply = data[i].reply;

            if (reply.length > 0) {

                 html.push(' <span class="kcmnt_list_view")><em class="icon_view"></em>查看对话</span>');

            }

           html.push(' <span class="kcmnt_list_cmnt"><em class="icon_comment"></em>回复</span>');

           html.push(' <span class="cmnt_good j_favor_single" zan="false"><em class="icon_ding"></em><span class="cmnt_good_num">'+ data[i].main.agree+'</span></span> ');

           html.push(' </div>');

           if (reply.length > 0) {

                html.push('<section class="kcmnt_view">');

                html.push('<section class="kcmnt_fixed_view">');

                html.push('<section class="kcmntListview">');

                for (var j = 0; j < reply.length; j++) {

                    huifu = _this.resolveFace(reply[j].content);

                    html.push('<div data-mid="'+reply[j].mid+'"  data-wb_content="'+reply[j].content+'" data-nick="'+reply[j].nick+'" data-wbname="'+reply[j].wbname+'" data-wbuser="'+reply[j].wbname+'" class="kcmnt_list_item">');

                    html.push('<img src="'+reply[j].face +'" class="kcmnt_list_face" alt="">');

                    html.push('<h2 class="kcmnt_list_h2"><strong class="kcmnt_list_name">'+ reply[j].wbname +'</strong>');

                    if(reply[j].uid === _this.author){

                        html.push('<mark class="kcmnt_list_author">作者</mark>');

                    }

                    html.push('<time class="kcmnt_list_ftime">'+reply[j].time +'</time>')

                    html.push('</h2>')

                    html.push('<p class="kcmnt_list_txt">'+ huifu +'</p>');

                    html.push('<div class="kcmnt_list_op">');

                    html.push('<a href="javascript:void(0);" class="cmnt_report j_report">举报</a>');

            

                    html.push('<span class="kcmnt_list_cmnt"><em class="icon_comment"></em>回复</span>');

                    html.push(' <span class="cmnt_good j_favor_single" zan="false"><em class="icon_ding"></em><span class="cmnt_good_num">'+ data[i].main.agree+'</span></span> ');

                    html.push('</div>');

                    html.push('</div>');

                    

                }

                html.push('</section>');

                html.push(' <a href="javascript:;" class="close kcmnt_review_close kcmnt_worid_close icon_close_1"></a>')

                html.push('</section>');

                html.push('</section>');

           }

           html.push(' </div>');

        };

       setTimeout(function(){

            _this.oImg.hide();

            $('.comment_more').hide();

            $('.kcmnt_list').append(html.join(''));

            html = [];

        },1000)

    }

}

Comment.prototype._addEvent=function ()

{

    this.oShare =$('.'+ this.shareBtn),

    this.oComment =$('.j_p_comt'),

    this.oCmtText =$('.j_cmt_btn'),

    this.oCmtArea=$('#j_cmnt_pop'),

    this.oMainWrap =this.options.main,

    this.oSucTips=$('#tipsCeng'),

    this.oreplybtn=$('.replybtn'),

    this.owb_ico=$('.wb_ico');

    this.oFoot_comment=$('.foot_comment');

    this.oCmnt_login = $('.cmnt_login');

    this.oWb_sendcont = $('#j_wb_sendcont');

    this.focusStatus = 0;

    oViedo = $('video');

    var _this=this;

   window.onresize = function(){

     _this.changSize();

   }

    $(".header_back").on("click",function(e){

        _this._cmtListClose();

        window.event?window.event.canceBubble = true:e.stopPropagation();

    });

    $('.kcmnt_list').delegate('.kcmnt_worid_close','click',function(){

        _this.Juge = false;

        $('.kcmnt_main .rviewSend').css({"background":"rgb(202, 202, 202)"});

        

   

        $('.kcmnt_main .kcmnt_fixed_reply_input').val(' ');

       

        $(".kcmnt_list").unbind("touchmove");

        $(this).parents('.kcmnt_view').hide();

    })

    $('.kcmnt_review').delegate('.swiper-wrapper','click',function(t){

    

        if ($(t.target).attr("data-face")) {

            $('.kcmnt_review .kcmnt_fixed_reply_input')[0].value += $(t.target).attr("data-face");

            _this.viewTextarea();

        };

       

    });

    $('.kcmnt_review').delegate('.kcmnt_fixed_reply_input','focus',function(t){

        $('.kcmnt_review .cmnt_tablist').css({"display":"none"});

        $('.kcmnt_review .kcmnt_fixed_reply').css({"height":"250px;"});

    })

    $('.kcmnt_review').delegate('.kcmnt_fixed_reply_input','blur',function(t){

        _this.changSize();

    })

    $('.kcmnt_main').delegate('.swiper-wrapper','click',function(t){

        if ($(t.target).attr("data-face")) {

             $('.kcmnt_main .kcmnt_fixed_reply_input')[0].value += $(t.target).attr("data-face");

            _this.mainTextarea();

        };

    });

    $('.kcmnt_review').delegate('.biaoqing','click',function(){

        var status = $(this).attr("biao");

        if(status == 'false'){

            $(this).attr("biao",'true');

            $('.kcmnt_review .kcmnt_fixed_reply').css({

                "height":"385px"

            });

            $('.cmnt_tablist').show();

        }else{

            $(this).attr("biao",'false');

            $('.cmnt_tablist').hide();

        }

        _this.changSize();

       

    });

    $('.kcmnt_main').delegate('.biaoqing','click',function(){

        var status = $(this).attr("biao");

        if(status == 'false'){

            $(this).attr("biao",'true');

            $('.kcmnt_main .kcmnt_fixed_reply').css({

                "height":"385px"

            });

            $('.cmnt_tablist').show();

        }else{

            

            $(this).attr("biao",'false');

            $('.cmnt_tablist').hide();

        }

        _this.changSize();

       

    })

    // $('.kcmnt_review .kcmnt_fixed_reply_input')[0].addEventListener('valuechange',function(e){

    //     alert("sadsd");

    //     var oInput =  $('.kcmnt_review .kcmnt_fixed_reply_input');

    //     var cmtListJuge = $('.kcmnt_view').css("display");

    //     var val = oInput.val();

    //     if (!val && !val.trim()) {

    //         $('.kcmnt_review .rviewSend').css({"background":"#cacaca"});

    //     }

    //     if (val && val.trim() !== ' ') {

    //         $('.kcmnt_review .rviewSend').css({"background":"#ff6965"});

    //     }

    // })

    var mainText =  $('.kcmnt_main .kcmnt_fixed_reply_input')[0];

    var viewText =  $('.kcmnt_review .kcmnt_fixed_reply_input')[0];

    if (window.addEventListener) { //先执行W3C

        mainText.addEventListener("input", _this.mainTextarea(), false);

        viewText.addEventListener("input", _this.viewTextarea(), false);

    } else {

        mainText.attachEvent("onpropertychange", _this.mainTextarea());

        viewText.attachEvent("onpropertychange", _this.viewTextarea());

    }

    if (window.VBArray && window.addEventListener) { //IE9;

        mainText.attachEvent("onkeydown", function() {

            var key = window.event.keyCode;

            (key == 8 || key == 46) && _this.mainTextarea(); //处理回退与删除

        });

        viewText.attachEvent("onkeydown", function() {

            var key = window.event.keyCode;

            (key == 8 || key == 46) && _this.viewTextarea(); //处理回退与删除

        });

        mainText.attachEvent("oncut", _this.mainTextarea()); //处理粘贴

        viewText.attachEvent("oncut", _this.viewTextarea()); //处理粘贴

    }

    $.fn.limitTextarea = function(fn) {

        this.each(function() {

            var self = $(this);

            if (window.addEventListener) { //先执行W3C

                self.get(0).addEventListener("input", fn, false);

            } else {

                self.get(0).attachEvent("onpropertychange", fn);

            }

            if (window.VBArray && window.addEventListener) { //IE9

                self.get(0).attachEvent("onkeydown", function() {

                    var key = window.event.keyCode;

                    (key == 8 || key == 46) && fn(); //处理回退与删除

                });

                self.get(0).attachEvent("oncut", fn); //处理粘贴

            }

        });

    }

    $('.kcmnt_review .kcmnt_fixed_reply_input').limitTextarea(_this.viewTextarea);

    $('.kcmnt_review .rviewSend').on('click',function(){

        var oInput =  $('.kcmnt_review .kcmnt_fixed_reply_input');

        // var cmtListJuge = $('.kcmnt_view').css("display");

        var val = oInput.val();

        if (!val && !val.trim()) {

            _this._tipShow('请输入评论内容');

                // $('.kcmnt_review').hide();

                 $('html').css({"overflow":"auto"});

            return;  

        }

        else if (val.indexOf('script') != -1) {

            $('.kcmnt_review .rviewSend').css({"background":"#cacaca"});

            _this._tipShow('请您检查输入内容');

   

                $('.kcmnt_review').hide();

                 $('html').css({"overflow":"auto"});

            return;

        }

        else {

            _this._commentSuccess(val,_this.Juge);

            $('.kcmnt_review .rviewSend').attr('data-com','false');

    

            $('.kcmnt_review .rviewSend').css({"background":"#cacaca"});

            _this.sending = 0;

 

        }

        $('#checkbox-1').prop('checked',false);

    })       

    $('.kcmnt_main').delegate('.rviewSend','click',function(){

        var oInput =  $('.kcmnt_main .kcmnt_fixed_reply_input');

        var val = oInput.val();

        if (!val || !val.trim()) {

           _this._tipShow('请输入评论内容');

            if (!_this.Juge) {

  

                    // $('.kcmnt_main').hide();

                    $('.kcmnt_list').unbind('touchmove');

   

            }

            return;  

        }

        else if (val.indexOf('script') != -1) {

            $('.kcmnt_main .rviewSend').css({"background":"#cacaca"});

           _this._tipShow('请您检查输入内容');

            if (!_this.Juge) {

                $('.kcmnt_main').hide();

                $('.kcmnt_list').unbind('touchmove');

            }

            return;

        }

        else {

            _this._commentSuccess(val,_this.Juge);

                $('.kcmnt_main .rviewSend').css({"background":"#cacaca"});

                // $('.kcmnt_main').hide();

                _this.sending = 0;

        }

        $('#checkbox-2').prop('checked',false);

    })

    // $('.kcmnt_review .j_cmnt_tablist').addEventListener('touchmove',function(){

    // })

    //关闭回复按钮

    $('.kcmnt_fixed_close').on('click', function() {

        $('.kcmnt_review .rviewSend').css({"background":"rgb(202, 202, 202)"});

        $('.kcmnt_review .rviewSend').attr('data-com','false');

        $('.kcmnt_review .kcmnt_fixed_reply_input').val("");

        $('.kcmnt_review .kcmnt_fixed_reply_input')[0].blur();

        $('.kcmnt_review').hide();

        $('.kcmnt_review .kcmnt_fixed_reply').css({"height":"250px;"});

        $('.j_cmnt_tablist').hide();

        $('#checkbox-1').prop('checked',false);

    });

    $('.cmtList .kcmnt_view_close').on('click',function(){

        $('.kcmnt_main .rviewSend').css({"background":"rgb(202, 202, 202)"});

        $('.kcmnt_main .kcmnt_fixed_reply_input').val("");

        $('.kcmnt_main .kcmnt_fixed_reply_input')[0].blur();

        $('.kcmnt_main .kcmnt_fixed_reply').css({"height":"250px;"});

        $('.j_cmnt_tablist').hide();

        // var cmtListJuge = $('.kcmnt_view').css('display');

        if (!_this.Juge) {

            $('.kcmnt_list').unbind('touchmove');

        }

        $('.kcmnt_main').hide();

        $('#checkbox-2').prop('checked',false);

    })

 //对评论的评论框

    $('.cmtList').delegate('.kcmnt_list_cmnt','click', function() {

        var parents = $(this).parents('.kcmnt_list_item');

        if (!_this.Juge) {

            _this.noScroll.init('kcmnt_main',$('.kcmnt_main'),parents.find('.kcmnt_fixed_view'));

            _this.noScroll.init('kcmnt_main',$('.kcmnt_main'),$('.kcmnt_list'));

        }else{

            _this.noScroll.init('kcmnt_main',$('.kcmnt_main'),$('.kcmnt_list'));

        }

            var cmntItem = $(this).parents('.kcmnt_list_item');

            var nick = '回复' + $(cmntItem).find('.kcmnt_list_name').eq(0).html()+ '：';

            $('.kcmnt_main .kcmnt_fixed_reply_input').attr('placeholder', nick);

            _this.mid = cmntItem.attr('data-mid'); 

            _this.nick = cmntItem.attr('data-nick'); 

            _this.wb_content =  cmntItem.attr('data-wb_content');

            _this.wbname = cmntItem.attr('data-wbname');     

        $('.kcmnt_main').css({"display":"block"});

        _this.changSize();

        $('.kcmnt_main .kcmnt_fixed_reply_input')[0].focus();


        window.event?window.event.canceBubble = true:e.stopPropagation();      

    });

    //文章下面的评论框

    // $('.j_cmt_btn').on('click tap',function(e){

    //      if ($('.cmtList ').attr('data-id') && $('.cmtList ').attr('data-id') != ' ') {

    //         var cmntItem = $(this).parents('.kcmnt_list_item');

    //         var nick = '回复' + $(cmntItem).find('.kcmnt_list_name').eq(0).html()+ '：';

    //         $('.kcmnt_fixed_reply_input').attr('placeholder', nick);

    //     }else{

    //         $('.kcmnt_fixed_reply_input').attr('placeholder', "说说你的看法");

    //     }

    //     $('.kcmnt_review').show();

    //     $('.kcmnt_fixed_reply_input').focus();

    //     window.event?window.event.canceBubble = true:e.stopPropagation();

    // });

    // //记录转发到微博

    addCommentlogin = (typeof(WapLogin)== 'function') ?(new WapLogin()):this;

    //文章下面的评论框

    this.oFoot_comment.on('click','.j_cmt_btn',function(e){

        $('.kcmnt_review .rviewSend').attr('data-com','true');

        _this.login(_this._oFootComment);

    });

    this.oComment.find('a').on('click',_this.commentList);

    // 给目标元素绑定登录浮层

    if(!window.ishare){

        // this.oFoot_comment.on('click','.'+ _this.shareBtn,function(ev){

        //  alert("dsfsd");

        //  if(!commentConfig.user.isLogin){

        //      addCommentlogin.login (false,function(){

        //          if(window.loginActive ==  _this.shareBtn){

        //              window.location.href = $('.'+ _this.shareBtn +' a').data('href');

        //          }

        //          commentConfig.user.isLogin=true;

        //          commentConfig.user.usernick = __userConfig__.__unick||commentConfig.dnick;

        //          commentConfig.user.userface = __userface = __userConfig__.__uface||commentConfig.dface;

                    

                    

        //          _this._addFloat();

        //          _this._addEvent();

        //      });

        //      window.loginActive =  _this.shareBtn;

        //      ev.preventDefault();

        //  }

        //  else{

        //      window.location.href = $('.'+ _this.shareBtn +' a').data('href');

        //  }

        // });

    }

    if(commentConfig.user.isLogin && commentConfig.user.userface==''){

         var url = 'http://passport.sina.cn/sso/islogin?entry=wapsso&';

        jsonp(url, {}, function (re){

            _this.oCmnt_login.find('img').attr('src',re.data.portrait_url);

        });

    }

    if(commentConfig.user.isLogin){

        var windowHeight = 223;

    }

    else{

        var windowHeight = 193;

    }

    if(!this.options.setTop){

        if($('#j_blankBox').length==0){

            this.oCmtArea.prepend('<div id="j_blankBox" style="width:100%; height:' + (document.documentElement.clientHeight-windowHeight+10) + 'px;"></div>');

        }

    }

    if(window.navigator.userAgent.toLowerCase().indexOf('ucbrowser')==-1){

    }

    else{

        this.oCmtArea.css('paddingBottom',20+'px');

    }

    this.oShare_layer = $('#sharebox');

    if(this.oShare_layer.length>0){

        this.oShare_layer.on('click',function(){

            if(oViedo.length>0){

                if(oViedo[0].getBoundingClientRect().bottom>0){

                    window.scrollTo(0, document.body.scrollTop+oViedo[0].getBoundingClientRect().bottom);

                }

            }

            window.removeEventListener("touchmove", prevent, false);

            _this.oFoot_comment.hide();

        });

    }

    function setCookie(name, value, expires, path, domain, secure) {

        var oDate=new Date();

        oDate.setDate(oDate.getDate()+expires);

        

        

        document.cookie = name + "=" + escape(value) +

            ((expires) ? "; expires=" + oDate : "") +

            "; path=/" +

            "; domain=sina.cn";

    }

    function getCookie (ckName) {

        if (undefined == ckName || "" == ckName) {

            return false;

        }

        return stringSplice(document.cookie, ckName, ";", "");

    }

    function stringSplice(src, k, e, sp) {

        if (src == "") { return ""; }

        sp = (sp == "") ? "=" : sp;

        k += sp;

        var ps = src.indexOf(k);

        if (ps < 0) {

            return "";

        }

        ps += k.length;

        var pe = src.indexOf(e, ps);

        if (pe < ps) {

            pe = src.length;

        }

        return src.substring(ps, pe);

    }

};

Comment.prototype._oFootComment = function(){

        $('.kcmnt_fixed_reply_input').attr('placeholder', "说说你的看法");

        $('.kcmnt_review').show();

        _this.changSize();

        $('.kcmnt_review .kcmnt_fixed_reply_input')[0].focus();

        window.event?window.event.canceBubble = true:e.stopPropagation();

}

Comment.prototype.mainTextarea  = function(){

        var oInput =  $('.kcmnt_main .kcmnt_fixed_reply_input');

        var cmtListJuge = $('.kcmnt_view').css("display");

        var val = oInput.val();

        if (!val && !val.trim()) {

            $('.kcmnt_main .rviewSend').css({"background":"#cacaca"});

        }

        if (val && val.trim() !== ' ') {

            $('.kcmnt_main .rviewSend').css({"background":"#ff6965"});

        }

}

Comment.prototype.viewTextarea  = function(){

        var oInput =  $('.kcmnt_review .kcmnt_fixed_reply_input');

        var cmtListJuge = $('.kcmnt_view').css("display");

        var val = oInput.val();

        if (!val && !val.trim()) {

            $('.kcmnt_review .rviewSend').css({"background":"#cacaca"});

        }

        if (val && val.trim() !== ' ') {

            $('.kcmnt_review .rviewSend').css({"background":"#ff6965"});

        }

}

/*

判断是否下拉加载

*/

Comment.prototype._judgeMore = function(){

    $('.comment_more').show();

    sTop = document.body.scrollTop || document.documentElement.scrollTop;

    var dHeight = $(document).height();

    var cHeight = document.documentElement.clientHeight;

    if (sTop+cHeight == dHeight) {

        _this.page = _this.oLoader.attr('data-page');

        $.ajax({

            type: "GET",

            cache: false,

            url: "http://cmnt.sina.cn/aj/v2/index",

            data: {

                product: CMNT.product, 

                group: CMNT.index,

                index: (CMNT.index || __docConfig.__docId),

                page: _this.page

            },

            dataType: "jsonp",

            jsonp:"_callback",

            jsonpCallback: "Getjsonp",

            success:function(data){

                _this.oLoader.attr('data-page', parseInt(_this.page) + 1);

                var data = data.data.data;

                var total = data.length;

                _this._templt(total,data);

            },

            error:function(f){

            }

        });

    }

}

window.callbackComment=function(){}

// 改变屏幕宽高适应图片大小

Comment.prototype.changSize = function(){

    var docHeight=$(window).height();

    var commentH =250;

    if ($('.kcmnt_review').css("display") === 'block') {

        if ( $('.kcmnt_review .cmnt_tablist ').css("display") === 'block') {

             $('.kcmnt_review .kcmnt_fixed_reply').css('marginTop',docHeight-385);

        }else{

             $('.kcmnt_review .kcmnt_fixed_reply').css('marginTop',docHeight-commentH);

        }

       

    };

    if ($('.kcmnt_main').css("display") === 'block') {

        if ( $('.kcmnt_main .cmnt_tablist ').css("display") === 'block') {

             $('.kcmnt_main .kcmnt_fixed_reply').css('marginTop',docHeight-385);

        }else{

             $('.kcmnt_main .kcmnt_fixed_reply').css('marginTop',docHeight-commentH);

        }

    };

}

Comment.prototype.resolveFace = function(val) {

    if (_this.oCmtFace) {

        _this.oCmtFace.forEach(function(item, index) {

            var re = new RegExp('\\[' + item.substring(1, item.length - 1) + '\\]', 'g');

            val = val.replace(re, '<i class="face face_' + (parseInt(index / 28) + 1) + ' icon_' + index % 28 + '">' + item + '</i>')

        });

    }

    return val;

};

Comment.prototype._commentSuccess = function(val,Juge){

    var pop = $('.kcmnt_review .rviewSend');

    //表情字符替换为表情

    var content = val;

    var item = _this.cmntItem;

    var towb;

    if (pop.attr('data-com') === 'true') {

        /*

            对文章评论

        */

        if ($('#checkbox-1').is(":checked")) towb = 1;

        else towb = 0;

        $.ajax({

            type: 'POST',

            url: 'http://cmnt.sina.cn/aj/cmnt/post',

            data: { product: CMNT.product, index: (CMNT.index || __docConfig.__docId), vcode: CMNT.vcode, csrfcode: CMNT.csrfcode, csrftime: CMNT.csrftime, wburl: __docConfig.__docUrl, vt: 4, cmntContent: content, towb: towb },

            // dataType: 'jsonp',

            // jsonp:"_callback",

            // jsonpCallback: "Getjsonp",

             xhrFields: {

                    withCredentials: true

                },

            timeout: 10000,

            success: function(data) {

                if (data && data.status) {

                    _this._tipShow('评论成功');

                }else{

                    _this._tipShow(data.msg);

                }

                 $('.kcmnt_review').hide();

         

            },

            error: function(xhr, type) {

                _this._tipShow('发送错误');

                    $('.kcmnt_review').hide();

               

            }

        });

    } else {

               // var data= {  product: CMNT.product, index: (CMNT.index || __docConfig.__docId), vcode: CMNT.vcode, csrfcode: CMNT.csrfcode, csrftime: CMNT.csrftime, wburl: __docConfig.__docUrl, vt: 4, cmntContent: content, mid: _this.mid, nick: _this.nick, wb_content: _this.wb_content, towb: towb };

       //评论的评论

       // data = { product: CMNT.product, index: (CMNT.index || __docConfig.__docId), vcode: CMNT.vcode, csrfcode: CMNT.csrfcode, csrftime: CMNT.csrftime, wburl: __docConfig.__docUrl, vt: 4, cmntContent: content, mid: _this.mid, nick: _this.nick, wb_content: _this.wb_content, towb: towb },

            

        if ($('#checkbox-2').is(":checked")) towb = 1;

        else towb = 0;

        $.ajax({

            type: 'POST',

            url: 'http://cmnt.sina.cn/aj/cmnt/post',

            data: { product: CMNT.product, index: (CMNT.index || __docConfig.__docId),csrfcode: CMNT.csrfcode, csrftime: CMNT.csrftime, wburl: __docConfig.__docUrl, vt: 4, cmntContent: content, mid: _this.mid, nick: _this.nick, wb_content: _this.wb_content, towb: towb },

            // dataType: 'jsonp',

            // jsonp:"_callback",

            // jsonpCallback: "Getjsonp",

            timeout: 10000,

            xhrFields: {

                withCredentials: true

            },

            success: function(data) {

                if (data && data.status) {

                    _this._tipShow('评论成功');

                }else{

                    _this._tipShow(data.msg);

                }

           

                     $('.kcmnt_main').hide();

           

            },

            error: function(xhr, type) {

                _this._tipShow('评论失败');

        

                   $('.kcmnt_main').hide();

            

            }

        });

    }

    $('.kcmnt_fixed_reply_input').val(" ");

    if (!_this.Juge) {                        

        $('.kcmnt_list').unbind('touchmove');

     };

}

Comment.prototype._jubaoSuccess = function(type){

    $.ajax({

        type: 'GET',

        url: 'http://cmnt.sina.cn/aj/cmnt/post',

        data: { product: CMNT.product, index: (CMNT.index || __docConfig.__docId), vcode: CMNT.vcode, csrfcode: CMNT.csrfcode, csrftime: CMNT.csrftime, wburl: __docConfig.__docUrl, vt: 4, cmntContent: content, mid: _this.mid, nick: _this.nick, wb_content: _this.wb_content, towb: towb },

        // dataType: 'jsonp',

        // jsonp:"_callback",

        // jsonpCallback: "Getjsonp",

        timeout: 10000,

        xhrFields: {

            withCredentials: true

        },

        success: function(data) {

            if (data && data.status) {

                _this._tipShow('评论成功');

            }else{

                _this._tipShow(data.msg);

            }

            $('.kcmnt_main').hide();

        },

        error: function(xhr, type) {

            _this._tipShow('评论失败');

            $('.kcmnt_main').hide();

        }

    });

}

// 公共函数

function jsonp(url, data, fnSucc)

{

    var fnName='jsonp_'+Math.random();

    fnName=fnName.replace('.', '');

    window[fnName]=function (arg)

    {

        fnSucc && fnSucc(arg);

        //清理

        oHead.removeChild(oS);

        window[fnName]=null;

    };

    data.callback=fnName;

    var arr=[];

    for(var i in data)

    {

        arr.push(i+'='+encodeURIComponent(data[i]));

    }

    var sData=arr.join('&');

    var oS=document.createElement('script');

    oS.src=url+sData;

    var oHead=document.getElementsByTagName('head')[0];

    oHead.appendChild(oS);

}

