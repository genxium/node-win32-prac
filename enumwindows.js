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
const longPtr = ref.refType(longType);
const hwndType = longType;
const lparamType = longPtr; 

const ulongType = ref.types.ulong;
const dwordType = ulongType;
const lpdwordType = ref.refType(dwordType);

const user32 = ffi.Library('user32.dll', {
  EnumWindows: [boolType, [voidPtr, int32Type]],
  GetWindowTextA: [dwordType, [hwndType, stringPtr, longType]],
  GetWindowThreadProcessId: [dwordType, [hwndType, lpdwordType]],  
  IsWindowVisible: [boolType, [hwndType]],
});

const windowProc = ffi.Callback(boolType, [hwndType, lparamType], function(hwnd, lParam) {
  const buf1 = new Buffer(255);
  const ret1 = user32.GetWindowTextA(hwnd, buf1, 255);
  const name = ref.readCString(buf1, 0);

  const buf2 = ref.alloc(dwordType);
  const ret2 = user32.GetWindowThreadProcessId(hwnd, buf2); 
  const pid = buf2.deref();

  const isOnScreen = user32.IsWindowVisible(hwnd);
  if (!isOnScreen) return true;

  console.log('On screen window \"' + name + '\" belongs to pid ' + pid);
  return true;
});

user32.EnumWindows(windowProc, 0);
