<template>
	<view v-if="visible" class="pop-container">
		<view class="mask" @click="close"></view>
		<view class="content">
			<view class="title">
				{{$t('zfmm')}}
				<image src="/static/market/guanbi.png" class="close-img" @click="close"></image>
			</view>
			<u-input :placeholder="$t('qsrzfmm1')" class="input-style" v-model="password" type="password"
				:maxlength="6" />
			<view class="operation">
				<view class="clost-btn" @click="close">{{$t("cancel")}}</view>
				<view class="confirm-btn" @click="confirm">{{$t("queren")}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		md5
	} from '@/utils/md5';
	export default {
		name: "pop-password",

		data() {
			return {
				visible: false,
				password: ''

			};
		},
		methods: {
			confirm() {
				if (!this.password) {
					uni.showToast({
						icon: 'none',
						title: this.$i18n.t('qsrzfmm1')
					})
					return
				}
				if (this.password.length != 6) {
					uni.showToast({
						icon: 'none',
						title: this.$i18n.t('qsrzqdzfmm')
					})
					return
				}
				this.$emit('callBack', md5(this.password))
				this.visible = false
			},
			open() {
				this.visible = true
				this.password = ''
			},
			close() {
				this.visible = false
			}
		}
	}
</script>

<style scoped lang="scss">
	.pop-container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 10;

		.mask {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
		}

		.content {
			position: fixed;
			left: 50%;
			top: 40%;
			transform: translate(-50%, -50%);
			background: #292A41;
			width: 300px;
			padding: 24rpx;
			border-radius: 20px;
			color: #fff;

			.title {
				position: relative;
				width: 100%;
				text-align: center;
				font-weight: bold;
				font-size: 30rpx;
				margin-bottom: 40rpx;
			}

			.close-img {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				right: 10rpx;
				top: 50%;
				transform: translate(0, -50%);
			}

			.operation {
				display: flex;
				gap: 10px;
				margin-top: 40rpx;

				view {
					flex: 1;
					text-align: center;
					border-radius: 22px;
					border: 1px solid #F645FF;
					height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.confirm-btn {
					background: linear-gradient(#8C50FF, #F645FF);
				}
			}

			.input-style {
				background: #34354E;
				padding: 0 16rpx !important;
			}
		}
	}

	/deep/ .u-input__input {
		color: #fff;
	}
</style>