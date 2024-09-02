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
		</view>
		<view class="hint" v-if="lang == 'zh-Hans'">
			注意：仅支持{{getSelectLabel(chain)}}资产，其他资产将会永久丢失
		</view>
		<view class="hint" v-else>
			Note: Only {{getSelectLabel(chain)}} assets are supported, other assets will be permanently lost.
		</view>
	</view>
</template>

<script>
	import thorui from "@/components/thorui/components/common/tui-clipboard/tui-clipboard.js"
	import qrCode from '@/components/thorui/libs/weapp-qrcode.js';

	export default {
		data() {
			return {
				chain: 'TRON',
				qrcode_w: uni.upx2px(380),
				lang: uni.getLocale(),
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
			const depositList = getApp().globalData.depositList || []
			this.chainList.forEach((item) => {
				depositList.forEach(citem => {
					if (item.code == citem.code) {
						item.address = citem.address
					}
				})
			})
			this.initData()
		},
		
		methods: {
			initData() {
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
			padding: 0 12px;

			.custom-picker {
				display: flex;
				align-items: center;
				gap: 4px;
				opacity: 0.8;
			}

			.select-img {
				width: 20px;
				height: 20px;
			}
		}

		.qrcode-wrapper {
			color: #fff;
			margin: 12px 0;
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

		.code-border {
			border: 10px solid #1e1e30;
			border-radius: 10px;
		}

		.hint {
			color: #fff;
			opacity: 0.7;
			font-size: 12px;
			padding-left: 12px;
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