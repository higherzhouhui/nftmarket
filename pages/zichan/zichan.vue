<template>
	<view class="zichan-container">
		<view class="wallet-balance" @click="handleRouter('/pages/zichan/zcDetail/zcDetail')">
			<view class="wallet-title">{{$t('dqqbye')}}</view>
			<view class="balance" v-if="userInfo.balance">$&nbsp;{{Number(userInfo.balance).toFixed(2)}}</view>
			<view class="balance" v-else>$&nbsp;0</view>
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
		<!-- <view class="address-list">
			<view v-for="(item, index) in depositList" :key="item.title" class="address-list-item">
				<view class="address-list-top">
					<view class="left">
						<image @click="handleRefresh(item.code, index)" src="/static/zichan/shuaxin.png" class="fresh-img"
							mode="aspectFill"></image>
						<view class="title">{{item.title}}</view>
					</view>
					<image @click="handleCopy($event, item.address)" src="/static/zichan/fuzhi.png" class="fresh-img"
						mode="aspectFill"></image>
				</view>
				<view class="address-list-bot">{{formatAddress(item.address, 'long')}}</view>
			</view>
		</view> -->
		<view class="money-wrapper">
			<view class="money">
				<image src="/static/zichan/zongshouyi.png" class="money-img"></image>
				<view class="money-detail">
					$&nbsp;{{Number(userInfo.incomeTotal).toFixed(2)}}
					<view class="money-desc">{{$t('totalsy')}}</view>
				</view>
			</view>
			<view class="money">
				<image src="/static/zichan/yitixian.png" class="money-img"></image>
				<view class="money-detail">
					$&nbsp;{{Number(userInfo.withdraw_amount).toFixed(2)}}
					<view class="money-desc">{{$t('ytx')}}</view>
				</view>
			</view>
		</view>
		<view class="money-wrapper">
			<view class="money">
				<image src="/static/zichan/gift.png" class="money-img"></image>
				<view class="money-detail">
					$&nbsp;{{Number(userInfo.gift_amount).toFixed(2)}}
					<view class="money-desc">{{$t('zsje')}}</view>
				</view>
			</view>
			<view class="money">
				<image src="/static/zichan/shifang.png" class="money-img"></image>
				<view class="money-detail">
					$&nbsp;{{Number(userInfo.released_amount).toFixed(2)}}
					<view class="money-desc">{{$t('yjsf')}}</view>
				</view>
			</view>
		</view>
		<view class="tixian-record">
			<view class="left">{{$t('txjl')}}</view>
			<view class="right" @click="handleRouter('/pages/zichan/withdrawRecord/withdrawRecord')">
				{{$t('more')}}
				<image src="/static/zichan/gengduo.png" class="gengduo"></image>
			</view>
		</view>
		<view class="record-list" v-for="(item, index) in recordList" :key="index">
			<view class="top">
				<view class="left">
					<view class="left-title">{{item.title}}</view>
					<!-- <view class="left-address" @click="handleCopy($event, item.address)">
					{{item.address}}
					</view> -->
				</view>
				<view class="right">{{Number(item.extraction_amount).toFixed(2)}}</view>
			</view>
			<view class="bot">
				<view class="left">{{item.time}}</view>
				<view class="right" :class="`status${item.status}`">
					{{item.status == 1 ? $t('success') : item.status == 2 ? $t('fail') : $t('shenhz')}}
				</view>
			</view>
		</view>
		<view class="empty" v-if="!recordList.length">
			<image src="/static/empty.png" class="empty-img" mode="widthFix"></image>
			<view class="desc">{{$t('nodata')}}</view>
		</view>
	</view>
</template>

<script>
	import {
		formatAddress
	} from '@/utils/tools'
	import thorui from "@/components/thorui/components/common/tui-clipboard/tui-clipboard.js"
	import storage from '@/utils/storage'
	import {
		getUserInfoReq, getDepositAddReq, getWithDrawListReq
	} from '@/api/user.js'
import moment from 'moment'
	export default {
		data() {
			return {
				userInfo: storage.getUserInfo(),
				lang: uni.getLocale(),
				recordList: [{
						title: '',
						type: 'withdraw',
						time: '2024-08-12 12:00:00',
						status: 'success',
						amount: 300.13,
					},
					{
						title: '',
						type: 'withdraw',
						time: '2024-08-12 12:00:00',
						status: 'error',
						amount: 300.13,
					},
					{
						title: '',
						type: 'withdraw',
						time: '2024-08-12 12:00:00',
						status: 'loading',
						amount: 300.13,
					},
				],
				formatAddress: formatAddress,
				depositList: [{
						title: `${this.$i18n.t('depositAddress')}(BEP-20)`,
						address: '',
						code: 'BSC',
						label: 'BSC',
					},
					{
						title: `${this.$i18n.t('depositAddress')}(TRC-20)`,
						address: '',
						label: 'TRC',
						code: 'TRON',
					},
				]
			}
		},
		onShow() {
			this.initData()
		},
		onPullDownRefresh() {
			this.initData()
		},
		methods: {
			initData() {
				uni.showLoading()
				
				getUserInfoReq().then(res => {
					if (res.code == 0) {
						storage.setUserInfo(res.data)
						this.userInfo = res.data
					}
				})
				
				// this.depositList.map((item, index) => {
				// 	this.handleRefresh(item.code, index)
				// })
				getWithDrawListReq({page: 1, page_size: 3}).then(res => {
					if (res.code == 0) {
						this.recordList = res.data.list
						this.recordList.map(item => {
							const title = this.$i18n.t('withdraw') + ' USDT'
							const title1 = item.chain == 1 ? ' (BEP-20)' : ' (TRC-20)'
							item.title = title + title1
							item.time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
						})
					}
				})
				
				uni.stopPullDownRefresh()
			},
			handleRouter(link) {
				uni.navigateTo({
					url: link
				})
			},
			async handleRefresh(type, index) {
				uni.showLoading()
				const res = await getDepositAddReq({chain: type})
				if (res.code == 0) {
					this.depositList[index].address = res.data.wallet
					getApp().globalData.depositList = this.depositList
				}
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
			margin: 20px 0;
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
				padding: 8px 0 8px 55px;
				display: flex;
				align-items: center;
				flex: 1;
				color: #fff;
				position: relative;
				.money-img {
					position: absolute;
					width: 24px;
					height: 24px;
					left: 15px;
					top: 50%;
					transform: translate(0, -50%);
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
		.left-address {
			word-break: break-all;
			opacity: 0.8;
			font-size: 13px;
			margin-top: 2px;
		}
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

		.status1 {
			background: rgb(54, 73, 94);
			padding: 2px 8px;
			border-radius: 4px;
			color: #68C6D2;
		}

		.status2 {
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