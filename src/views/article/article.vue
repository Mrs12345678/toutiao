<template>
  <div class="article">
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>

    <!-- /导航栏 -->

    <div class="container">
      <div
        class="article-content"
        :style="{ height: 'calc(' + windowHeight + ' - 100px)' }"
      >
        <h1 class="title">{{ title }}</h1>

        <!--  骨架屏 -->
        <van-skeleton title avatar :row="3" :loading="!article.time">
          <div ref="renderContents">
            <van-cell center class="user-info">
              <div slot="title" class="name">{{ article.author }}</div>
              <van-image
                slot="icon"
                class="avatar"
                round
                fit="cover"
                :src="article.avatar"
              />
              <div slot="label" class="pubdate">{{ article.time }}</div>
              <!-- <van-button class="follow-btn" type="default" icon="plus" round size="small">已关注</van-button> -->
            </van-cell>
            <div
              class="markdown-body"
              ref="articleContent"
              v-html="article.content"
            ></div>
            <div
              :class="{
                hide: article.poster_type == 1,
                rightImg: article.poster_type == 2,
                articleImgs: article.poster_type == 3,
              }"
            >
              <img v-for="img in article.imageSrc" :src="img" />
            </div>
          </div>
        </van-skeleton>

        <van-divider
          ref="divider"
          :style="{ borderColor: '#999', height: '5px' }"
        ></van-divider>
        <!-- 文章评论列表 -->
        <div class="section-title2">热门评论</div>
        <div>
          <van-list
            v-model="commentLoading"
            :finished="commentFinished"
            @load="getCommentList"
          >
            <template #finished>
              <div>
                <p v-if="commentList.length === 0">抢沙发</p>
                <p v-else>没有更多数据了</p>
              </div>
            </template>

            <van-cell
              class="comment-item"
              v-for="(item, index) in commentList"
              :key="item._id"
            >
              <van-image
                slot="icon"
                class="avatar"
                round
                fit="cover"
                :src="item.info.avatar"
              />
              <div slot="title" @click="openReply(item, index)">
                <div class="title-w">
                  <div class="name">{{ item.info.nickname }}</div>
                  <div class="like-w">
                    <van-icon
                      class="like-icon"
                      :class="{ liked: item.is_like }"
                      name="good-job"
                      @click="toggleCommentLike(item._id, item.is_like, index)"
                    />
                    <span class="like-count">{{
                      item.like_count == 0 ? "" : item.like_count
                    }}</span>
                  </div>
                </div>
                <div class="content">{{ item.content }}</div>
                <div class="info">
                  <span class="pubdate">{{
                    item.create_time | formatTime
                  }}</span>
                  <van-button
                    class="reply-btn"
                    round
                    size="mini"
                    @click.stop="
                      popupShow(1, item.info.nickname, item._id, index, item)
                    "
                    >{{
                      item.reply_num == 0 ? "" : item.reply_num
                    }}回复</van-button
                  >
                </div>
              </div>
            </van-cell>
          </van-list>
        </div>
        <!-- /文章评论列表 -->
      </div>
    </div>
    <!-- /发布评论 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="popupShow(0)"
        >写评论</van-button
      >

      <!-- 评论  -->

      <van-icon name="comment-o" color="#777" v-if="article.comment == 0" />
      <van-icon name="comment-o" color="#777" :badge="article.comment" v-else />

      <!-- commentList.length  BUG   -->

      <!-- 收藏 -->
      <van-icon
        name="star"
        :color="article.is_fav ? '#f00' : '#777'"
        @click="toggleFav"
      />
      <!-- 点赞 -->
      <van-icon
        name="good-job"
        :color="article.is_like ? '#f00' : '#777'"
        @click="toggleLike"
      />
      <van-icon
        name="share"
        color="#777777"
        @click="showShare = true"
      ></van-icon>
    </div>
    <!-- 评论回复 -->

    <van-popup v-model="commentPopupShow" position="bottom">
      <div class="post-comment">
        <van-field
          v-model="content"
          rows="4"
          autosize
          type="textarea"
          maxlength="1000"
          :placeholder="reply_placeholder"
          show-word-limit
          ref="content"
        />
        <div style="width: 100%">
          <van-button size="large" type="primary" @click="submit"
            >确定</van-button
          >
        </div>
      </div>
    </van-popup>

    <!-- /评论回复 -->

    <!--   /回复   -->

    <van-popup
      v-model="replyPopupShow"
      round
      :overlay="false"
      position="bottom"
      style="height: 100%"
    >
      <replyCom
        @close="replyPopupShow = false"
        :replyInfo="replyInfo"
        :replycommentList="replycommentList"
        :getfreplycommentList="getreplycommentList"
      ></replyCom>
    </van-popup>

    <!-- 分享 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />
    <van-popup v-model="qrcodePopupShow" round>
      <div class="qrcodebox">
        <p>请使用微信/浏览器扫码</p>
        <van-image :src="qrcodeURL"></van-image>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "@/common/github-markdown.css";
import { Popup, Skeleton, Divider, Field } from "vant";
import { mapState } from "vuex";
import { addComment, getreplycommentList } from "@/api/api";
import articleMethods from "./articleMethods";
import commentMixin from "./commentMixin";
import { formatDate } from "@/common/utils";
import replyCom from "./replyCom.vue";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

