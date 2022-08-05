<template>
  <div id="app">
    <!-- 无差别  让所有的页面都缓存   -->
    <keep-alive>
   <router-view v-if="$route.meta.keep"></router-view>
    </keep-alive>

    
 <router-view v-if="!$route.meta.keep"></router-view>

<!-- vue  组件加载的过程   把原来的 清掉 释放了  新的 放上去  -->


<!-- 加了keep-alive后  

切换组件时   会把组件的v_node 放到一个对象中缓存  

当再次回来刚才的组件时  不用重新创建 而是从 这个对象里去找  找到后直接恢复  所以他可以记住一些状态   -->
<!-- 
cache :{
   home_v_node:home_v_node
} -->

  </div>
</template>

<script>

export default{
  data(){
    return {
   
    }
  }
}
</script>

<style lang="less">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
*{
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.a{
  font-size:@mColor;
}
.tt-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}


//   覆盖vant默认的
.van-nav-bar__title{
  max-width: 75%;
}
</style>
