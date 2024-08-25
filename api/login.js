import { http } from "@/utils/request.js";

import api from "@/config/api.js";

/**
 * 通过短信重置密码
 * @param  mobile
 */
export function resetByMobile(params) {
  return http.request({
    url: `/passport/member/resetByMobile`,
    method: "POST",
    params,
  });
}

/**
 * 绑定手机号码
 * @param  mobile
 */
export function bindMobile(params) {
  return http.request({
    url: `/passport/member/bindMobile`,
    method: "POST",
    params,
  });
}

//获取自动发券
export function getAutoCoup(){
  return http.request({
    url:`/promotion/coupon/activity`,
    method:"GET",
    needToken: true,
  });
}

/**
 * 账号密码登陆
 * @params  password
 * @params  username
 */
 export function userLogin(params, clientType){
  return http.request({
    method: "POST",
    url:`/passport/member/userLogin`,
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
	  clientType: clientType,
    },
  })
}


/**
 * 发送验证码
 * @param  mobile
 */
export function sendMobile(mobile,type='LOGIN') {
  return http.request({
    url: `${api.common}/common/sms/${type}/${mobile}`,
    method: "GET",
  });
}

/**
 * 短信登录
 * @param  mobile
 * @param  smsCode
 */
export function smsLogin(params, clientType) {
  return http.request({
    url: `/passport/member/smsLogin`,
    method: "POST",
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      clientType: clientType,
    },
  });
}

/**
 * 修改密码
 * @param  newPassword
 * @param  password
 */

export function modifyPass(params) {
  return http.request({
    url: `/passport/member/modifyPass`,
    method: "PUT",
    params,
  });
}

/**
 * 刷新token
 */
export function refreshTokenFn(refresh_token) {
  return http.request({
    url: `/passport/member/refresh/${refresh_token}`,
    method: "GET",
  });
}

// 获取密码状态
export function logout () {
  return http.request({
    url: '/passport/member/logout',
    method: "POST",
    needToken: true,
  })
}

export function scannerCodeLogin(params){
	return http.request({
	  url: '/passport/member/app_scanner',
	  method: "POST",
	  params,
	  needToken: true,
	});
}
export function scannerCodeLoginConfirm(params){
	return http.request({
	  url: '/passport/member/app_confirm',
	  method: "POST",
	  params,
	  needToken: true,
	});
}

// 注销用户
export function logoffConfirm() {
	return http.request({
		url: '/passport/member/cancellation',
		method: "PUT",
		needToken: true,
	})
}