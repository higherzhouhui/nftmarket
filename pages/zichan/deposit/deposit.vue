<template>
	<view class="deposit-container">
		<view class="title">
			<view class="left">{{$t('selectNet')}}</view>
			<view class="right">
				<picker mode="selector" :range="chainList" @change="onChangeChain" range-key="label">
					<view class="custom-picker">
						{{getSelectLabel(chain)}}
						<image src="/static/index/xiala.png" class="select-img" />
					</view>
				</picker>
			</view>
		</view>
		<view class="countText" v-if="countText">
			<view class="text">
			{{countText}}
			<!-- <image src="/static/zichan/shuaxin.png" class="shuaxin"></image> -->
			</view>
		</view>
		<view class="qrcode-wrapper">
			<view class="code-container">
				<view class="code-border" :style="{zIndex: chain == 'TRON' ? 10 : -1}">
					<canvas :style="{ width: qrcode_w + 'px', height: qrcode_w + 'px' }" canvas-id="trc20"
						id="trc20"></canvas>
				</view>

				<view class="code-border" :style="{zIndex: chain == 'BSC' ? 10 : -1}">
					<canvas :style="{ width: qrcode_w + 'px', height: qrcode_w + 'px' }" canvas-id="bep20"
						id="bep20"></canvas>
				</view>
			</view>

			<view class="qr-title">{{$t('depositAddress')}}（{{chain}}）</view>
			<view class="qr-address">
				{{getSelectAddress(chain)}}
				<image @click="handleCopy($event, getSelectAddress(chain))" src="/static/zichan/fuzhi.png"
					class="copy-img" mode="aspectFill"></image>
			</view>
			<view class="btn-color zf-btn" @click="handlePay">{{$t('yzhifu')}}</view>
		</view>
		<view class="hint" v-if="lang == 'zh-Hans'">
			注意：仅支持{{getSelectLabel(chain)}}资产，其他资产将会永久丢失。
		</view>
		<view class="hint" v-else>
			Note: Only {{getSelectLabel(chain)}} assets are supported, other assets will be permanently lost.
		</view>
	</view>
</template>

