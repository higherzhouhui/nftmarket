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
				<u-input :placeholder="$t('qsrnickName')" class="custom-input-style" v-model="nickName">
				</u-input>
			</view>
		</view>
		<view class="custom-input" @click="show">
			<view class="label">{{$t('birthday')}}</view>
			<view class="birthday" >
				{{birthday}}
			</view>
		</view>
		
		<view class="btn-color btn" @click="confirm">{{$t('queren')}}</view>
	</view>
</template>

<script>
	import tuiDatetime from "@/components/thorui/components/thorui/tui-datetime/tui-datetime.vue"
	import configs from '@/config/config'
	export default {
		data() {
			return {
				userImage: configs.defaultUserPhoto,
				nickName: '',
				birthday: '1994-06-25',
			}
		},
		components: {
			tuiDatetime
		},
		methods: {
			handleUploadAvatar() {
				// 获取图片
				let that = this;
				// 选择图片
				uni.chooseImage({
				  success(res) {
					const tempFilePaths = res.tempFilePaths[0];
					uni.showLoading({
						title: '上传中...'
					})
					uni.uploadFile({
					  url: ``,
					  filePath: tempFilePaths,
					  name: 'file',
					  formData: {
					    'user': 'test'
					  },
					  success: function (res) {
						  const response = JSON.parse((res.data))
						  uni.hideLoading()
					    updateAvatarRequest({
							avatar: response.data,
							idCard: that.info.idCard,
							name: that.info.name
						}).then(avatarRes => {
							if (avatarRes.code === 200) {
								that.info.avatar = response.data;
								that.$store.commit('SET_USERINFO', that.info)
							}
						})
					  },
					  fail: function (res) {
					    console.log('上传失败：', res);
							uni.hideLoading()
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
				if (!this.oldPwd) {
					uni.showToast({
						title: '请输入当前密码!',
						icon: 'none'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						title: '请输入新密码!',
						icon: 'none'
					})
					return
				}
				if (!this.repassword) {
					uni.showToast({
						title: '请再次确认新密码!',
						icon: 'none'
					})
					return
				}
				if (this.password.length < 6) {
					uni.showToast({
						title: '密码至少6位!',
						icon: 'none'
					})
					return
				}
				if (this.password !== this.repassword) {
					uni.showToast({
						title: '两次密码不一致!',
						icon: 'none'
					})
					return
				}
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
}
</style>
