<template>
	<view class="password-set-page">
		<view class="title" v-if="step == 1">
			<view class="qiehuan" @click="handleSwitch">{{$t('qiehuan')}}</view>
			<view>
				<view v-if="type == 'old'">{{$t('qsrzfmm')}}</view>
				<view v-else class="eamil-verify">
					<text>{{$t('syyxyz')}}</text>
					<text v-if="!count" @click="send" class="send">{{$t('send')}}</text>
					<text v-else class="send">{{count}}S</text>
				</view>
			</view>
		</view>
		<view class="title" v-if="step == 2">
			{{$t('szlwszzfmm')}}
		</view>
		<view class="title" v-if="step == 3">
			{{$t('qzcsrmm')}}
		</view>
		<view class="code">
			<view v-for="(item, index) in 6" :key="index">
				{{ type == 'old' || step != 1 ? (password[index] && '●' || '') : password[index] }}</view>
		</view>
		<view v-if="error" class="error">{{error}}</view>
		<view class="keyboard flex flex-wrap">
			<button v-for="(item, index) in 9" :key="index" @click="key(index + 1)">
				<text>{{ index + 1 }}</text>
			</button>
			<button class="hide"></button>
			<button @click="key(0)">
				<text>0</text>
			</button>
			<button @click="del()">
				<image src="/static/wode/delete.png" mode="aspectFill"></image>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		sendPayPasswordReq,
		setPayPassWordReq
	} from '@/api/user.js'
	import {md5 } from '@/utils/md5.js'
	export default {
		data() {
			return {
				count: 0,
				step: 1,
				password: '',
				repassword: '',
				error: false,
				current_pay_password: '',
				code: '',
				type: 'email',
				timer: '',
			}
		},

		methods: {
			async send() {
				uni.showLoading()
				const res = await sendPayPasswordReq()
				if (res.code == 0) {
					this.count = 60
					this.timer = setInterval(() => {
						this.count--;
						if (this.count == 0) {
							clearInterval(this.timer)
						}
					}, 1000)
				}
			},
			handleSwitch() {
				if (this.type == 'old') {
					this.type = 'email'
				} else {
					this.type = 'old'
				}
			},
			judgeValid(str) {
				const regexp =
					/([0-9])\1{5}|((?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){5}\d)|((?:0(?=9)|9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){5}\d)/;
				const isError = regexp.test(str)
				return !isError
			},
			key(key) {
				if (this.password.length < 6) {
					this.password += key
					if (this.password.length === 6) {
						if (this.step == 1) {
							if (this.type == 'old') {
								this.current_pay_password = md5(this.password)
							} else {
								this.code = this.password
							}
							this.step = 2
							this.password = ''
						} else if (this.step == 2) {
							if (this.judgeValid(this.password)) {
								this.repassword = this.password
								this.password = ''
								this.step = 3
							} else {
								this.error = this.$i18n.t('errorszlwszzfmm')
							}
						} else if (this.step == 3) {
							if (this.password !== this.repassword) {
								this.error = this.$i18n.t('lcmmbyz')
							} else {
								uni.showLoading()
								setPayPassWordReq({
									current_pay_password: this.current_pay_password ? this.current_pay_password : undefined,
									new_pay_password: this.password ? this.password : undefined,
									code: this.code
								}).then(res => {
									if (res.code == 0) {
										uni.showToast({
											title: this.$i18n.t('czcg'),
											icon: 'none'
										})
										setTimeout(() => {
											uni.switchTab({
												url: '/pages/wode/wode'
											})
										}, 1500)
									}
								})
							}
						}
					}
				}
			},

			del() {
				if (this.password.length == 6) {
					if (this.error) {
						this.error = ''
					}
				}
				if (this.password.length > 0) {
					this.password = this.password.substring(0, this.password.length - 1)
				}
			}
		},
		destroyed() {
			clearInterval(this.timer)
		},
	}
</script>

<style lang="scss" scoped>
	.password-set-page {
		padding: 0 12px;

		.title {
			text-align: center;
			color: #999DB7;
			margin: 30px 0 80px 0;

			.qiehuan {
				color: #f2f2ff;
				margin-bottom: 12px;
			}
		}

		.eamil-verify {
			.send {
				margin-left: 4px;
				background: rgba(255, 255, 255, 0.9);
				color: #000;
				padding: 2px 4px;
				border-radius: 4px;
			}
		}

		.code {
			display: flex;
			align-items: center;
			justify-content: space-around;

			view {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height: 80rpx;
				background: #34354E;
				border-radius: 8px;
				color: #fff;
			}
		}

		.error {
			color: #999DB7;
			text-align: center;
			margin-top: 12px;
			width: 100%;
		}

		.keyboard {
			position: fixed;
			bottom: 0;
			width: 100%;
			background: rgba(255, 255, 255, 0.1);
			left: 0;
			display: grid;
			grid-template-columns: repeat(3, 1fr);

			button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: calc(100vw / 3 - 1px);
				background: rgba(255, 255, 255, 0.1);
				border-radius: 0;
				margin-top: 1px;
				font-size: 50rpx;
				height: 120rpx;
				color: #fff;
				opacity: 0.6;

				&.button-hover:not(.hide) {
					background: #EEEEEE;
				}

				image {
					width: 52rpx;
					height: 38rpx;
				}
			}
		}
	}
</style>