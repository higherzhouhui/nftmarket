<template>
	<view class="main">
		<view class="bottom">
			<view class="img-box">
				<image src="/static/logo.png" class="img"></image>
			</view>
			<a download="HYH NFT.apk" :href="url" class="download btn-color" v-if="device == 'Android'">{{$t('download')}}</a>
			<a :href="url" class="download btn-color" v-else>{{$t('download')}}</a>
		</view>
	</view>
</template>

<script>
	import {
		getDonwloadReq
	} from '@/api/user.js'
	
	export default {
		data() {
			return {
				url: '',
				device: ''
				
			}
		},
		onLoad(options) {
			if (!options.useH5) {
				this.int()
			}
			this.getDonwloadUrl()
			this.device = this.getDeviceType()
		},
		methods: {
			int() {
				// #ifdef H5
				var a = document.getElementsByTagName('uni-page-head')
				if (a.length) {
					a[0].style.display = 'none';
				}
				// #endif
			},
			getDeviceType() {
			  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
			 
			  if (/android/i.test(userAgent)) {
			    return 'Android';
			  }
			 
			  if (/iPad|iPhone|iPod/.test(userAgent)) {
			    return 'iOS';
			  }
			 
			  if (/Windows Phone/i.test(userAgent)) {
			    return 'Windows Phone';
			  }
			 
			  return 'Browser';
			},
			getDonwloadUrl() {
				uni.showLoading()
				getDonwloadReq().then(res => {
					if (res.code == 0) {
						if (this.device == 'Android') {
							this.url = res.data.android
						} else {
							this.url = res.data.ios
						}
					} else {
						uni.showToast({
							title: res.msg || 'Net Error',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main {
		width: 100%;
		height: 100vh;
		background-image: url('/static/login/bg.png');
		background-size: cover;
		background-repeat: no-repeat;
		text-align: center;
	}

	.img-box {
		margin: 0 auto 105px;
		position: relative;
		width: 35%;
		padding-bottom: 35%;

		.img {
			left: 0;
			top: 0;
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}

	.logo {
		width: 200px;
		height: 165px;
	}

	.bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
	}

	.download {
		width: 256px;
		height: 50px;
		border-radius: 28px 28px 28px 28px;
		opacity: 1;
		text-decoration: none;
		text-align: center;
		line-height: 50px;
		color: #fff;
		font-size: 18px;

	}

	.version {
		font-size: 15px;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		margin-top: 12px;
	}
</style>