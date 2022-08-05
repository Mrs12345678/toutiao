<template>
  <div>
 <van-nav-bar title="修改昵称" left-arrow @click-left="$router.back()">
    </van-nav-bar>
      <van-field v-model="nickname" label="昵称" clearable placeholder="请输入昵称" />

    <div style="text-align:center;padding: 20px;">
          <van-button type="primary" size="large" @click="edit_nickname">修改</van-button>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant'
export default {
   components:{
    [Field.name]:Field
   },
   data(){
    return {
        nickname:''
    }
   },
   created(){
       this.nickname = this.$route.query.nickname
   },
   methods:{
    edit_nickname(){
      let {nickname} = this;

        if(nickname.trim().length === 0){
            this.$toast('不能为空')
            return 
        }
        
    sessionStorage.setItem('nickname',nickname)
         setTimeout(v=>{
            this.$router.back()
         },300)
    }
   }
}
</script>

<style>

</style>