export default {
  name: "articleView",
  components: {
    [Popup.name]: Popup,
    [Skeleton.name]: Skeleton,
    [Divider.name]: Divider,
    [Field.name]: Field,
    [replyCom.name]: replyCom,
  },
  mixins: [commentMixin],
  data() {
    return {
      qrcodeURL: "",
      qrcodePopupShow: false, //二维码
      commentPopupShow: false,
      content: "",
      title: "",
      article_id: "",
      article: {},
      comment_type: 0, //  0  评论  1  回复
      reply_placeholder: "请留下您的精彩评论",
      reply_comment_id: "", //  回复的id  这个数据作为中转
      replyPopupShow: false, //  回复的 弹出层
      replyInfo: {},
      replycommentList: [], //回复评论列表
      replyInfo2: {},
      getfreplycommentList: getreplycommentList,
      showShare: false,
      options: [
        { name: "QQ", icon: "qq" },
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
    };
  },
  computed: {
    ...mapState(["uid", "userInfo"]),
  },
  filters: {
    formatTime(v) {
      // console.log(v);
      return formatDate(v);
    },
  },
  created() {
    let { title, article_id } = this.$route.query;
    this.article_id = article_id;
    this.title = title;

    this.getArticleDetail();
  },
  methods: {
    // 分享
    onSelect({ name }) {
      let title = this.article.title;
      let href = window.location.href;
      switch (name) {
        case "QQ":
          break;
        case "微博":
          break;
        case "复制链接":
          let input = document.createElement("input");
          input.value = href;
          document.body.appendChild(input);
          input.select();
          document.execCommand("Copy");
          document.body.removeChild(input);
          break;
        case "分享海报":
          //
          html2canvas(this.$refs.renderContents).then((canvas) => {
            document.body.appendChild(canvas);
            console.log(canvas);
            let url = canvas.toDataURL();
            console.log(url);
          });
          break;
        case "二维码":
        case "微信":
          QRCode.toDataURL(href)
            .then((url) => {
              console.log(url);
              this.qrcodePopupShow = true;
              this.qrcodeURL = url;
            })
            .catch((err) => {
              console.error(err);
            });
          break;
      }
    },

    ...articleMethods,

    //  点击评论
    openReply(item, index) {
      this.replyPopupShow = true;
      // console.log(item,index)
      console.log(item);
      this.replyInfo = item;
      this.getreplycommentList();
    },

    getreplycommentList() {
      // let { article_id } = this.$route.query;
      // console.log(this.replyInfo)
      let { _id, article_id } = this.replyInfo;
      let { uid } = this;
      getreplycommentList({
        article_id,
        reply_comment_id: _id,
        user_id: uid,
        comment_type: 1,
      }).then((res) => {
        console.log(res);
        this.replycommentList = res.data;
      });
    },

    // 弹出评论弹窗
    popupShow(
      comment_type = 0,
      reply_placeholder,
      reply_comment_id,
      index,
      item
    ) {
      if (!this.checkLogin()) return;
      this.replyInfo2 = item;
      console.log(item);
      this.comment_type = comment_type;

      if (comment_type == 0) {
        this.reply_placeholder = "留下您的精彩评论";
        this.reply_comment_id = "";
      } else {
        this.reply_placeholder = "回复：" + reply_placeholder;
        this.reply_comment_id = reply_comment_id;
      }

      this.commentPopupShow = true;

      this.$nextTick(function () {
        console.log(this.$refs.content);
        this.$refs.content.focus();
      });
    },
    // 发评论
    submit() {
      let {
        content,
        uid: user_id,
        article_id,
        comment_type,
        reply_comment_id,
      } = this;
      content = content.trim();
      if (typeof content != "string" || content.length === 0) {
        this.$toast("格式错误");
        return;
      }

      addComment({
        content,
        user_id,
        article_id,
        comment_type,
        reply_comment_id,
      }).then((res) => {
        console.log(res);

        this.$toast(res.msg);

        if (res.code == 0) {
          this.commentPopupShow = false;
          this.content = "";
          this.article.comment++;

          //  this.skip = 0;
          //  this.commentFinished = false;
          //  this.commentList = []
          //  this.getCommentList()

          if (comment_type == 0) {
            let { avatar, nickname, username } = this.userInfo;
            let newCommentData = {
              article_id,
              comment_type,
              content,
              create_time: new Date().getTime(),
              like_count: 0,
              reply_comment_id: "",
              reply_num: 0,
              user_id,
              info: {
                avatar,
                nickname,
                username,
                _id: user_id,
              },
              _id: res.data.id, //   你刚发的这条数据的id
            };
            this.commentList.unshift(newCommentData);
          } else {
            this.replyPopupShow = true;
            this.replyInfo = this.replyInfo2;
            this.getreplycommentList();
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.qrcodebox {
  width: 300px;
  p {
    margin-left: 60px;
    margin-top: 20px;
  }
  :deep .van-image__img {
    margin-left: 22px;
  }
}
.article {
  word-wrap: break-word;
  word-break: break-all;
  .rightImg {
    img {
      width: 100%;
      height: 200px;
      background-size: cover;
    }
  }

  .articleImgs {
    img {
      width: 100%;
      height: 200px;
      background-size: cover;
    }
  }
}
.article-content {
  overflow-y: auto;
  padding-bottom: 50px;
  .title {
    font-size: 20px;
    color: #3a3a3a;
    padding: 24px 20px 18px;
    background-color: #fff;
    margin: 0;
  }
}

.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

.section-title2 {
  padding: 10px;
  font-size: 24px;
  color: #222;
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name {
    font-size: 16px;
    color: #555;
  }
  .content {
    font-size: 16px;
    color: #222222;
    margin: 10px 0;
  }
  .info {
    display: flex;
    height: 36px;
    align-items: center;
  }
  .pubdate {
    font-size: 12px;
    margin-right: 12px;
  }
  .title-w {
    display: flex;
    justify-content: space-between;
    height: 36px;
    align-items: center;
  }
  .like-w {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .like-icon.liked {
    color: #ef092c;
  }
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}

.post-comment {
  padding: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
