<template>
  <view class="checkout">
    <view class="title">确认订单</view>
    <view class="goods-list">
      <view v-for="(item, idx) in cart" :key="idx" class="goods-item">
        <image :src="item.image" mode="aspectFill" class="goods-img"></image>
        <view class="goods-info">
          <text class="name">{{ item.name }}</text>
          <text class="price">¥{{ item.price }}</text>
          <text class="count">x{{ item.count }}</text>
        </view>
      </view>
    </view>
    <view class="total">
      <text>共 {{ totalCount }} 件 合计：</text>
      <text class="total-price">¥{{ totalPrice }}</text>
    </view>
    <button class="submit-btn" @click="submitOrder">提交订单</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      totalCount: 0,
      totalPrice: '0.00'
    }
  },
  onShow() {
    this.loadCart()
  },
  methods: {
    loadCart() {
      const cart = uni.getStorageSync('cart') || []
      this.cart = cart
      let count = 0
      let price = 0
      for (let item of cart) {
        count += item.count
        price += item.price * item.count
      }
      this.totalCount = count
      this.totalPrice = price.toFixed(2)
    },
    async submitOrder() {
      if (this.cart.length === 0) {
        uni.showToast({ title: '购物车为空', icon: 'none' })
        return
      }
      uni.showLoading({ title: '提交中...', mask: true })
      try {
        // 调用云函数
        const res = await uniCloud.callFunction({
          name: 'createOrder',
          data: {
            items: this.cart,
            totalPrice: this.totalPrice,
            totalCount: this.totalCount
          }
        })
        if (res.result.code === 0) {
          // 提交成功，清空购物车缓存
          uni.removeStorageSync('cart')
          uni.showToast({ title: '下单成功', icon: 'success' })
          // 跳转到“我的”页面
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/mine/mine'
            })
          }, 1500)
        } else {
          uni.showToast({ title: res.result.message || '下单失败', icon: 'none' })
        }
      } catch (err) {
        console.error(err)
        uni.showToast({ title: '网络错误', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style>
.checkout {
  padding: 30rpx;
  background-color: #f9f6ef;
  min-height: 100vh;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
}
.goods-list {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}
.goods-item {
  display: flex;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.goods-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.goods-info {
  flex: 1;
  position: relative;
}
.name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}
.price {
  color: #5D4037;
  font-size: 28rpx;
  margin-top: 10rpx;
  display: inline-block;
}
.count {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 28rpx;
  color: #999;
}
.total {
  text-align: right;
  font-size: 30rpx;
  margin-bottom: 60rpx;
}
.total-price {
  color: #5D4037;
  font-weight: bold;
  font-size: 40rpx;
}
.submit-btn {
  background-color: #5D4037;
  color: white;
  border-radius: 60rpx;
  font-size: 32rpx;
  padding: 20rpx 0;
}
</style>
