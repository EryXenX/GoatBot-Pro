process.stdout.write("]2;EryXenX 🌐 Ultra Edition\\");
function decode(_0x3eea0c) {
  _0x3eea0c = Buffer.from(_0x3eea0c, 'hex').toString('utf-8');
  _0x3eea0c = Buffer.from(_0x3eea0c, "hex").toString('utf-8');
  _0x3eea0c = Buffer.from(_0x3eea0c, "base64").toString("utf-8");
  return _0x3eea0c;
}
const gradient = require('gradient-string');
const axios = require("axios");
const path = require('path');
const readline = require('readline');
const fs = require("fs-extra");
const toptp = require("totp-generator");
const login = require("@eryxenx/fca");
const qr = new (require("qrcode-reader"))();
const Canvas = require('canvas');
const https = require('https');
async function getName(_0x5db5ea) {
  try {
    const _0x48573d = await axios.post('https://www.facebook.com/api/graphql/?q=' + ('node(' + _0x5db5ea + "){name}"));
    return _0x48573d.data[_0x5db5ea].name;
  } catch (_0x4e164f) {
    return null;
  }
}
function compareVersion(_0x4542d3, _0x3e334e) {
  const _0x4a41a6 = _0x4542d3.split('.');
  const _0x44dbec = _0x3e334e.split('.');
  for (let _0x277be0 = 0x0; _0x277be0 < 0x3; _0x277be0++) {
    if (parseInt(_0x4a41a6[_0x277be0]) > parseInt(_0x44dbec[_0x277be0])) {
      return 0x1;
    }
    if (parseInt(_0x4a41a6[_0x277be0]) < parseInt(_0x44dbec[_0x277be0])) {
      return -0x1;
    }
  }
  return 0x0;
}
const {
  writeFileSync,
  readFileSync,
  existsSync,
  watch
} = require("fs-extra");
const handlerWhenListenHasError = require("./handlerWhenListenHasError.js");
const checkLiveCookie = require("./checkLiveCookie.js");
const {
  callbackListenTime,
  storage5Message
} = global.GoatBot;
const {
  log,
  logColor,
  getPrefix,
  createOraDots,
  jsonStringifyColor,
  getText,
  convertTime,
  colors,
  randomString
} = global.utils;
const sleep = _0x2df535 => new Promise(_0x5d65c9 => setTimeout(_0x5d65c9, _0x2df535));
const currentVersion = require(process.cwd() + "/package.json").version;
function centerText(_0x4f9e3a, _0x5dd3db) {
  const _0x127cd5 = process.stdout.columns;
  const _0x1bd1ec = Math.floor((_0x127cd5 - (_0x5dd3db || _0x4f9e3a.length)) / 0x2);
  const _0x55e74f = _0x127cd5 - _0x1bd1ec - (_0x5dd3db || _0x4f9e3a.length);
  const _0x46b4da = " ".repeat(_0x1bd1ec > 0x0 ? _0x1bd1ec : 0x0) + _0x4f9e3a + " ".repeat(_0x55e74f > 0x0 ? _0x55e74f : 0x0);
  console.log(_0x46b4da);
}
const titles = [["██████╗  ██████╗  █████╗ ████████╗    ██╗   ██╗██████╗", "██╔════╝ ██╔═══██╗██╔══██╗╚══██╔══╝    ██║   ██║╚════██╗", "██║  ███╗██║   ██║███████║   ██║       ██║   ██║ █████╔╝", "██║   ██║██║   ██║██╔══██║   ██║       ╚██╗ ██╔╝██╔═══╝", "╚██████╔╝╚██████╔╝██║  ██║   ██║        ╚████╔╝ ███████╗", "╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝         ╚═══╝  ╚══════╝"], ["█▀▀ █▀█ ▄▀█ ▀█▀  █▄▄ █▀█ ▀█▀  █░█ ▀█", "█▄█ █▄█ █▀█ ░█░  █▄█ █▄█ ░█░  ▀▄▀ █▄"], ["G O A T B O T  V 2 @" + currentVersion], ["GOATBOT V2"]];
const maxWidth = process.stdout.columns;
const title = maxWidth > 0x3a ? titles[0x0] : maxWidth > 0x24 ? titles[0x1] : maxWidth > 0x1a ? titles[0x2] : titles[0x3];
console.log(gradient("#f5af19", "#f12711")(createLine(null, true)));
console.log();
for (const text of title) {
  const textColor = gradient("#FA8BFF", "#2BD2FF", "#2BFF88")(text);
  centerText(textColor, text.length);
}
let subTitle = "GoatBot V2@" + currentVersion + "- Powered by MOHAMMAD AKASH";
const subTitleArray = [];
if (subTitle.length > maxWidth) {
  while (subTitle.length > maxWidth) {
    let lastSpace = subTitle.slice(0x0, maxWidth).lastIndexOf(" ");
    lastSpace = lastSpace == -0x1 ? maxWidth : lastSpace;
    subTitleArray.push(subTitle.slice(0x0, lastSpace).trim());
    subTitle = subTitle.slice(lastSpace).trim();
  }
  if (subTitle) {
    subTitleArray.push(subTitle);
  } else {
    '';
  }
} else {
  subTitleArray.push(subTitle);
}
for (const t of subTitleArray) {
  const textColor2 = gradient("#9F98E8", '#AFF6CF')(t);
  centerText(textColor2, t.length);
}
centerText(gradient('#9F98E8', "#AFF6CF")("Created by NTKhang with ♡"), "Created by NTKhang with ♡".length);
centerText(gradient('#9F98E8', '#AFF6CF')("Source code: https://github.com/ntkhang03/Goat-Bot-V2"), "Source code: https://github.com/ntkhang03/Goat-Bot-V2".length);
centerText(gradient("#f5af19", '#f12711')("ALL VERSIONS NOT RELEASED HERE ARE FAKE"), "ALL VERSIONS NOT RELEASED HERE ARE FAKE".length);
let widthConsole = process.stdout.columns;
if (widthConsole > 0x32) {
  widthConsole = 0x32;
}
function createLine(_0x5e1f50, _0x5cc2b7 = false) {
  if (!_0x5e1f50) {
    return Array(_0x5cc2b7 ? process.stdout.columns : widthConsole).fill('─').join('');
  } else {
    _0x5e1f50 = " " + _0x5e1f50.trim() + " ";
    const _0x200e0c = _0x5e1f50.length;
    const _0x128791 = _0x5cc2b7 ? process.stdout.columns - _0x200e0c : widthConsole - _0x200e0c;
    let _0x512638 = Math.floor(_0x128791 / 0x2);
    if (_0x512638 < 0x0 || isNaN(_0x512638)) {
      _0x512638 = 0x0;
    }
    const _0x2f4f8d = Array(_0x512638).fill('─').join('');
    return _0x2f4f8d + _0x5e1f50 + _0x2f4f8d;
  }
}
const character = createLine();
const clearLines = _0x10f8dc => {
  for (let _0x592406 = 0x0; _0x592406 < _0x10f8dc; _0x592406++) {
    const _0x41f992 = _0x592406 === 0x0 ? null : -0x1;
    process.stdout.moveCursor(0x0, _0x41f992);
    process.stdout.clearLine(0x1);
  }
  process.stdout.cursorTo(0x0);
  process.stdout.write('');
};
async function input(_0x4a72d0, _0x162445 = false) {
  const _0x23ca98 = readline.createInterface({
    'input': process.stdin,
    'output': process.stdout
  });
  if (_0x162445) {
    _0x23ca98.input.on("keypress", function () {
      const _0x4a882d = _0x23ca98.line.length;
      readline.moveCursor(_0x23ca98.output, -_0x4a882d, 0x0);
      readline.clearLine(_0x23ca98.output, 0x1);
      for (let _0x506b08 = 0x0; _0x506b08 < _0x4a882d; _0x506b08++) {
        _0x23ca98.output.write('*');
      }
    });
  }
  return new Promise(_0x382484 => _0x23ca98.question(_0x4a72d0, _0x38f0b6 => {
    _0x23ca98.close();
    _0x382484(_0x38f0b6);
  }));
}
qr.readQrCode = async function (_0x522919) {
  const _0x24bdb4 = await Canvas.loadImage(_0x522919);
  const _0x29fe3 = Canvas.createCanvas(_0x24bdb4.width, _0x24bdb4.height);
  const _0x3e7964 = _0x29fe3.getContext('2d');
  _0x3e7964.drawImage(_0x24bdb4, 0x0, 0x0);
  const _0x3fdef8 = _0x3e7964.getImageData(0x0, 0x0, _0x24bdb4.width, _0x24bdb4.height);
  let _0x88097b;
  qr.callback = function (_0x3b309b, _0x6e94be) {
    if (_0x3b309b) {
      throw _0x3b309b;
    }
    _0x88097b = _0x6e94be;
  };
  qr.decode(_0x3fdef8);
  return _0x88097b.result;
};
const {
  dirAccount
} = global.client;
const {
  facebookAccount
} = global.GoatBot.config;
function responseUptimeSuccess(_0x3615f6, _0x4d08e7) {
  _0x4d08e7.type('json').send({
    'status': "success",
    'uptime': process.uptime(),
    'unit': "seconds"
  });
}
function responseUptimeError(_0x1034fb, _0x505b51) {
  _0x505b51.status(0x1f4).type("json").send({
    'status': "error",
    'uptime': process.uptime(),
    'statusAccountBot': global.statusAccountBot
  });
}
function checkAndTrimString(_0x3bf5d3) {
  if (typeof _0x3bf5d3 == "string") {
    return _0x3bf5d3.trim();
  }
  return _0x3bf5d3;
}
function filterKeysAppState(_0x46da08) {
  return _0x46da08.filter(_0x38ff82 => ['c_user', 'xs', "datr", 'fr', 'sb', "i_user"].includes(_0x38ff82.key));
}
global.responseUptimeCurrent = responseUptimeSuccess;
global.responseUptimeSuccess = responseUptimeSuccess;
global.responseUptimeError = responseUptimeError;
global.statusAccountBot = "good";
let changeFbStateByCode = false;
let latestChangeContentAccount = fs.statSync(dirAccount).mtimeMs;
let dashBoardIsRunning = false;
async function getAppStateFromEmail(_0x339f3a = {
  '_start': () => {},
  '_stop': () => {}
}, _0x38fc39) {
  const {
    email: _0x289899,
    password: _0x506262,
    userAgent: _0x508f50,
    proxy: _0x2b3056
  } = _0x38fc39;
  const _0x56e588 = require(process.env.NODE_ENV === 'development' ? './getFbstate1.dev.js' : "./getFbstate1.js");
  let _0x5c463e;
  let _0x420472;
  try {
    try {
      _0x420472 = await _0x56e588(checkAndTrimString(_0x289899), checkAndTrimString(_0x506262), _0x508f50, _0x2b3056);
      _0x339f3a._stop();
    } catch (_0x288897) {
      if (_0x288897["continue"]) {
        let _0x11b0cc = 0x0;
        let _0x449a00 = false;
        await async function _0x17ce99(_0x308145) {
          if (_0x308145 && _0x449a00) {
            _0x339f3a._stop();
            log.error("LOGIN FACEBOOK", _0x308145);
            process.exit();
          }
          if (_0x308145) {
            _0x339f3a._stop();
            log.warn("LOGIN FACEBOOK", _0x308145);
          }
          if (_0x38fc39['2FASecret'] && _0x11b0cc == 0x0) {
            switch (['.png', ".jpg", ".jpeg"].some(_0x5981a5 => _0x38fc39["2FASecret"].endsWith(_0x5981a5))) {
              case true:
                _0x5c463e = (await qr.readQrCode(process.cwd() + '/' + _0x38fc39["2FASecret"])).replace(/.*secret=(.*)&digits.*/g, '$1');
                break;
              case false:
                _0x5c463e = _0x38fc39['2FASecret'];
                break;
            }
          } else {
            _0x339f3a._stop();
            _0x5c463e = await input("> Enter 2FA code or secret: ");
            readline.moveCursor(process.stderr, 0x0, -0x1);
            readline.clearScreenDown(process.stderr);
          }
          const _0x4da775 = isNaN(_0x5c463e) ? toptp(_0x5c463e.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, '').replace(/[đ|Đ]/g, _0x56b697 => _0x56b697 == 'đ' ? 'd' : 'D').replace(/\(|\)|\,/g, '').replace(/ /g, '')) : _0x5c463e;
          _0x339f3a._start();
          try {
            _0x420472 = JSON.parse(JSON.stringify(await _0x288897["continue"](_0x4da775)));
            _0x420472 = _0x420472.map(_0xba17c6 => ({
              'key': _0xba17c6.key,
              'value': _0xba17c6.value,
              'domain': _0xba17c6.domain,
              'path': _0xba17c6.path,
              'hostOnly': _0xba17c6.hostOnly,
              'creation': _0xba17c6.creation,
              'lastAccessed': _0xba17c6.lastAccessed
            })).filter(_0x5bbd0d => _0x5bbd0d.key);
            _0x339f3a._stop();
          } catch (_0x1d8556) {
            _0x11b0cc++;
            if (!_0x1d8556["continue"]) {
              _0x449a00 = true;
            }
            await _0x17ce99(_0x1d8556.message);
          }
        }(_0x288897.message);
      } else {
        throw _0x288897;
      }
    }
  } catch (_0x52d402) {
    const _0x53364d = require(process.env.NODE_ENV === "development" ? "./loginMbasic.dev.js" : './loginMbasic.js');
    if (_0x38fc39['2FASecret']) {
      switch ([".png", ".jpg", ".jpeg"].some(_0x1e14f4 => _0x38fc39['2FASecret'].endsWith(_0x1e14f4))) {
        case true:
          _0x5c463e = (await qr.readQrCode(process.cwd() + '/' + _0x38fc39['2FASecret'])).replace(/.*secret=(.*)&digits.*/g, '$1');
          break;
        case false:
          _0x5c463e = _0x38fc39["2FASecret"];
          break;
      }
    }
    _0x420472 = await _0x53364d({
      'email': _0x289899,
      'pass': _0x506262,
      'twoFactorSecretOrCode': _0x5c463e,
      'userAgent': _0x508f50,
      'proxy': _0x2b3056
    });
    _0x420472 = _0x420472.map(_0x550f81 => {
      _0x550f81.key = _0x550f81.name;
      delete _0x550f81.name;
      return _0x550f81;
    });
    _0x420472 = filterKeysAppState(_0x420472);
  }
  global.GoatBot.config.facebookAccount['2FASecret'] = _0x5c463e || '';
  writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 0x2));
  return _0x420472;
}
function isNetScapeCookie(_0x110258) {
  if (typeof _0x110258 !== "string") {
    return false;
  }
  return /(.+)\t(1|TRUE|true)\t([\w\/.-]*)\t(1|TRUE|true)\t\d+\t([\w-]+)\t(.+)/i.test(_0x110258);
}
function netScapeToCookies(_0x3d2eb6) {
  const _0xb53f9b = [];
  const _0x4b835e = _0x3d2eb6.split("\n");
  _0x4b835e.forEach(_0x17c534 => {
    if (_0x17c534.trim().startsWith('#')) {
      return;
    }
    const _0x3d62fb = _0x17c534.split("\t").map(_0x19dc55 => _0x19dc55.trim()).filter(_0x55d447 => _0x55d447.length > 0x0);
    if (_0x3d62fb.length < 0x7) {
      return;
    }
    const _0x302712 = {
      'key': _0x3d62fb[0x5],
      'value': _0x3d62fb[0x6],
      'domain': _0x3d62fb[0x0],
      'path': _0x3d62fb[0x2],
      'hostOnly': _0x3d62fb[0x1] === 'TRUE',
      'creation': new Date(_0x3d62fb[0x4] * 0x3e8).toISOString(),
      'lastAccessed': new Date().toISOString()
    };
    _0xb53f9b.push(_0x302712);
  });
  return _0xb53f9b;
}
function pushI_user(_0x27d1ca, _0x3d40fc) {
  _0x27d1ca.push({
    'key': "i_user",
    'value': _0x3d40fc || facebookAccount.i_user,
    'domain': "facebook.com",
    'path': '/',
    'hostOnly': false,
    'creation': new Date().toISOString(),
    'lastAccessed': new Date().toISOString()
  });
  return _0x27d1ca;
}
let spin;
async function getAppStateToLogin(_0x33ba3a) {
  let _0x3719a4 = [];
  if (_0x33ba3a) {
    return await getAppStateFromEmail(undefined, facebookAccount);
  }
  if (!existsSync(dirAccount)) {
    return log.error("LOGIN FACEBOOK", getText("login", 'notFoundDirAccount', colors.green(dirAccount)));
  }
  const _0x3b1cab = readFileSync(dirAccount, "utf8");
  try {
    const _0x36b4e8 = _0x3b1cab.replace(/\|/g, "\n").split("\n").map(_0x40e673 => _0x40e673.trim()).filter(_0x177c4b => _0x177c4b);
    if (_0x3b1cab.startsWith("EAAAA")) {
      try {
        spin = createOraDots(getText('login', "loginToken"));
        spin._start();
        _0x3719a4 = await require("./getFbstate.js")(_0x3b1cab);
      } catch (_0xd93bfe) {
        _0xd93bfe.name = "TOKEN_ERROR";
        throw _0xd93bfe;
      }
    } else {
      if (_0x3b1cab.match(/^(?:\s*\w+\s*=\s*[^;]*;?)+/)) {
        spin = createOraDots(getText("login", "loginCookieString"));
        spin._start();
        _0x3719a4 = _0x3b1cab.split(';').map(_0x46b055 => {
          const [_0x218a9b, _0x2bd88f] = _0x46b055.split('=');
          return {
            'key': (_0x218a9b || '').trim(),
            'value': (_0x2bd88f || '').trim(),
            'domain': "facebook.com",
            'path': '/',
            'hostOnly': true,
            'creation': new Date().toISOString(),
            'lastAccessed': new Date().toISOString()
          };
        }).filter(_0x173260 => _0x173260.key && _0x173260.value && _0x173260.key != 'x-referer');
      } else {
        if (isNetScapeCookie(_0x3b1cab)) {
          spin = createOraDots(getText("login", "loginCookieNetscape"));
          spin._start();
          _0x3719a4 = netScapeToCookies(_0x3b1cab);
        } else {
          if ((_0x36b4e8.length == 0x2 || _0x36b4e8.length == 0x3) && !_0x36b4e8.slice(0x0, 0x2).map(_0x19428e => _0x19428e.trim()).some(_0x4affc6 => _0x4affc6.includes(" "))) {
            global.GoatBot.config.facebookAccount.email = _0x36b4e8[0x0];
            global.GoatBot.config.facebookAccount.password = _0x36b4e8[0x1];
            if (_0x36b4e8[0x2]) {
              const _0x1224b3 = _0x36b4e8[0x2].replace(/ /g, '');
              global.GoatBot.config.facebookAccount['2FASecret'] = _0x1224b3;
            }
            writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 0x2));
          } else {
            try {
              spin = createOraDots(getText("login", "loginCookieArray"));
              spin._start();
              _0x3719a4 = JSON.parse(_0x3b1cab);
            } catch (_0xf3ccf7) {
              const _0x16a865 = new Error(path.basename(dirAccount) + " is invalid");
              _0x16a865.name = "ACCOUNT_ERROR";
              throw _0x16a865;
            }
            if (_0x3719a4.some(_0x1d07e5 => _0x1d07e5.name)) {
              _0x3719a4 = _0x3719a4.map(_0x3fc6bf => {
                _0x3fc6bf.key = _0x3fc6bf.name;
                delete _0x3fc6bf.name;
                return _0x3fc6bf;
              });
            } else {
              if (!_0x3719a4.some(_0x57cac1 => _0x57cac1.key)) {
                const _0x60472f = new Error(path.basename(dirAccount) + " is invalid");
                _0x60472f.name = "ACCOUNT_ERROR";
                throw _0x60472f;
              }
            }
            _0x3719a4 = _0x3719a4.map(_0x21e6d5 => ({
              ..._0x21e6d5,
              'domain': "facebook.com",
              'path': '/',
              'hostOnly': false,
              'creation': new Date().toISOString(),
              'lastAccessed': new Date().toISOString()
            })).filter(_0x2065de => _0x2065de.key && _0x2065de.value && _0x2065de.key != "x-referer");
          }
        }
      }
      if (!(await checkLiveCookie(_0x3719a4.map(_0x5a1240 => _0x5a1240.key + '=' + _0x5a1240.value).join("; "), facebookAccount.userAgent))) {
        const _0x5273dd = new Error("Cookie is invalid");
        _0x5273dd.name = "COOKIE_INVALID";
        throw _0x5273dd;
      }
    }
  } catch (_0x4c2d7a) {
    if (spin) {
      spin._stop();
    }
    let {
      email: _0x528bea,
      password: _0x2fbc01
    } = facebookAccount;
    if (_0x4c2d7a.name === "TOKEN_ERROR") {
      log.err("LOGIN FACEBOOK", getText("login", "tokenError", colors.green("EAAAA..."), colors.green(dirAccount)));
    } else if (_0x4c2d7a.name === 'COOKIE_INVALID') {
      log.err("LOGIN FACEBOOK", getText("login", "cookieError"));
    }
    if (!_0x528bea || !_0x2fbc01) {
      log.warn("LOGIN FACEBOOK", getText("login", "cannotFindAccount"));
      const _0x22c297 = readline.createInterface({
        'input': process.stdin,
        'output': process.stdout
      });
      const _0x445342 = [getText("login", 'chooseAccount'), getText("login", "chooseToken"), getText('login', "chooseCookieString"), getText("login", "chooseCookieArray")];
      let _0x58f797 = 0x0;
      await new Promise(_0x528177 => {
        function _0x30dc65() {
          _0x22c297.output.write("\r" + _0x445342.map((_0x3e10a2, _0x2411ce) => _0x2411ce === _0x58f797 ? colors.blueBright("> (" + (_0x2411ce + 0x1) + ") " + _0x3e10a2) : "  (" + (_0x2411ce + 0x1) + ") " + _0x3e10a2).join("\n") + "");
          _0x22c297.write("[?25l");
        }
        _0x22c297.input.on("keypress", (_0x15dbb1, _0x3a59be) => {
          if (_0x3a59be.name === 'up') {
            _0x58f797 = (_0x58f797 - 0x1 + _0x445342.length) % _0x445342.length;
          } else {
            if (_0x3a59be.name === "down") {
              _0x58f797 = (_0x58f797 + 0x1) % _0x445342.length;
            } else {
              if (!isNaN(_0x3a59be.name)) {
                const _0x22e51c = parseInt(_0x3a59be.name);
                if (_0x22e51c >= 0x0 && _0x22e51c <= _0x445342.length) {
                  _0x58f797 = _0x22e51c - 0x1;
                }
                process.stdout.write("[1D");
              } else if (_0x3a59be.name === "enter" || _0x3a59be.name === "return") {
                _0x22c297.input.removeAllListeners("keypress");
                _0x22c297.close();
                clearLines(_0x445342.length + 0x1);
                _0x30dc65();
                _0x528177();
              } else {
                process.stdout.write("[1D");
              }
            }
          }
          clearLines(_0x445342.length);
          _0x30dc65();
        });
        _0x30dc65();
      });
      _0x22c297.write("[?25h\n");
      clearLines(_0x445342.length + 0x1);
      log.info("LOGIN FACEBOOK", getText("login", 'loginWith', _0x445342[_0x58f797]));
      if (_0x58f797 == 0x0) {
        _0x528bea = await input(getText("login", "inputEmail") + " ");
        _0x2fbc01 = await input(getText("login", 'inputPassword') + " ", true);
        const _0x28525a = await input(getText("login", 'input2FA') + " ");
        facebookAccount.email = _0x528bea || '';
        facebookAccount.password = _0x2fbc01 || '';
        facebookAccount["2FASecret"] = _0x28525a || '';
        writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 0x2));
      } else {
        if (_0x58f797 == 0x1) {
          const _0x1b2091 = await input(getText("login", "inputToken") + " ");
          writeFileSync(global.client.dirAccount, _0x1b2091);
        } else {
          if (_0x58f797 == 0x2) {
            const _0x299455 = await input(getText("login", "inputCookieString") + " ");
            writeFileSync(global.client.dirAccount, _0x299455);
          } else {
            const _0x5e3c4d = await input(getText("login", "inputCookieArray") + " ");
            writeFileSync(global.client.dirAccount, JSON.stringify(JSON.parse(_0x5e3c4d), null, 0x2));
          }
        }
      }
      return await getAppStateToLogin();
    }
    log.info("LOGIN FACEBOOK", getText("login", 'loginPassword'));
    log.info("ACCOUNT INFO", "Email: " + facebookAccount.email + ", I_User: " + (facebookAccount.i_user || '(empty)'));
    spin = createOraDots(getText("login", "loginPassword"));
    spin._start();
    try {
      _0x3719a4 = await getAppStateFromEmail(spin, facebookAccount);
      spin._stop();
    } catch (_0x480ffb) {
      spin._stop();
      log.err("LOGIN FACEBOOK", getText("login", 'loginError'), _0x480ffb.message, _0x480ffb);
      process.exit();
    }
  }
  return _0x3719a4;
}
function stopListening(_0x14a2f7) {
  _0x14a2f7 = _0x14a2f7 || Object.keys(callbackListenTime).pop();
  return new Promise(_0x557283 => {
    if (!global.GoatBot.fcaApi.stopListening?.(() => {
      if (callbackListenTime[_0x14a2f7]) {
        callbackListenTime[_0x14a2f7] = () => {};
      }
      _0x557283();
    })) {
      _0x557283();
    }
  });
}
async function startBot(_0x3cad9e) {
  console.log(colors.hex("#f5ab00")(createLine("START LOGGING IN", true)));
  const _0x3b1314 = require("../../package.json").version;
  if (global.GoatBot.Listening) {
    await stopListening();
  }
  log.info("LOGIN FACEBOOK", getText("login", "currentlyLogged"));
  const fcaVersion = (() => { try { return JSON.parse(require("fs").readFileSync(require.resolve("@eryxenx/fca").replace(/index\.js$/, "package.json"), "utf8")).version; } catch { return "unknown"; } })();
  log.warn("FCA", `Modified By Mohammad Akash 😈 | @eryxenx/fca v${fcaVersion}`);
  try {
    var _0x41cca2 = path.join(process.cwd(), "account.txt");
    var _0x11ae53 = fs.readFileSync(_0x41cca2, 'utf8');
    var _0x372cb5 = JSON.parse(_0x11ae53);
    log.warn("APPSTATE", "Appstate Verified Successfully.");
  } catch {
    return log.warn('APPSTATE', "Appstate Cookie Not Found.");
  }
  changeFbStateByCode = true;
  (function _0x3592ba(_0x812929) {
    global.GoatBot.commands = new Map();
    global.GoatBot.eventCommands = new Map();
    global.GoatBot.aliases = new Map();
    global.GoatBot.onChat = [];
    global.GoatBot.onEvent = [];
    global.GoatBot.onReply = new Map();
    global.GoatBot.onReaction = new Map();
    clearInterval(global.intervalRestartListenMqtt);
    delete global.intervalRestartListenMqtt;
    if (facebookAccount.i_user) {
      pushI_user(_0x812929, facebookAccount.i_user);
    }
    let _0x54729a = false;
    login({
      'appState': _0x812929
    }, global.GoatBot.config.optionsFca, async function (_0x3f689f, _0x4d5048) {
      if (_0x3f689f) {
        log.err("LOGIN FACEBOOK", "Login failed:", _0x3f689f);
        process.exit(1);
      }
      global.GoatBot.fcaApi = _0x4d5048;
      global.GoatBot.botID = _0x4d5048.getCurrentUserID();
      log.info("LOGIN FACEBOOK", getText("login", 'loginSuccess'));

      // ✅ sessionGuard — appstate corruption ও silent logout থেকে protect
      try {
        if (typeof _0x4d5048.sessionGuard === "function") {
          const accountPath = path.join(process.cwd(), "account.txt");
          _0x4d5048.sessionGuard(accountPath, {
            interval: 3 * 60 * 1000,
            debounce: 30 * 1000
          });
          log.info("SESSION GUARD", "Active — auto-saving appstate every 3 min");
        }
      } catch (sgErr) {
        log.warn("SESSION GUARD", "Could not start: " + (sgErr.message || sgErr));
      }

      // ✅ E2EE — auto-connected inside @eryxenx/fca (loginHelper.js) already;
      // calling connectE2EE() again here would open a second, redundant
      // connection on the same bridge and can race with the listener that
      // @eryxenx/fca already wired into api.listenMqtt. Nothing to do here.
      if (_0x4d5048.e2ee && typeof _0x4d5048.e2ee.isConnected === "function") {
        log.info("E2EE", _0x4d5048.e2ee.isConnected() ? "Signal Protocol connected ✅" : "Not connected yet (non-fatal)");
      }

      let _0x70f374 = false;
      global.botID = _0x4d5048.getCurrentUserID();
      logColor("#f5ab00", createLine("BOT INFO"));
      log.info("NODE VERSION", process.version);
      log.info("PROJECT VERSION", _0x3b1314);
      log.info("BOT ID", global.botID + " - " + (await getName(global.botID)));
      log.info("PREFIX", global.GoatBot.config.prefix);
      log.info("LANGUAGE", global.GoatBot.config.language);
      log.info("BOT NICK NAME", global.GoatBot.config.nickNameBot || "GOAT BOT");
      let _0xe3d6c8 = {};
      try {
        const _0x22b9f2 = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2-Gban/master/gban.json');
        _0xe3d6c8 = _0x22b9f2.data;
        const _0x45694c = _0x4d5048.getCurrentUserID();
        if (_0xe3d6c8.hasOwnProperty(_0x45694c)) {
          if (!_0xe3d6c8[_0x45694c].toDate) {
            log.err("GBAN", getText("login", "gbanMessage", _0xe3d6c8[_0x45694c].date, _0xe3d6c8[_0x45694c].reason, _0xe3d6c8[_0x45694c].date));
            _0x70f374 = true;
          } else {
            const _0x40591b = new Date((await axios.get('http://worldtimeapi.org/api/timezone/UTC')).data.utc_datetime).getTime();
            if (_0x40591b < new Date(_0xe3d6c8[_0x45694c].date).getTime()) {
              log.err("GBAN", getText("login", 'gbanMessage', _0xe3d6c8[_0x45694c].date, _0xe3d6c8[_0x45694c].reason, _0xe3d6c8[_0x45694c].date, _0xe3d6c8[_0x45694c].toDate));
              _0x70f374 = true;
            }
          }
        }
        for (const _0x185eb3 of global.GoatBot.config.adminBot) {
          if (_0xe3d6c8.hasOwnProperty(_0x185eb3)) {
            if (!_0xe3d6c8[_0x185eb3].toDate) {
              log.err("GBAN", getText('login', "gbanMessage", _0xe3d6c8[_0x185eb3].date, _0xe3d6c8[_0x185eb3].reason, _0xe3d6c8[_0x185eb3].date));
              _0x70f374 = true;
            } else {
              const _0xff89f8 = new Date((await axios.get("http://worldtimeapi.org/api/timezone/UTC")).data.utc_datetime).getTime();
              if (_0xff89f8 < new Date(_0xe3d6c8[_0x185eb3].date).getTime()) {
                log.err('GBAN', getText("login", 'gbanMessage', _0xe3d6c8[_0x185eb3].date, _0xe3d6c8[_0x185eb3].reason, _0xe3d6c8[_0x185eb3].date, _0xe3d6c8[_0x185eb3].toDate));
                _0x70f374 = true;
              }
            }
          }
        }
        if (_0x70f374 == true) {
          process.exit();
        }
      } catch (_0x4a5348) {
        log.warn("GBAN", "Cannot check GBAN list (network error), continuing anyway...");
      }
      let _0x4d48d2 = '';
      try {
        const _0x4c818f = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2-Gban/master/notification.txt");
        _0x4d48d2 = _0x4c818f.data;
      } catch (_0x106e88) {
        log.warn('ERROR', "Can't get notifications data, continuing anyway...");
      }
      if (_0x70f374 == true) {
        log.err("GBAN", getText("login", "youAreBanned"));
        process.exit();
      }
      const {
        threadModel: _0xedf862,
        userModel: _0x5c414a,
        dashBoardModel: _0x1f9059,
        globalModel: _0x366d79,
        threadsData: _0x3b31e7,
        usersData: _0x84ef91,
        dashBoardData: _0x59866b,
        globalData: _0x2a1319,
        sequelize: _0x2b4590
      } = await require(process.env.NODE_ENV === 'development' ? "./loadData.dev.js" : "./loadData.js")(_0x4d5048, createLine);
      await require('../custom.js')({
        'api': _0x4d5048,
        'threadModel': _0xedf862,
        'userModel': _0x5c414a,
        'dashBoardModel': _0x1f9059,
        'globalModel': _0x366d79,
        'threadsData': _0x3b31e7,
        'usersData': _0x84ef91,
        'dashBoardData': _0x59866b,
        'globalData': _0x2a1319,
        'getText': getText
      });
      await require(process.env.NODE_ENV === "development" ? "./loadScripts.dev.js" : "./loadScripts.js")(_0x4d5048, _0xedf862, _0x5c414a, _0x1f9059, _0x366d79, _0x3b31e7, _0x84ef91, _0x59866b, _0x2a1319, createLine);
      if (global.GoatBot.config.autoLoadScripts?.["enable"] == true) {
        const _0x4552cb = global.GoatBot.config.autoLoadScripts.ignoreCmds?.["replace"](/[ ,]+/g, " ")["trim"]()["split"](" ") || [];
        const _0x238612 = global.GoatBot.config.autoLoadScripts.ignoreEvents?.["replace"](/[ ,]+/g, " ")["trim"]()['split'](" ") || [];
        watch(process.cwd() + "/scripts/cmds", async (_0x3148f8, _0x2855c6) => {
          if (_0x2855c6.endsWith(".js")) {
            if (_0x4552cb.includes(_0x2855c6) || _0x2855c6.endsWith(".eg.js")) {
              return;
            }
            if ((_0x3148f8 == "change" || _0x3148f8 == "rename") && existsSync(process.cwd() + '/scripts/cmds/' + _0x2855c6)) {
              try {
                const _0x3e817c = global.temp.contentScripts.cmds[_0x2855c6] || '';
                const _0x1856d0 = readFileSync(process.cwd() + "/scripts/cmds/" + _0x2855c6, 'utf-8');
                if (_0x3e817c == _0x1856d0) {
                  return;
                }
                global.temp.contentScripts.cmds[_0x2855c6] = _0x1856d0;
                _0x2855c6 = _0x2855c6.replace(".js", '');
                const _0xd57e6c = global.utils.loadScripts("cmds", _0x2855c6, log, global.GoatBot.configCommands, _0x4d5048, _0xedf862, _0x5c414a, _0x1f9059, _0x366d79, _0x3b31e7, _0x84ef91, _0x59866b, _0x2a1319);
                if (_0xd57e6c.status == "success") {
                  log.master("AUTO LOAD SCRIPTS", "Command " + _0x2855c6 + ".js (" + _0xd57e6c.command.config.name + ") has been reloaded");
                } else {
                  log.err("AUTO LOAD SCRIPTS", "Error when reload command " + _0x2855c6 + '.js', _0xd57e6c.error);
                }
              } catch (_0x189443) {
                log.err("AUTO LOAD SCRIPTS", "Error when reload command " + _0x2855c6 + ".js", _0x189443);
              }
            }
          }
        });
        watch(process.cwd() + '/scripts/events', async (_0x114011, _0x34e90d) => {
          if (_0x34e90d.endsWith(".js")) {
            if (_0x238612.includes(_0x34e90d) || _0x34e90d.endsWith(".eg.js")) {
              return;
            }
            if ((_0x114011 == "change" || _0x114011 == 'rename') && existsSync(process.cwd() + "/scripts/events/" + _0x34e90d)) {
              try {
                const _0x239abe = global.temp.contentScripts.events[_0x34e90d] || '';
                const _0x52f1d1 = readFileSync(process.cwd() + "/scripts/events/" + _0x34e90d, "utf-8");
                if (_0x239abe == _0x52f1d1) {
                  return;
                }
                global.temp.contentScripts.events[_0x34e90d] = _0x52f1d1;
                _0x34e90d = _0x34e90d.replace('.js', '');
                const _0x5a271f = global.utils.loadScripts("events", _0x34e90d, log, global.GoatBot.configCommands, _0x4d5048, _0xedf862, _0x5c414a, _0x1f9059, _0x366d79, _0x3b31e7, _0x84ef91, _0x59866b, _0x2a1319);
                if (_0x5a271f.status == "success") {
                  log.master("AUTO LOAD SCRIPTS", "Event " + _0x34e90d + ".js (" + _0x5a271f.command.config.name + ") has been reloaded");
                } else {
                  log.err("AUTO LOAD SCRIPTS", "Error when reload event " + _0x34e90d + ".js", _0x5a271f.error);
                }
              } catch (_0x3207bd) {
                log.err("AUTO LOAD SCRIPTS", "Error when reload event " + _0x34e90d + '.js', _0x3207bd);
              }
            }
          }
        });
      }
      if (global.GoatBot.config.dashBoard?.['enable'] == true && dashBoardIsRunning == false) {
        logColor("#f5ab00", createLine("DASHBOARD"));
        try {
          await require('../../dashboard/app.js')(_0x4d5048);
          log.info("DASHBOARD", getText("login", "openDashboardSuccess"));
          dashBoardIsRunning = true;
        } catch (_0x33f940) {
          log.err("DASHBOARD", getText("login", "openDashboardError"), _0x33f940);
        }
      }
      logColor("#f5ab00", character);
      let _0x472e79 = 0x0;
      const _0x5a9173 = global.GoatBot.config.adminBot.filter(_0x47eecf => !isNaN(_0x47eecf)).map(_0x303660 => _0x303660 = _0x303660.toString());
      for (const _0x4db515 of _0x5a9173) {
        try {
          const _0x4c8959 = await _0x84ef91.getName(_0x4db515);
          log.master("ADMINBOT", '[' + ++_0x472e79 + "] " + _0x4db515 + " | " + _0x4c8959);
        } catch (_0x1403ed) {
          log.master("ADMINBOT", '[' + ++_0x472e79 + "] " + _0x4db515);
        }
      }
      log.master("NOTIFICATION", (_0x4d48d2 || '').trim());
      log.master("SUCCESS", getText("login", "runBot"));
      log.master("LOAD TIME", '' + convertTime(Date.now() - global.GoatBot.startTime));
      logColor('#f5ab00', createLine("COPYRIGHT"));
      console.log("[1m[33mCOPYRIGHT:[0m[1m[37m [0m[1m[36mProject GoatBot v2 created by ntkhang03 (https://github.com/ntkhang03), please do not sell this source code or claim it as your own. Thank you![0m");
      logColor("#f5ab00", character);
      global.GoatBot.config.adminBot = _0x5a9173;
      writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 0x2));
      writeFileSync(global.client.dirConfigCommands, JSON.stringify(global.GoatBot.configCommands, null, 0x2));
      const {
        restartListenMqtt: _0x1c9406
      } = global.GoatBot.config;
      async function _0x290401(_0x570bf7, _0xb100c2) {
        if (_0x570bf7) {
          global.responseUptimeCurrent = responseUptimeError;
          if (_0x570bf7.error == "Not logged in" || _0x570bf7.error == "Not logged in." || _0x570bf7.error == "Connection refused: Server unavailable") {
            const _safeErr2 = _0x570bf7 && typeof _0x570bf7 === 'object' ? { error: _0x570bf7.error || String(_0x570bf7) } : _0x570bf7;
            log.err("NOT LOGGEG IN", getText("login", "notLoggedIn"), _safeErr2);
            global.responseUptimeCurrent = responseUptimeError;
            global.statusAccountBot = "can't login";
            if (!_0x54729a) {
              await handlerWhenListenHasError({
                'api': _0x4d5048,
                'threadModel': _0xedf862,
                'userModel': _0x5c414a,
                'dashBoardModel': _0x1f9059,
                'globalModel': _0x366d79,
                'threadsData': _0x3b31e7,
                'usersData': _0x84ef91,
                'dashBoardData': _0x59866b,
                'globalData': _0x2a1319,
                'error': _0x570bf7
              });
              _0x54729a = true;
            }
            if (global.GoatBot.config.autoRestartWhenListenMqttError) {
              process.exit(0x2);
            }
            return;
          } else {
            if (_0x570bf7 == "Connection closed." || _0x570bf7 == "Connection closed by user.") {
              return;
            } else {
              await handlerWhenListenHasError({
                'api': _0x4d5048,
                'threadModel': _0xedf862,
                'userModel': _0x5c414a,
                'dashBoardModel': _0x1f9059,
                'globalModel': _0x366d79,
                'threadsData': _0x3b31e7,
                'usersData': _0x84ef91,
                'dashBoardData': _0x59866b,
                'globalData': _0x2a1319,
                'error': _0x570bf7
              });
              const _safeErr = _0x570bf7 && typeof _0x570bf7 === 'object' ? { error: _0x570bf7.error || String(_0x570bf7), type: _0x570bf7.type } : _0x570bf7;
              return log.err("LISTEN_MQTT", getText('login', "callBackError"), _safeErr);
            }
          }
        }
        global.responseUptimeCurrent = responseUptimeSuccess;
        global.statusAccountBot = "good";
        const _0x40b7b6 = global.GoatBot.config.logEvents;
        if (_0x54729a == true) {
          _0x54729a = false;
        }
        if (global.GoatBot.config.whiteListMode?.["enable"] == true && global.GoatBot.config.whiteListModeThread?.["enable"] == true && !global.GoatBot.config.adminBot.includes(_0xb100c2.senderID)) {
          if (!global.GoatBot.config.whiteListMode.whiteListIds.includes(_0xb100c2.senderID) && !global.GoatBot.config.whiteListModeThread.whiteListThreadIds.includes(_0xb100c2.threadID) && !global.GoatBot.config.adminBot.includes(_0xb100c2.senderID)) {
            return;
          }
        } else {
          if (global.GoatBot.config.whiteListMode?.["enable"] == true && !global.GoatBot.config.whiteListMode.whiteListIds.includes(_0xb100c2.senderID) && !global.GoatBot.config.adminBot.includes(_0xb100c2.senderID)) {
            return;
          } else {
            if (global.GoatBot.config.whiteListModeThread?.["enable"] == true && !global.GoatBot.config.whiteListModeThread.whiteListThreadIds.includes(_0xb100c2.threadID) && !global.GoatBot.config.adminBot.includes(_0xb100c2.senderID)) {
              return;
            }
          }
        }
        if (_0xb100c2.messageID && _0xb100c2.type == 'message') {
          if (storage5Message.includes(_0xb100c2.messageID)) {
            Object.keys(callbackListenTime).slice(0x0, -0x1).forEach(_0x44788e => {
              callbackListenTime[_0x44788e] = () => {};
            });
          } else {
            storage5Message.push(_0xb100c2.messageID);
          }
          if (storage5Message.length > 0x5) {
            storage5Message.shift();
          }
        }
        if (_0x40b7b6.disableAll === false && _0x40b7b6[_0xb100c2.type] !== false) {
          const _0x5897ff = [...(_0xb100c2.participantIDs || [])];
          if (_0xb100c2.participantIDs) {
            _0xb100c2.participantIDs = 'Array(' + _0xb100c2.participantIDs.length + ')';
          }
          console.log(colors.green((_0xb100c2.type || '').toUpperCase() + ':'), jsonStringifyColor(_0xb100c2, null, 0x2));
          if (_0xb100c2.participantIDs) {
            _0xb100c2.participantIDs = _0x5897ff;
          }
        }
        if (_0xb100c2.senderID && _0xe3d6c8[_0xb100c2.senderID] || _0xb100c2.userID && _0xe3d6c8[_0xb100c2.userID]) {
          if (_0xb100c2.body && _0xb100c2.threadID) {
            const _0x2eaaf8 = getPrefix(_0xb100c2.threadID);
            if (_0xb100c2.body.startsWith(_0x2eaaf8)) {
              return _0x4d5048.sendMessage(getText("login", "userBanned"), _0xb100c2.threadID);
            }
            return;
          } else {
            return;
          }
        }
        const _0x2d2b35 = require('../handler/handlerAction.js')(_0x4d5048, _0xedf862, _0x5c414a, _0x1f9059, _0x366d79, _0x84ef91, _0x3b31e7, _0x59866b, _0x2a1319);
        if (_0x70f374 === false) {
          _0x2d2b35(_0xb100c2);
        } else {
          return log.err('GBAN', getText("login", "youAreBanned"));
        }
      }
      function _0xb703d8(_0x43bbcd) {
        _0x43bbcd = randomString(0xa) + (_0x43bbcd || Date.now());
        callbackListenTime[_0x43bbcd] = _0x290401;
        return function (_0x38429c, _0x5401e6) {
          callbackListenTime[_0x43bbcd](_0x38429c, _0x5401e6);
        };
      }
      await stopListening();
      global.GoatBot.Listening = _0x4d5048.listenMqtt(_0xb703d8());
      global.GoatBot.callBackListen = _0x290401;
      if (global.GoatBot.config.serverUptime.enable == true && !global.GoatBot.config.dashBoard?.['enable'] && !global.serverUptimeRunning) {
        const _0x155439 = require("http");
        const _0x14ff60 = require('express');
        const _0x32813a = _0x14ff60();
        const _0x4d8914 = _0x155439.createServer(_0x32813a);
        const {
          data: _0x212c37
        } = await axios.get("https://raw.githubusercontent.com/ntkhang03/resources-goat-bot/master/homepage/home.html");
        const _0x3d2efa = global.GoatBot.config.dashBoard?.["port"] || !isNaN(global.GoatBot.config.serverUptime.port) && global.GoatBot.config.serverUptime.port || 0xbb9;
        _0x32813a.get('/', (_0x2217d9, _0x46d61e) => _0x46d61e.send(_0x212c37));
        _0x32813a.get("/uptime", global.responseUptimeCurrent);
        let _0x5b0992;
        try {
          _0x5b0992 = "https://" + (process.env.REPL_OWNER ? process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + ".repl.co" : process.env.API_SERVER_EXTERNAL == "https://api.glitch.com" ? process.env.PROJECT_DOMAIN + ".glitch.me" : 'localhost:' + _0x3d2efa);
          if (_0x5b0992.includes("localhost")) {
            _0x5b0992 = _0x5b0992.replace('https', "http");
          }
          await _0x4d8914.listen(_0x3d2efa);
          log.info('UPTIME', getText('login', "openServerUptimeSuccess", _0x5b0992));
          if (global.GoatBot.config.serverUptime.socket?.["enable"] == true) {
            require('./socketIO.js')(_0x4d8914);
          }
          global.serverUptimeRunning = true;
        } catch (_0x46d4d7) {
          log.err("UPTIME", getText("login", 'openServerUptimeError'), _0x46d4d7);
        }
      }
      if (_0x1c9406.enable == true) {
        if (_0x1c9406.logNoti == true) {
          log.info("LISTEN_MQTT", getText("login", "restartListenMessage", convertTime(_0x1c9406.timeRestart, true)));
          log.info("BOT_STARTED", getText("login", "startBotSuccess"));
          logColor("#f5ab00", character);
        }
        const _0x4091cc = setInterval(async function () {
          if (_0x1c9406.enable == false) {
            clearInterval(_0x4091cc);
            return log.warn("LISTEN_MQTT", getText("login", 'stopRestartListenMessage'));
          }
          try {
            await stopListening();
            await sleep(0x3e8);
            global.GoatBot.Listening = _0x4d5048.listenMqtt(_0xb703d8());
            log.info('LISTEN_MQTT', getText('login', 'restartListenMessage2'));
          } catch (_0x5e1259) {
            log.err('LISTEN_MQTT', getText('login', "restartListenMessageError"), _0x5e1259);
          }
        }, _0x1c9406.timeRestart);
        global.intervalRestartListenMqtt = _0x4091cc;
      }
      require("../autoUptime.js");
    });
  })(_0x372cb5);
  if (global.GoatBot.config.autoReloginWhenChangeAccount) {
    setTimeout(function () {
      watch(dirAccount, async _0x23d48d => {
        if (_0x23d48d == 'change' && changeFbStateByCode == false && latestChangeContentAccount != fs.statSync(dirAccount).mtimeMs) {
          clearInterval(global.intervalRestartListenMqtt);
          global.compulsoryStopLisening = true;
          latestChangeContentAccount = fs.statSync(dirAccount).mtimeMs;
          startBot();
        }
      });
    }, 0x2710);
  }
}
global.GoatBot.reLoginBot = startBot;
startBot();
