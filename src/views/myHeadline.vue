<template>
  <div>
    <van-nav-bar
      title="我的发布"
      fixed
      placeholder
      z-index="999"
      left-arrow
      @click-left="$router.back()"
    />
    <div>
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <!--  容器 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getMyHeadline"
        >
          <!-- 初始化后  会立刻执行一次  getArtList    cate_id  '' -->
          <!-- loading   是否转圈 是否正在加载中  -->
          <li
            style="padding-bottom: 20px"
            v-for="(item, index) in myHeadline"
            :key="item._id"
            @click="
              $router.push({
                path: '/article',
                query: { article_id: item._id, title: item.title },
              })
            "
          >
            <van-swipe-cell>
              <template #left>
                <!-- <van-button square type="primary" text="选择" /> -->
              </template>
              <van-cell :border="false">
                <p>作者：{{ item.author }}</p>
                <p>标题：{{ item.title }}</p>
                <div
                  :class="{
                    hide: item.poster_type == 1,
                    rightImg: item.poster_type == 2,
                    articleImgs: item.poster_type == 3,
                  }"
                >
                  <img v-for="img in item.imageSrc" :src="img" />
                </div>
              </van-cell>
              <template #right>
                <van-button
                  square
                  type="danger"
                  text="删除"
                  class="delete-button"
                  @click="getButtondel(index, item)"
                />
                <!-- <van-button square type="primary" text="收藏" /> -->
              </template>
            </van-swipe-cell>
          </li>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getMyHeadline, getdel } from "@/api/api";
import { List, PullRefresh, SwipeCell } from "vant";
export default {
  name: "myHeadline",
  data() {
    return {
      skip: 0,
      limit: 20,
      loading: false,
      finished: false, //  是否 全部 加载完毕了
      isRefresh: false, //  是否正在刷新
      myHeadline: [],
    };
  },
  created() {
    // this.getMyHeadline();
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [SwipeCell.name]: SwipeCell,
  },
  computed: {
    ...mapState(["uid"]),
  },
  methods: {
    // _id uid
    getButtondel(index, item) {
      console.log(index, item);
      let { _id } = item;
      let { uid } = this;
      getdel({ _id, uid }).then((res) => {
          console.log(res);
          if (res.code == 0) {
            console.log( this.myHeadline)
            this.$toast(res.msg);
            this.myHeadline.splice(index, 1);
          } else {
            this.$toast(res.msg || "删除失败");
          }
        })
        // .catch((err) => {
        //   console.log(err);
        // });
    },

    getMyHeadline(flag) {
      let { skip, limit, uid } = this;
      getMyHeadline({ skip, limit, uid }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          if (flag) {
            this.myHeadline = res.data;
            this.isRefresh = false;
          } else {
            this.myHeadline.push(...res.data);
          }
          let len = this.myHeadline.length;

          if (len >= res.count) {
            this.finished = true;
          } else {
            this.loading = false;
            this.skip = len;
          }
        }
      });
    },

    onRefresh() {
      this.skip = 0;
      this.finished = false;
      this.getMyHeadline(true);
    },
  },
};
</script>

<style lang="less" scoped>
.delete-button {
  height: 100%;
}
.rightImg {
  img {
    width: 100%;
    height: 200px;
    background-size: cover;
  }
}
.articleImgs {
  img {
    width: 33%;
    height: 150px;
    background-size: cover;
  }
}
</style>