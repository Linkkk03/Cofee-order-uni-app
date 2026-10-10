<template>
  <view class="menu-container">
    <!-- 左侧分类栏 -->
    <scroll-view class="left-category" scroll-y>
      <view 
        v-for="(cat, idx) in categoryList" 
        :key="idx"
        class="category-item"
        :class="{ active: currentCategory === cat }"
        @click="currentCategory = cat"
      >
        {{ cat }}
      </view>
    </scroll-view>

    <!-- 右侧商品列表 -->
    <scroll-view class="right-goods" scroll-y>
      <view v-if="loading" class="loading">加载商品中...</view>
      <view v-else-if="goodsList.length === 0" class="empty">暂无商品</view>
      <view v-else v-for="(goods, idx) in goodsList" :key="idx" class="goods-card">
        <image class="goods-img" :src="goods.image" mode="aspectFill"></image>
        <view class="goods-info">
          <text class="goods-name">{{ goods.name }}</text>
          <text class="goods-price">¥{{ goods.price }}</text>
          <button class="add-btn" size="mini" @click="addToCart(goods)">加购</button>
        </view>
      </view>
    </scroll-view>

    <!-- 底部购物车栏 -->
    <view class="cart-bar" @click="showCartPopup = true">
      <view class="cart-info">
        <text class="cart-icon">🛒</text>
        <text class="cart-total">¥{{ cartTotalPrice }}</text>
      </view>
      <view class="cart-detail">
        <text>共 {{ cartTotalCount }} 件</text>
        <text class="go-checkout">去结算</text>
      </view>
    </view>

    <!-- 购物车弹窗 -->
    <view class="cart-popup-mask" v-if="showCartPopup" @click="showCartPopup = false"></view>
    <view class="cart-popup" :class="{ show: showCartPopup }">
      <view class="popup-header">
        <text>购物车</text>
        <text class="clear-btn" @click="clearCart">清空</text>
      </view>
      <scroll-view scroll-y class="popup-goods-list">
        <view v-for="(item, idx) in cart" :key="idx" class="popup-goods-item">
          <image class="popup-img" :src="item.image" mode="aspectFill"></image>
          <view class="popup-info">
            <text class="popup-name">{{ item.name }}</text>
            <text class="popup-price">¥{{ item.price }}</text>
          </view>
          <view class="popup-actions">
            <view class="stepper">
              <text class="stepper-btn" @click.stop="changeCount(item, -1)">-</text>
              <text class="stepper-count">{{ item.count }}</text>
              <text class="stepper-btn" @click.stop="changeCount(item, 1)">+</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="popup-footer">
        <text>合计：¥{{ cartTotalPrice }}</text>
        <button class="checkout-btn" @click="goCheckout">去结算</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      allGoods: [],
      categoryList: [],
      currentCategory: '',
      goodsList: [],
      cart: [],
      cartTotalCount: 0,
      cartTotalPrice: 0,
      showCartPopup: false
    }
  },
  mounted() {
    this.loadGoods()
    this.loadCart()
  },
  methods: {
    // 加载商品
    async loadGoods() {
      this.loading = true
      try {
        const db = uniCloud.database()
        const res = await db.collection('coffee-goods').get()
        const goodsData = res.result && res.result.data ? res.result.data : []
        this.allGoods = goodsData
        if (this.allGoods.length === 0) {
          uni.showToast({ title: '数据库无数据', icon: 'none' })
          this.loading = false
          return
        }
        const cats = [...new Set(this.allGoods.map(item => item.category))]
        cats.sort()
        this.categoryList = cats
        if (cats.length) this.currentCategory = cats[0]
        this.filterGoods()
      } catch (err) {
        console.error('加载失败', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    filterGoods() {
      if (!this.currentCategory) {
        this.goodsList = []
      } else {
        this.goodsList = this.allGoods.filter(item => item.category === this.currentCategory)
      }
    },
    // 购物车逻辑
    loadCart() {
      const storedCart = uni.getStorageSync('cart')
      if (storedCart && Array.isArray(storedCart)) {
        this.cart = storedCart
      } else {
        this.cart = []
      }
      this.updateCartSummary()
    },
    saveCart() {
      uni.setStorageSync('cart', this.cart)
      this.updateCartSummary()
    },
    updateCartSummary() {
      let totalCount = 0
      let totalPrice = 0
      for (let item of this.cart) {
        totalCount += item.count
        totalPrice += item.price * item.count
      }
      this.cartTotalCount = totalCount
      this.cartTotalPrice = totalPrice.toFixed(2)
    },
    addToCart(goods) {
      const existing = this.cart.find(item => item._id === goods._id)
      if (existing) {
        existing.count += 1
      } else {
        this.cart.push({
          _id: goods._id,
          name: goods.name,
          price: goods.price,
          image: goods.image,
          count: 1
        })
      }
      this.saveCart()
      uni.showToast({ title: `已添加 ${goods.name}`, icon: 'success' })
    },
    changeCount(item, delta) {
      const newCount = item.count + delta
      if (newCount <= 0) {
        const index = this.cart.findIndex(i => i._id === item._id)
        if (index !== -1) this.cart.splice(index, 1)
      } else {
        item.count = newCount
      }
      this.saveCart()
    },
    clearCart() {
      uni.showModal({
        title: '提示',
        content: '确定清空购物车吗？',
        success: (res) => {
          if (res.confirm) {
            this.cart = []
            this.saveCart()
            uni.showToast({ title: '已清空', icon: 'success' })
          }
        }
      })
    },
    goCheckout() {
      if (this.cart.length === 0) {
        uni.showToast({ title: '购物车为空', icon: 'none' })
        return
      }
      uni.navigateTo({
        url: '/pages/checkout/checkout'
      })
      this.showCartPopup = false
    }
  },
  watch: {
    currentCategory() {
      this.filterGoods()
    }
  }
}
</script>

<style>
.menu-container {
  display: flex;
  height: 100vh;
  background-color: #f9f6ef;
  padding-bottom: 0;
}
.left-category {
  width: 160rpx;
  background-color: #f5f5f5;
  height: 100%;
}
.category-item {
  padding: 30rpx 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #eee;
}
.category-item.active {
  background-color: #fff;
  color: #5D4037;
  font-weight: bold;
  border-left: 6rpx solid #5D4037;
}
.right-goods {
  flex: 1;
  padding: 20rpx;
  height: 100%;
}
.goods-card {
  display: flex;
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
  padding: 20rpx;
}
.goods-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  background-color: #eee;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
}
.goods-price {
  font-size: 30rpx;
  color: #5D4037;
  font-weight: bold;
  margin: 10rpx 0;
}
.add-btn {
  align-self: flex-start;
  background-color: #5D4037;
  color: white;
  border: none;
  border-radius: 30rpx;
  font-size: 26rpx;
  padding: 6rpx 20rpx;
}
.loading, .empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.cart-bar {
  position: fixed;
  bottom: 100rpx;   /* 根据你的 TabBar 高度调整，没有则改为 0 */
  left: 0;
  right: 0;
  background-color: #2c2c2c;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-radius: 40rpx 40rpx 0 0;
  z-index: 10;
}
.cart-info {
  display: flex;
  align-items: center;
}
.cart-icon {
  font-size: 44rpx;
  margin-right: 20rpx;
}
.cart-total {
  font-size: 36rpx;
  font-weight: bold;
}
.cart-detail {
  display: flex;
  align-items: center;
}
.go-checkout {
  background-color: #5D4037;
  padding: 12rpx 30rpx;
  border-radius: 60rpx;
  margin-left: 20rpx;
  font-size: 28rpx;
}
.cart-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 999;
}
.cart-popup {
  position: fixed;
  bottom: -100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 40rpx 40rpx 0 0;
  transition: bottom 0.3s ease;
  z-index: 1000;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}
.cart-popup.show {
  bottom: 0;
}
.popup-header {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  border-bottom: 1rpx solid #eee;
}
.clear-btn {
  color: #f56c6c;
  font-size: 28rpx;
}
.popup-goods-list {
  max-height: 500rpx;
  padding: 0 20rpx;
}
.popup-goods-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.popup-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.popup-info {
  flex: 1;
}
.popup-name {
  font-size: 28rpx;
  font-weight: bold;
}
.popup-price {
  font-size: 26rpx;
  color: #5D4037;
  display: block;
}
.popup-actions {
  display: flex;
  align-items: center;
}
.stepper {
  display: flex;
  align-items: center;
  border: 1rpx solid #ddd;
  border-radius: 30rpx;
  overflow: hidden;
}
.stepper-btn {
  width: 50rpx;
  text-align: center;
  font-size: 36rpx;
  background-color: #f9f9f9;
  padding: 8rpx 0;
}
.stepper-count {
  min-width: 50rpx;
  text-align: center;
  font-size: 28rpx;
}
.popup-footer {
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkout-btn {
  background-color: #5D4037;
  color: white;
  border-radius: 60rpx;
  font-size: 28rpx;
  padding: 12rpx 30rpx;
  margin: 0;
}
</style>
