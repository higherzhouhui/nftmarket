<template>
	<view class="wrapper">
			<!-- <u-navbar :is-back="showBack" :border-bottom="false"></u-navbar> -->
			<view class="top-container">
			<view class="wrapper-title">{{$t('welecom')}}</view>
			<!-- 帐号密码登录 -->
			<view class="input-wrapper">
				<view class="sign-title">{{$t('signup')}}</view>
				<u-input :placeholder="$t('username')"
					class="input-style" v-model="userData.username" />
				<u-input :placeholder="$t('password')"
					class="input-style" v-model="userData.password" type="password" />
				<u-input :placeholder="$t('qzcsrmm')"
					class="input-style" v-model="userData.rePassword" type="password" />
				<u-input :placeholder="$t('inviteCode')"
					class="input-style" v-model="userData.invite_code" />
				<view :class="!enableUserBtnColor ? 'disable' : 'fetch'" @click="passwordRegister" class="btn">
					{{$t('signup')}}
				</view>
			</view>
				</view>
				<view class="bot-container">
					{{$t('already')}}<span @click="routeToSignIn">{{$t('signin')}}</span>
				</view>
	</view>
</template>

<script>
	import {
		registerReq,
		loginReq
	} from "@/api/login";
	import storage from "@/utils/storage.js"; //缓存
	import {
		md5
	} from "@/utils/md5.js";
	export default {
		data() {
			return {
				wechatLogin: false, //是否加载微信公众号登录
				flage: false, //是否验证码验证
				codeFlag: true, //验证开关，用于是否展示验证码
				tips: "",
				enableUserPwdBox: false, //帐号密码登录
				current: 0,
				codeColor: "#999", //按钮验证码颜色
				lightColor: this.$lightColor,
				seconds: 60, //默认验证码等待时间
				userData: {
					username: "",
					password: "",
					rePassword: "",
					invite_code: ""
				},
				showBack: false,
				enableFetchCode: false,
				enableUserBtnColor: false,
				enablePrivacy: false, //隐私政策
				mobile: "", //手机号
				code: "", //验证码
			};
		},
		onShow() {
			// 只要是app登录的全部清除内容
			// #ifdef APP-PLUS
			storage.setAccessToken("");
			storage.setRefreshToken("");
			storage.setUserInfo({});
			// #endif
		},

		mounted() {
		},
		
		onLoad(options) {
			if (options.invite_code) {
				this.userData.invite_code = options.invite_code
			}
		},
		methods: {
			// 跳转
			routeToSignIn() {
				uni.navigateTo({
					url: '/pages/passport/login'
				})
			},
			
			// 跳转
			navigateToPrivacy(val) {
				uni.navigateTo({
					url: "/pages/mine/help/tips?type=" + val,
				});

			},

			passwordRegister() {
				if (!this.userData.username) {
					uni.showToast({
						title: this.$i18n.t('qtxyhm'),
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.userData.password) {
					uni.showToast({
						title: this.$i18n.t('qsrmm'),
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (!this.userData.rePassword) {
					uni.showToast({
						title: this.$i18n.t('qzcsrmm'),
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (this.userData.password !== this.userData.rePassword) {
					uni.showToast({
						title: this.$i18n.t('lcmmbyz'),
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
				if (!this.userData.invite_code) {
					uni.showToast({
						title: this.$i18n.t('qsryqm'),
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				const dataReq = {
					username: this.userData.username,
					invite_code: this.userData.invite_code,
					password: this.userData.password,
				}
				uni.showLoading()
				registerReq(dataReq).then(res => {
					if (res.code == 0) {
						uni.showLoading()
						loginReq({
							username: this.userData.username,
							password: md5(this.userData.password),
						}).then(res => {
							if (res.code == 0) {
								storage.setAccessToken(res.data.access_token)
								storage.setUserInfo(res.data.user)
								uni.switchTab({
									url: '/pages/tabbar/home/index'
								})
							}
						})
					}
				})
				
			},
		},
	};
</script>

<style lang="scss" scoped>
@import './login.scss';
.other-sign {
	margin-top: 50rpx;
	.other-sign-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
		width: fit-content;
		width: 100%;
		color: rgba(#fff, 0.5);
		margin-bottom: 50rpx;
		&::before {
			content: '';
			flex: 1;
			height: 2rpx;
			background: rgba(#fff, 0.5);
		}
		&::after {
			content: '';
			flex: 1;
			height: 2rpx;
			background: rgba(#fff, 0.5);
		}
	}
	.icon-list {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
		img {
			width: 96rpx;
			object-fit: contain;
		}
	}
}
	.forget {
		color: #F061FF;
		font-size: 28rpx;
		margin-top: 44rpx;
		padding-left: 20rpx;
	}
	.desc,
	.desc-light {
		font-size: 32rpx;
		line-height: 32rpx;
		color: #333333;
		margin-top: 40rpx;
	}

	.desc {
		color: #333;
	}

	.desc-light {
		color: #999999;

		>span {
			color: #333;
			margin-left: 8rpx;
		}
	}

	
	.tips {
		font-size: 12px;
		line-height: 20px;
		margin-top: 32rpx;
		width: 546rpx;

		>span {
			color: $light-color;
		}
	}
	
	.fetch-btn {
		width: 370rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #f2f2f2;
		border-radius: 100rpx;
		font-size: 28rpx;
		color: #999;

		margin: 71rpx auto 0 auto;
	}

	.login-list {
		display: flex;
		width: 590rpx;
		position: absolute;
		top: 1200rpx;
		align-items: center;
		justify-content: center;
	}

	.login-item {
		width: 80rpx;
		border-radius: 10rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		margin: 0 20rpx;
	}

	.user-password-tips {
		text-align: center;
		color: $main-color;
		margin: 20px 0;
	}
</style>
