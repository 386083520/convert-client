import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import UploadFile from '@/components/UploadFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/uploadFile',
      name: 'UploadFile',
      component: UploadFile
    }
  ]
})
