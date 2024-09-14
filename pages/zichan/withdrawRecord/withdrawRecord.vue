<template>
	<view class="zichan-container">
		<view class="tixian-record">
			<view class="left">{{$t('time')}}</view>
			<view class="right">
				<picker mode="date" :value="month" start="1920-01" end="2100-12" fields="month"
					@change="bindDateChange">
					<view>{{month}}</view>
				</picker>
				<image src="/static/index/xiala.png" mode="widthFix" class="xiala"></image>
			</view>
		</view>
		<view class="record-list" v-for="(item, index) in recordList" :key="index">
			<view class="top">
				<view class="left">
					<view class="left-title">{{item.title}}</view>
				<!-- 	<view class="left-address" @click="handleCopy($event, item.address)">
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
		<view class="empty" v-if="!recordList.length && !loading">
			<image src="/static/empty.png" class="empty-img" mode="widthFix"></image>
			<view class="desc">{{$t('nodata')}}</view>
		</view>
	</view>
</template>

<script>
	import {
		getWithDrawListReq
	} from '@/api/user.js'
	import moment from 'moment'
	import thorui from "@/components/thorui/components/common/tui-clipboard/tui-clipboard.js"
	
	export default {
		data() {
			return {
				month: '2024-08',
				hasNextPage: true,
				loading: true,
				params: {
					pageNum: 1,
					pageSize: 10
				},
				recordList: [],
			}
		},
		onPullDownRefresh() {
			this.params.pageNum = 1
			this.initGetData()
		},
		onReachBottom() {
			if (this.hasNextPage) {
				this.params.pageNum += 1
				this.initGetData()
			}
		},
		onLoad() {
			this.initDate()
		},
		onShow() {
			this.initGetData()
		},
		methods: {
			async initGetData() {
				uni.showLoading()
				this.loading = true
				const res = await getWithDrawListReq({
					page: this.params.pageNum,
					page_size: this.params.pageSize,
					month: this.month
				})
				this.loading = false
				if (res.code == 0) {
					const list = res.data.list
					if (this.params.pageNum == 1) {
						this.recordList = list
					} else {
						this.recordList = [...this.recordList, ...list]
					}
					this.recordList.map(item => {
						const title = this.$i18n.t('withdraw') + ' USDT'
						const title1 = item.chain == 1 ? ' (BEP-20)' : ' (TRC-20)'
						item.title = title + title1
						item.time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
					})
					this.hasNextPage = list.length == this.params.pageSize
				}
				uni.stopPullDownRefresh()
			},
			bindDateChange(e) {
				this.month = e.detail.value
			},
			initDate(time) {
				const date = new Date()
				const yesr = date.getFullYear()
				let month = date.getMonth() + 1
				if (month < 10) {
					month = `0${month}`
				}
				const str = `${yesr}-${month}`
				this.month = str
			},
			show(e) {

				this.dateTimePicker = true
				return
				console.log(this.$refs.dateTime)
				this.$refs.dateTime && this.$refs.dateTime.show();
			},
			change(e) {
				//选择的结果
				this.month = e.month;
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
			color: #aaa;
			background: #292A41;
			padding: 8px 12px;
			display: flex;
			gap: 8px;
			border-radius: 8px;
		}

		.xiala {
			width: 20px;
			height: 20px;
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