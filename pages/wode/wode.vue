<template>
	<view class="user">
		<!-- 个人信息 -->
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="header" @click="navigateTo({link: '/pages/wode/detail/detail'})">
			<view class="header-wode">{{$t('mine')}}</view>
			<view class="head-1">
				<image :src="userImage"></image>
			</view>
			<view class="head-2">
				Make jason
				<image src="/static/wode/lv.png" mode="widthFix" class="lv-img"></image>
			</view>
		</view>
		<!-- 积分，优惠券，关注， -->
		<view class="pointBox box">
			<view class="btn-wrapper">
				<view class="btn" @click="navigateTo({link: '/pages/wode/invite/invite'})">
					{{$t('yqhy')}}
					<image src="/static/wode/he.png" class="btn-img"></image>
				</view>
				<view class="btn btn-com" @click="navigateTo({link: '/pages/wode/submember/submember'})">
					{{$t('wdsq')}}
					<image src="/static/wode/yj.png" class="btn-img"></image>
				</view>
			</view>
		</view>
		<view class="list-wrapper">
			<view class="list-item" v-for="item in list" :key="item.title" @click="navigateTo(item)">
				<view class="list-left">
					<image :src="`/static/wode/${item.icon}.png`" mode="widthFix" class="icon-img"></image>
					<text>{{item.title}}</text>
				</view>
				<view class="list-right">
					<image src="/static/zichan/gengduo.png" mode="widthFix" class="gengduo"></image>
				</view>
			</view>
		</view>
		<tui-modal :button="buttons" :show="modal" @click="handleClick" @cancel="hideModal" :title="$t('hint')"
			:content="$t('qrtc')"></tui-modal>

	</view>
</template>
<script>
	import tuiModal from "@/components/thorui/components/thorui/tui-modal/tui-modal.vue"

	import configs from '@/config/config'
	export default {
		components: {
			tuiModal,
		},
		data() {
			return {
				buttons: [{
						text: "Cancel",
						type: "red",
						plain: true
					},
					{
						text: "Confirm",
						type: "red",
						plain: false
					}
				],
				modal: false,
				userImage: configs.defaultUserPhoto,
				list: [{
						icon: 'youxiang',
						title: this.$i18n.t('wdemail'),
						link: '/pages/wode/email/email',
					},
					{
						icon: 'xiugai',
						title: this.$i18n.t('xgmm'),
						link: '/pages/wode/changepwd/changepwd',
					},
					{
						icon: 'zhifu',
						title: this.$i18n.t('zfmm'),
						link: '/pages/wode/zhifumm/zhifumm',
					},
					{
						icon: 'bianji',
						title: this.$i18n.t('bjzl'),
						link: '/pages/wode/detail/detail',
					},
					{
						icon: 'shezhi',
						title: this.$i18n.t('setting'),
						link: '/pages/wode/setting/setting',
					},
					{
						icon: 'tuichu',
						title: this.$i18n.t('logout'),
						type: 'exit'
					},
				]
			};
		},
		onLoad() {},
		onShow() {

		},
		mounted() {},
		methods: {
			//调用此方法显示组件
			showModal() {
				this.modal = true;
			},
			//隐藏组件
			hideModal() {
				this.modal = false;
			},
			handleClick(e) {
				let index = e.index;
				if (index === 0) {
					// this.tui.toast('你点击了取消按钮');
				} else {
					// this.tui.toast('你点击了确定按钮');
					uni.navigateTo({
						url: '/pages/passport/login'
					})
				}
				this.hideModal();
			},
			navigateTo(item) {
				if (item.type == 'exit') {
					// 退出
					this.showModal()
				} else {
					uni.navigateTo({
						url: item.link,
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	html,
	body {
		overflow: auto;
	}

	.money {
		overflow: hidden;

		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user {
		padding-bottom: 30px;

		.header {
			max-width: 100%;
			padding: calc(50rpx + var(--status-bar-height)) 30rpx 0 6%;
			height: calc(var(--status-bar-height) + 400rpx);
			background-size: cover;
			border-bottom-left-radius: 30rpx;
			border-bottom-right-radius: 30rpx;
			background-image: url("/static/wode/bg.png");
			background-position: bottom;
			background-repeat: no-repeat;
			color: #ffffff;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 15px;

			.header-wode {
				font-size: 16px;
				font-weight: bold;
			}

			.head-1 {
				text-align: center;
				width: 152rpx;
				position: relative;
				display: flex;
				align-items: center;

				image {
					width: 152rpx;
					height: 144rpx;
					border-radius: 50%;
				}

			}

			.head-2 {
				display: flex;
				align-items: center;
				gap: 6px;
				font-size: 16px;

				.lv-img {
					width: 30px;
				}
			}


		}

		.pointBox {
			width: 94%;
			margin: 0 3%;
			border-radius: 20rpx;
			margin-top: -15px;

			.btn-wrapper {
				display: flex;
				gap: 20px;

				.btn {
					flex: 1;
					height: 72px;
					position: relative;
					display: flex;
					align-items: center;
					border-radius: 16px;
					background: linear-gradient(#7B4BF2, #E842F4);
					color: #fff;
					padding-left: 18px;
					font-size: 18px;
					font-weight: bold;
				}

				.btn-com {
					background: linear-gradient(#E739B3, #ED7E34);
				}

				.btn-img {
					position: absolute;
					width: 48px;
					height: 48px;
					right: 0;
					top: 0;
				}
			}
		}

		.list-wrapper {
			margin: 0 3%;
			margin-top: 15px;
			border-radius: 16px;
			background: #292A41;
			width: 94%;

			.list-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 52px;
				padding: 0 12px;

				.list-left {
					display: flex;
					align-items: center;
					gap: 8px;
					color: #fff;
					font-size: 16px;

					.icon-img {
						width: 28px;
						height: 28px;
					}
				}

				.gengduo {
					width: 20px;
					height: 20px;
				}
			}
		}
	}
</style>