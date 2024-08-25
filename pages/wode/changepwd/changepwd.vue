<template>
	<view class="changepwd-container">
		<view class="custom-input">
			<view class="label">{{$t('dqmm')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsrdqmm')" focus type="password" class="custom-input-style" v-model="oldPwd">
				</u-input>
			</view>
		</view>
		<view class="custom-input">
			<view class="label">{{$t('xinmm')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsrxinmm')" type="password" class="custom-input-style" v-model="password">
				</u-input>
			</view>
		</view>
		<view class="custom-input">
			<view class="label">{{$t('qrmm')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qzcsrmm')" type="password" class="custom-input-style" v-model="repassword">
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
				oldPwd: '',
				password: '',
				repassword: '',
			}
		},
		methods: {
			confirm() {
				if (!this.oldPwd) {
					uni.showToast({
						title: this.$i18n.t('qsrdqmm'),
						icon: 'none'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						title: this.$i18n.t('qsrxinmm'),
						icon: 'none'
					})
					return
				}
				if (!this.repassword) {
					uni.showToast({
						title: this.$i18n.t('qzcsrmm'),
						icon: 'none'
					})
					return
				}
				if (this.password.length < 6) {
					uni.showToast({
						title: this.$i18n.t('mmzslw'),
						icon: 'none'
					})
					return
				}
				if (this.password !== this.repassword) {
					uni.showToast({
						title: this.$i18n.t('lcmmbyz'),
						icon: 'none'
					})
					return
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.changepwd-container {
	padding: 12px;
	.custom-input {
		margin-bottom: 18px;
	}
	.btn {
		margin-top: 50px;
	}
}
</style>
