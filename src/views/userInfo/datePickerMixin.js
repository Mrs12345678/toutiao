import { DatetimePicker ,Popup  } from 'vant';
import {formatDate} from '@/common/utils'

export default {
    data(){
     return {
        datePickerShow:false,
        minDate: new Date(1920, 0, 1),
        maxDate: new Date(),
        
     }
    },
    components:{
        [DatetimePicker.name]:DatetimePicker,
        [Popup.name]:Popup
      },
      methods:{
        datePickerConfirm(e){
            console.log(e);//  日期对象
            // this.userInfo.sex = e;

             let d = formatDate(e)
             this.userInfo.birthday = d;
            this.datePickerShow = false;
        
           },
      }
}