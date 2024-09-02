<template>
	<view class="user">
		<!-- 个人信息 -->
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="header">
			<view class="header-mask">
				<view class="nav">
					{{$t('yqhy')}}
					<view @click="navigateTo">
						<image src="/static/wode/back.png" mode="widthFix" class="back"></image>
					</view>
				</view>
				<view class="content">
					<view class="title">Discover <text>NFT</text></view>
					<view class="title">Collections</view>
					<view class="code-border">
						<canvas :style="{ width: qrcode_w + 'px', height: qrcode_w + 'px' }" canvas-id="trc20"
							id="trc20"></canvas>
					</view>
					<view class="save btn-color" @click="saveQrCode">{{$t('bcpic')}}</view>
					<view class="text-container">
						<view class="text-left"><text>{{$t('inviteCode')}}：</text>{{userInfo.invite_code}}</view>
						<view class="text-right" @click="handleCopy($event, userInfo.invite_code)">
							<image src="/static/zichan/fuzhi.png" class="fuzhi"></image>
						</view>
					</view>
					<view class="text-container">
						<view class="text-left"><text>{{$t('inviteUrl')}}：</text>{{link}}</view>
						<view class="text-right" @click="handleCopy($event, link)">
							<image src="/static/zichan/fuzhi.png" class="fuzhi"></image>
						</view>
					</view>
					<view class="explore">
						{{$t('explorethe')}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import storage from "@/utils/storage";
import thorui from "@/components/thorui/components/common/tui-clipboard/tui-clipboard.js"
	import qrCode from '@/components/thorui/libs/weapp-qrcode.js';

	export default {

		data() {
			return {
				qrcode_w: uni.upx2px(380),
				userInfo: storage.getUserInfo(),
				link: `https://app.nftmarket.life/pages/register?invite_code=${storage.getUserInfo().invite_code}`
			};
		},
		onLoad() {},
		onReady() {
			new qrCode('trc20', {
				text: this.link,
				width: this.qrcode_w,
				height: this.qrcode_w,
				colorDark: '#333333',
				colorLight: '#FFFFFF',
			});
		},
		onShow() {

		},
		onPullDownRefresh() {

		},

		methods: {
			handleCopy(event, item) {
				thorui.getClipboardData(item, (res) => {
					if (res) {
						//复制成功
						console.log('复制成功')
						uni.showToast({
							title: this.$i18n.t('copied'),
							icon: 'none'
						})
					} else {
						//复制失败
						console.log('复制失败')
					}
				}, event)
			},
			navigateTo() {
				uni.switchTab({
					url: '/pages/wode/wode'
				})
			},
			saveQrCode() {
				// 将画布保存为临时文件
				  uni.canvasToTempFilePath({
				    canvasId: 'trc20',
				    success: (res) => {
				      // 临时文件路径
				      const tempFilePath = res.tempFilePath;
				      
				      // 保存图片到相册
				      uni.saveImageToPhotosAlbum({
				        filePath: tempFilePath,
				        success: () => {
				          uni.hideLoading();
				          uni.showToast({
				            title: this.$i18n.t('saveSuccess'),
				            icon: 'none',
				            duration: 2000
				          });
				        },
				        fail: () => {
				          uni.hideLoading();
				          uni.showToast({
				            title: 'Fail',
				            icon: 'none'
				          });
				        }
				      });
				    },
				    fail: () => {
				      uni.hideLoading();
				      uni.showToast({
				        title: '生成失败',
				        icon: 'none'
				      });
				    }
				  }, this);
			}
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
			height: calc(var(--status-bar-height) + 800rpx);
			background-size: cover;
			border-bottom-left-radius: 30rpx;
			border-bottom-right-radius: 30rpx;
			background-image: url("/static/wode/inviteBg.png");
			background-position: center;
			background-repeat: no-repeat;
			position: relative;

			.header-mask {
				position: fixed;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				background: rgba(0, 0, 0, 0.5);
				padding: calc(40rpx + var(--status-bar-height)) 0 0 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
			}

			.nav {
				width: 100%;
				text-align: center;
				color: #fff;
				font-size: 16px;
				font-weight: bold;
				position: relative;
				z-index: 99;

				.back {
					position: absolute;
					z-index: 99;
					left: 20px;
					top: 50%;
					width: 20px;
					transform: translate(0, -50%);
				}
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			padding: 0 18px 30px 18px;

			.title {
				font-weight: bold;
				color: #fff;
				font-size: 36px;
				text-align: center;

				text {
					color: rgb(193, 125, 255);
					margin-left: 6px;
				}
			}

			.code-border {
				border: 10px solid #1e1e30;
				border-radius: 10px;
				width: fit-content;
				margin: 15px 0;
			}

			.save {
				width: 150px;
				margin-bottom: 10px;
			}

			.text-container {
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: #292A41;
				color: #fff;
				border-radius: 20px;
				padding: 8px 12px;
				margin-top: 12px;
				width: 100%;

				text {
					opacity: 0.7;
				}

				.fuzhi {
					width: 20px;
					height: 20px;
				}
			}

			.explore {
				width: 100%;
				padding: 0 18px;
				text-align: center;
				word-break: break-all;
				color: #fff;
				opacity: 0.7;
				line-height: 24px;
				margin-top: 20px;
			}
		}
	}
</style>