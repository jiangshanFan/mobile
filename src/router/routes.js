
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    redirect: 'mould',
    meta: {
      requiresAuth: true,
      name: '模具管理系统'
    },
    children: [
      { name: 'mould', path: 'mould', component: () => import('pages/Index.vue') }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/login.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
