<template>
	<view class="zichan-container">
		<picker mode="selector" :range="reasonList" @change="onChangeReason" range-key="label">
			<view class="custom-picker">
				<view class="cp-left">{{$t('type')}}</view>
				<view class="cp-right">
					{{label}}
					<image src="/static/index/xiala.png" class="renzheng" mode="widthFix" />
				</view>
			</view>
		</picker>
		<view class="record-list" v-for="(item, index) in recordList" :key="index">
			<view class="top">
				<view class="left" v-if="lang == 'en'">{{item.reason_text_en}}</view>
				<view class="left" v-else>{{item.reason_text}}</view>
				<view class="right">{{Number(item.money).toFixed(2)}}</view>
			</view>
			<view class="bot">
				<view class="left">{{item.time}}</view>
				<view class="right">
					<text>{{$t('balance')}}:</text>{{Number(item.after).toFixed(2)}}
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
	import moment from 'moment'
import {
		getWalletLogReq
	} from '@/api/user.js'
	export default {
		data() {
			return {
				reason: 0,
				label: this.$i18n.t('all'),
				hasNextPage: true,
				lang: uni.getLocale(),
				loading: true,
				params: {
					pageNum: 1,
					pageSize: 10
				},
				reasonList: [{
						label: this.$i18n.t('all'),
						code: 0
					},
					{
						label: this.$i18n.t('chognzhi'),
						code: 1
					},
					{
						label: this.$i18n.t('xtchognzhi'),
						code: 2
					},
					{
						label: this.$i18n.t('shouyi'),
						code: 3
					},
					{
						label: this.$i18n.t('txbh'),
						code: 4
					},
					{
						label: this.$i18n.t('txshibai'),
						code: 5
					},

					{
						label: this.$i18n.t('withdraw'),
						code: -1
					},
					{
						label: this.$i18n.t('buyNft'),
						code: -2
					},
				],
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
	
		onShow() {
			this.initGetData()
		},
		methods: {
			async initGetData() {
				uni.showLoading()
				this.loading = true
				const res = await getWalletLogReq({
					page: this.params.pageNum,
					page_size: this.params.pageSize,
					reason: this.reason
				})
				this.loading = false
				if (res.code == 0) {
					const list = res.data.list
					list.map(item => {
						item.time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
					})
					if (this.params.pageNum == 1) {
						this.recordList = list
					} else {
						this.recordList = [...this.recordList, ...list]
					}
					this.hasNextPage = list.length == this.params.pageSize
				}
				uni.stopPullDownRefresh()
			},

			onChangeReason(e) {
				//选择的结果
				const index = e.detail.value;
				this.reason = this.reasonList[index].code
				this.label = this.reasonList[index].label
				this.initGetData()
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

	.custom-picker {
		width: 100%;
		color: #fff;
		display: flex;
		padding: 6px 12px;
		justify-content: space-between;
		.cp-right {
			display: flex;
			align-items: center;
			gap: 6px;
		}
		.renzheng {
			width: 22px;
		}
	}
</style>