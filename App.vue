<script>
	/**
	 * vuex管理登录状态，具体可以参考官方登录模板示例
	 */
	import config from "@/config/config";
	import {
		getClipboardData
	} from "@/js_sdk/h5-copy/h5-copy.js";
	import APPUpdate from "@/plugins/APPUpdate";
	import storage from "@/utils/storage";
	import {
		mapMutations
	} from "vuex";
	
	import {getAppVersion} from "@/api/common.js"



	/**
	 * 路由监听并删除路由
	 * https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
	 * */
	// #ifdef MP-WEIXIN
	wx.onAppRoute((res) => {

	})
	// #endif

	export default {
		data() {
			return {
				config,
			};
		},


		/**
		 * 监听返回
		 */
		onBackPress(e) {
			console.log("onBackPress-APP", e);
			if (e.from == "backbutton") {
				let routes = getCurrentPages();
				let curRoute = routes[routes.length - 1].options;
				routes.forEach((item) => {
					if (
						item.route == "pages/tabbar/cart/cartList" ||
						item.route.indexOf("pages/product/goods") != -1
					) {
						uni.redirectTo({
							url: item.route,
						});
					}
				});

				if (curRoute.addId) {
					uni.reLaunch({
						url: "/pages/tabbar/cart/cartList",
					});
				} else {
					uni.navigateBack();
				}
				return true; //阻止默认返回行为
			}
		},
		methods: {
			...mapMutations(["login"]),
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
			// this.checkUpdate();
			this.checkArguments(); // 检测启动参数
			APPUpdate();

			// 重点是以下： 一定要监听后台恢复 ！一定要
			plus.globalEvent.addEventListener("newintent", (e) => {
				this.checkArguments(); // 检测启动参数
			});
			// #endif

			// #ifdef MP-WEIXIN
			this.applyUpdateWeChat();
			// #endif
		},

		onShow() {
			// #ifndef H5
			if (this.config.enableGetClipboard) {
				this.getClipboard();
			}
			// #endif
			// #ifdef APP-PLUS

			if (storage.getShow()) {
				if (uni.getSystemInfoSync().platform == 'ios') {
					this.$u.route("/pages/tabbar/screen/fullScreen");

				}
			}
			// #endif
		},
		methods: {
			//  TODO 开屏广告 后续优化添加
			launch() {
				try {
					// 获取本地存储中launchFlag标识 开屏广告
					const value = uni.getStorageSync("launchFlag");
					if (!value) {
						// this.$u.route("/pages/index/agreement");
					} else {
						//app启动时打开启动广告页
						var w = plus.webview.open(
							"/hybrid/html/advertise/advertise.html",
							"本地地址", {
								top: 0,
								bottom: 0,
								zindex: 999,
							},
							"fade-in",
							500
						);
						//设置定时器，4s后关闭启动广告页
						setTimeout(function() {
							plus.webview.close(w);
							APPUpdate();
						}, 3000);
					}
				} catch (e) {
					// error
					uni.setStorage({
						key: "launchFlag",
						data: true,
						success: function() {
							console.log("error时存储launchFlag");
						},
					});
				}
			},

			/**
			 * 获取粘贴板数据
			 */
			async getClipboard() {
				let res = await getClipboardData();

				/**
				 * 解析粘贴板数据
				 */

				if (res.indexOf(config.shareLink) != -1 && (res != this.$store.state.shareLink)) {
					this.$store.state.shareLink = res
					uni.showModal({
						title: "提示",
						content: "检测到一个分享链接是否跳转？",
						confirmText: "跳转",
						success: function(callback) {
							if (callback.confirm) {
								const path = res.split(config.shareLink)[1];
								if (path.indexOf("tabbar") != -1) {
									uni.switchTab({
										url: path,
									});
								} else {
									uni.navigateTo({
										url: path,
									});
								}
							}
						},
					});
				}
			},

			/**
			 * h5中打开app获取跳转app的链接并跳转
			 */
			checkArguments() {
				// #ifdef APP-PLUS
				setTimeout(() => {
					const args = plus.runtime.arguments;
					if (args) {
						const argsStr = decodeURIComponent(args);
						const path = argsStr.split("//")[1];
						if (path.indexOf("tabbar") != -1) {
							uni.switchTab({
								url: `/${path}`,
							});
						} else {
							uni.navigateTo({
								url: `/${path}`,
							});
						}
					}
				});
				// #endif
			},
			
			checkUpdate() {
			    plus.runtime.getProperty(plus.runtime.appid, async (widgetInfo) => {
			        console.log("当前版本信息：",widgetInfo.version);
			        getAppVersion().then(result => {
			            if (!result.code) {
			                let platform = uni.getSystemInfoSync().platform
			                if (platform === 'ios') {
			                    if (result.data.ios_version !== widgetInfo.version) {
			                        uni.showModal({
			                            cancelText: "Skip",
			                            confirmText: "Update",
			                            title: "Update available",
			                            content: "Please update to the latest version for improved features and performance.",
			                            success: (res) => {
			                                if (res.confirm) {
			                                    plus.runtime.openURL(
			                                        result.data.ios_ipa_url, () => {
			                                            console.log('打开地址失败', result.data.ios_ipa_url)
			                                        }
			                                    )
			                                }
			                            }
			                        })
			                    }
			                } else if (platform === 'android') {
			                    if (result.data.android_version !== widgetInfo.version) {
			                        // 版本不一致
			                        console.log('版本不一致!', result.data.android_version, widgetInfo.version)
			                        console.log('版本不一致!', JSON.stringify(result))
			                        uni.showModal({
			                            cancelText: "Skip",      // 下次更新
			                            confirmText: "Update",   // 立即更新
			                            title: "Update available",  // 发现新版本
			                            content: "Please update to the latest version for improved features and performance.",    // 当前应用有新的版本，是否立即更新?
			                            success: (res) => {
			                                if (res.confirm) {
			                                    console.log("开始下载:" + result.data.android);
			                                    let downloadTask = uni.downloadFile({
			                                        url: result.data.android,
			                                        success: (downloadResult) => {
			                                            if (downloadResult.statusCode === 200) {
			                                                plus.runtime.install(
			                                                    downloadResult.tempFilePath, {
			                                                        force: false
			                                                    }, () => {
			                                                        console.log("安装成功");
			                                                        plus.runtime.restart();
			                                                    }, () => {
			                                                        uni.showToast({
			                                                            title: "Installation failed, please try manually downloading and installing",    // 安装失败，请尝试手动下载安装
			                                                            icon: "fail"
			                                                        });
			                                                    }
			                                                );
			                                            }
			                                        },
			                                        fail: (error) => {
			                                            console.log("下载失败~~~~~~~~~~");
			                                            console.log(error);
			                                        },
			                                        complete: () => {
			                                            uni.hideLoading();
			                                        }
			                                    });
			                                    let lastProcess = 0;
			                                    uni.hideLoading();
			                                    var w = plus.nativeUI.showWaiting("Preparing to download ..."); // 准备下载...
			                                    downloadTask.onProgressUpdate((res) => {
			                                        console.log("lastProcess:" + res.progress);
			                                        if (lastProcess !== res.progress) {
			                                            lastProcess = res.progress;
			                                            w.setTitle("Download progress" + res.progress + "%");   // 下载进度
			                                        }
			                                    });
			                                }
			                            }
			                        })
			                    }
			                }
			            }
			        })
			    });
			}
		
		},
	};
</script>

<style lang="scss">
	@import "uview-ui/index.scss";

	// -------适配底部安全区  苹果x系列刘海屏

	// #ifdef MP-WEIXIN
	.mp-iphonex-bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;
		height: auto !important;
		padding-top: 10rpx;
	}

	// #endif

	body {
		background-color: $bg-color;
	}

	/************************ */
	.w200 {
		width: 200rpx !important;
	}

	.flex1 {
		flex: 1; //必须父级设置flex
	}
</style>