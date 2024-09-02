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
		<view class="form">
			<view class="custom-input">
				<view class="label">{{$t('skdz')}}（{{chain}}）</view>
				<view class="cunst-input-wrapper">
					<u-input :placeholder="$t('qsrskdz')" class="custom-input-style" focus v-model="address">
					</u-input>
					<view class="right-desc" @click="zhantie">{{$t('zhantie')}}</view>
				</view>
			</view>
			<view class="custom-input">
				<view class="label">{{$t('txje')}}（USDT）</view>
				<view class="cunst-input-wrapper">
					<u-input :placeholder="$t('qsrtxje')" @input="onInput" class="custom-input-style" type="number"
						v-model="amount">
					</u-input>
					<view class="right-desc" @click="zuida">{{$t('max')}}</view>
				</view>
			</view>
		</view>
		<view class="hint">
			{{$t('hintWithdraw')}}
		</view>
		<view class="btn-wrapper">
			<view class="global-btn" @click="open">{{$t('queren')}}</view>
		</view>
		<popPasswordVue ref="popPassword" @callBack="handleConfirm"/>
	</view>
</template>

<script>
	import popPasswordVue from '@/components/pop-password.vue'
	import { withDrawReq } from '@/api/user.js'
import storage from '@/utils/storage'
	export default {
		data() {
			return {
				userInfo: storage.getUserInfo(),
				address: '',
				amount: '',
				chain: 'TRON',
				maxValue: Number(storage.getUserInfo().balance),
				chainList: [{
						label: this.$i18n.t('bcl'),
						code: 'TRON',
					},
					{
						label: this.$i18n.t('binance'),
						code: 'BSC',
					}
				]
			}
		},
		components: {
			popPasswordVue
		},
		methods: {
			async handleConfirm(password) {
				uni.showLoading()
				const data = {
					chain: this.chain == 'BSC' ? 1 : 2,
					address: this.address,
					amount: this.amount,
					password
				}
				const res = await withDrawReq(data)
				if (res.code == 0) {
					uni.showToast({
						title: this.$i18n.t('txcg'),
						icon: 'none'
					})
				}
			},
			open() {
				if (!this.address) {
					uni.showToast({
						title: this.$i18n.t('qsrskdz'),
						icon: 'none'
					})
					return
				}
				// if (!parseInt(this.amount)) {
				// 	uni.showToast({
				// 		title: this.$i18n.t('qsrtxje'),
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				this.$refs.popPassword.open()
			},
			initData() {

			},
			zuida() {
				this.amount = this.maxValue
			},
			onInput(value) {
				const val = parseInt(value)
				if (val >= this.maxValue) {
					this.amount = this.maxValue
				}
				if (parseInt(this.amount) > this.maxValue) {
					this.amount = this.maxValue
				}
			},
			zhantie() {
				uni.getClipboardData({
					success: (res) => {
						this.address = res.data
					},
					fail: (res) => {
						console.log(res)
					},
				})
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

		.form {
			padding: 0 12px;
			margin-top: 20px;
			color: #fff;
		}

		.custom-input {
			margin-top: 30px;
		}

		.hint {
			padding: 12px;
			color: #aaa;
			font-size: 12px;
			margin: 22px 0 20px 0;
		}

		.btn-wrapper {
			padding: 0 12px;
		}
	}
</style>