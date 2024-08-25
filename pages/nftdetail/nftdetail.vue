<template>
	<view class="detail-container">
		<view class="img-wrapper">
			<image :src="detail.img" mode="widthFix" class="cover"></image>
		</view>
		<view class="title">NFToker {{detail.title}}</view>
		<view class="desc">{{detail.desc}}</view>
		<view class="list">
			<view class="list-left">
				<view class="list-item"><text>{{$t('price')}}:</text> {{detail.price}}&nbsp;USDT</view>
				<view class="list-item"><text>{{$t('time')}}:</text> {{detail.period}}&nbsp;DAYS</view>
				<view class="list-item"><text>{{$t('zuanqian')}}:</text> {{detail.earn}}&nbsp;USDT</view>
			</view>
			<view class="list-right" v-if="!isMy">
				<view class="list-right-top">{{$t('jsy')}}</view>
				<view class="list-right-bot">
					{{countTime}} &nbsp;Left
				</view>
			</view>
		</view>
		<view class="total-price list" v-if="!isMy">
			<view class="total-left">
				<view class="total">Total</view>
				<view class="total-num">
					<image src="/static/market/eth.png" class="eth"></image>
					<text>{{detail.price * detail.num}}&nbsp;USDT</text>
				</view>
			</view>
			<view class="list-right">
				<view class="list-right-top">{{$t('number')}}</view>
				<view class="list-right-bot">
					<image src="/static/market/minus.png" mode="widthFix" class="minus" @click="handleMinus"></image>
					<view class="amount">{{detail.num}}</view>
					<image src="/static/market/add.png" mode="widthFix" class="add" @click="handleAdd"></image>
				</view>
			</view>
		</view>
		<view class="seller-container" v-if="!isMy">
			<view class="seller-left">
				<image src="/static/market/user.png" class="avatar"></image>
				<image src="/static/index/renzheng.png" class="renzheng"></image>
			</view>
			<view class="seller-right">
				<view class="seller-title">{{detail.sellUser.name}}</view>
				<view class="seller-address">{{formatAddress(detail.sellUser.address)}}</view>
			</view>
		</view>
		<view class="btn-wrapper">
			<view v-if="isMy" class="buy-btn" @click="handleBuy">
				{{$t('zhiya')}}
			</view>
			<view v-else class="buy-btn" @click="handleBuy">{{$t('gmbzy')}}</view>
		</view>
		<popPasswordVue ref="popPassword"/>
	</view>
</template>

<script>
	import { formatAddress } from '@/utils/tools'
	import popPasswordVue from '@/components/pop-password.vue'
	export default {
		data() {
			return {
				isMy: false,
				formatAddress: formatAddress,
				timer: '',
				countTime: '',
				detail: {
					id: 1,
					title: 'Super infilfengs',
					token: '#23504',
					desc: 'Flare finance commemorates its closed beta program by providing our beta participants with a super rare collective NFT.',
					price: '400',
					earn: '300',
					period: '5',
					time: new Date().getTime() + 20 * 60 * 60 * 1000,
					num: 1,
					img: '/static/market/4.png',
					sellUser: {
						icon: '/static/market/user.png',
						name: 'List Makc',
						address: '0xfe15415ffaefaafea'
					}
				}
			}
		},
		components: {
			popPasswordVue
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: `NFT-${option.id}`
			})
			if (option.my) {
				this.isMy = true
			}
		},
		onShow() {
			this.timer = setInterval(() => {
				this.countTime = this.timestampToHHMMSS()
			}, 1000)
		},
		onPullDownRefresh() {
			// 加载
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			handleBuy() {
				this.$refs.popPassword.open()
			},
			 timestampToHHMMSS() {
				let ts = (this.detail.time - new Date().getTime()) / 1000
			    var hours = Math.floor(ts / 3600);
			    var minutes = Math.floor((ts % 3600) / 60);
			    var seconds = Math.floor(ts % 60);
			 
			    hours = hours < 0 ? 0 : hours;
			    minutes = minutes < 0 ? 0 : minutes;
			 
			    hours = hours < 10 ? '0' + hours : hours;
			    minutes = minutes < 10 ? '0' + minutes : minutes;
			    seconds = seconds < 10 ? '0' + seconds : seconds;
				if (ts == 0) {
					return '00: 00: 00'
				}
			    return hours + ': ' + minutes + ': ' + seconds;
			},
			handleMinus() {
				this.detail.num = Math.max(1, this.detail.num - 1)
			},
			handleAdd() {
				this.detail.num += 1
			}
		},
		destroyed() {
			clearInterval(this.timer)
		},
	}
</script>

<style scoped lang="scss">

	.detail-container {
		padding: 0 12px 150rpx 12px;
		overflow: auto;
	}
	.img-wrapper {
		border-radius: 20px;
		overflow: hidden;
		.cover {
			width: 100%;
		}
	}
	.title {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
		margin: 14rpx 0 20rpx 0;
	}
	.desc {
		font-size: 24rpx;
		color: #999DB7;
		margin-bottom: 30rpx;
	}
.list {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.list-left {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		row-gap: 20rpx;
		column-gap: 20rpx;
		color: #fff;
		flex: 1;
		text {
			opacity: 0.5;
			margin-right: 20rpx;
		}
	}
	.list-right {
		width: fit-content;
		text-align: right;
		.list-right-top {
			color: #999DB7;
			font-size: 22rpx;
		}
		.list-right-bot {
			background: #292A41;
			color: #F061FF;
			border: 1px solid #F061FF;
			padding: 6rpx 10rpx;
			border-radius: 4px;
			margin-top: 10rpx;
			min-width: 110px;
		}
	}
}
	.total-price {
		margin-top: 30rpx;
		color: #fff;
		.total {
			opacity: 0.5;
		}
		.total-num {
			display: flex;
			align-items: center;
			gap: 10rpx;
			font-size: 36rpx;
			font-weight: bold;
			margin-top: 20rpx;
		}
		.eth {
			width: 50rpx;
			height: 50rpx;
		}
		.list-right-bot {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.minus, .add {
				width: 30rpx;
				height: 30rpx;
			}
			.amount {
				color: #fff;
				font-size: 32rpx;
			}
		}
	}
	.btn-wrapper {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		padding: 0 24rpx;
		background: #1e1e30;
		height: 118rpx;
	}
	.buy-btn {
		background: linear-gradient(#FF44FF, #8A50FF);
		color: #fff;
		font-size: 32rpx;
		border-radius: 100rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.seller-container {
		margin-top: 40rpx;
		display: flex;
		gap: 40rpx;
		.seller-left {
			position: relative;
			.avatar {
				width: 80rpx;
				height: 80rpx;
			}
			.renzheng {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				bottom: 0rpx;
				right: 0rpx;
			}
		}
		.seller-right {
			color: #fff;
			.seller-title {
				font-size: 28rpx;
				font-weight: bold;
			}
			.seller-address {
				opacity: 0.5;
			}
		}
	}
</style>
