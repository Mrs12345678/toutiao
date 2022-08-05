<template>
  <div>
    <van-nav-bar title="发布"> </van-nav-bar>

    <van-form @submit="onSubmit">
      <van-field
        v-model="title"
        name="title"
        label="标题"
        placeholder="标题"
        label-width="30px"
        :rules="[{ required: true, message: '请填写标题' }]"
      />
      <van-field
        :value="cate_name"
        label="分类"
        label-width="30px"
        placeholder="请选择分类"
        readonly
        name="cate_name"
        @click="catePickerShow = true"
      />

      <van-field
        v-model="content"
        name="content"
        label="内容"
        label-width="30px"
        placeholder="内容"
        type="textarea"
        :rules="[{ required: true, message: '请填写内容' }]"
      />

      <!--   上传 -->
      <van-field label="图片" label-width="30px" name="fileList">
        <template #input>
          <van-uploader
            v-model="fileList"
            :max-size="500 * 1024"
            multiple
            :max-count="3"
          />
        </template>
      </van-field>

      <div style="margin: 16px">
        <van-button block type="primary" native-type="submit" size="larg"
          >提交</van-button
        >
      </div>
    </van-form>

    <!--   弹出层 -->
    <van-popup
      v-model="catePickerShow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-picker
        title="请选择"
        show-toolbar
        :columns="cate"
        @confirm="onConfirm"
        @cancel="catePickerShow = false"
        value-key="name"
      />
    </van-popup>

    <tabBar></tabBar>
  </div>
</template>

<script>
import Tabbar from "@/components/tabBar";
import { Form, } from "vant";
import { Field, Picker, Popup } from "vant";
import { addArticle } from "@/api/api";
import { mapState,mapActions } from "vuex";
import { Uploader } from "vant";
export default {
  name: "publish",
  components: {
    [Tabbar.name]: Tabbar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Uploader.name]: Uploader,
  },
  data() {
    return {
      title: "",
      content: "",
      cate_id: "",
      cate_name: "",
      catePickerShow: false,
      fileList: [], //  vant上传组件 接收数据
    };
  },
  computed: {
    ...mapState(["cate", "uid", "userInfo"]),
  },
  created() {
    this.$store.dispatch("getCate");
  },
  methods: {
    ...mapActions(['upload']),
    //  picker确定
    onConfirm(e) {
      // console.log(e);
      this.catePickerShow = false;
      this.cate_name = e.name;
      this.cate_id = e._id;
    },

    async onSubmit(values) {
      // console.log("submit", values);

      let { cate_id, uid, userInfo, fileList } = this;
      let { nickname } = userInfo;

      // console.log(uid);
      // console.log(cate_id);
      // console.log(nickname);

      // 需要把file传到服务器  服务器收到以后存到服务器上 返回该图片在服务器的地址
      if (!uid) {
        this.$toast("请先登录");
        setTimeout((v) => {
          this.$router.push("/login");
        }, 500);
        return;
      }

      //  上传图片操作

      // fileList  vant给的上传相关的文件
      let imageSrc = await this.upload(fileList);

      console.log(imageSrc);
      delete values.fileList;
      addArticle({
        ...values,
        cate_id,
        author:nickname,
        author_id:uid,
        imageSrc
      }).then(res=>{
        console.log(res)
          this.$toast(res.msg);

        if(res.code ==0){
          //  提示你  是否去查看  

          //  把数据清掉  
            this.imageSrc=[]
            this.fileList=[]
            this.cate_name=''
            this.title= "",
            this.content= ""

        }else{
          this.$toast(res.msg)
        }
      })
    },
  },
};
</script>

<style>
</style>