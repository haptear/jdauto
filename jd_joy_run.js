/**
宠汪汪邀请助力与赛跑助力脚本，感谢github@Zero-S1提供帮助
更新时间：2021-1-7（宠汪汪助力更新Token的配置正则表达式已改）
活动入口：京东APP我的-更多工具-宠汪汪
token时效很短，几个小时就失效了,闲麻烦的放弃就行
每天拿到token后，可一次性运行完毕即可。
互助码friendPin是京东用户名，不是昵称（可在京东APP->我的->设置 查看获得）
token获取途径：
1、微信搜索'来客有礼'小程序,登陆京东账号，点击底部的'我的'或者'发现'两处地方,即可获取Token，脚本运行提示token失效后，继续按此方法获取即可
2、或者每天去'来客有礼'小程序->宠汪汪里面，领狗粮->签到领京豆 也可获取Token(此方法每天只能获取一次)
脚本里面有内置提供的friendPin，如果你没有修改脚本或者BoxJs处填写自己的互助码，会默认给脚本内置的助力。
[MITM]
hostname = draw.jdfcloud.com

===========Surge=================
[Script]
宠汪汪邀请助力与赛跑助力 = type=cron,cronexp="15 10 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js
宠汪汪助力更新Token = type=http-response,pattern=^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=, requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js
宠汪汪助力获取Token = type=http-request,pattern=^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=, max-size=0, script-path=https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js

===================Quantumult X=====================
[task_local]
# 宠汪汪邀请助力与赛跑助力
15 10 * * * https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true
[rewrite_local]
# 宠汪汪助力更新Token
^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code= url script-response-body https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js
# 宠汪汪助力获取Token
^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId= url script-request-header https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js

=====================Loon=====================
[Script]
cron "15 10 * * *" script-path=https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力
http-response ^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code= script-path=https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js, requires-body=true, timeout=10, tag=宠汪汪助力更新Token
http-request ^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId= script-path=https://raw.githubusercontent.com/haptear/jdauto/master/jd_joy_run.js, timeout=3600, tag=宠汪汪助力获取Token
 **/
const isRequest = typeof $request != "undefined"
const $ = new Env('宠汪汪赛跑');
const JD_BASE_API = `https://draw.jdfcloud.com//pet`;
//此处填入你需要助力好友的京东用户名
//下面给出好友邀请助力的示例填写规则
let invite_pins = ["jd_6cd93e613b0e5,被折叠的记忆33,jd_704a2e5e28a66,jd_45a6b5953b15b,zooooo58,jd_66f5cecc1efcd,jd_41345a6f96aa5,jd_sIhNpDXJehOr,jd_mCbhXxmqzYJC"];
//下面给出好友赛跑助力的示例填写规则
let run_pins = ["被折叠的记忆33,jd_6cd93e613b0e5,jd_45a6b5953b15b,jd_66f5cecc1efcd,jd_sIhNpDXJehOr,jd_41345a6f96aa5,jd_704a2e5e28a66,zooooo58,jd_5851f32d4a083,jd_mCbhXxmqzYJC"];
let temp = run_pins[0].split(',')
let fixPins = temp.splice(temp.indexOf('jd_6cd93e613b0e5'), 1);
fixPins.push(...temp.splice(temp.indexOf('被折叠的记忆33'), 1));
const randomPins = getRandomArrayElements(temp, 4);
temp = [...fixPins, ...randomPins];
run_pins = [temp.join(',')];
// $.LKYLToken = '76fe7794c475c18711e3b47185f114b5' || $.getdata('jdJoyRunToken');
// $.LKYLToken = $.getdata('jdJoyRunToken');
let friendsArr = ["jd_6cd93e613b0e5", "被折叠的记忆33", "jd_704a2e5e28a66", "jd_45a6b5953b15b", "zooooo58", "jd_66f5cecc1efcd", "jd_41345a6f96aa5"]
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
const headers = {
  'Connection' : 'keep-alive',
  'Accept-Encoding' : 'gzip, deflate, br',
  'App-Id' : '',
  'Lottery-Access-Signature' : '',
  'Content-Type' : 'application/json',
  'reqSource' : 'weapp',
  'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
  'Cookie' : '',
  'openId' : '',
  'Host' : 'draw.jdfcloud.com',
  'Referer' : 'https://servicewechat.com/wxccb5c536b0ecd1bf/633/page-frame.html',
  'Accept-Language' : 'zh-cn',
  'Accept' : '*/*',
  'LKYLToken' : ''
}
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
} else {
  //支持 "京东多账号 Ck 管理"的cookie
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
  if ($.getdata('jd_joy_invite_pin')) {
    invite_pins = [];
    invite_pins.push($.getdata('jd_joy_invite_pin'));
  }
  if ($.getdata('jd2_joy_invite_pin')) {
    if (invite_pins.length > 0) {
      invite_pins.push($.getdata('jd2_joy_invite_pin'))
    } else {
      invite_pins = [];
      invite_pins.push($.getdata('jd2_joy_invite_pin'));
    }
  }
  if ($.getdata('jd_joy_run_pin')) {
    run_pins = []
    run_pins.push($.getdata('jd_joy_run_pin'));
  }
  if ($.getdata('jd2_joy_run_pin')) {
    if (run_pins.length > 0) {
      run_pins.push($.getdata('jd2_joy_run_pin'))
    } else {
      run_pins = [];
      run_pins.push($.getdata('jd2_joy_run_pin'));
    }
  }
}

