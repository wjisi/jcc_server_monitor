import Vue from 'vue'
import Router from 'vue-router'
const _import = file => () => import('@/components/' + file + '.vue')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: _import('index'),
      redirect: '/home/currentStatus',
      children: [{
          path: '/home/currentStatus',
          name: 'currentStatus',
          component: _import('currentStatus')
        },
        {
          path: '/home/historyStatus',
          name: 'historyStatus',
          component: _import('historyStatus')
        }
      ]
    }
  ]
})