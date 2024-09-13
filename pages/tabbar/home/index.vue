<template>
	<view class="wrapper">
		<view class="top-container">
			<view v-for="item in topList" :key="item.name" class="top-item">
				<view class="img-wrapper">
					<image :src="item.logo" alt="logo" class="item-cover" mode="widthFix" />
				</view>
				<view class="title-price">
					<view class="title">
						<text class="item-name">{{item.name}}</text>
						<image src="/static/index/renzheng.png" class="renzheng" />
					</view>
					<view class="price">
						Floor: {{item.floor_price}}
					</view>
				</view>
			</view>
		</view>
		<view class="tab-container">
			<view :class="`tab-item ${item.code == selectObj.tab ? 'tab-active' : ''}`" v-for="item in tabList"
				:key="item.code" @click="handleFilter('tab', item.code)">
				{{item.label}}
			</view>
		</view>
		<view class="select-container">
			<picker mode="selector" :range="timeList" @change="onChangeTime" range-key="label">
				<view class="custom-picker">
					{{getSelectLabel(timeList, selectObj.time)}}
					<image src="/static/index/xiala.png" class="renzheng" />
				</view>
			</picker>
			<picker mode="selector" :range="chainList" @change="onChangeChain" range-key="label">
				<view class="custom-picker">
					{{getSelectLabel(chainList, selectObj.chain)}}
					<image src="/static/index/xiala.png" class="renzheng" />
				</view>
			</picker>
			<picker mode="selector" :range="cateList" @change="onChangeCate" range-key="label">
				<view class="custom-picker">
					{{getSelectLabel(cateList, selectObj.cate)}}
					<image src="/static/index/xiala.png" class="renzheng" />
				</view>
			</picker>
		</view>
		<view class="collection-title">
			<view class="collection-left"># Collection</view>
			<view class="collection-right">Volume</view>
		</view>
		<view class="collection-list">
			<view class="collection-item" v-for="(item, index) in list" :key="index">
				<view class="item-left">
					<text>{{index + 1}}</text>
					<image :src="item.logo" class="collection-img"></image>
					<view class="name-price">
						<view class="name">
							<text>{{item.name}}</text>
							<image src="/static/index/renzheng.png" class="renzheng"></image>
						</view>
						<view class="price">
							Floor: {{item.floor_price}}
						</view>
					</view>
				</view>
				<view class="item-right">
					<view class="total-percent">
						<view class="total">{{item.total}}{{item.price}}</view>
						<view class="percent" :class="item.ratio < 0 ? 'lt-zero' : ''">{{item.ratio}}%</view>
					</view>
					<view class="like-wrapper" @click="handleLike(index)">
						<image src="/static/index/like.png" class="renzheng" v-if="item.isLike"></image>
						<image src="/static/index/nlike.png" class="renzheng" v-else></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import storage from '@/utils/storage';
	import {
		getNftListReq
	} from '@/api/user.js'
	export default {
		data() {
			return {
				topList: [{}, {}],
				isLoad: false,
				selectObj: {
					tab: 'Trending',
					time: '24',
					chain: 'all',
					cate: 'all',
				},

				tabList: [{
						label: 'Trending',
						code: 'Trending',
					},
					{
						label: 'Top',
						code: 'Top',
					},
					{
						label: 'WatchList',
						code: 'WatchList',
					},
				],
				timeList: [{
						label: '24h',
						code: '24',
					},
					{
						label: '3d',
						code: '3d',
					},
					{
						label: '7d',
						code: '7d',
					},
					{
						label: '14d',
						code: '14d',
					},
				],
				chainList: [{
						label: 'All Chain',
						code: 'all'
					},
					{
						label: 'ETH',
						code: 'ETH'
					},
					{
						label: 'BSC',
						code: 'BSC'
					},
					{
						label: 'TRON',
						code: 'TRON'
					},
				],
				cateList: [{
						label: 'All Categories',
						code: 'all'
					},
					{
						label: 'Pepe',
						code: 'Pepe'
					},
					{
						label: 'Egg',
						code: 'Egg'
					},
					{
						label: 'Bored',
						code: 'Bored'
					},
					{
						label: 'Pudgy',
						code: 'Pudgy'
					},
					{
						label: 'Wrapped',
						code: 'Wrapped'
					},
				],
				list: [{},{},{}]
			};
		},
		onLoad() {
			
		},
		onShow() {
			if (!storage.getAccessToken()) {
				uni.navigateTo({
					url: '/pages/passport/login'
				})
				return
			}
			if (!this.isLoad) {
				this.initData()
			}
		},
		watch: {
			// selectObj: {
			// 	handler(val) {
			// 		uni.showLoading()
			// 		setTimeout(() => {
			// 			uni.hideLoading()
			// 		}, 100)
			// 	},
			// 	deep: true,
			// },
		},

		methods: {
			generateRandomNumbers(len) {
			    let num1, num2;
			    do {
			        num1 = Math.floor(Math.random() * len);
			        num2 = Math.floor(Math.random() * len);
			    } while (num1 === num2);
			    return [num1, num2];
			},
			async initData() {
				const res = await getNftListReq()
				if (res.code == 0) {
					const max = res.data.length
					const [num1, num2] = this.generateRandomNumbers(max)
					this.topList = [res.data[num1], res.data[num2]]
					res.data.map(item => {
						item.isLike = false
					})
					this.list = res.data
					this.isLoad = true
				}
				uni.stopPullDownRefresh()
			},
			handleFilter(key, value) {
				this.selectObj[key] = value
			},
			onChangeTime(event) {
				this.selectObj.time = this.timeList[event.detail.value].code
			},
			onChangeChain(event) {
				this.selectObj.chain = this.chainList[event.detail.value].code
			},
			onChangeCate(event) {
				this.selectObj.cate = this.cateList[event.detail.value].code
			},
			getSelectLabel(list, code) {
				const itemList = list.filter(item => {
					return item.code == code
				})
				return itemList[0].label
			},
			routeToDetail() {

			},
			handleLike(index) {
				this.list[index].isLike = !this.list[index].isLike
			}
		},
		onReachBottom() {
			// 给子级监听触底加载
		},

		onPullDownRefresh() {
			this.initData()
		},

	};
