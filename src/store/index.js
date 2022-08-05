import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const CHANGE = 'change';


import {
  getUserInfo
} from '@/api/user'
import {
  getCateList
} from '@/api/home'
import {
  getUploadToken,
  uploadQiniu
} from "@/api/api";
import {
  Toast
} from 'vant';
export default new Vuex.Store({
  //  放数据的  
  state: {
    uid: '',
    token: "",
    userInfo: {},
    isLogin: false,
    cate: [],
    publish_num:0,
    liked_num:0
  },
  //  vue里的 computed计算属性
  getters: {


  },

  //  改数据的
  mutations: {
    changea(state, val) {

      state.a = val
    },
    [CHANGE](state, {
      key,
      value
    }) {
      // {key:'userInfo',value:userInfo}
      // {key:'uid',value:uid}
      state[key] = value
    },
    clear(state) {

      state.uid = '';
      state.token = '';
      state.userInfo = {};
      state.isLogin = false;
      state.publish_num = 0;
      state.liked_num = 0;


    }


  },
  //  
  actions: {

   async  getUserInfo({
      commit
    }, token) {
      //  在这里写异步 
      // console.log(json)

    return  getUserInfo({
        token
      }).then(res => {
        console.log(res)
        //  再次存起来
        if (res.code == 0) {
          commit('change', {
            key: "userInfo",
            value: res.userInfo
          })
          commit('change', {
            key: "uid",
            value: res.uid
          })
          commit('change', {
            key: "token",
            value: token
          })
          commit('change', {
            key: "isLogin",
            value: true
          })
          commit('change', {
            key: "publish_num",
            value: res.publish_num
          })
          commit('change', {
            key: "liked_num",
            value: res.liked_num
          })
        } else {

          Toast(res.msg)

        }


      })


    },
    getCate({
      state,
      commit
    }) {
      getCateList().then(res => {
        console.log(res)
        commit('change', {
          key: 'cate',
          value: res.data
        })
      })

    },
    //  上传

    ///  上传
    async upload(o,fileList) {
      let imageSrc = [];
      if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
        //  没上传图片
        return imageSrc;
      }

      // 需要 循环
      //  多个异步任务都执行完成  返回他们完成后的结果
      let task = fileList.map((v) => {
        return new Promise(async (resolve, reject) => {
          let {
            file
          } = v;
          let {
            type
          } = file;
          //  拿到类型  比如jpg image/jpg
          type = type.split("/")[1];
          // 重新命名  随机名字
          let file_name = `${new Date().getTime()}_${Math.random()
                .toString(36)
                .slice(2)}.${type}`;
          // 去服务器申请一个上传token

          let {
            token
          } = await getUploadToken();

          console.log(token);

          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append("token", token);
          formdata.append("key", file_name);

          uploadQiniu(formdata).then((res) => {
            console.log(res);
            resolve(`http://toutiao.longxiaokj.com/` + res.key);
          });
        });
      });

      // task  [promises,promise]

      imageSrc = await Promise.all(task);

      return imageSrc;
    },

  },
  modules: {}
})
