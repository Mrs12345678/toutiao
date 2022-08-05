<template>
  <div class="home">
    <!--  头部 -->
    <van-nav-bar  >
      <template #title>
        <router-link class="home-header-searchbox" to="/search">
          <van-icon name="search" color="#fff" size="24" /> <span>搜索</span>
        </router-link>
      </template>
    </van-nav-bar>

    <!--  tabs 导航 -->

    <van-tabs v-model="active" border @click="switchTab">
      <van-tab
        v-for="item in cate"
        :key="item._id"
        :title="item.name"
      ></van-tab>
    </van-tabs>

    <div class="home-article-list" style="padding-bottom: 50px">
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <!--  容器 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getArtList"
          :immediate-check="false"
        >
          <!-- 初始化后  会立刻执行一次  getArtList    cate_id  '' -->
          <!-- loading   是否转圈 是否正在加载中  -->
          <li
            v-for="(item, index) in articleList"
            :key="item._id"
            style="padding: 10px 0"
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
             <!-- lazy-load   v-lazy="img" -->
              <img v-for="img in item.imageSrc"   v-lazy="img"/>
            </div>
          </li>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 底部栏 -->
    <div class="back"><a href="javascript:scroll(0,0)">↑</a></div>
    <tabBar></tabBar>
  </div>
</template>

<script>
// @ is an alias to /src
import { Tab, Tabs, List, PullRefresh } from "vant";

import Tabbar from "@/components/tabBar";

import { getCateList, getArticleList } from "@/api/home";

export default {
  name: "HomeView",
  components: {
    [Tabbar.name]: Tabbar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
  data() {
    return {
      active: 0,
      cate: [], //  存放分类数据
      active_cate_id: "", //   当前被选中的那一项的分类id
      articleList: [], //  文章列表
      loading: false,
      finished: false, //  是否 全部 加载完毕了
      skip: 0,
      limit: 20,
      isRefresh: false, //  是否正在刷新
    };
  },
  mounted() {
    this.getCate();
  },
  methods: {
    //   下拉刷新
    onRefresh() {
      this.skip = 0;
      this.finished = false;
      this.getArtList(true);
    },

    //  分类切换功能
    switchTab() {
      this.active_cate_id = this.cate[this.active]._id;

      this.articleList = [];
      this.skip = 0;
      this.finished = false;

      this.getArtList();
    },

    getCate() {
      getCateList().then((res) => {
        console.log(res);

        this.cate = res.data;

        //  对 cate进行了更改  vue视图更新

        //  待 拿到分类数据后 去取第一个栏目的id

        this.active_cate_id = this.cate[this.active]._id; //  获取到目前高亮的栏目的id

        ///
        this.getArtList();
      });
    },
    //  获取文章列表

    getArtList(flag) {
      let { active_cate_id, skip, limit } = this; //

      getArticleList({
        cate_id: active_cate_id,
        skip,
        limit,
      }).then((res) => {
        console.log(res.data)
        if (flag) {
          //  如果是刷新操作
          this.isRefresh = false; //  结束下拉刷新的转圈
          this.articleList = res.data; //  替换为新的
        } else {
          this.articleList.push(...res.data); //  新数据和老数据 拼接
        }

        let len = this.articleList.length; //  数量
        if (len >= res.count) {
          this.finished = true; //  数据加载完了  再滑也别触发事件了
        } else {
          this.skip = len; // skip  更新
          this.loading = false; //  我可以继续去加载
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.back {
  position: fixed;
  bottom: 70px;
  right: 5px;
  background: aqua;
  width: 20px;
  height: 50px;
  a {
    display: block;
  text-align: center;
    width: 20px;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
/*主色*/
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
::v-deep .van-nav-bar__title {
  max-width: 75%;
}
.home-header-searchbox {
  height: 32px;
  width: 270px;
  background: rgb(247 255 247 / 50%);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

::v-deep .van-tabs--line {
  border-bottom: 1px solid #ccc;
}
::v-deep .van-tabs__wrap--scrollable .van-tab {
  border-right: 1px solid #ccc;
}
::v-deep .van-tabs__wrap--scrollable .van-tab:nth-last-of-type(1) {
  border-right: 0;
}
::v-deep .van-tabs__line {
  bottom: 5.2vw;

  width: 3.66667vw;

  background-color: @mColor;
}

.home-article-list {
  overflow: hidden;
  img {
    max-width: 100%;
  }
}
</style>
