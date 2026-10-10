<template>
  <view class="home">
    <!-- 顶部头像&登录区 -->
    <view class="header">
      <view class="user-row">
        <image class="avatar" src="https://picsum.photos/seed/avatar/80/80" mode="aspectFill"></image>
        <view class="greeting">
          <text class="hello">Hey，来跟幸运打个招呼 👋</text>
          <text class="login-tip" @click="handleLogin">登录/注册</text>
        </view>
      </view>
    </view>

    <!-- 限时活动大卡片（联名周边） -->
    <view class="activity-card">
      <image class="activity-img" src="https://img.shetu66.com/2024/01/07/170464153826283238.png?x-oss-process=image/resize,h_800/watermark,image_d2F0ZXJtYXJrL2JhY2tncm91cDAxLnBuZw==,g_se,x_0,y_10/watermark,text_6K6-5Zu-572RIOe8luWPtzo2MzE2MzUwNzk1ODM2MzU1NDU=,type_ZmFuZ3poZW5naGVpdGk,color_FFFFFF,size_12,g_se,x_15,y_16" mode="widthFix"></image>
      <view class="activity-content">
        <text class="title">买咖啡得</text>
        <text class="brand">联名周边</text>
        <button class="buy-btn" @click="goBuy">立即购买</button>
      </view>
    </view>

    <!-- 快速入口（3~4个） -->
    <view class="quick-grid">
      <view class="grid-item" @click="navTo('takeout')">
        <image class="icon" src="https://pic.nximg.cn/file/20201014/32177163_223620125080_2.jpg" mode="aspectFill"></image>
        <text>到店取</text>
        <text class="sub">免排队</text>
      </view>
      <view class="grid-item" @click="navTo('delivery')">
        <image class="icon" src="https://pic.mksucai.com/00/23/18/aacd008e6f7f1a02.webp" mode="aspectFill"></image>
        <text>幸运送</text>
        <text class="sub">及时送达</text>
      </view>
      <view class="grid-item" @click="navTo('instant')">
        <image class="icon" src="https://pic.pngsucai.com/01/08/41/8eec4366bed1ec0d.webp" mode="aspectFill"></image>
        <text>即享咖啡</text>
        <text class="sub">看球赛</text>
      </view>
      <view class="grid-item" @click="navTo('card')">
        <image class="icon" src="https://imgs.design006.com/202308/Design006_dyZRbFKwnm.jpg!prev_w_750_h_auto" mode="aspectFill"></image>
        <text>咖啡卡券</text>
        <text class="sub">限时</text>
      </view>
    </view>

    <!-- 福利活动双栏 -->
    <view class="welfare-row">
      <view class="welfare-card" @click="goGuess">
        <text class="tag">猜口令</text>
        <text class="desc">赢手机</text>
      </view>
      <view class="welfare-card" @click="goWelfare">
        <text class="tag">福利中心</text>
        <text class="desc">天天得福利</text>
      </view>
    </view>

    <!-- 拼单满减促销 -->
    <view class="promo-banner" @click="goGroup">
      <text>拼单满减  立享优惠</text>
      <text>一起点更划算 ></text>
    </view>

    <!-- 9.9元券 & 邀请好友 -->
    <view class="coupon-row">
      <view class="coupon-card">
        <text class="price">9.9</text>
        <text class="unit">元×3张饮品券</text>
      </view>
      <view class="coupon-card invite">
        <text>邀好友得9.9元</text>
        <text class="small">加幸运官好礼周周领</text>
        <button class="invite-btn" @click="invite">立即邀请 ></button>
      </view>
    </view>

    <!-- 新朋友福利 -->
    <view class="new-friend" @click="newUser">
      <text>新朋友享首杯福利</text>
      <text>立即领取 ></text>
    </view>

    <!-- 推荐饮品标题 -->
    <view class="section-title">
      <text>☕️ 为你推荐</text>
    </view>

    <!-- 商品横向滚动列表 -->
    <scroll-view scroll-x class="goods-scroll" show-scrollbar="false">
      <view class="goods-row">
        <view class="goods-card" v-for="item in recommendList" :key="item.id" @click="addToCart(item)">
          <image class="goods-img" :src="item.image" mode="aspectFill"></image>
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-price">¥{{ item.price }}</text>
          <view class="add-cart">+ 加购</view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部占位（避免Tab遮挡） -->
    <view class="bottom-placeholder"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recommendList: [
        { id: 1, name: '经典拿铁', price: 28, image: 'https://www.gafei.com/uploads/allimg/151103/215125M47-0.jpg' },
        { id: 2, name: '香草拿铁', price: 29, image: 'https://s.boohee.cn/house/upload_food/2020/5/14/big_photo_url_7fc9f7cabb396adad03e5113c5430b08.jpg' },
        { id: 3, name: '经典美式', price: 22, image: 'https://ts1.tc.mm.bing.net/th/id/R-C.696afceffe1c1b196633360bd3332ff1?rik=Y4tv4ahm24t44w&riu=http%3a%2f%2fi2.chuimg.com%2fe1da7142883311e6b87c0242ac110003_640w_640h.jpg%3fimageView2%2f2%2fw%2f660%2finterlace%2f1%2fq%2f90&ehk=eAVG9SSEfrMfRouwPodEI74YjaWANmKEGPUuDAxBDLE%3d&risl=&pid=ImgRaw&r=0' },
        { id: 4, name: '冰美式', price: 32, image: 'https://ts1.tc.mm.bing.net/th/id/R-C.8408f81011e70a2f4fc948d344efd1dd?rik=fi0o2SDzp%2bAsjg&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20210812ac%2f77%2fw2048h1229%2f20210812%2fd6d6-ba0795f1b47cbde3a640bdbc6bb68310.jpg&ehk=26HY9chRTWUjqMe6Sh%2bXnyGX%2f3S6UmOT6ULuXAnvm58%3d&risl=&pid=ImgRaw&r=0' },
        { id: 5, name: '手冲耶加雪菲', price: 25, image: 'https://www.gafei.com/uploadfile/202301/3c2b61aee080c0b.jpg' }
      ]
    }
  },
  methods: {
    handleLogin() {
      uni.showToast({ title: '跳转登录页', icon: 'none' })
      // 实际可跳转：uni.navigateTo({ url: '/pages/login/login' })
    },
    goBuy() {
      uni.showToast({ title: '周边详情', icon: 'none' })
    },
    navTo(type) {
      uni.showToast({ title: `功能：${type}`, icon: 'none' })
    },
    goGuess() {
      uni.showToast({ title: '猜口令活动', icon: 'none' })
    },
    goWelfare() {
      uni.showToast({ title: '福利中心', icon: 'none' })
    },
    goGroup() {
      uni.showToast({ title: '拼单满减', icon: 'none' })
    },
    invite() {
      uni.showToast({ title: '邀请好友', icon: 'none' })
    },
    newUser() {
      uni.showToast({ title: '新朋友福利', icon: 'none' })
    },
    addToCart(goods) {
      // 临时购物车提示（后续可对接全局store）
      uni.showToast({ title: `已添加 ${goods.name}`, icon: 'success' })
      console.log('加购:', goods)
    }
  }
}
</script>

