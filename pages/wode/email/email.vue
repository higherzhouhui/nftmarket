<template>
	<view class="email-container">
		<view class="custom-input">
			<view class="label">{{$t('wdemail')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsryxdz')" class="custom-input-style" v-model="email">
				</u-input>
			</view>
		</view>
		<view class="btn-color btn" @click="confirm">{{$t('queren')}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email: '',
			}
		},
		methods: {
			confirm() {
				if (this.email) {
					
				} else {
					uni.showToast({
						title: this.$i18n.t('qsryxdz'),
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.email-container {
	padding: 12px;
	.btn {
		margin-top: 50px;
	}
}
</style>
