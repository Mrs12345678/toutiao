import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

import '@/common/iconfont.js';//  引入iconfont


import '@/components/vant';   

//  

let windowHeight = document.documentElement.scrollHeight;
Vue.mixin({
  data(){
    return {
      baseColor:"#07c160",
      windowHeight:windowHeight+'px'
    }
  },
    methods:{
      checkLogin(url='/login',msg="请先登录",t=500){

          if(!this.$store.state.uid){
            this.$toast(msg)
            setTimeout(v=>{
              this.$router.push(url)
            },t)
            return false
          }
          return true
          
      }
    }
})

Vue.prototype.$bus = new Vue() //全局事件总线   类似于中转站


let token = localStorage.getItem('token');

if(token){
  
   store.dispatch('getUserInfo',token)
   .then(res=>{
        new Vue({
          router,
          store,
          render: h => h(App)
        }).$mount('#app')
   })


}else{
        new Vue({
          router,
          store,
          render: h => h(App)
        }).$mount('#app')
}






