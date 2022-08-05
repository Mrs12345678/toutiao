<template>
  <div>

    <van-nav-bar title="登录" left-arrow  @click-left="$router.back()"> </van-nav-bar>


<van-form @submit="onSubmit">
<!-- field 字段 -->
  <van-field
    v-model="username"
    name="username"
    label="手机号"
    placeholder="请填写手机号"
    :rules="[{ required: true, message: '请填写手机号' },{ pattern:/^1[3-9]\d{9}$/, message: '手机号格式错误' }]"
  />

  <van-field
    v-model="password"
    type="password"
    name="password"
    label="密码"
    placeholder="密码"
    :rules="[{ required: true, message: '请填写密码' },{ validator: (e)=> /^\w{6,12}$/.test(e), message: '密码格式错误,需要是6-12位的字母或数字' }]"
  />
  <div style="margin: 16px;">
    <van-button  block type="info" native-type="submit" :color="baseColor">提交</van-button>
  </div>
  <div class="bottom">
<router-link to="/forgetpassword" class="forget">忘记密码</router-link>
<router-link to="/reg" class="reg">注册</router-link>
  </div>


</van-form>





  </div>
</template>

<script>
import { Form } from 'vant';
import { Field } from 'vant';
import {login} from '@/api/user'
// keep-alive  
export default {
  name:"login",
  components:{
    [Form.name]:Form,
    [Field.name]:Field
  },
   data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);

      login(values).then(res=>{
        console.log(res)

        if(res.code==0){

          let {token} = res;

          localStorage.setItem('token',token);  //  通行证  验证我们身份的   过期时间  

             this.$store.dispatch('getUserInfo',token)



          setTimeout(v=>{
                 this.$router.back()
          },500)


        
        }else{

            this.$toast(res.msg||'登录失败');

        }



      })

    },
   
  },

}
</script>

<style lang="less" scoped>
.bottom{
  display: flex;
    text-align: center;
  a{
        color: #000;
  }
.forget{
    width: 50%;
    border-right: 1px solid #999;
  }
  .reg{
    width: 50%;
  }
}
</style>