<template>
	<view class="submember-container">
		<view class="btn-color total-btn">{{$t('totalUser')}}：<text>15145</text></view>
		<view class="table">
			<view class="table-header table-content">
				<view class="name">{{$t('username')}}</view>
				<view class="time">{{$t('registerTime')}}</view>
			</view>
			<view class="table-content" v-for="(item,index) in listData" :key="index">
				<view class="name">{{item.name}}</view>
				<view class="time">{{item.time}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
				listData: [{
						id: 1,
						name: '张三',
						age: '18',
						time: '2023-05-04 16:55'
					},
					{
						id: 2,
						name: '李四',
						age: '16',
						time: '2023-05-04 16:55'
					},
					{
						id: 3,
						name: '王小虎',
						age: '38',
						time: '2023-05-04 16:55'
					}
				]
			}
		},
		
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.submember-container {
	padding: 0 12px 12px 12px;
	.total-btn {
		width: 100%;
		height: 85px;
		font-size: 20px;
		text {
			font-size: 32px;
			color: #FAE74C;
			font-weight: bold;
		}
	}
	.table {
		background: #292A41;
		border-radius: 16px;
		padding: 12px;
		margin-top: 12px;
		color: #fff;
		.table-header {
			opacity: 0.7;
		}
		.table-content {
			padding: 12px;
			display: flex;
			border-top: 1px solid #454665;
			gap: 6px;
			view {
				flex: 1;
				text-align: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.table-content:first-child {
			border-top: none;
		}
	}
}
</style>
