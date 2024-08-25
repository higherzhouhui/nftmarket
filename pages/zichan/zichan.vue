<template>
	<view class="zichan-container">
		<view class="wallet-balance">
			<view class="wallet-title">{{$t('dqqbye')}}</view>
			<view class="balance">$&nbsp;5,5454.00</view>
		</view>
		<view class="deposit-withdraw">
			<view class="btn-wrapper" @click="handleRouter('/pages/zichan/deposit/deposit')">
				<image src="/static/zichan/cunkuan.png" class="btn-img"></image>
				{{$t('deposit')}}
			</view>
			<view class="btn-wrapper" @click="handleRouter('/pages/zichan/withdraw/withdraw')">
				<image src="/static/zichan/tixian.png" class="btn-img"></image>
				{{$t('withdraw')}}
			</view>
		</view>
		<view class="address-list">
			<view v-for="item in depositList" :key="item.address" class="address-list-item">
				<view class="address-list-top">
					<view class="left">
						<image @click="handleRefresh(item)" src="/static/zichan/shuaxin.png" class="fresh-img" mode="aspectFill"></image>
						<view class="title">{{item.title}}</view>
					</view>
					<image @click="handleCopy($event, item.address)" src="/static/zichan/fuzhi.png" class="fresh-img" mode="aspectFill"></image>
				</view>
				<view class="address-list-bot">{{formatAddress(item.address, 'long')}}</view>
			</view>
		</view>
		<view class="money-wrapper">
			<view class="money">
				<image src="/static/zichan/zongshouyi.png" class="money-img"></image>
				<view class="money-detail">
					$&nbsp;5154.00
					<view class="money-desc">{{$t('totalsy')}}</view>
				</view>
			</view>
			<view class="money">
				<image src="/static/zichan/yitixian.png" class="money-img"></image>
				<view class="money-detail">
					$&nbsp;5154.00
					<view class="money-desc">{{$t('ytx')}}</view>
				</view>
			</view>
		</view>
		<view class="tixian-record">
			<view class="left">{{$t('txjl')}}</view>
			<view class="right" @click="handleRouter('/pages/zichan/withdrawRecord/withdrawRecord')">
				{{$t('more')}}<image src="/static/zichan/gengduo.png" class="gengduo"></image>
			</view>
		</view>
		<view class="record-list" v-for="(item, index) in recordList" :key="index">
			<view class="top">
				<view class="left">{{item.title}}</view>
				<view class="right">{{item.type == 'deposit' ? '+' : '-'}}{{item.amount}}</view>
			</view>
			<view class="bot">
				<view class="left">{{item.time}}</view>
				<view class="right" :class="`${item.status}`">{{item.status == 'success' ? $t('success') : item.status == 'error' ? $t('fail') : $t('shenhz')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatAddress
	} from '@/utils/tools'
	import thorui from "@/components/thorui/components/common/tui-clipboard/tui-clipboard.js"

	export default {
		data() {
			return {
				recordList: [
					{
						title: '提现USDT(TRC-20)',
						type: 'withdraw',
						time: '2024-08-12 12:00:00',
						status: 'success',
						amount: 300.13,
					},
					{
						title: '提现USDT(TRC-20)',
						type: 'withdraw',
						time: '2024-08-12 12:00:00',
						status: 'error',
						amount: 300.13,
					},
					{
						title: '提现USDT(TRC-20)',
						type: 'withdraw',
						time: '2024-08-12 12:00:00',
						status: 'loading',
						amount: 300.13,
					},
				],
				formatAddress: formatAddress,
				depositList: [{
						title: `${this.$i18n.t('depositAddress')}(BEP-20)`,
						address: '0xfe5a1f5e1afeaafea'
					},
					{
						title: `${this.$i18n.t('depositAddress')}(TRC-20)`,
						address: '0x11f3e5a1f5e1afeaafea'
					},
				]
			}
		},
		methods: {
			handleRouter(link) {
				uni.navigateTo({
					url: link
				})
			},
			handleRefresh(item) {

			},
			handleCopy(event, item) {
				thorui.getClipboardData(item, (res) => {
					// #ifdef H5 || MP-ALIPAY
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
					// #endif
				}, event)
			}
		}
	}
</script>

<style scoped lang="scss">
	.zichan-container {
		padding: 0 12px 12px 12px;

		.wallet-balance {
			width: 100%;
			height: 130px;
			background: linear-gradient(#FF44FF, #8A50FF);
			border-radius: 16px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 30px;
			color: #fff;

			.wallet-title {
				font-size: 28rpx;
				margin-bottom: 10px;
			}

			.balance {
				font-size: 60rpx;
				font-weight: bold;
			}
		}

		.deposit-withdraw {
			margin-top: 20px;
			display: flex;
			gap: 10px;

			.btn-wrapper {
				padding: 10px 0;
				flex: 1;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 16px;
				gap: 8px;
				background-color: #292A41;
				border: 1px solid #8C50FF;

				.btn-img {
					width: 30px;
					height: 30px;
				}
			}
		}

		.address-list {
			.address-list-item {
				margin-top: 10px;
				background: #292A41;
				border-radius: 16px;
				padding: 14px 12px;
				color: #fff;

				.address-list-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10px;

					.left {
						display: flex;
						align-items: center;
						gap: 6px;
					}
				}

				.fresh-img {
					width: 20px;
					height: 20px;
				}

				.address-list-bot {
					opacity: 0.8;
				}
			}
		}
		.money-wrapper {
			display: flex;
			gap: 10px;
			margin-top: 10px;
			.money {
				background: #292A41;
				border-radius: 16px;
				gap: 8px;
				padding: 8px 0;
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				color: #fff;
				.money-img {
					width: 24px;
					height: 24px;
				}
				.money-desc {
					font-size: 12px;
					opacity: 0.7;
					margin-top: 6px;
				}
			}
		}
		.tixian-record {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 15px 0 10px 0;
			color: #fff;
			.right {
				display: flex;
				font-size: 12px;
				opacity: 0.8;
				align-items: center;
			}
			.gengduo {
				width: 20px;
				height: 20px;
			}
		}
	}
	.record-list {
		background: #292A41;
		padding: 12px;
		border-radius: 12px;
		color: #fff;
		margin-top: 10px;
		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.right {
				font-weight: bold;
			}
		}
		.bot {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 8px;
			opacity: 0.8;
			font-size: 12px;
		}
		.success {
			background: rgb(54, 73, 94);
			padding: 2px 8px;
			border-radius: 4px;
			color: #68C6D2;
		}
		.error {
			background: rgb(84, 49, 67);
			padding: 2px 8px;
			border-radius: 4px;
			color: #FF4D4D;
		}
		.loading {
			background: rgb(53, 68, 103);
			padding: 2px 8px;
			border-radius: 4px;
			color: #64ABFF;
		}
	}
</style>