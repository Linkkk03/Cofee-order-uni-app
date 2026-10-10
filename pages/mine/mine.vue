<template>
  <view class="mine">
    <view class="user-header">
      <text class="greeting">咖啡爱好者</text>
    </view>
    <view class="orders-section">
      <view class="section-title">我的订单</view>
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="orders.length === 0" class="empty">
        <text>暂无订单</text>
        <button class="go-order" @click="goMenu">去点单</button>
      </view>
      <view v-else>
        <view v-for="(order, idx) in orders" :key="idx" class="order-card">
          <view class="order-header">
            <text>订单时间：{{ formatTime(order.createTime) }}</text>
            <text class="status">{{ order.status }}</text>
          </view>
          <view class="order-detail">
            <text>共 {{ order.totalCount }} 件商品  实付 ¥{{ order.totalPrice }}</text>
          </view>
          <view class="order-items">
            <text v-for="(item, i) in order.items" :key="i">
              {{ item.name }} x{{ item.count }} {{ i < order.items.length-1 ? '、' : '' }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      loading: true
    }
  },
  onShow() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      this.loading = true
      try {
        const db = uniCloud.database()
        const res = await db.collection('coffee-orders')
          .orderBy('createTime', 'desc')
          .get()
        // 注意数据结构：res.result.data
        const ordersData = res.result && res.result.data ? res.result.data : []
        this.orders = ordersData
      } catch (err) {
        console.error('加载订单失败', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return `${date.getMonth()+1}/${date.getDate()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`
    },
    goMenu() {
      uni.switchTab({ url: '/pages/menu/menu' })
    }
  }
}
</script>

<style>
.mine {
  padding: 30rpx;
  background-color: #f9f6ef;
  min-height: 100vh;
}
.user-header {
  background: linear-gradient(135deg, #5D4037, #8b5a4b);
  padding: 60rpx 30rpx;
  border-radius: 30rpx;
  margin-bottom: 40rpx;
}
.greeting {
  font-size: 40rpx;
  font-weight: bold;
  color: white;
}
.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.order-card {
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.order-header {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #666;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 15rpx;
}
.status {
  color: #5D4037;
  font-weight: bold;
}
.order-detail {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}
.order-items {
  font-size: 26rpx;
  color: #888;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
}
.go-order {
  background-color: #5D4037;
  color: white;
  border-radius: 60rpx;
  margin-top: 30rpx;
  width: 200rpx;
}
.loading {
  text-align: center;
  padding: 100rpx 0;
}
</style>
