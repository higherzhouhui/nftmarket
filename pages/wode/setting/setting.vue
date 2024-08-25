<template>
	<view class="setting-container">
		<view class="label">{{$t('language')}}</view>
		<view class="list-wrapper">
			<view class="list" @click="handleChange('zh-Hans')">
				<view class="list-left">中文</view>
				<view class="list-right" v-if="lang == 'zh-Hans'">
					<image src="/static/wode/select.png" class="img"></image>
				</view>
			</view>
			<view class="list" @click="handleChange('en')">
				<view class="list-left">Englist</view>
				<view class="list-right" v-if="lang == 'en'">
					<image src="/static/wode/select.png" class="img"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lang: uni.getLocale()
			}
		},
		methods: {
			handleChange(l) {
				uni.setLocale(l)
				uni.setStorageSync('lang', l)
				this.lang = l
				// #ifdef APP-PLUS
				plus.runtime.restart();
				// #endif
				// #ifdef H5
				location.reload()
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.setting-container {
		color: #fff;
		padding: 12px;

		.list-wrapper {
			background: #292A41;
			padding: 12px;
			border-radius: 8px;
		}

		.label {
			opacity: 0.8;
			padding-left: 8px;
			margin-bottom: 12px;
		}

		.img {
			width: 18px;
			height: 18px;
		}

		.list {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #666;
			height: 44px;

			.list-right {
				display: flex;
				align-items: center;
				gap: 10px;
			}
		}

		.list:last-child {
			border: none;
		}
	}
</style>