Dependencies on Window 7
==

- [Git Bash](https://git-scm.com/downloads)
- Dependencies for [node-gyp](https://github.com/nodejs/node-gyp)
    - It's strongly recommended that the "more manual" option picked up.
        - This README will proceed by assuming that you use [Python 2.7.13](https://www.python.org/downloads/release/python-2713/) and [Visual C++ Build Tool 2015](http://landinghub.visualstudio.com/visual-cpp-build-tools). Please beware of that Python 3.x.y+ is NOT supported!
    - If you prefer the [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) option, please install it with `npm install --global --product --add-python-to-path=true --verbose windows-build-tools` and make sure that your network connection is excellent.

***

Npm Install
==

The following one-liner will install all the node module dependencies.

```
proj-root> PYTHON=C:\\Python27\\python.exe npm install --msvs_version=2015 --verbose
```

To avoid setting the `PYTHON` node env repeatedly, you might as well set the `PYTHON` environment variable in operating system scope or operating system user scope. 
***

Trouble Shooting 
==

## Speed of Npm Downloads in China

If you want to switch node modules and node-gyp tools mirror to a domestic source, e.g. taobao's, for speeding up downloads, try the following OPTIONAL commands BEFORE running the installation one-liner.

```
proj-root> npm config set registry https://registry.npm.taobao.org
proj-root> npm config set NODEJS_ORG_MIRROR https://npm.taobao.org/mirrors/node
proj-root> npm config set strict-ssl false
```
