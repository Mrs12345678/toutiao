
import { getCommentList} from "@/api/api";
import {List} from 'vant'
export default{
    
    data(){
        return {
          skip:0,
          limit:10,
          commentFinished:false,
          commentLoading:false,
          commentList:[]
        }
    },
    components:{
        [List.name]:List
    },
    mounted(){
        
    },
    methods:{
        getCommentList(){
            let {uid,article_id,skip,limit} = this;

            getCommentList({
                user_id:uid,article_id,skip,limit
            }).then(res=>{
                if(res.code == 0){
                    console.log(res.data);
                    this.commentList.push(...res.data);

                    let len = this.commentList.length;
     
                    if(len>=res.count){
                       this.commentFinished = true
                    }else{
                        console.log(1)
                        this.skip = len
                        this.commentLoading = false;
                    }
                }
            })
        }
    }

}