<template>
	<view class="submember-container">
		<view class="btn-color total-btn">{{$t('totalUser')}}：<text>{{total}}</text></view>
		<view class="table">
			<view class="table-header table-content">
				<view class="name">{{$t('username')}}</view>
				<view class="per">{{$t('gongxian')}}</view>
				<view class="time">{{$t('registerTime')}}</view>
			</view>
			<view class="table-content" v-for="(item,index) in listData" :key="index">
				<view class="name">{{item.username}}</view>
				<view class="per">{{Number(item.performance).toFixed(2)}}</view>
				<view class="time">{{item.time}}</view>
			</view>
			<view class="empty" v-if="!listData.length">
				<image src="/static/empty.png" class="empty-img" mode="widthFix"></image>
				<view class="desc">{{$t('nodata')}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import moment from 'moment/moment'
import { getMySubMember } from '@/api/user.js'
	export default {
		data() {
			return {
				haveNextPage: true,
				page: 1,
				page_size: 10,
				total: 0,
				listData: []
			}
		},
		onShow() {
			this.initData()
		},
		onReachBottom() {
			if (this.haveNextPage) {
				this.page = this.page + 1
				this.initData()
			}
		},
		onPullDownRefresh() {
			this.page = 1
		},
		methods: {
			async initData() {
				uni.showLoading()
				const res = await getMySubMember({
					page: this.page,
					page_size: this.page_size
				})
				if (res.code == 0) {
					this.total = 0
					const list = res.data.list
					this.haveNextPage = list.length == this.pageSize ? true : false
					if (this.page == 1) {
						this.listData = list
					} else {
						this.listData = [...this.listData, ...list]
					}
					this.listData.map(item => {
						item.time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
						this.total += Number(item.performance)
					})
				}
				uni.stopPullDownRefresh()
			}
		}
	}
</script>

<style scoped lang="scss">
.submember-container {
	padding: 0 12px 12px 12px;
	.total-btn {
		width: 100%;
		height: 85px;
		font-size: 20px;
		text {
			font-size: 32px;
			color: #FAE74C;
			font-weight: bold;
		}
	}
	.table {
		background: #292A41;
		border-radius: 16px;
		padding: 12px;
		margin-top: 12px;
		color: #fff;
		.table-header {
			opacity: 0.7;
		}
		.table-content {
			padding: 12px;
			display: flex;
			border-top: 1px solid #454665;
			gap: 6px;
			view {
				flex: 1;
				text-align: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				min-width: fit-content;
			}
			.per {
				min-width: fit-content;
				flex: 0.8;
			}
		}
		.table-content:first-child {
			border-top: none;
		}
	}
}
</style>
