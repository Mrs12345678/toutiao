<template>
  <div>
    <van-nav-bar
      title="搜索列表"
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
        @load="getList"
      >
        <!-- 初始化后  会立刻执行一次  getArtList    cate_id  '' -->
        <!-- loading   是否转圈 是否正在加载中  -->
        <li v-for="(item, index) in list" :key="item._id" 
         style="padding-bottom: 20px"
         @click="$router.push({path:'/article',query:{article_id:item._id,title:item.title}})"
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
</template>

<script>
import { List, PullRefresh } from "vant";

import { search } from "@/api/api";

export default {
  name: "searchList",
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
  data() {
    return {
      loading: false,
      finished: false, //  是否 全部 加载完毕了
      skip: 0,
      limit: 20,
      isRefresh: false, //  是否正在刷新
      list: [],
      key_word: "",
    };
  },
  created() {
    this.key_word = this.$route.query.key_word;
  },
  methods: {
    getList(flag) {
      let { key_word, skip, limit } = this;
      search({
        key_word,
        skip,
        limit,
      }).then((res) => {
        console.log(res);

        if (res.code == 0) {
          if (flag) {
            this.list = res.data;
            this.isRefresh = false
          } else {
            this.list.push(...res.data);
          }


          let len = this.list.length;

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
      this.getList(true);
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
        height: 100px;
        background-size: cover;
      }
    }
</style>