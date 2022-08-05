<template>
  <div class="updatePwd">
    <van-nav-bar title="修改密码" left-arrow @click-left="$router.back()" />

    <van-form @submit="onSubmit">
      <!-- field 字段 -->

      <van-field
        v-model="oldPassword"
        type="password"
        name="oldPassword"
        label="旧密码"
        placeholder="请输入旧密码"
        :rules="[
          { required: true, message: '请填写密码' },
          {
            validator: (e) => /^\w{6,12}$/.test(e),
            message: '密码格式错误,需要是6-12位的字母或数字',
          },
        ]"
      />
      <van-field
        v-model="newPassword"
        type="password"
        name="newPassword"
        label="新密码"
        placeholder="请输入新密码"
        :rules="[
          { required: true, message: '请填写密码' },
          {
            validator: (e) => /^\w{6,12}$/.test(e),
            message: '密码格式错误,需要是6-12位的字母或数字',
          },
        ]"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :color="baseColor"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { Form, Field } from "vant";
import { mapState, mapMutations } from "vuex";
import { updatePwd } from "@/api/api";
export default {
  name: "updatePwd",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
    };
  },
  computed: {
    ...mapState(["uid"]),
  },
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
  },
  methods: {
    ...mapMutations(["clear"]),
    onSubmit(values) {
      let { oldPassword, newPassword, uid } = this;
      console.log(values);

      updatePwd({ oldPassword, newPassword, uid }).then((res) => {
        console.log(res);
        this.$toast(res.msg);
        if (res.code == 0) {
          localStorage.clear();
          this.clear();
          setTimeout((v) => {
            this.$toast("请重新登录");
            this.$router.back();
          });
        }
      });
    },
  },
};
</script>

<style>
</style>