<template>
	<view class="changepwd-container">
		<view class="custom-input">
			<view class="label">{{$t('dqmm')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsrdqmm')" focus type="password" class="custom-input-style" v-model="current_password">
				</u-input>
			</view>
		</view>
		<view class="custom-input">
			<view class="label">{{$t('xinmm')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsrxinmm')" type="password" class="custom-input-style" v-model="new_password">
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
	import {
		md5
	} from "@/utils/md5.js";
	import { changePwdReq } from '@/api/user.js'
	export default {
		data() {
			return {
				current_password: '',
				new_password: '',
				repassword: '',
			}
		},
		methods: {
			confirm() {
				if (!this.current_password) {
					uni.showToast({
						title: this.$i18n.t('qsrdqmm'),
						icon: 'none'
					})
					return
				}
				if (!this.new_password) {
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
				if (this.new_password.length < 6) {
					uni.showToast({
						title: this.$i18n.t('mmzslw'),
						icon: 'none'
					})
					return
				}
				if (this.new_password !== this.repassword) {
					uni.showToast({
						title: this.$i18n.t('lcmmbyz'),
						icon: 'none'
					})
					return
				}
				uni.showLoading()
				changePwdReq({
					current_password: md5(this.current_password),
					new_password: this.new_password
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: this.$i18n.t('xgmmcg'),
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					}
				})
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
