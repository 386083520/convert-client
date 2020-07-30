import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import UploadFile from '@/components/UploadFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '文档在线转换'
      }
    },
    {
      path: '/uploadFile',
      name: 'UploadFile',
      component: UploadFile,
      meta: {
        title: '文档在线转换'
      }
    }
  ]
})
