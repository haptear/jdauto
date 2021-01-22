//备份之前单账号的萌宠脚本
const name = '东东萌宠';
const $ = new Env(name);

// =======node.js使用说明======
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//ios等软件用户直接用NobyDa的jd cookie
const cookie = jdCookieNode.CookieJD ? jdCookieNode.CookieJD : $.getdata('CookieJD');
//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let jdNotify = $.getdata('jdPetNotify');
let shareCodes = [ // 这个列表填入你要助力的好友的shareCode, 最多可能是5个
  'MTAxODc2NTEzMjAwMDAwMDAzMDI3MTMyOQ==',
  'MTAxODcxOTI2NTAwMDAwMDAyNjA4ODQyMQ==',
  'MTAxODc2NTEzMDAwMDAwMDAwNTUwNDUxMw==',
  'MTAxODc2NTEzOTAwMDAwMDAxODQ5MDg5NQ==',
  'MTAxODcxOTI2NTAwMDAwMDAxOTQ3MjkzMw=='
]
// 添加box功能
// 【用box订阅的好处】
// 1️⃣脚本也可以远程挂载了。助力功能只需在box里面设置助力码。
// 2️⃣所有脚本的cookie都可以备份，方便你迁移到其他支持box的软件。
let isBox = false //默认没有使用box
const boxShareCodeArr = ['jd_pet1', 'jd_pet2', 'jd_pet3', 'jd_pet4', 'jd_pet5'];
isBox = boxShareCodeArr.some((item) => {
  const boxShareCode = $.getdata(item);
  return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
});
if (isBox) {
  shareCodes = [];
  for (const item of boxShareCodeArr) {
    if ($.getdata(item)) {
      shareCodes.push($.getdata(item));
    }
  }
}
let petInfo = null, taskInfo = null, message = '', subTitle = '', goodsUrl = '', taskInfoKey = [], option = {};

//按顺序执行, 尽量先执行不消耗狗粮的任务, 避免中途狗粮不够, 而任务还没做完
let function_map = {
  signInit: signInit, //每日签到
  threeMealInit: threeMealInit, //三餐
  browseSingleShopInit: browseSingleShopInit, //浏览店铺1
  browseSingleShopInit2: browseSingleShopInit2, //浏览店铺2
  browseSingleShopInit3: browseSingleShopInit3, //浏览店铺3
  browseShopsInit: browseShopsInit, //浏览店铺s, 目前只有一个店铺
  firstFeedInit: firstFeedInit, //首次喂食
  inviteFriendsInit: inviteFriendsInit, //邀请好友, 暂未处理
  feedReachInit: feedReachInit, //喂食10次任务  最后执行投食10次任务, 提示剩余狗粮是否够投食10次完成任务, 并询问要不要继续执行
}

let gen = entrance();
gen.next();
/**
 * 入口函数
 */
