<template>
	<view class="detail-container">
		<tui-datetime :startYear="1920" :endYear="2016" :type="3" ref="dateTime" @confirm="change"></tui-datetime>
		<view class="head" @click="handleUploadAvatar">
			<image :src="userImage" class="avatar"></image>
			<image src="/static/wode/dbianji.png" class="bianji"></image>
		</view>
		
		<view class="custom-input">
			<view class="label">{{$t('nickName')}}</view>
			<view class="cunst-input-wrapper">
				<u-input :placeholder="$t('qsrnickName')" class="custom-input-style" v-model="username">
				</u-input>
			</view>
		</view>
	<!-- 	<view class="custom-input">
			<view class="label">{{$t('birthday')}}</view>
			<picker mode="date" :value="birthday" start="1920-01" end="2100-12" 
				@change="bindDateChange">
				<view class="birthday">{{birthday}}</view>
			</picker>
		</view> -->
		
		<view class="btn-color btn" @click="confirm">{{$t('queren')}}</view>
	</view>
</template>

<script>
	import tuiDatetime from "@/components/thorui/components/thorui/tui-datetime/tui-datetime.vue"
	import configs from '@/config/config'
	import storage from "@/utils/storage"
	import { updateAvatarReq, changeUsernameReq } from "@/api/user.js"
	export default {
		data() {
			return {
				userImage: storage.getUserInfo().avatar || configs.defaultUserPhoto,
				birthday: storage.getUserInfo().birthday || '1980-01-01',
				username: storage.getUserInfo().username
			}
		},
		components: {
			tuiDatetime
		},
		methods: {
			bindDateChange(e) {
				this.birthday = e.detail.value
			},
			handleUploadAvatar() {
				// 获取图片
				let that = this;
				// 选择图片
				uni.chooseImage({
				  success(res) {
					const tempFilePaths = res.tempFilePaths[0];
					uni.showLoading({
						title: that.$i18n.t('sczhong'),
					})
					uni.uploadFile({
					  url: `https://app.nftmarket.life/common/upload/avatar`,
					  filePath: tempFilePaths,
					  name: 'file',
					  formData: {
					    'user': 'test'
					  },
					  success: function (res) {
						  uni.hideLoading()
						  const response = JSON.parse((res.data))
					    updateAvatarReq({
							avatar: response.data.url_full,		
						}).then(avatarRes => {
							if (avatarRes.code === 0) {
								that.userImage = response.data.url_full;
								storage.setUserInfo(that.info)
							} else {
								uni.showToast({
									title: this.$i18n.t('scshibai'),
									icon: 'none'
								})
							}
						})
					  },
					  fail: function (res) {
					    console.log('上传失败：', res);
						uni.hideLoading()
						uni.showToast({
							title: this.$i18n.t('scshibai'),
							icon: 'none'
						})
					  }
					});
				  }
				});
			},
			show(e) {
				console.log(111)
				this.$refs.dateTime && this.$refs.dateTime.show();
			},
			change(e) {
				//选择的结果
				this.birthday = e.result;
			},
			confirm() {
				if (!this.username) {
					uni.showToast({
						title: this.$i18n.t('qtxyhm'),
						icon: 'none'
					})
				}
				uni.showLoading()
				changeUsernameReq({
					username: this.username,
					birthday: this.birthday
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: this.$i18n.t('xgcg'),
							icon: 'none'
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/wode/wode'
							})
						}, 1500)
					}
				})
				// 
			}
		}
	}
</script>

<style scoped lang="scss">
.detail-container {
	padding: 12px;
	.custom-input {
		margin-bottom: 18px;
	}
	.btn {
		margin-top: 50px;
	}
	.birthday {
		height: 52px;
		border-radius: 8px;
		background: #34354E;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.head {
		position: relative;
		margin: 20px auto;
		width: fit-content;
		.avatar {
			width: 90px;
			height: 90px;
			border-radius: 50%;
		}
		.bianji {
			width: 20px;
			height: 20px;
			position: absolute;
			right: 5px;
			bottom: 5px;
		}
	}
}
/deep/ .uni-input-input, .input-placeholder {
	text-align: center;
	margin-left: 20px;
	
}
</style>
