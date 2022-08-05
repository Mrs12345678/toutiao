<template>
  <div class="reg">
    <van-nav-bar
      title="忘记密码"
      fixed
      placeholder
      z-index="999"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="formbox">
      <!-- 手机号 -->
      <van-form @submit="onSubmit" ref="regform">
        <van-field
          v-model="username"
          name="username"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            {
              pattern:
                /^(0|86|17951)?(13[0-9]|15[012356789]|166|19[356789]|17[35678]|18[0-9]|14[57])[0-9]{8}$/,
              message: '请输入正确的号码格式',
            },
          ]"
        >
          <template #left-icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shouji"></use>
            </svg>
          </template>
        </van-field>

        <!-- 密码 -->
        <van-field
          v-model="password"
          type="password"
          name="password"
          placeholder="请输入密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              pattern: /\w{6,18}/,
              message: '密码长度在6~18之间，只能包含字母、数字和下划线',
            },
          ]"
        >
          <template #left-icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yanzhengma"></use>
            </svg>
          </template>
        </van-field>
        <!-- 验证码 -->
        <van-field
          v-model="vercode"
          center
          clearable
          placeholder="请输入验证码"
          :rules="[
            { required: true, message: '请填写验证码' },
            {
              pattern: /^\d{6}$/,
              message: '验证码格式错误',
            },
          ]"
        >
          <template #left-icon>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yanzhengma"></use>
            </svg>
          </template>

          <template #button>
            <van-button
              size="small"
              type="primary"
              native-type="button"
              v-show="show"
              @click="send"
              >获取验证码</van-button
            >
            <van-button
              size="small"
              type="primary"
              native-type="button"
              v-show="!show"
              >{{ count }}s后重新获取</van-button
            >
          </template>
        </van-field>

        <!-- 按钮 -->
        <!-- <div style="margin: 16px"> -->
        <van-button type="primary" block native-type="submit" size="large"
          >保存</van-button
        >
        <div class="misc">
          <p @click="$router.push('/login')">返回登录</p>
        </div>
        <!-- </div> -->
      </van-form>
    </div>
  </div>
</template>
<script>
import { sendSms } from "@/api/user";
import { get_forget } from "@/api/api";
import { Form } from "vant";
import { Field } from "vant";
export default {
  name: "reg",
  data() {
    return {
      username: "", //手机
      vercode: "", //验证码
      password: "", //密码
      show: true,
      count: "",
      timer: null,
    };
  },
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
  },
  created() {
    // this.getuser()
  },
  // 挂载后
  mounted() {},
  methods: {
    onSubmit(values) {
      console.log("submit", values);
      this. get_forget();
    },

    // 倒计时
    countdown() {
      let TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
// 点击事件发送
    send() {
      console.log("触发了send");
      this.$refs.regform.validate("username").then((data) => {
        console.log(data);
      });
      // 验证码
      this.getsendSms();
    },

    // 忘记密码
    get_forget(){
         let { username, password, vercode } = this;
         get_forget({ username, password,vercode,}).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.$toast("修改成功");
            localStorage.removeItem("tt-token");
          localStorage.removeItem("tt-tokenExpired");
          localStorage.removeItem("tt-uid");
          localStorage.removeItem("tt-username");
          localStorage.removeItem("tt-userInfo");
        
          setTimeout((v) => {
            this.$router.back();
          });
        } else {
          this.$toast(res.msg || "修改失败");
        }
      });
    },
    
   
    // 验证码
//  sendSms(params){
//     return axios.post('/user/sendSms',params)
// },
    getsendSms() {
      let { username } = this;
      console.log(username);
      sendSms({  mobile: username,type: "login",}).then((res) => {
          console.log(res);
          // 发送成功
          if (res.code == 0) {
            this.countdown();
            this.$toast("发送成功");
          } else {
            this.$toast("发送失败");
          }
          if (res.msg) {
            this.$toast(res.msg);
          }
        })
        .catch((err) => {
          this.$toast(err.msg);
        });
    },
  },
};
</script>
<style lang='less' scoped>
.reg {
  .formbox {
    /*position: fixed;
    top: 50px;
    left: 0;
    right: 0;*/
    svg {
      width: 20px;
      height: 20px;
    }
    .misc {
      display: flex;
      justify-content: space-around;
      .password {
        width: 40%;
        border-right: 1px solid #999;
      }
    }
    ::v-deep .van-button--primary {
      margin-top: 30px;
    }
    /*::v-deep .van-button--small {
      border-radius: 15px;
      background-color: #ededed;
      border: none;
      color: #666666;
    }*/
  }
}
</style>