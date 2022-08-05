<template>
  <div>
    <van-tabbar  active-color="#07c160" route>
  <van-tabbar-item to="/" >
      <span>首页</span>
    <template #icon> 
     <van-icon name="friends-o"  size="24" />
    </template>
    </van-tabbar-item>
  <van-tabbar-item  to="/publish" icon="search">发布</van-tabbar-item>
  <van-tabbar-item  to="/my" icon="friends-o">我的</van-tabbar-item>
</van-tabbar>

  </div>
</template>

<script>

import { Tabbar, TabbarItem } from 'vant';

export default {
    name:"tabBar",
    components:{
        [Tabbar.name]:Tabbar,
        [TabbarItem.name]:TabbarItem
    }

}
</script>

<style>

</style>