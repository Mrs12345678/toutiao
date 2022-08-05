<template>
  <div>
    <van-nav-bar
      title="浏览历史"
      fixed
      placeholder
      right-text="删除历史"
      z-index="999"
      left-arrow
      @click-right="delClickRight"
      @click-left="$router.back()"
    />
    <div>
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <!--  容器 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getBrowseHistory"
        >
          <!-- 初始化后  会立刻执行一次  getArtList    cate_id  '' -->
          <!-- loading   是否转圈 是否正在加载中  -->
          <li
            style="padding-bottom: 20px"
            v-for="(item, index) in BrowseHistory"
            :key="item._id"
            @click="
              $router.push({
                path: '/article',
                query: { article_id: item._id, title: item.title },
              })
            "
          >
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
          </li>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getBrowseHistory } from "@/api/api";
import { List, PullRefresh } from "vant";
export default {
  name: "BrowseHistory",
  data() {
    return {
      skip: 0,
      limit: 20,
      loading: false,
      finished: false, //  是否 全部 加载完毕了
      isRefresh: false, //  是否正在刷新
      BrowseHistory: [],
    };
  },
  created() {
    // this.getBrowseHistory();
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
  computed: {
    ...mapState(["uid"]),
  },
  methods: {
    // 删除浏览历史
    delClickRight() {
      this.BrowseHistory = [];
      this.$toast("删除成功");
    },

    // 浏览历史
    getBrowseHistory(flag) {
      let { skip, limit, uid } = this;
      getBrowseHistory({ skip, limit, uid }).then((res) => {
         if (!this.checkLogin()) return
        console.log(res);
        if (res.code == 0) {
          if (flag) {
            this.BrowseHistory = res.data;
            this.isRefresh = false;
          } else {
            this.BrowseHistory.push(...res.data);
            // console.log(this.BrowseHistory);
          }

          let len = this.BrowseHistory.length;
          console.log(len);
          if (len >= res.count) {
            this.finished = true;
            // console.log( this.finished);
          } else {
            this.loading = false;
            this.skip = len;
            console.log(this.loading,  this.skip );
          }
        }
      });
    },
    onRefresh() {
      this.skip = 0;
      this.finished = false;
      this.getBrowseHistory(true);
    },
  },
};
</script>

<style lang="less" scoped>
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