'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  // 从前端传来的数据：items, totalPrice, totalCount
  const { items, totalPrice, totalCount } = event
  
  // 校验数据
  if (!items || !items.length) {
    return {
      code: 400,
      message: '购物车不能为空'
    }
  }
  
  // 构建订单对象
  const order = {
    items: items,            // 购物车明细 [{_id, name, price, image, count}]
    totalPrice: totalPrice,  // 总价（数字，保留两位小数）
    totalCount: totalCount,  // 总件数
    status: '待制作',        // 初始状态
    createTime: Date.now()   // 时间戳，用于排序
  }
  
  try {
    const collection = db.collection('coffee-orders')
    const res = await collection.add(order)
    return {
      code: 0,
      message: '订单创建成功',
      orderId: res.id
    }
  } catch (err) {
    console.error(err)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
};
