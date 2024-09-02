<template>
	<view class="email-container">
		<view class="custom-input">
			<view class="label">{{$t('wdemail')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsryxdz')" class="custom-input-style" v-model="email" :disabled="isBind">
				</u-input>
			</view>
		</view>
		<view class="custom-input" v-if="!isBind">
			<view class="label">{{$t('yzm')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsryzm')" class="custom-input-style" v-model="code">
				</u-input>
				<view class="yzm" @click="sendMsg">
					<view class="send" v-if="!count">{{$t('send')}}</view>
					<view class="send" v-else>{{count}}S</view>
				</view>
			</view>
		</view>
		<view class="btn-color btn" @click="confirm" v-if="!isBind">{{$t('queren')}}</view>
	</view>
</template>

<script>
	import {
		sendEmailCodeReq, changeEmailReq
	} from '@/api/user.js'
	import storage from "@/utils/storage";
	export default {
		data() {
			return {
				email: storage.getUserInfo().email,
				count: 0,
				timer: '',
				code: '',
				isBind: storage.getUserInfo().email ? true : false
			}
		},

		methods: {
			sendMsg() {
				if (this.count) {
					return
				}
				const emailRegExp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
				if (emailRegExp.test(this.email)) {
					uni.showLoading()
					sendEmailCodeReq({
						email: this.email
					}).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: this.$i18n.t('sendSuccess'),
								icon: 'none'
							})
							this.count = 60
							this.timer = setInterval(() => {
								this.count--;
								if (this.count == 0) {
									clearInterval(this.timer)
								}
							}, 1000)
						}
					})
				} else {
					uni.showToast({
						title: this.$i18n.t('emailError'),
						icon: 'none'
					})
				}
			},
			confirm() {
				if (!this.email) {
					uni.showToast({
						title: this.$i18n.t('qsryxdz'),
						icon: 'none'
					})
					return
				} 
				if (!this.code) {
					uni.showToast({
						title: this.$i18n.t('qsryzm'),
						icon: 'none'
					})
					return
				} 
				uni.showLoading()
				changeEmailReq({
					email: this.email,
					code: this.code
				}).then(res => {
					if (res.code == 0) {
						const userInfo = {
							...this.userInfo,
							email: this.email
						}
						storage.setUserInfo(userInfo)
						uni.showToast({
							title: this.$i18n.t('czcg'),
							icon: 'none'
						})
					}
				})
			},
		},
		destroyed() {
			clearInterval(this.timer)
		},
	}
</script>

<style scoped lang="scss">
	.email-container {
		padding: 12px;

		.btn {
			margin-top: 50px;
		}

		.custom-input {
			margin-top: 12px;
		}

		.yzm {
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translate(0, -50%);
			background: #fff;
			color: #2ead67;
			border-radius: 4px;
			padding: 2px 6px;
		}
	}
</style>