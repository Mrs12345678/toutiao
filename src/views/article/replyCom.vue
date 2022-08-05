<template>
  <div class="reply">
    <van-nav-bar :title=" replyInfo.reply_num== 0 ? '暂无回复' : replyInfo.reply_num +'条回复' " @click-left="close" border>
      <template #left>
        <van-icon name="cross" color="#333" />
      </template>
    </van-nav-bar>

    <van-cell class="comment-item">
      <van-image
        slot="icon"
        class="avatar"
        round
        fit="cover"
        :src="replyInfo.info.avatar"
      />
      <div slot="title">
        <div class="title-w">
          <div class="name">{{ replyInfo.info.nickname }}</div>
          <div class="like-w">
            <van-icon
              class="like-icon"
              :class="{ liked: replyInfo.is_like }"
              name="good-job"
              @click="
                replyCommentLikes(
                  replyInfo._id,
                  replyInfo.is_like,
                  replyInfo.index
                )
              "
            />
            <span class="like-count">{{
              replyInfo.like_count == 0 ? "" : replyInfo.like_count
            }}</span>
          </div>
        </div>
        <div class="content">{{ replyInfo.content }}</div>
        <div class="info">
          <span class="pubdate">{{ replyInfo.create_time | formatTime }}</span>
        </div>
      </div>
    </van-cell>

    <!-- {{replyInfo}}   -->
  
    <div>
      <van-cell
        class="comment-item"
        v-for="(item, index) in replycommentList"
        :key="item._id"
      >
        <van-image
          slot="icon"
          class="avatar"
          round
          fit="cover"
          :src="item.info.avatar"
        />
        <div slot="title">
          <div class="title-w">
            <div class="name">{{ item.info.nickname }}</div>
            <div class="like-w">
              <van-icon
                class="like-icon"
                :class="{ liked: item.is_like }"
                name="good-job"
                @click="replyCommentLike(item._id, item.is_like, index)"
              />
              <span class="like-count">{{
                item.like_count == 0 ? "" : item.like_count
              }}</span>
            </div>
          </div>
          <div class="content">{{ item.content }}</div>
          <div class="info">
            <span class="pubdate">{{ item.create_time | formatTime }}</span>
            <!-- <div class="article-bottom">
              <van-button
                class="comment-btninput"
                type="default"
                 size="large"
                @click="popupShow(item)"
                >写评论</van-button
              >
            </div> -->
          </div>
        </div>
      </van-cell>
    </div>

       <div class="article-bottom">
              <van-button
                class="comment-btninput"
                type="default"
                 size="large"
                @click="popupShow(1,replyInfo.info.nickname,replyInfo._id)"
                >写评论</van-button
              >
            </div>
    <!-- 回复 -->
    <van-popup v-model="commentPopupShow" position="bottom">
      <div class="post-comment">
        <van-field
          v-model="content"
          rows="4"
          autosize
          type="textarea"
          maxlength="1000"
          :placeholder="nickname"
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
  </div>
</template>
<script>
import { formatDate } from "@/common/utils";
import articleMethods from "./articleMethods";
import { addComment, commentLike, commentUnlike } from "@/api/api";
import { Popup, Field } from "vant";
import { mapState } from "vuex";
export default {
  name: "replyCom",
  props: {
    replyInfo: {
      default: {},
    },
    replycommentList: {
      default: [],
    },
    getfreplycommentList:{

    }
  },
  data() {
    return {
      // replycommentList: [],
      commentPopupShow: false,
      reply_placeholder: "请留下您的精彩评论",
      content: "",
      nickname: "",
      replayitem: {},
    };
  },
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
  },
  filters: {
    formatTime(v) {
      return formatDate(v);
    },
  },
  mounted() {},

  computed: {
    ...mapState(["uid"]),
  },
  methods: {
    close() {
      this.$emit("close");
    },

    replyCommentLike(comment_id, is_like, index) {
      console.log(comment_id, is_like, index);
      if (!this.checkLogin()) return;

      let { uid } = this;

      if (is_like) {
        //  取消
        commentUnlike({
          comment_id,
          user_id: uid,
        }).then((res) => {
          console.log(res);
          this.$toast(res.msg);
          if (res.code == 0) {
            this.replycommentList[index].like_count = res.count;
            this.replycommentList[index].is_like = false;
          }
        });
      } else {
        commentLike({
          comment_id,
          user_id: uid,
        }).then((res) => {
          // console.log(res)
          this.$toast(res.msg);
          if (res.code == 0) {
            this.replycommentList[index].like_count = res.count;
            this.replycommentList[index].is_like = true;
          }
        });
      }
    },

    replyCommentLikes(comment_id, is_like) {
      console.log(comment_id, is_like);
      if (!this.checkLogin()) return;

      let { uid } = this;

      if (is_like) {
        //  取消
        commentUnlike({
          comment_id,
          user_id: uid,
        }).then((res) => {
          console.log(res);
          this.$toast(res.msg);
          if (res.code == 0) {
            this.replyInfo.like_count = res.count;
            this.replyInfo.is_like = false;
          }
        });
      } else {
        commentLike({
          comment_id,
          user_id: uid,
        }).then((res) => {
          // console.log(res)
          this.$toast(res.msg);
          if (res.code == 0) {
            this.replyInfo.like_count = res.count;
            this.replyInfo.is_like = true;
          }
        });
      }
    },

    ...articleMethods,
    submit() {
      let { article_id, _id } = this.replayitem;
      let { content, uid } = this;
      addComment({
        article_id,
        reply_comment_id:_id,
        content,
        comment_type: 1,
        user_id: uid,
      }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
          this.commentPopupShow = false;
          this.content = "";
          this.getfreplycommentList();
        } else {
          this.$toast(res.msg || "评论失败");
        }
      });
    },
    popupShow() {
      this.commentPopupShow = true;
      this.replayitem = this.replyInfo;
      // this.
      this.nickname = this.replyInfo.info.nickname;
      // console.log(item);
    },
  },
};
</script>

<style lang="less" scoped>
.comment-btninput{
  width: 100%;
  height: 40px;
  border: 1px solid #eeeeee;
  font-size: 15px;
  line-height: 23px;
  color: #a7a7a7;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
::v-deep .van-nav-bar {
  background-color: #fff;
  border-radius: 10px 10px 0 0;
}
::v-deep .van-nav-bar__title {
  color: #333;
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
</style>