<script>
	import thorui from "@/components/thorui/components/common/tui-clipboard/tui-clipboard.js"
	import qrCode from '@/components/thorui/libs/weapp-qrcode.js';
	import {
		getDepositAddReq, updateRechargeReq
	} from '@/api/user.js'
	export default {
		data() {
			return {
				chain: 'TRON',
				qrcode_w: uni.upx2px(380),
				lang: uni.getLocale(),
				end: Date.now(),
				countText: '',
				timer: '',
				qrtimer: '',
				chainList: [{
						label: this.$i18n.t('bcl'),
						code: 'TRON',
						address: ''
					},
					{
						label: this.$i18n.t('binance'),
						code: 'BSC',
						address: ''
					}
				]
			}
		},
		onReady() {
			//需等canvas初始化完成才可执行方法
			// const depositList = getApp().globalData.depositList || []
			// this.chainList.forEach((item) => {
			// 	depositList.forEach(citem => {
			// 		if (item.code == citem.code) {
			// 			item.address = citem.address
			// 		}
			// 	})
			// })
			this.initData()
		},

		methods: {
			timestampToHHMMSS() {
				let ts = (this.end - new Date().getTime()) / 1000
				var minutes = Math.floor(ts / 60);
				var seconds = Math.floor(ts % 60);

				minutes = minutes < 0 ? 0 : minutes;
				minutes = minutes < 10 ? '0' + minutes : minutes;
				seconds = seconds < 10 ? '0' + seconds : seconds;
				if (ts <= 0) {
					this.initData()
					return ''
				}
				return minutes + ': ' + seconds;
			},

			async initData() {
				if (this.timer) {
					clearInterval(this.timer)
				}
				if (this.qrtimer) {
					clearInterval(this.qrtimer)
				}
				this.countText = ''
				uni.showLoading()
				const res = await getDepositAddReq({
					chain: this.chain
				})
				if (res.code == 0) {
					this.end = Date.now() + 301 * 1000
					this.timer = setInterval(() => {
						this.countText = this.timestampToHHMMSS()
					}, 1000)
					this.updateChargeStatus()
					this.qrtimer = setInterval(() => {
						this.updateChargeStatus()
					}, 30000)
					const address = res.data.wallet
					if (this.chain == 'TRON') {
						this.chainList[0].address = address
					} else {
						this.chainList[1].address = address
					}
					this.initQrcode()
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			},
			updateChargeStatus(shodong) {
				updateRechargeReq().then(res => {
					if (res.code == 0 && shodong) {
						uni.showToast({
							title: this.$i18n.t('czcg'),
							icon: 'none',
							duration: 3000
						})
					}
				})
			},
			initQrcode() {
				new qrCode('trc20', {
					text: this.chainList[0].address,
					width: this.qrcode_w,
					height: this.qrcode_w,
					colorDark: '#333333',
					colorLight: '#FFFFFF',
				});
				new qrCode('bep20', {
					text: this.chainList[1].address,
					width: this.qrcode_w,
					height: this.qrcode_w,
					colorDark: '#333333',
					colorLight: '#FFFFFF',
				});
			},
			onChangeChain(event) {
				this.chain = this.chainList[event.detail.value].code
				this.initData()
			},
			handlePay() {
				uni.showLoading()
				this.updateChargeStatus(true)
			},
			getSelectLabel(code) {
				const itemList = this.chainList.filter(item => {
					return item.code == code
				})
				return itemList[0].label
			},
			getSelectAddress(code) {
				const itemList = this.chainList.filter(item => {
					return item.code == code
				})
				return itemList[0].address
			},
			handleCopy(event, item) {
				thorui.getClipboardData(item, (res) => {
					if (res) {
						//复制成功
						uni.showToast({
							title: this.$i18n.t('copied'),
							icon: 'none'
						})
					} else {
						//复制失败
						console.log('复制失败')
					}
				}, event)
			},
		},
		destroyed() {
			clearInterval(this.timer)
			clearInterval(this.qrtimer)
		}
	}
</script>

<style scoped lang="scss">
	.deposit-container {
		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #fff;
			padding: 8px 12px;
			border: 1px solid #ccc;
			border-left: none;
			border-right: none;
			font-weight: bold;

			.custom-picker {
				display: flex;
				align-items: center;
				gap: 4px;
			}

			.select-img {
				width: 20px;
				height: 20px;
			}
		}
		.countText {
			color: #fff;
			background: #292A41;
			padding-top: 12px;
			.text {
				margin: 0 auto;
				padding: 4px 12px;
				border-radius: 6px;
				width: fit-content;
				background: rgb(30, 30, 48);
				display: flex;
				align-items: center;
				gap: 4px;
			}
			.shuaxin {
				width: 18px;
				height: 18px;
			}
		}
		.qrcode-wrapper {
			color: #fff;
			background: #292A41;
			height: 425px;
			display: flex;
			align-items: center;
			flex-direction: column;

			.qr-title {
				font-size: 16px;
				font-weight: bold;
				margin-top: 250px;
			}

			.qr-address {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 4px;
				margin-top: 20px;
				opacity: 0.8;
				padding: 0 12px;
				word-break: break-all;
				text-align: center;

				.copy-img {
					width: 20px;
					height: 20px;
				}
			}
			
		}
		.zf-btn {
			width: 40%;
			margin-top: 24px;
		}
		.code-border {
			border: 10px solid #1e1e30;
			border-radius: 10px;
		}

		.hint {
			color: #fff;
			opacity: 0.8;
			font-size: 12px;
			padding-left: 12px;
			margin-top: 12px;
		}

		.code-container {
			position: relative;

			.code-border {
				position: absolute;
				left: 0;
				top: 0;
				transform: translate(-50%, 30px);
			}
		}
	}
</style>