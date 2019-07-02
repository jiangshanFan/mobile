/* eslint-disable */
/** api-doc*/
import $ajax from './request'

//--此处根据method方法改变：method === 'post'? data : params;
// console.log($ajax)

/**
 * @name login -------------- 登录
 * @author fjs
 * */
//登录
export const login = data => {return $ajax({url: '/api/login', method: 'post', data: data,})};
//登出
export const loginOut = data => {return $ajax({url: '/api/login/loginOut', method: 'post', data: data,})};


/**
 * @name yfpo
 * @author fjs
 * */
//路由列表
export const auth = data => {return $ajax({url: '/static/auth.json', method: 'get', params: data,})};
//项目列表
export const getProjectList = data => {return $ajax({url: '/api/project/getProjectList', method: 'get', params: data,})};
//单个模号认可清单
export const getApproveStatistics = data => {return $ajax({url: '/api/project/getApproveStatistics', method: 'get', params: data,})};
//获取tool information
export const getToolInformationByMouldNo = data => {return $ajax({url: '/api/project/getToolInformationByMouldNo', method: 'get', params: data,})};
//获取单个认可清单信息
export const getApproveInfoByMouldNo = data => {return $ajax({url: '/api/project/getApproveInfoByMouldNo', method: 'get', params: data,})};
//客户更新认可清单信息
export const updateApproveInfoByCustomer = data => {return $ajax({url: '/api/project/updateApproveInfoByCustomer', method: 'post', data: data, meta: 1, })};
//内部用户更新认可清单信息
export const updateApproveInfoByInnerUser = data => {return $ajax({url: '/api/project/updateApproveInfoByInnerUser', method: 'post', data: data, meta: 1, })};
