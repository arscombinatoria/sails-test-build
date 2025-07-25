const sails=require('sails');
module.exports=async()=>{
  process.env.NODE_ENV='test';
  process.env.MYSQL_URL='mysql://root:pass@127.0.0.1:13306/testdb';
  await new Promise((res,rej)=>sails.lift({hooks:{grunt:false},log:{level:'warn'}},e=>e?rej(e):res()));
};
