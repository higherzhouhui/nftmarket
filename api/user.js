import {
	http
} from "@/utils/request.js";

import api from "@/config/api.js";

export function getUserInfoReq() {
	return http.request({
		url: `${api.nftMarket}/api/user`,
		method: 'GET',
	})
}

export function sendEmailCodeReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/setting/send_code`,
		method: 'POST',
		data
	})
}
export function changePwdReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/setting/change_password`,
		method: 'POST',
		data
	})
}

export function getMessageList(params) {
	return http.request({
		url: `${api.nftMarket}/api/notify`,
		method: 'GET',
		params
	})
}
export function changeEmailReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/setting/email_confirm`,
		method: 'POST',
		data
	})
}

export function sendPayPasswordReq() {
	return http.request({
		url: `${api.nftMarket}/api/setting/send_forget_pay_password_code`,
		method: 'POST',
	})
}

export function setPayPassWordReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/setting/change_pay_password`,
		method: 'POST',
		data
	})
}

export function updateAvatarReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/setting/change_avatar`,
		method: 'POST',
		data
	})
}
export function changeUsernameReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/setting/change_username`,
		method: 'POST',
		data
	})
}

export function getMySubMember() {
	return http.request({
		url: `${api.nftMarket}/api/user/team`,
		method: 'GET',
	})
}
export function getDepositAddReq(params) {
	return http.request({
		url: `${api.nftMarket}/api/wallet/deposit`,
		method: 'GET',
		params
	})
}

export function withDrawReq(data) {
	return http.request({
		url: `${api.nftMarket}/api/wallet/withdraw`,
		method: 'POST',
		data
	})
}
export function getWithDrawListReq(params) {
	return http.request({
		url: `${api.nftMarket}/api/wallet/withdraw`,
		method: 'GET',
		params
	})
}
export function getWalletLogReq(params) {
	return http.request({
		url: `${api.nftMarket}/api/wallet/log`,
		method: 'GET',
		params
	})
}

export function getNftListReq(params) {
	return http.request({
		url: `${api.nftMarket}/api/nft`,
		method: 'GET',
		params
	})
}
export function getMyNftListReq(params) {
	return http.request({
		url: `${api.nftMarket}/api/order`,
		method: 'GET',
		params
	})
}

export function updateRechargeReq() {
	return http.request({
		url: `${api.nftMarket}/api/user/update_recharge`,
		method: 'GET',
	})
}

export function getDonwloadReq() {
	return http.request({
		url: `${api.nftMarket}/api/download`,
		method: 'GET',
	})
}



