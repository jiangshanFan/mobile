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
//获取单个认可清单中的单个项的详情
export const getCheckDetailList = data => {return $ajax({url: '/api/project/getCheckDetailList', method: 'get', params: data,})};
//添加单个项的详情
export const addCheckDetail = data => {return $ajax({url: '/api/project/addCheckDetail', method: 'post', data: data, meta: 1, })};
//根据模号，获取设计评审清单列表
export const getDesignStatistics = data => {return $ajax({url: '/api/project/getDesignStatistics', method: 'get', params: data,})};
//根据模号，以及设计类型获取设计评审清单详情
export const getDesignInfoByMouldNo = data => {return $ajax({url: '/api/project/getDesignInfoByMouldNo', method: 'get', params: data,})};
//更新设计评审清单结果
export const updateDesignInfo = data => {return $ajax({url: '/api/project/updateDesignInfo', method: 'post', data: data, meta: 1, })};
//获取评论信息
export const getRemarkList=data=>{return $ajax({url:'/api/project/getRemarkList',method:'get',params:data,})};
//提交评论信息
export const submitRemarks = data => {return $ajax({url: '/api/project/submitRemarks', method: 'post', data: data, meta: 1, })};
//保存详情
export const saveCheckDetail = data => {return $ajax({url: '/api/project/saveCheckDetail', method: 'post', data: data, meta: 1, })};
//获取详情草稿
export const getCheckDetail = data => {return $ajax({url: '/api/project/getCheckDetail', method: 'get', params:data, })};
//上传多附件接口
export const uploadManyEnclosure = data => {return $ajax({url: '/api/upload/file/uploadManyEnclosure', method: 'post', data: data, meta: 1, })};
//删除附件
export const deleteEnclosure = data => {return $ajax({url: '/api/project/deleteEnclosure', method: 'get', params:data, })};
//获取附件
export const getEnclosureList = data => {return $ajax({url: '/api/project/getEnclosureList', method: 'get', params:data, })};