'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const collection = db.collection('coffee-goods')
  const res = await collection.get()
  return {
    code: 0,
    data: res.data
  }
};
