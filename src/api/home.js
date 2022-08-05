import axios from './index.js'  // 这是被加工过的axios   


//  获取分类列表
export function getCateList(params){
   return  axios.post('/api/get_cate_list',params)
} 
//  获取文章列表
export function getArticleList(params){
   return  axios.get('/api/get_article_list',{
      params
   })
} 
