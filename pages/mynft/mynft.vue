<template>
	<view>
		<view class="header">
			<text>{{$t('mynft')}}</text>
			<view @click="routerToMessage">
				<image src="/static/market/xiaoxi.png" class="message"></image>
				<!-- <view class="hint">4</view> -->
			</view>
		</view>
		<view class="market-container">
			<view class="market-content">
				<view class="tabList">
					<div class="tabList-item" v-for="item in tabList" :key="item.code"
						:class="currentTab == item.code && 'tabList-active'" @click="handleChangeTab(item.code)">
						{{item.name}}
					</div>
				</view>
				<view class="nft-list">
					<view class="nft-item" v-for="item in list" :key="item.id">
						<image :src="item.banner || '/static/market/2.png'" class="nft-cover" mode="widthFix"></image>
						<view class="nft-item-bot">
							<view class="title">{{item.name}}</view>
							<view class="price">
								Price: {{Number(item.total).toFixed(2)}} USDT
							</view>
							<!-- <view class="period">
								Period: {{item.stake_days}} days
							</view> -->
							<view class="buy-btn" @click="routerToDetail(item)">{{item.isZyz ? $t('zhiyaz') : $t('zhiya')}}</view>
						</view>
					</view>
				</view>
				<view class="empty" v-if="!list.length && !loading">
					<image src="/static/empty.png" class="empty-img" mode="widthFix"></image>
					<view class="desc">{{$t('nodata')}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getMyNftListReq } from '@/api/goods.js'
	export default {
		data() {
			return {
				hasNextPage: true,
				list: [],
				loading: true,
				currentTab: 'all',
				params: {
					pageNum: 1,
					pageSize: 4,
				},
				tabList: [{
					name: "ALL NTFS",
					code: "all",
				}, {
					name: "Art",
					code: "art",
				}, {
					name: "Collectibles",
					code: "Collectibles",
				}, {
					name: "Musk Empore",
					code: "Musk Empore",
				}]
			}
		},
		//下拉刷新触发方法(和onLoad同级)
		onPullDownRefresh () {
			this.params.pageNum = 1
		    this.getInitData()  //获取数据
		},
		onShow() {
			this.getInitData()
		},
		onNavigationBarButtonTap() {
			this.routerToMessage()
		},
		//上拉加载触发方法
		onReachBottom() {
			
		},
		methods: {
			async getInitData() {
				this.loading = true
				const res = await getMyNftListReq()
				this.loading = false
				this.list = res.data.list
				this.list.map(item => {
					const data = JSON.parse(item.goods_img)
					const stake_days = data.stake_days
					const endTime = new Date(item.created_at)
					endTime.setDate(endTime.getDate() + stake_days)
					item.banner = JSON.parse(item.goods_img).banner
					item.name = JSON.parse(item.goods_img).name
					item.isZyz = new Date().getTime() < endTime.getTime() ? true : false
				})
				uni.stopPullDownRefresh()
			},
			//切换tab，逻辑请自行处理
			handleChangeTab(code) {
				this.currentTab = code
			},
			routerToMessage() {
				uni.navigateTo({
					url: '/pages/message/message?my=true'
				})
			},
			routerToDetail(item) {
				uni.navigateTo({
					url: `/pages/nftdetail/nftdetail?id=${item.id}&my=true&name=${item.name}`,
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.market-container {
		padding: 12px;
		padding-top: calc(120rpx + constant(safe-area-inset-top));
	}
	
	.header {
		padding-top: calc(40rpx + var(--status-bar-height));
		position: relative;
		color: #fff;
		font-weight: bold;
		font-size: 16px;
		text-align: center;
		.message {
			width: 24px;
			height: 24px;
			position: absolute;
			right: 12px;
			top: calc(40rpx + var(--status-bar-height));
		}
		.hint {
			background: red;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 8px;
			top: calc(30rpx + var(--status-bar-height));
		}
	}
.tabList {
	display: flex;
	overflow: auto;
	gap: 8px;
	.tabList-item {
		min-width: fit-content;
		background: #292A41;
		color: #fff;
		font-size: 32rpx;
		padding: 8px 16px;
		border: 1px solid transparent;
		border-radius: 22px;
	}
	.tabList-active {
		border-color: #F645FF;
		
	}
}
.nft-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 20rpx;
	row-gap: 20rpx;
	margin-top: 30rpx;
	.nft-item {
		width: 100%;
		background: #292A41;
		border-radius: 32rpx;
		overflow: hidden;
		color: #fff;
		.nft-cover {
			width: 100%;
		}
		.nft-item-bot {
			padding: 12rpx;
		}
		.title {
			font-weight: bold;
			font-size: 32rpx;
			word-break: break-all;
		}
		.price {
			color: #999DB7;
			font-size: 24rpx;
			margin-top: 8rpx;
		}
		.period {
			color: #999DB7;
			font-size: 24rpx;
			margin-top: 8rpx;
		}
		.buy-btn {
			margin: 18rpx auto 0 auto;
			width: fit-content;
			background: linear-gradient(#FF44FF, #8A50FF);
			padding: 10rpx 40rpx;
			border-radius: 44rpx;
		}
	}
}
</style>
