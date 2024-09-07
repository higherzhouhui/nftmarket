<template>
	<div class="wrapper">
		<!-- <u-navbar :is-back="showBack" :border-bottom="false"></u-navbar> -->
		<div class="top-container">
			<div class="wrapper-title">{{$t('findyour')}}</div>
			<div class="wrapper-title">{{$t('nfttoday')}}</div>
			<div class="input-wrapper">
				<div class="sign-title">{{$t("signin")}}</div>
				<u-input :placeholder="$t('username')" class="input-style" v-model="userData.username" />
				<u-input :placeholder="$t('password')" class="input-style" v-model="userData.password"
					type="password" />
				<div class="forget">{{$t('forget')}}</div>
				<div :class="!enableUserBtnColor ? 'disable' : 'fetch'" @click="passwordLogin" class="btn">
					{{$t("signin")}}
				</div>
			</div>
			<div class="other-sign">
				<div class="other-sign-title">{{$t('orsign')}}</div>
				<div class="icon-list" @click="handleToast">
					<div v-for="(item, index) in loginList" :key="item.code">
						<image :src="`/static/login/${item.icon}.png`" alt="logo" class="icon" mode="widthFix" />
					</div>
				</div>
			</div>
		</div>
		<div class="bot-container">
			{{$t('donthaa')}}<span @click="routeToSignUp">{{$t('signup')}}</span>
		</div>
	</div>
</template>

<script>
	import {
		loginReq
	} from "@/api/login";
	import {
		md5
	} from "@/utils/md5.js";
	import storage from "@/utils/storage";
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
				userData: storage.getLoginInfo() || {
					username: '',
					password: ''
				},
				showBack: false,
				enableFetchCode: false,
				enableUserBtnColor: false,
				enablePrivacy: false, //隐私政策
				mobile: "", //手机号
				code: "", //验证码
				loginList: [
					//第三方登录集合
					{
						icon: "twitter",
						title: "twitter",
						code: "twitter",
					},
					{
						icon: "facebook",
						title: "facebook",
						code: "facebook",
					},
					{
						icon: "google",
						title: "google",
						code: "google",
					},
				],
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

		mounted() {},
		watch: {
			current(val) {
				val ? (this.showBack = true) : (this.showBack = false);
			},

		},
		onLoad(options) {

		},
		methods: {
			handleToast() {
				uni.showToast({
					title: 'Coom soon!',
					icon: 'none'
				})
			},
			routeToSignUp() {
				uni.navigateTo({
					url: '/pages/passport/register'
				})
			},
			passwordLogin() {
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
				uni.showLoading()
				loginReq({
					username: this.userData.username,
					password: md5(this.userData.password),
				}).then(res => {
					if (res.code == 0) {
						storage.setLoginInfo({
							username: this.userData.username,
							password: this.userData.password,
						})
						storage.setAccessToken(res.data.access_token)
						storage.setUserInfo(res.data.user)
						uni.switchTab({
							url: '/pages/tabbar/home/index'
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

			.icon {
				width: 96rpx;
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