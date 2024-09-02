<template>
	<view class="message-container">
		<view class="list-item" v-for="item in list" :key="item.title">
			<view class="left">
				<image :src="item.logo" class="icon"></image>
			</view>
			<view class="right">
				<view class="top">
					<view class="title">{{item.title}}</view>
					<view class="time">{{item.time}}</view>
				</view>
				<view class="desc">{{item.content}}</view>
			</view>
		</view>
		<view class="empty" v-if="!list.length && !loading">
			<image src="/static/empty.png" class="empty-img" mode="widthFix"></image>
			<view class="desc">{{$t('nodata')}}</view>
		</view>
	</view>
</template>

<script>
	import { getMessageList } from '@/api/user.js'
	import moment from 'moment/moment'
	export default {
		data() {
			return {
				hasNextPage: true,
				loading: true,
				params: {
					pageNum: 1,
					pageSize: 15
				},
				list: [
				
				]
			}
		},
		onPullDownRefresh() {
			this.params.pageNum = 1
			this.getInitData()
		},
		//上拉加载触发方法
		onReachBottom() {
			if(this.hasNextPage) {    //判断是否还有数据需要加载
				this.params.pageNum = this.params.pageNum + 1
				this.getInitData()    //获取数据
			}
		},
		onShow() {
			this.getInitData()
		},
		methods: {
			async getInitData() {
				uni.showLoading()
				this.loading = true
				const res = await getMessageList({
					page: this.params.pageNum,
					page_size: this.params.pageSize
				})
				this.loading = false
				const _list = res.data.list
				_list.map(item => {
					item.logo = '/static/market/system.png'
					if (item.type == 2) {
						item.logo = '/static/market/activity.png'
					}
					if (item.type == 3) {
						item.logo = '/static/market/transaction.png'
					}
				})
				_list.map(item => {
					item.time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
				})
				if (this.params.pageNum == 1) {
					this.list = _list
				} else {
					this._list = [...this._list, ..._list]
				}
				uni.stopPullDownRefresh()
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
			gap: 4px;
			.title {
				font-weight: bold;
				font-size: 32rpx;
			}
			.time {
				color: #999DB7;
				font-size: 26rpx;
				min-width: fit-content;
			}
		}
		.desc {
			color: #999DB7;
			font-size: 26rpx;
			margin-top: 6rpx;
			text-align: left;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
		}
	}
	.list-item:last-child {
		border-bottom: none;
	}
}
</style>
