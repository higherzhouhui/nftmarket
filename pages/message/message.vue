<template>
	<view class="message-container">
		<view class="list-item" v-for="item in list" :key="item.title">
			<view class="left">
				<image :src="`/static/market/${item.type}.png`" class="icon"></image>
			</view>
			<view class="right">
				<view class="top">
					<view class="title">{{item.title}}</view>
					<view class="time">{{item.time}}</view>
				</view>
				<view class="desc">{{item.desc}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasNextPage: true,
				params: {
					pageNum: 1,
					pageSize: 4
				},
				list: [
				
				]
			}
		},
		onPullDownRefresh() {
			this.params.pageNum = 1
			this.getData()
		},
		//上拉加载触发方法
		onReachBottom() {
			if(this.hasNextPage) {    //判断是否还有数据需要加载
				this.params.pageNum = this.params.pageNum + 1
				this.getInitData()    //获取数据
			}
		},
		onShow() {
			this.getDate()
		},
		methods: {
			getDate() {
				uni.showLoading()
				const _list = [
					{
						title: '系统公告',
						desc: '8月14日22:00进行系统维护的通知',
						type: 'system',
						time: '08-18 17:56'
					},
					{
						title: '交易提醒',
						desc: '有新的nft等待付款',
						type: 'transaction',
						time: '08-17 17:56'
					},
					{
						title: '活动提醒',
						desc: '现在开始参与质押NFT赢大奖',
						type: 'activity',
						time: '08-14 17:56'
					},
					{
						title: '活动提醒',
						desc: '现在开始参与质押NFT赢大奖',
						type: 'activity',
						time: '08-14 17:56'
					},
				]
				this.list = [...this.list, ..._list]
				uni.stopPullDownRefresh()
				uni.hideLoading()
				this.hasNextPage = _list.length == this.params.pageSize ? true : false
			}
		}
	}
</script>

<style scoped lang="scss">
.message-container {
	page {
		padding: 24rpx;
	}
	.list-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
		background: #292A41;
		padding: 24rpx;
		border-bottom: 1px solid #474862;
		border-radius: 10rpx;
		color: #fff;
		.icon {
			width: 40px;
			height: 40px;
		}
		.right {
			flex: 1;
		}
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-weight: bold;
				font-size: 32rpx;
			}
			.time {
				color: #999DB7;
				font-size: 26rpx;
			}
		}
		.desc {
			color: #999DB7;
			font-size: 26rpx;
			margin-top: 6rpx;
			text-align: left;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.list-item:last-child {
		border-bottom: none;
	}
}
</style>
