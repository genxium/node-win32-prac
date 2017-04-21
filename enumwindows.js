'use strict';

// Reference http://stackoverflow.com/questions/37670273/node-ffi-window-list.
const ref = require('ref');
const ffi = require('ffi');

const voidType = ref.types.void;
const voidPtr = ref.refType(voidType);

const stringType = ref.types.CString;
const stringPtr = ref.refType(stringType);

const intType = ref.types.int;
const uintType = ref.types.uint;

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
  GetClassNameA: [dwordType, [hwndType, stringPtr, longType]],
  GetWindowTextA: [dwordType, [hwndType, stringPtr, longType]],
  GetWindowThreadProcessId: [dwordType, [hwndType, lpdwordType]],  
  IsWindowVisible: [boolType, [hwndType]],
});

const windowProc = ffi.Callback(boolType, [hwndType, lparamType], function(hwnd, lParam) {
  const buf1 = new Buffer(255);
  const ret1 = user32.GetWindowTextA(hwnd, buf1, 255);
  const name = ref.readCString(buf1, 0);

  const isOnScreen = user32.IsWindowVisible(hwnd);
  if (!isOnScreen) return true;

  const buf2 = ref.alloc(dwordType);
  const ret2 = user32.GetWindowThreadProcessId(hwnd, buf2); 
  const pid = buf2.deref();

  const buf3 = new Buffer(512); 
  const ret3 = user32.GetClassNameA(hwnd, buf3, 512); 
  const className = ref.readCString(buf3, 0); 

  console.log('On screen window \"' + name + ':' + className + '\" belongs to pid ' + pid);
  return true;
});

user32.EnumWindows(windowProc, 0);
