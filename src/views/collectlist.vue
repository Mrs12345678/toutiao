<template>
  <div class="collectlist">
    <van-nav-bar
      title="收藏列表"
      fixed
      placeholder
      z-index="999"
      left-arrow
      @click-left="$router.back()"
    />
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
      <!--  容器 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="get_fav_list"
      >
        <div
          class="tabs"
          v-for="(item, index) in fav_list"
          :key="item._id"
          @click="
            $router.push({ name: 'article', query: { article_id: item._id } })
          "
        >
          <div>作者 ：{{ item.author }}</div>
          <div>标题 ：{{ item.title }}</div>
          <div>类型 ：{{ item.cate_name }}</div>
          <div
            :class="{
              hide: item.poster_type == 1,
              rightimg: item.poster_type == 2,
              actiImg: item.poster_type == 3,
            }"
          >
            <img
              v-for="item2 in item.imageSrc"
              :src="item2"
              alt=""
              :key="item2._id"
            />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get_fav_list } from "@/api/api";
import { mapState } from "vuex";
import { List, PullRefresh } from "vant";
export default {
  name: "collectlist",
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
  data() {
    return {
      loading: false,
      finished: false, //  是否 全部 加载完毕了
      skip: 0,
      limit: 5,
      isRefresh: false, //  是否正在刷新
      fav_list: [],
    };
  },
  created() {
    // this.get_fav_list();
  },
  computed: {
    ...mapState(["uid"]),
  },
  methods: {
    get_fav_list(flag) {
      let { uid, skip, limit } = this;
      if (!uid) {
        this.$toast("请先登录");
        setTimeout((v) => {
          this.$router.push("/login");
        }, 5000);
        return;
      } else {
        get_fav_list({ user_id: uid, skip, limit }).then((res) => {
          console.log(res);
          if (res.code == 0) {
            if (flag) {
              this.fav_list = res.data;
              this.isRefresh = false;
            } else {
              this.fav_list.push(...res.data);
            }
            let len = this.fav_list.length;
            if (len >= res.count) {
              this.finished = true;
            } else {
              this.loading = false;
              this.skip = len;
              console.log(this.loading);
              console.log(this.skip);
            }
          }
        });
      }
    },
    onRefresh() {
      this.skip = 0;
      this.finished = false;
      this.get_fav_list(true);
    },
  },
};
</script>

<style lang="less" scoped>
.collectlist {
  width: 100%;
  width: 100%;
  /* margin-top: 20px;
    overflow: hidden;

    padding-top: 75px;*/
  .rightimg {
    img {
      width: 100%;
      height: 200px;
      background-size: cover;
    }
  }
  .hide {
    img {
      width: 100%;
      height: 200px;
    }
  }
  .actiImg {
    img {
      width: 33%;
      height: 100px;
      background-size: cover;
    }
  }
}
</style>