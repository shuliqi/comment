#评论插件配置参数说明
  所需参数，放在页面中
            var __docConfig= {
              __domain:, //文档所在域
              __docid:,
              __docUrl:, //分享的url
              __mainPic:, //分享的图片地址
              __title:, //文章标题
              __content:, //文章内容
              __tj_ch:, //统计参数
              __webURL:, //文章url
              __isdoc:, //1表示分享到微博需要doc样式，0表示不需要doc样式
              __cmntTotal: //评论总条数
            };

#使用的步骤如下：
1.在所需该评论组件的的页面引入：

       http://mjs.sinaimg.cn/wap/online/dpool/wemedia/js/addComment.min.js

       http://mjs.sinaimg.cn/wap/online/dpool/wemedia/css/addComment.css

2.在页面执行下面的代码：

         var oComment = new Comment({

               main : $('#mainpage')

         });

        window.oComment=oComment;

        其中 $('#mainpage')默认是整体页面的容器。

3. 另外还有两个公开方法：

        oComment.commentShow(); 显示输入框

        oComment.commentHide(); 隐藏输入框

        注意：默认情况下是显示输入框。

4.如果是页面的其他dom元素要绑定评论的显示，在确定执行了步骤1和步骤2之后直接调用：_this.commentList();  例子如下：

         $('.show_comment').on('click',function(){

              _this.commentList();

          });

5.如果是页面的其他dom元素要绑定评论的显示，在确定执行了步骤1和步骤2之后直接调用：_this.commentList();  例子如下：

         $('.show_comment').on('click',function(){

              _this.commentList();

          });

   
