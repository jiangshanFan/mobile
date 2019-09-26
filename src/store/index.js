/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

const state = {   //要设置的全局访问的state对象     //要设置的初始属性值
  //login获取token
  token: '',
  accountName: '',
  userLoginVO: {},
  mould_list: {},
  detail_list: {},
  design_list: {}
};


const getters = {   //实时监听state值的变化(最新状态)
  //承载变化的 token 的值
  token: (state) => { return state.token },
  //承载变化的 userLoginVO 的值
  userLoginVO: (state) => { return state.userLoginVO },
  //承载变化的 accountName 的值
  accountName: (state) => { return state.accountName },
  //承载变化的 mould_list 的值
  mould_list: (state) => { return state.mould_list },
  //承载变化的 detail_list 的值
  detail_list: (state) => { return state.detail_list },
  //承载变化的 design_list 的值
  design_list: (state) => { return state.design_list }
};


const mutations = {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
  //改变 token
  token(state, item) { state.token = item; },
  //改变 userLoginVO
  userLoginVO(state, item) { state.userLoginVO = item; },

  //改变 accountName
  accountName(state, item) { state.accountName = item; },
  //改变 mould_list
  mould_list(state, item) { state.mould_list = item; },
  //改变 detail_list
  detail_list(state, item) { state.detail_list = item; },
  //改变 design_list
  design_list(state, item) { state.design_list = item; }
};


const actions = {//同上注释，item 为要变化的形参
  //异步触发改变 token
  token(context, item) { context.commit('token', item) },
  //异步触发改变 userLoginVO
  userLoginVO(context, item) { context.commit('userLoginVO', item) },

  //异步触发改变 accountName
  accountName(context, item) { context.commit('accountName', item) },
  //异步触发改变 mould_list
  mould_list(context, item) { context.commit('mould_list', item) },
  //异步触发改变 detail_list
  detail_list(context, item) { context.commit('detail_list', item) },
  //异步触发改变 design_list
  design_list(context, item) { context.commit('design_list', item) }
};

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },
    state,
    getters,
    mutations,
    actions,

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
