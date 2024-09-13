import {
	refreshTokenFn
} from "@/api/login.js";
import api from "@/config/api.js";
import Request from "@/lib/request/index.js";
import Foundation from "@/utils/Foundation.js";
import {
	md5
} from "@/utils/md5.js";
import storage from "@/utils/storage.js";

import jwt from '@/js_sdk/t-jwt/jwt.js';
import uuid from "@/utils/uuid.modified.js";
import store from "../store";


let isNavigateTo = false

function cleanStorage() {
	uni.showToast({
		title: 'Login expired',
		icon: "none",
		duration: 1500,
	});
	if (uni.showLoading()) {
		uni.hideLoading();
	}

	storage.setHasLogin(false);
	storage.setAccessToken("");
	storage.setRefreshToken("");
	console.log("清空token");
	storage.setUuid("");
	storage.setUserInfo({});
	uni.navigateTo({
		url: '/pages/passport/login'
	})
}

let http = new Request();


/**
 * 创建uuid方法
 */
const createUuid = () => {
	if (!storage.getUuid()) {
		storage.setUuid(uuid.v1());
		console.log("uuid", storage.getUuid());
	}
}


http.setConfig((config) => {
	createUuid();
	/* 设置全局配置 */
	// config.baseURL = api.buyer;
	config.baseURL = '';
	config.header = {
		...config.header,
	};
	config.validateStatus = (statusCode) => {
		// 不论什么状态,统一在正确中处理
		return true;
	};
	return config;
});

http.interceptors.request.use(
	(config) => {
		/* 请求之前拦截器。可以使用async await 做异步操作 */
		let accessToken = `Bearer ${storage.getAccessToken()}`;
		createUuid();
		config.header = {
			...config.header,
			'Authorization': accessToken,
			'Content-Type': 'application/json;charset=UTF-8',
			uuid: storage.getUuid()
		};
		return config;
	},
	(config) => {
		return Promise.reject(config);
	}
);


// 是否正在刷新的标记
let isRefreshing = false;
//重试队列
let requests = [];
// 必须使用异步函数，注意
http.interceptors.response.use(
	async (response) => {
		isNavigateTo = false
		uni.showLoading() ? uni.hideLoading() : ''
		let token = storage.getAccessToken();
		console.log('response:', response)
		if (response.statusCode == 200) {
			const data = response.data
			if (data.code != 0) {
				uni.showToast({
					title: data.message,
					icon: 'none',
				})
			} 
			return response.data;
		} else {
			uni.showToast({
				title: response.data.message || response.statusCode,
				icon: 'none',
			})
		}
		if (response.statusCode == 401) {
			cleanStorage()
			
		}
		return response
	},
	(error) => {
		console.log(error)
		uni.showLoading() ? uni.hideLoading() : ''
		return error;
	}
);

export {
	http
};

export const Method = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
};