<style>
page {
  background-color: #f9f6ef;
}
.home {
  padding: 20rpx 30rpx 100rpx;
}

/* 头部 */
.header {
  margin-bottom: 30rpx;
}
.user-row {
  display: flex;
  align-items: center;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  background-color: #e0cbb0;
}
.greeting {
  flex: 1;
}
.hello {
  font-size: 32rpx;
  font-weight: 600;
  color: #4e2e1e;
  display: block;
}
.login-tip {
  font-size: 24rpx;
  color: #b47c48;
  margin-top: 8rpx;
  display: inline-block;
  background: #fff2e6;
  padding: 6rpx 20rpx;
  border-radius: 40rpx;
}

/* 活动大卡片 */
.activity-card {
  background: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.05);
  position: relative;
}
.activity-img {
  width: 100%;
  height: 180rpx;
  object-fit: cover;
}
.activity-content {
  padding: 20rpx 30rpx 30rpx;
  text-align: center;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}
.brand {
  font-size: 40rpx;
  font-weight: 900;
  color: #e05a5a;
  margin: 12rpx 0;
  display: block;
}
.buy-btn {
  background-color: #5D4037;
  color: white;
  border-radius: 60rpx;
  font-size: 28rpx;
  padding: 12rpx 0;
  width: 200rpx;
  margin: 0 auto;
}

/* 四格入口 */
.quick-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  background: white;
  border-radius: 32rpx;
  padding: 20rpx 0;
}
.grid-item {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  font-weight: 500;
  color: #4e2e1e;
}
.grid-item .icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 30rpx;
  margin-bottom: 10rpx;
  background-color: #f0e4d5;
}
.sub {
  font-size: 20rpx;
  color: #b47c48;
  display: block;
  margin-top: 4rpx;
}

/* 双福利卡片 */
.welfare-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}
.welfare-card {
  flex: 1;
  background: linear-gradient(135deg, #f5e6d3, #faeedf);
  padding: 30rpx 20rpx;
  border-radius: 28rpx;
  text-align: center;
}
.welfare-card .tag {
  font-size: 28rpx;
  font-weight: bold;
  background: #5D4037;
  color: white;
  padding: 6rpx 20rpx;
  border-radius: 60rpx;
  display: inline-block;
  margin-bottom: 16rpx;
}
.welfare-card .desc {
  font-size: 32rpx;
  font-weight: 600;
  color: #5D4037;
  display: block;
}

/* 拼单banner */
.promo-banner {
  background-color: #f0e4d5;
  border-radius: 32rpx;
  display: flex;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  font-weight: 500;
}

/* 优惠券行 */
.coupon-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}
.coupon-card {
  flex: 1;
  background: white;
  border-radius: 28rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
}
.price {
  font-size: 56rpx;
  font-weight: 800;
  color: #5D4037;
}
.unit {
  font-size: 24rpx;
  margin-left: 8rpx;
}
.invite {
  background: #fef3e8;
}
.invite-btn {
  background: none;
  border: none;
  font-size: 24rpx;
  color: #5D4037;
  padding: 0;
  margin-top: 16rpx;
  text-align: left;
}

/* 新朋友福利 */
.new-friend {
  background: #d9c9b6;
  border-radius: 32rpx;
  display: flex;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  margin-bottom: 40rpx;
  font-weight: bold;
  font-size: 28rpx;
}

/* 推荐区 */
.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin: 20rpx 0 20rpx;
  padding-left: 10rpx;
}
.goods-scroll {
  white-space: nowrap;
  width: 100%;
}
.goods-row {
  display: inline-flex;
  gap: 20rpx;
}
.goods-card {
  width: 240rpx;
  background: white;
  border-radius: 28rpx;
  padding: 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  margin-right: 20rpx;
}
.goods-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 24rpx;
  margin: 0 auto 12rpx;
}
.goods-name {
  font-size: 28rpx;
  font-weight: 500;
  display: block;
}
.goods-price {
  color: #5D4037;
  font-weight: bold;
  margin: 8rpx 0;
  display: block;
}
.add-cart {
  background-color: #5D4037;
  color: white;
  border-radius: 40rpx;
  font-size: 24rpx;
  padding: 8rpx 0;
  width: 100rpx;
  margin: 0 auto;
}
.bottom-placeholder {
  height: 100rpx;
}
</style>
