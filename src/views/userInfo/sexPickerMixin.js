import { Picker,Popup  } from 'vant';

export default {
    data(){
     return {
        sexPickerShow:false,
        sexColumns:['男','女']
     }
    },
    components:{
        [Picker.name]:Picker,
        [Popup.name]:Popup
      },
      methods:{
        sexPickerConfirm(e){
            console.log(e)
            this.userInfo.sex = e;
            this.sexPickerShow = false;
        
           },
      }
}