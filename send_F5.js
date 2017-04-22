'use strict';

// Reference http://stackoverflow.com/questions/37670273/node-ffi-window-list.
const ref = require('ref');
const ffi = require('ffi');

const voidType = ref.types.void;
const voidPtr = ref.refType(voidType);

const stringType = ref.types.CString;
const stringPtr = ref.refType(stringType);

const intType = ref.types.int;
const intPtr = ref.refType(intType);

const uintType = ref.types.uint;
const wparamType = uintType;

const int32Type = ref.types.int32;
const boolType = ref.types.bool;

const longType = ref.types.long;
const longPtr = ref.refType(longType);
const hwndType = longType;
const lparamType = longType; 

const ulongType = ref.types.ulong;
const dwordType = ulongType;
const lpdwordType = ref.refType(dwordType);

const targetPidStr = process.env.PID;

let targetWindowList = [];

const user32 = ffi.Library('user32.dll', {
  EnumWindows: [boolType, [voidPtr, int32Type]],
  GetWindowTextA: [dwordType, [hwndType, stringPtr, longType]],
  GetClassNameA: [dwordType, [hwndType, stringPtr, longType]],
  GetWindowThreadProcessId: [dwordType, [hwndType, lpdwordType]],  
  PostMessageA: [boolType, [hwndType, uintType, wparamType, lparamType]],
});

const windowProc = ffi.Callback(boolType, [hwndType, lparamType], function(hwnd, lParam) {
  const buf2 = ref.alloc(dwordType);
  const ret2 = user32.GetWindowThreadProcessId(hwnd, buf2); 
  const pid = buf2.deref();

  if (pid.toString() !== targetPidStr) return true;

  const buf1 = new Buffer(1024);
  const ret1 = user32.GetWindowTextA(hwnd, buf1, 1024);
  const name = ref.readCString(buf1, 0);

  const buf3 = new Buffer(512); 
  const ret3 = user32.GetClassNameA(hwnd, buf3, 512); 
  const className = ref.readCString(buf3, 0); 
 
  targetWindowList.push({
    windowId: hwnd, 
    windowName: name,
    windowClassName: className,
  });

  return true;
});

user32.EnumWindows(windowProc, 0);

const WM_KEYDOWN = 0x0100;
const WM_KEYUP = 0x0101;
const VK_F5 = 0x74;
const VK_F6 = 0x75;

for (let i = 0; i < targetWindowList.length; ++i) {
  const target = targetWindowList[i];
  console.log('Found target window ' + target.windowName + ':' + target.windowClassName);
  user32.PostMessageA(target.windowId, WM_KEYDOWN, VK_F5, 0);
  user32.PostMessageA(target.windowId, WM_KEYUP, VK_F5, 0);
}
