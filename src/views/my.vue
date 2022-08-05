<template>
  <div class="container" style="padding-top: 0;">

<!-- <button @click="$store.state.a++">改</button>  //  直接改数据  devtool里没记录  调试的话 不方便 不好观测数据如何变化的 -->

  <van-cell-group  class="my-info" v-if="isLogin">
      <van-cell
        class="base-info"
        center
        :border="false"
        @click="$router.push('/userInfo')"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="userInfo.avatar"
        />
        <div class="name" slot="title">{{userInfo.nickname}}</div>
        <van-button
          class="update-btn"
          size="small"
          round
        
        >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false" column-num="2">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap" @click="$router.push({name:'myHeadline'})">
            <div class="count">{{publish_num}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{liked_num}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
<!--  没登录 -->
    <div  class="not-login" v-else @click="$router.push('/login')">
      <div >
        <img class="mobile" src="~@/assets/tel.png">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
	  
	    <van-grid-item  class="nav-grid-item">
			
	     <span class="iconfont icon-shoucang"></span>
		 <span @click="$router.push('/collectlist')">收藏</span>
	    </van-grid-item>
	    <van-grid-item  class="nav-grid-item">
	     <span class="iconfont icon-lishi"></span>
		 <span  @click="$router.push('/BrowseHistory')">历史</span>
	    </van-grid-item>
    </van-grid>
    <van-cell title="修改密码" @click="updatePwd" />
    <van-cell title="忘记密码" is-link to="/forgetpassword" />
    <van-cell
      class="mb-4"
      title="关于我们"
      is-link
      to="/Aboutus"
    />
    <van-cell
    v-if="isLogin"
      class="logout-cell"
      title="退出登录"
      @click="logout"
    />
       <tabBar></tabBar>
  </div>
</template>


<script>


//  做一个判断  如果没登录  和登录后看到的界面 有所不同
import {mapState,mapMutations} from 'vuex'
import { Dialog } from 'vant';
import Tabbar from "@/components/tabBar";

export default{
   name:'my',
   data(){
    return {
    
    }
   },
   components:{
     [Dialog.Component.name]: Dialog.Component,
     [Tabbar.name]:Tabbar
   },
   computed:{
    ...mapState(['uid','token','isLogin','userInfo','liked_num','publish_num'])
   },

methods:{
    ...mapMutations(['clear']),
    updatePwd(){
  if (!this.checkLogin()) {
         this.$toast("请先登录");
        return;
      }
    },
    async logout(){

    let res =    await Dialog.confirm({
        title: '提示',
        message: '您确认退出吗?',
      });
      
      if(res =='confirm'){

          localStorage.clear();
          // localStorage.removeItem('token');

            this.clear() 


      }
    


    }

}



}


</script>

<style  lang="less">
.container {
  .my-info {
     background: url("~@/assets/banner.jpg") no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 24px;
        font-size: 12px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
     .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background: url("~@/assets/banner.jpg") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

   .nav-grid {
    .nav-grid-item {
      height: 70px;
      .iconfont {
        font-size: 22px;
		margin-bottom: 5px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
