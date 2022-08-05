<template>
  <div class="Aboutus">
  <van-nav-bar
  title="关于我们"
  left-arrow
  @click-left="$router.back()"
/>
<van-cell-group>
  <van-cell title="检查新版本"  is-link to="/"/>
  <van-cell title="功能介绍" is-link to="/" />
<van-cell title="联系我们" is-link to="/" />
  <van-cell title="头条官网" value="www.toutiao.com" is-link to="/" />  
  <van-cell title="头条官方邮箱" value="1405025357@qq.com" is-link to="/" />  
  <van-cell title="头条客服热线" value="17550266309" is-link to="/" />  

</van-cell-group>
  </div>
</template>

<script>
export default {
    name:'Aboutus',

}
</script>

<style>

</style>