//获取来客有礼Token
let count = 0;
async function getToken() {
  const url = $request.url;
  $.log(`${$.name}url\n${url}\n`)
  if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=/)) {
    const body = JSON.parse($response.body);
    const LKYLToken = body.data && body.data.token;
    if (LKYLToken) {
      $.log(`${$.name} token\n${LKYLToken}\n`);
      count = $.getdata('countFlag') ? $.getdata('countFlag') * 1 : 0;
      count ++;
      console.log(`count: ${count}`)
      $.setdata(`${count}`, 'countFlag');
      if ($.getdata('countFlag') * 1 === 2) {
        count = 0;
        $.setdata(`${count}`, 'countFlag');
        $.msg($.name, '更新Token: 成功🎉', ``);
        console.log(`开始上传Token，${LKYLToken}\n`)
        await $.http.get({url: `http://jd.turinglabs.net/api/v2/jd/joy/create/${LKYLToken}/`}).then((resp) => {
          if (resp.statusCode === 200) {
            let { body } = resp;
            console.log(`Token提交结果:${body}\n`)
            body = JSON.parse(body);
            console.log(`${body.message}`)
          }
        });
      }
      $.setdata(LKYLToken, 'jdJoyRunToken');
    }
    $.done({ body: JSON.stringify(body) })
  } else if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=/)){
    if ($request && $request.method !== 'OPTIONS') {
      const LKYLToken = $request.headers['LKYLToken'];
      //if ($.getdata('jdJoyRunToken')) {
        //if ($.getdata('jdJoyRunToken') !== LKYLToken) {

        //}
        //$.msg($.name, '更新获取Token: 成功🎉', `\n${LKYLToken}\n`);
      //} else {
        //$.msg($.name, '获取Token: 成功🎉', `\n${LKYLToken}\n`);
      //}
      $.setdata(LKYLToken, 'jdJoyRunToken');

      $.msg($.name, '获取Token: 成功🎉', ``);

      // $.done({ body: JSON.stringify(body) })
      $.done({ url: url })
    }
  } else {
    $.done()
  }
}
function readToken() {
  return new Promise(resolve => {
    $.get({url: `http://jd.turinglabs.net/api/v2/jd/joy/read/1/`, 'timeout': 10000}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(data)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
async function main() {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  const readTokenRes = await readToken();
  if (readTokenRes && readTokenRes.code === 200) {
    $.LKYLToken = readTokenRes.data[0] || $.getdata('jdJoyRunToken');
  } else {
    $.LKYLToken = $.getdata('jdJoyRunToken');
  }
  // $.LKYLToken = $.getdata('jdJoyRunToken');
  console.log(`打印token \n${$.LKYLToken}\n`)
  if (!$.LKYLToken) {
    $.msg($.name, '【提示】请先获取来客有礼宠汪汪token', "微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token");
    return;
  }
  await getFriendPins();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.inviteReward = 0;
      $.runReward = 0;
      console.log(`\n开始【京东账号${$.index}】${UserName}\n`);
      $.jdLogin = true;
      $.LKYLLogin = true;
      console.log(`=============【开始邀请助力】===============`)
      const inviteIndex = $.index > invite_pins.length ? (invite_pins.length - 1) : ($.index - 1);
      let new_invite_pins = invite_pins[inviteIndex].split(',');
      new_invite_pins = [...new_invite_pins, ...getRandomArrayElements(friendsArr, friendsArr.length >= 18 ? 18 : friendsArr.length)];
      await invite(new_invite_pins);
      if ($.jdLogin && $.LKYLLogin) {
        console.log(`===========【开始助力好友赛跑】===========`)
        const runIndex = $.index > run_pins.length ? (run_pins.length - 1) : ($.index - 1);
        let new_run_pins = run_pins[runIndex].split(',');
        await run(new_run_pins);
      }
      await showMsg();
    }
  }
  $.done()
}
function showMsg() {
  return new Promise(async resolve => {
    if ($.inviteReward || $.runReward) {
      let message = '';
      if ($.inviteReward > 0) {
        message += `给${$.inviteReward / 30}人邀请助力成功,获得${$.inviteReward}积分\n`;
      }
      if ($.runReward > 0) {
        message += `给${$.runReward / 5}人赛跑助力成功,获得狗粮${$.runReward}g`;
      }
      if (message) {
        $.msg($.name, '', `京东账号${$.index} ${UserName}\n${message}`);
      }
    }
    resolve();
  })
}
//邀请助力
async function invite(invite_pins) {
  console.log(`账号${$.index} [${UserName}] 给下面名单的人进行邀请助力\n${invite_pins.map(item => item.trim())}\n`);
  for (let item of invite_pins.map(item => item.trim())) {
    console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行邀请助力`)
    const data = await enterRoom(item);
    if (data) {
      if (data.success) {
        const { helpStatus } = data.data;
        console.log(`helpStatus ${helpStatus}`)
        if (helpStatus=== 'help_full') {
          console.log(`您的邀请助力机会已耗尽\n`)
          break;
        } else if (helpStatus=== 'cannot_help') {
          console.log(`已给该好友 ${item} 助力过或者此friendPin是你自己\n`)
          continue;
        } else if (helpStatus=== 'invite_full') {
          console.log(`助力失败，该好友 ${item} 已经满3人给他助力了,无需您再次助力\n`)
          continue;
        } else if (helpStatus=== 'can_help') {
          console.log(`开始给好友 ${item} 助力\n`)
          const LKYL_DATA = await helpInviteFriend(item);
          if (LKYL_DATA.errorCode === 'L0001' && !LKYL_DATA.success) {
            console.log('来客有礼宠汪汪token失效');
            $.setdata('', 'jdJoyRunToken');
            $.msg($.name, '【提示】来客有礼token失效，请重新获取', "微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
            $.LKYLLogin = false;
            break
          } else {
            $.LKYLLogin = true;
          }
        }
        $.jdLogin = true;
      } else {
        if (data.errorCode === 'B0001') {
          console.log('京东Cookie失效');
          $.msg($.name, `【提示】京东cookie已失效`, `京东账号${$.index} ${UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
          $.jdLogin = false;
          break
        }
      }
    }
  }
  // if ($.inviteReward > 0) {
  //   $.msg($.name, ``, `账号${$.index} [${UserName}]\n给${$.inviteReward/5}人邀请助力成功\n获得${$.inviteReward}积分`)
  // }
}
function enterRoom(invitePin) {
  return new Promise(resolve => {
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    headers['Content-Type'] = "application/json";
    const options = {
      url: `${JD_BASE_API}/enterRoom/h5?reqSource=weapp&invitePin=${encodeURI(invitePin)}&inviteSource=task_invite&shareSource=weapp&inviteTimeStamp=${Date.now()}`,
      body: '{}',
      headers
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          $.log(`${$.name} API请求失败`)
          $.log(JSON.stringify(err))
        } else {
          // console.log('进入房间', data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
function helpInviteFriend(friendPin) {
  return new Promise((resolve) => {
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    const options = {
      url: `${JD_BASE_API}/helpFriend?friendPin=${encodeURI(friendPin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err));
        } else {
          $.log(`邀请助力结果：${data}`);
          data = JSON.parse(data);
          // {"errorCode":"help_ok","errorMessage":null,"currentTime":1600254297789,"data":29466,"success":true}
          if (data.success && data.errorCode === 'help_ok') {
            $.inviteReward += 30;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
//赛跑助力
async function run(run_pins) {
  console.log(`账号${$.index} [${UserName}] 给下面名单的人进行赛跑助力\n${(run_pins.map(item => item.trim()))}\n`);
  for (let item of run_pins.map(item => item.trim())) {
    console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行赛跑助力`)
    const combatDetailRes = await combatDetail(item);
    const { petRaceResult } = combatDetailRes.data;
    console.log(`petRaceResult ${petRaceResult}`);
    if (petRaceResult === 'help_full') {
      console.log('您的赛跑助力机会已耗尽');
      break;
    } else if (petRaceResult === 'can_help') {
      console.log(`开始赛跑助力好友 ${item}`)
      const LKYL_DATA = await combatHelp(item);
      if (LKYL_DATA.errorCode === 'L0001' && !LKYL_DATA.success) {
        console.log('来客有礼宠汪汪token失效');
        $.setdata('', 'jdJoyRunToken');
        $.msg($.name, '【提示】来客有礼token失效，请重新获取', "微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
        $.LKYLLogin = false;
        break
      } else {
        $.LKYLLogin = true;
      }
    }
  }
  // if ($.runReward > 0) {
  //   $.msg($.name, ``, `账号${$.index} [${UserName}]\n给${$.runReward/5}人赛跑助力成功\n获得狗粮${$.runReward}g`)
  // }
}
function combatHelp(friendPin) {
  return new Promise(resolve => {
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    const options = {
      url: `${JD_BASE_API}/combat/help?friendPin=${encodeURI(friendPin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err));
        } else {
          $.log(`赛跑助力结果${data}`);
          data = JSON.parse(data);
          // {"errorCode":"help_ok","errorMessage":null,"currentTime":1600479266133,"data":{"rewardNum":5,"helpStatus":"help_ok","newUser":false},"success":true}
          if (data.errorCode === 'help_ok' && data.data.helpStatus === 'help_ok') {
            console.log(`助力${friendPin}成功\n获得狗粮${data.data.rewardNum}g\n`);
            $.runReward += data.data.rewardNum;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
function combatDetail(invitePin) {
  return new Promise(resolve => {
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    const options = {
      url: `${JD_BASE_API}/combat/detail/v2?help=true&inviterPin=${encodeURI(invitePin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
function isURL(domain, reg) {
  // const name = reg;
  return reg.test(domain);
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
function getRandomArrayElements(arr, count) {
  let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
function getFriendPins() {
  return new Promise(resolve => {
    $.get({
      url: "https://gitee.com/lxk0301/updateTeam/raw/master/friendPins.json",
      headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      },
      timeout: 100000}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`getFriendPins::${JSON.stringify(err)}`);
        } else {
          $.friendPins = data && JSON.parse(data);
          if ($.friendPins && $.friendPins['friendsArr']) {
            friendsArr = $.friendPins['friendsArr'];
            console.log(`\n共提供 ${friendsArr.length}个好友供来进行邀请助力\n`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
isRequest ? getToken() : main();
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
