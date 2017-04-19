'use strict';

// Reference http://stackoverflow.com/questions/37670273/node-ffi-window-list.
const ref = require('ref');
const ffi = require('ffi');

const voidType = ref.types.void;
const voidPtr = ref.refType(voidType);
const stringPtr = ref.refType(ref.types.CString);
const int32Type = ref.types.int32;
const boolType = ref.types.bool;
const longType = ref.types.long;
const dwordType = longType;

const longPtr = ref.refType(longType);
const hwndType = longType;
const lparamType = longPtr;

const user32 = ffi.Library('user32.dll', {
  EnumWindows: [boolType, [voidPtr, int32Type]],
  GetWindowTextA: [dwordType, [hwndType, stringPtr, longType]],
  GetWindowThreadProcessId: [dwordType, [hwndType, lparamType]],  
  IsWindowVisible: [boolType, [hwndType]],
});

const windowProc = ffi.Callback('bool', ['long', 'int32'], function(hwnd, lParam) {
  let buf1 = new Buffer(255);
  const ret1 = user32.GetWindowTextA(hwnd, buf1, 255);
  const name = ref.readCString(buf1, 0);

  let buf2 = new Buffer(255);
  const ret2 = user32.GetWindowThreadProcessId(hwnd, buf2);
  
  const pid = ref.readInt64(buf2, 0);

  const isOnScreen = user32.IsWindowVisible(hwnd);
  if (!isOnScreen) return true;

  console.log('On screen window \"' + name + '\" belongs to pid ' + pid);
  return true;
});

user32.EnumWindows(windowProc, 0);
