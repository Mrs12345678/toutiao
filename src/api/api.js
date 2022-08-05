

import axios from './index.js'  // 这是被加工过的axios   


//  发布文章
export function addArticle(params){
   return  axios.post('/api/add_article',params)
} 
//  获取七牛上传token 
export function getUploadToken(){
   return  axios.get('/upload/token')
} 
//  上传七牛 
export function uploadQiniu(formData){
   return  axios.post('https://upload-z1.qiniup.com',formData)
} 

//  search 
export function search(params){
   return  axios.get('/api/search',{
      params
   })
} 


// 获取文章详情

export function getArticleDetail(params){
      return  axios.get('/api/get_article_detail',{
         params
      })
}

// 收藏
export function addFav(params){
      return  axios.get('/api/add_fav',{
         params
      })
}
// 取消收藏
export function removeFav(params){
      return  axios.get('/api/remove_fav',{
         params
      })
}
// 点赞
export function like(params){
      return  axios.get('/api/like',{
         params
      })
}
// 取消点赞
export function unlike(params){
      return  axios.get('/api/unlike',{
         params
      })
}
// 评论列表
export function getCommentList(params){
      return  axios.get('/api/get_comment_list',{
         params
      })
}
// 发布评论
export function addComment(params){
      return  axios.post('/api/add_comment',params)
}
// 评论点赞
export function commentLike(params){
      return  axios.post('/api/comment_like',params)
}
// 评论取消点赞
export function commentUnlike(params){
      return  axios.post('/api/comment_unlike',params)
}
// 回复评论列表
export function getreplycommentList(params){
   return  axios.post('/api/get_reply_list',params)
}

// 收藏列表
export function get_fav_list(params){
   return  axios.post('/api/get_fav_list',params)
}
// 忘记密码
export function get_forget(params){
   return  axios.post('/user/forget',params)
}
// 修改密码
export function updatePwd(params){
   return  axios.post('/user/updatePwd',params)
}
// 我的发布
export function getMyHeadline(params){
   return  axios.post('/api/get_user_article_list',params)
}
// 删除我的发布
export function getdel(params){
   return  axios.post('/api/del_user_article',params)
}
// 浏览历史
export function getBrowseHistory(params){
   return  axios.post('/api/get_history_list',params)
}