function* entrance() {
  if (!cookie) {
    $.msg(name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    $.done();
    return
  }
  console.log('任务开始');
  yield initPetTown(); //初始化萌宠
  yield taskInit(); // 初始化任务

  yield petSport(); // 遛弯
  yield slaveHelp();  // 助力, 在顶部shareCodes中填写需要助力的shareCode
  yield masterHelpInit();//获取助力信息
  taskInfo['taskList'].forEach((val) => {
    taskInfoKey.push(val);
  })
  // 任务开始
  for (let task_name in function_map) {
    if (taskInfoKey.indexOf(task_name) !== -1) {
      taskInfoKey.splice(taskInfoKey.indexOf(task_name), 1);
    }
    if (taskInfo[task_name] && !taskInfo[task_name].finished) {
      console.log('任务' + task_name + '开始');
      // yield eval(task_name + '()');
      yield function_map[task_name]();
    } else {
      console.log('任务' + task_name + '已完成');
    }
  }
  for (let item of taskInfoKey) {
    console.log(`新任务 【${taskInfo[item].title}】 功能未开发，请反馈给脚本维护者@haptear\n`);
    $.msg($.name, subTitle, `新的任务 【${taskInfo[item].title}】 功能未开发，请反馈给脚本维护者@haptear\n`, {"open-url": "https://t.me/JD_fruit_pet"})
  }
  yield feedPetsAgain();//所有任务做完后，检测剩余狗粮是否大于110g,大于就继续投食
  yield energyCollect();
  option['media-url'] = goodsUrl;
  if (!jdNotify || jdNotify === 'false') {
    $.msg(name, subTitle, message, option);
  }
  // $notify(name, subTitle, message);
  console.log('全部任务完成, 如果帮助到您可以点下🌟STAR鼓励我一下, 明天见~');
  $.done();
}


// 收取所有好感度
function energyCollect() {
  console.log('开始收取任务奖励好感度');

  let function_id = arguments.callee.name.toString();
  request(function_id).then(response => {
    console.log(`收取任务奖励好感度完成:${JSON.stringify(response)}`);
    if (response.code === '0') {
      // message += `【第${petInfo.medalNum + 2}块勋章完成进度】：${response.result.medalPercent}%，还需投食${response.result.needCollectEnergy}g狗粮\n`;
      // message += `【已获得勋章】${petInfo.medalNum + 1}块，还需收集${petInfo.goodsInfo.exchangeMedalNum - petInfo.medalNum - 1}块即可兑换奖品“${petInfo.goodsInfo.goodsName}”\n`;
      message += `【第${response.result.medalNum + 1}块勋章完成进度】${response.result.medalPercent}%，还需收集${response.result.needCollectEnergy}好感\n`;
      message += `【已获得勋章】${response.result.medalNum}块，还需收集${response.result.needCollectMedalNum}块即可兑换奖品“${petInfo.goodsInfo.goodsName}”\n`;
    }
    gen.next();
  })
}

// 首次投食 任务
function firstFeedInit() {
  console.log('首次投食任务合并到10次喂食任务中');
  setTimeout(() => {
    gen.next();
  }, 2000);
}

/**
 * 投食10次 任务
 */
async function feedReachInit() {
  console.log('投食任务开始...');

  // let foodAmount = petInfo.foodAmount; //剩余狗粮
  let finishedTimes = taskInfo.feedReachInit.hadFeedAmount / 10; //已经喂养了几次
  let needFeedTimes = 10 - finishedTimes; //还需要几次
  // let canFeedTimes = foodAmount / 10;
  // if (canFeedTimes < needFeedTimes) {
  // if (confirm('当前剩余狗粮' + foodAmount + 'g, 已不足投食' + needFeedTimes + '次, 确定要继续吗?') === false) {
  // 	console.log('你拒绝了执行喂养十次任务');
  // 	gen.next();
  // }
  // }

  let tryTimes = 20; //尝试次数
  do {
    console.log(`还需要投食${needFeedTimes}次`);
    let response = await feedPets();
    console.log(`本次投食结果: ${JSON.stringify(response)}`);
    if (response.resultCode == 0 && response.code == 0) {
      needFeedTimes--;
    }
    if (response.resultCode == 3003 && response.code == 0) {
      console.log('剩余狗粮不足, 投食结束');
      needFeedTimes = 0;
    }

    tryTimes--;
  } while (needFeedTimes > 0 && tryTimes > 0)

  console.log('投食任务结束...');
  gen.next();

}

// 遛狗, 每天次数上限10次, 随机给狗粮, 每次遛狗结束需调用getSportReward领取奖励, 才能进行下一次遛狗
async function petSport() {
  console.log('开始遛弯');

  var times = 1;
  var code = 0;
  var resultCode = 0;

  do {
    let response = await request(arguments.callee.name.toString())
    console.log(`第${times}次遛狗完成: ${JSON.stringify(response)}`);
    resultCode = response.resultCode;

    if (resultCode == 0) {
      let sportRevardResult = await getSportReward();
      console.log(`领取遛狗奖励完成: ${JSON.stringify(sportRevardResult)}`);
    }

    times++;
  } while (resultCode == 0 && code == 0)
  if (times > 1) {
    message += '【十次遛狗】已完成\n';
  }
  gen.next();

}

/**
 * 助力好友, 暂时支持一个好友, 需要拿到shareCode
 * shareCode为你要助力的好友的
 * 运行脚本时你自己的shareCode会在控制台输出, 可以将其分享给他人
 */
async function slaveHelp() {
  let functionId = arguments.callee.name.toString();
  let helpPeoples = '';
  for (let code of shareCodes) {
    console.log(`开始助力好友: ${code}`);
    let response = await request(functionId, {
      shareCode: code
    });
    if (response.code === '0' && response.resultCode === '0') {
      if (response.result.helpStatus === 0) {
        console.log('已给好友: 【' + response.result.masterNickName + '】助力');
        helpPeoples += response.result.masterNickName + '，';
      } else if (response.result.helpStatus === 1) {
        // 您今日已无助力机会
        console.log(`助力好友${response.result.masterNickName}失败，您今日已无助力机会`);
        break;
      } else if (response.result.helpStatus === 2) {
        //该好友已满5人助力，无需您再次助力
        console.log(`该好友${response.result.masterNickName}已满5人助力，无需您再次助力`);
      }
    } else {
      console.log(`助理好友结果: ${response.message}`);
    }
  }
  if (helpPeoples && helpPeoples.length > 0) {
    message += `【您助力的好友】${helpPeoples.substr(0, helpPeoples.length - 1)}\n`;
  }

  gen.next();
}


// 领取遛狗奖励
function getSportReward() {
  return new Promise((rs, rj) => {
    request(arguments.callee.name.toString()).then(response => {
      rs(response);
    })
  })
}

// 浏览店铺任务, 任务可能为多个? 目前只有一个
async function browseShopsInit() {
  console.log('开始浏览店铺任务');
  let times = 0;
  let resultCode = 0;
  let code = 0;

  do {
    let response = await request("getBrowseShopsReward");
    console.log(`第${times}次浏览店铺结果: ${JSON.stringify(response)}`);
    code = response.code;
    resultCode = response.resultCode;
    times++;
  } while (resultCode == 0 && code == 0 && times < 5)

  console.log('浏览店铺任务结束');
  gen.next();
}

// 浏览指定店铺 任务
function browseSingleShopInit() {
  console.log('准备浏览指定店铺');
  const body = {"index":0,"version":1,"type":1};
  request("getSingleShopReward", body).then(response => {
    console.log(`response::${JSON.stringify(response)}`);
    if (response.code === '0' && response.resultCode === '0') {
      const body2 = {"index":0,"version":1,"type":2};
      request("getSingleShopReward", body2).then(response2 => {
        console.log(`response2::${JSON.stringify(response)}`);
        if (response2.code === '0' && response2.resultCode === '0') {
          message += `【浏览指定店铺】获取${response2.result.reward}g\n`;
        }
        gen.next();
      })
    }
  })
}
// 临时新增任务--冰淇淋会场
function browseSingleShopInit2() {
  console.log('准备浏览指定店铺--冰淇淋会场');
  const body = {"index":1,"version":1,"type":1};
  const body2 = {"index":1,"version":1,"type":2}
  request("getSingleShopReward", body).then(response => {
    console.log(`①点击浏览指定店铺结果: ${JSON.stringify(response)}`);
    if (response.code === '0' && response.resultCode === '0') {
      request("getSingleShopReward", body2).then(response2 => {
        console.log(`②浏览指定店铺结果: ${JSON.stringify(response2)}`);
        if (response2.code === '0' && response2.resultCode === '0') {
          message += `【冰淇淋会场】获取狗粮${response2.result.reward}g\n`;
        }
      })
    }
    gen.next();
  })
}
function browseSingleShopInit3() {
  console.log('准备完成 去参与星品解锁计划');
  const body = {"index":2,"version":1,"type":1};
  const body2 = {"index":2,"version":1,"type":2}
  request("getSingleShopReward", body).then(response => {
    console.log(`①点击浏览指定店铺结果: ${JSON.stringify(response)}`);
    if (response.code === '0' && response.resultCode === '0') {
      request("getSingleShopReward", body2).then(response2 => {
        console.log(`②浏览指定店铺结果: ${JSON.stringify(response2)}`);
        if (response2.code === '0' && response2.resultCode === '0') {
          message += `【去参与星品解锁计划】获取狗粮${response2.result.reward}g\n`;
        }
      })
    }
    gen.next();
  })
}
// 三餐签到, 每天三段签到时间
function threeMealInit() {
  console.log('准备三餐签到');
  request("getThreeMealReward").then(response => {
    console.log(`三餐签到结果: ${JSON.stringify(response)}`);
    if (response.code === '0' && response.resultCode === '0') {
      message += `【定时领狗粮】获得${response.result.threeMealReward}g\n`;
    } else {
      message += `【定时领狗粮】${response.message}\n`;
    }
    gen.next();
  })
}

// 每日签到, 每天一次
function signInit() {
  console.log('准备每日签到');
  request("getSignReward").then(response => {
    console.log(`每日签到结果: ${JSON.stringify(response)}`);
    message += `【每日签到成功】奖励${response.result.signReward}g狗粮\n`;
    gen.next();
  })

}

// 投食
function feedPets() {
  console.log('开始投食');
  return new Promise((rs, rj) => {
    request(arguments.callee.name.toString()).then(response => {
      rs(response);
    })
  })
}

//查询jd宠物信息
function initPetTown() {
  request(arguments.callee.name.toString()).then((response) => {
    // console.log(`初始化萌宠信息${JSON.stringify(response)}`)
    if (response.code === '0' && response.resultCode === '0' && response.message === 'success') {
      petInfo = response.result;
      if (petInfo.userStatus === 0) {
        $.msg(name, '【提示】此账号萌宠活动未开始，请手动去京东APP开启活动\n入口：我的->游戏与互动->查看更多', '', { "open-url": "openapp.jdmoble://" });
        $.done();
        return
      }
      goodsUrl = petInfo.goodsInfo && petInfo.goodsInfo.goodsUrl;
      // console.log(`初始化萌宠信息完成: ${JSON.stringify(petInfo)}`);
      if (petInfo.petStatus === 5 && petInfo.showHongBaoExchangePop) {
        option['open-url'] = "openApp.jdMobile://";
        option['media-url'] = goodsUrl;
        $.msg($.name, `【提醒⏰】${petInfo.goodsInfo.goodsName}已可领取`, '请去京东APP或微信小程序查看', option);
        $.done();
        return
      }
      console.log(`\n【您的互助码shareCode】 ${petInfo.shareCode}\n`);
      gen.next();
    } else if (response.code === '0' && response.resultCode === '2001'){
      console.log(`初始化萌宠失败:  ${response.message}`);
      $.setdata('', 'CookieJD');//cookie失效，故清空cookie。
      $.msg(name, '【提示】京东cookie已失效,请重新登录获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
      $.done();
    }
  })

}
//再次投食
async function feedPetsAgain() {
  const response = await secondInitPetTown(); //再次初始化萌宠
  if (response.code === '0' && response.resultCode === '0' && response.message === 'success') {
    let secondPetInfo = response.result;
    let foodAmount = secondPetInfo.foodAmount; //剩余狗粮
    if (foodAmount - 100 >= 10) {
      for (let i = 0; i < parseInt((foodAmount - 100) / 10); i++) {
        const feedPetRes = await feedPets();
        console.log(`投食feedPetRes`);
        if (feedPetRes.resultCode == 0 && feedPetRes.code == 0) {
          console.log('投食成功')
        }
      }
      const response2 = await secondInitPetTown();
      subTitle = response2.result.goodsInfo.goodsName;
      message += `【与爱宠相识】${response2.result.meetDays}天\n`;
      message += `【剩余狗粮】${response2.result.foodAmount}g\n`;
    } else {
      console.log("目前剩余狗粮：【" + foodAmount + "】g,不再继续投食,保留100g用于完成第二天任务");
      subTitle = secondPetInfo.goodsInfo.goodsName;
      message += `【与爱宠相识】${secondPetInfo.meetDays}天\n`;
      message += `【剩余狗粮】${secondPetInfo.foodAmount}g\n`;
    }
  } else {
    console.log(`初始化萌宠失败:  ${JSON.stringify(petInfo)}`);
  }
  gen.next();
}
// 再次查询萌宠信息
function secondInitPetTown() {
  console.log('开始再次初始化萌宠信息');
  return new Promise((rs, rj) => {
    request("initPetTown").then(response => {
      rs(response);
    })
  })
}
// 邀请新用户
function inviteFriendsInit() {
  console.log('邀请新用户功能未实现');
  if (taskInfo.inviteFriendsInit.status == 1 && taskInfo.inviteFriendsInit.inviteFriendsNum > 0) {
    // 如果有邀请过新用户,自动领取60gg奖励
    request('getInviteFriendsReward').then((res) => {
      try {
        if (res.code == 0 && res.resultCode == 0) {
          console.log(`领取邀请新用户奖励成功,获得狗粮现有狗粮${taskInfo.inviteFriendsInit.reward}g，${res.result.foodAmount}g`);
          message += `【邀请新用户】获取${taskInfo.inviteFriendsInit.reward}g\n`;
        }
        gen.next();
      } catch (e) {
        console.log('领取邀请新用户奖励失败')
      }
    });
  } else {
    setTimeout(() => {
      gen.next();
    }, 2000);
  }
}

// 好友助力信息
async function masterHelpInit() {
  let res = await request(arguments.callee.name.toString());
  console.log('助力信息: ' , res);
  if (res.code === '0' && res.resultCode === '0') {
    if (res.result.masterHelpPeoples && res.result.masterHelpPeoples.length >= 5) {
      if(!res.result.addedBonusFlag) {
        console.log("开始领取额外奖励");
        let getHelpAddedBonusResult = await getHelpAddedBonus();
        console.log(`领取30g额外奖励结果：【${getHelpAddedBonusResult.message}】`);
        message += `【额外奖励${getHelpAddedBonusResult.result.reward}领取】${getHelpAddedBonusResult.message}\n`;
      } else {
        console.log("已经领取过5好友助力额外奖励");
        message += `【额外奖励】已领取\n`;
      }
    } else {
      console.log("助力好友未达到5个")
      message += `【额外奖励】领取失败，原因：助力好友未达5个\n`;
    }
    if (res.result.masterHelpPeoples && res.result.masterHelpPeoples.length > 0) {
      console.log('帮您助力的好友的名单开始')
      let str = '';
      res.result.masterHelpPeoples.map((item, index) => {
        if (index === (res.result.masterHelpPeoples.length - 1)) {
          str += item.nickName || "匿名用户";
        } else {
          str += (item.nickName || "匿名用户") + '，';
        }
      })
      message += `【助力您的好友】${str}\n`;
    }
  }
  gen.next();
}
// 领取5好友助力后的奖励
function getHelpAddedBonus() {
  return new Promise((rs, rj)=> {
    request(arguments.callee.name.toString()).then(response=> {
      rs(response);
    })
  })
}

// 初始化任务, 可查询任务完成情况
function taskInit() {
  console.log('开始任务初始化');
  const body = {"version":1};
  request(arguments.callee.name.toString(), body).then(response => {
    if (response.resultCode === '9999' || !response.result) {
      console.log('初始化任务异常, 请稍后再试');
      gen.return();
    }
    taskInfo = response.result;
    // function_map = taskInfo.taskList;
    // console.log(`任务初始化完成: ${JSON.stringify(taskInfo)}`);
    gen.next();
  })

}

// 请求
async function request(function_id, body = {}) {
  await $.wait(3000); //歇口气儿, 不然会报操作频繁
  return new Promise((resolve, reject) => {
    $.get(taskurl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东萌宠: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve(data)
      }
    })
  })
}

function taskurl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&loginWQBiz=pet-town&body=${escape(JSON.stringify(body))}`,
    headers: {
      Cookie: cookie,
      UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
    }
  };
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}