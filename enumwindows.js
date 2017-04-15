'use strict';

// Reference http://stackoverflow.com/questions/37670273/node-ffi-window-list.
const ref = require('ref');
const ffi = require('ffi');

const voidPtr = ref.refType(ref.types.void);
const stringPtr = ref.refType(ref.types.CString);

const user32 = ffi.Library('user32.dll', {
  EnumWindows: ['bool', [voidPtr, 'int32']],
  GetWindowTextA : ['long', ['long', stringPtr, 'long']]
});

const windowProc = ffi.Callback('bool', ['long', 'int32'], function(hwnd, lParam) {
  let buf = new Buffer(255);
  const ret = user32.GetWindowTextA(hwnd, buf, 255);
  const name = ref.readCString(buf, 0);
  console.log(name);
  return true;
});

user32.EnumWindows(windowProc, 0);