</script>

<style lang="scss" scoped>
	.wrapper {
		padding: 0 12px;
	}

	.top-container {
		display: flex;
		gap: 10px;
		width: 100%;

		.top-item {
			border-radius: 20px;
			overflow: hidden;
			flex: 1;
			background: #292A41;

			.img-wrapper {
				border-radius: 0 0 20px 20px;
				overflow: hidden;
			}

			.item-cover {
				width: 100%;
				object-fit: contain;
			}

			.title-price {
				padding: 14rpx 22rpx;
				color: #fff;
			}
			.item-name {
				word-break: break-all;
			}
			.title {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				gap: 10rpx;
			}

			.price {
				opacity: 0.5;
				font-size: 32rpx;
				margin-top: 10rpx;
			}
		}
	}

	.tab-container {
		margin: 40rpx 0;
		display: flex;
		gap: 40rpx;
		color: #999DB7;
		font-size: 36rpx;
		font-weight: bold;

		.tab-active {
			color: #fff;
		}
	}

	.select-container {
		display: flex;
		align-items: center;
		gap: 6rpx;

		.custom-picker {
			background: #292A41;
			border-radius: 24rpx;
			padding: 16rpx 24rpx;
			color: #999DB7;
			display: flex;
			align-items: center;
			gap: 20rpx;
		}
	}

	.collection-title {
		margin-top: 20rpx;
		padding: 16rpx;
		color: #999DB7;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #474862;
	}

	.renzheng {
		width: 40rpx;
		height: 40rpx;
		min-width: 40rpx;
		min-height: 40rpx;
	}

	.collection-list {
		margin-top: 20rpx;

		.collection-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #292A41;
			border: 1px solid #454665;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			padding: 24rpx;
			color: #fff;

			.collection-img {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
			}

			.item-left {
				display: flex;
				align-items: center;
				gap: 12rpx;
				flex: 1;
			}

			.name-price {
				.name {
					display: flex;
					align-items: center;
					gap: 10rpx;
					font-size: 32rpx;

					text {
						max-width: 144px;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						white-space: nowrap;
						font-size: 15px;
					}
				}

				.price {
					opacity: 0.5;
					font-size: 26rpx;
					margin-top: 16rpx;
				}
			}

			.item-right {
				display: flex;
				align-items: center;
				gap: 10rpx;
				min-width: max-content;
				.total-percent {
					text-align: right;
				}

				.total {
					font-weight: bold;
					font-size: 32rpx;
				}

				.percent {
					color: #68C6D2;
					font-size: 28rpx;
					margin-top: 16rpx;
				}

				.lt-zero {
					color: #EAA758;
				}
			}
		}
	}
</style>