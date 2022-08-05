<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人资料" left-arrow @click-left="$router.back()">
    </van-nav-bar>

    <div class="container">
      <input
        type="file"
        hidden
        id="file"
        accept="image/*"
        ref="file"
        @change="change"
      />
      <!-- /导航栏 -->
      <van-cell title="头像" center>
        <!-- 点击label标签 也会触发 他for的那个元素的点击 -->
        <label for="file">
          <van-image
            width="50"
            height="50"
            round
            fit="cover"
            :src="userInfo.avatar"
          />
        </label>
      </van-cell>
      <van-cell
        title="昵称"
        is-link
        :to="{ path: '/edit', query: { nickname: userInfo.nickname } }"
        :value="userInfo.nickname"
      />

      <van-cell
        title="性别"
        @click="sexPickerShow = true"
        is-link
        :value="userInfo.sex || '请选择性别'"
      />

      <!--  -->
      <van-popup v-model="sexPickerShow" position="bottom">
        <van-picker
          title="选择"
          show-toolbar
          @confirm="sexPickerConfirm"
          @cancel="sexPickerShow = false"
          :columns="sexColumns"
        />
      </van-popup>

      <!--  -->

      <van-cell title="生日" is-link 
      @click="datePickerShow = true"
      :value="userInfo.birthday||'请选择生日'" />

      <van-popup v-model="datePickerShow" position="bottom">
        <van-datetime-picker
          :value="userInfo.birthday?new Date(userInfo.birthday):new Date(2000,0,1)"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="datePickerConfirm"
          @cancel="datePickerShow = false"
        />
      </van-popup>

      <div style="margin: 30px 50px">
        <van-button
          round
          block
          type="primary"
          size="normal"
          :square="true"
          native-type="submit"
          @click="submit"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { editUserInfo } from "@/api/user";
import sexPickerMixin from "./sexPickerMixin";
import datePickerMixin from "./datePickerMixin";

export default {
  name: "userInfo",
  data() {
    return {
      userInfo: {},
    };
  },
  mixins: [sexPickerMixin, datePickerMixin],
  mounted() {
      console.log(this.userInfo)
  },
  // keep-alive后 又增加了两个新的生命周期 钩子

  //  激活  当被组件的组件 再次被打开时     他的加载时机  比较晚  
 activated(){
     let nickname = sessionStorage.getItem('nickname')
     if(nickname){
         this.userInfo.nickname = nickname
     }
 },
 //  被缓存的组件 加入到缓存时  
 deactivated(){
    console.log('加入到缓存')
 },

  watch: {
    //  数据无污染  刷新后也能拿到
    "$store.state.userInfo": {
      immediate: true, //  初始化后立刻进行监听
      handler(n, o) {
        this.userInfo = JSON.parse(JSON.stringify(n));
      },
    },
  },
  methods: {
    ...mapActions(["upload"]),
    //  性别选择器 确定事件

    async change(e) {
      console.log(); //  没有使用vant   我们把他封装成vant的

      let file = e.target.files[0]; //  二进制

      //  1  前端预览 FileReader   base64
      //  2 URL.createObjectURL  前端预览图片  1
      this.userInfo.file = file;
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        this.userInfo.avatar = e.target.result;
      };
    },
    // submit
    async submit() {
      let {
        _id,
        nickname,
        avatar,
        file,
        sex = "",
        birthday = "",
      } = this.userInfo;

      if (file) {
        //  证明咱们上传头像

        let fileList = [
          {
            file,
          },
        ]; //  和vant上传组件形状一样

        let res = await this.upload(fileList);

        avatar = res[0];
      }

      editUserInfo({
        uid: _id,
        nickname,
        avatar,
        sex,
        birthday,
      }).then((res) => {
        console.log(res);

        ///  改完数据后   返回 竟然没同步
     this.$toast(res.msg)
       if(res.code == 0){
            
           //  通知服务器  已经改了 
          //  但是  本地的vuex的数据还没改
          
          //  1. 直接调接口   严谨 但是浪费了一点点
          this.$store.dispatch('getUserInfo',localStorage.getItem('token'))

//  2.  本地修改

      // this.$store.commit('change',{
      //   key:'userInfo',
      //   value:{
      //      _id, 
      //     nickname,
      //     avatar,
      //     sex,
      //     birthday,
      //   }
      // })



            setTimeout(v=>{
              this.$router.back()
            },500)
       }


      
      });
    },
  },
};
</script>
<style scoped lang="less">
.van-popup {
  background-color: #f5f7f9;
}

.update-photo-popup {
  background-color: #000;
}

.name-field-wrap {
  padding: 10px;
}
.update-photo {
  height: 100%;
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}

/* Ensure the size of the image fit the container perfectly */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
