<template>
	<view class="zichan-container">
		<view class="tixian-record">
			<view class="left">{{$t('time')}}</view>
			<view class="right">
				<picker mode="date" :value="result" start="1920-01" end="2100-12" fields="month"
					@change="bindDateChange">
					<view>{{result}}</view>
				</picker>
				<image src="/static/index/xiala.png" mode="widthFix" class="xiala"></image>
			</view>
		</view>
		<view class="record-list" v-for="(item, index) in recordList" :key="index">
			<view class="top">
				<view class="left">{{item.title}}</view>
				<view class="right">{{item.type == 'deposit' ? '+' : '-'}}{{item.amount}}</view>
			</view>
			<view class="bot">
				<view class="left">{{item.time}}</view>
				<view class="right" :class="`${item.status}`">
					{{item.status == 'success' ? $t('success') : item.status == 'error' ? $t('error') : $t('shenhz')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result: '2024-08',
				params: {
					pageNum: 1,
					pageSize: 10
				},
				recordList: [{
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
			}
		},
		onPullDownRefresh() {

		},
		onReachBottom() {

		},
		onLoad() {
			this.initDate()
		},
		methods: {
			bindDateChange(e) {
				this.result = e.detail.value
			},
			initDate(time) {
				const date = new Date()
				const yesr = date.getFullYear()
				let month = date.getMonth() + 1
				if (month < 10) {
					month = `0${month}`
				}
				const str = `${yesr}-${month}`
				this.result = str
			},
			show(e) {
				console.log(111)
				this.dateTimePicker = true
				return
				console.log(this.$refs.dateTime)
				this.$refs.dateTime && this.$refs.dateTime.show();
			},
			change(e) {
				//选择的结果
				this.result = e.result;
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
</style>