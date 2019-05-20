社交北航(正式名字未定)
=======

一个类似微博的社交客户端，基于React Native。虽然是采用 React Native 开发的，但是实际使用体验应该不输大部分 Github 上的个人开发的原生应用。

这是整个校园社交平台的移动端项目，与之配套的还有另一个基于 Python Flask 的后端应用，你可以[点此查看](https://github.com/fondoger/School).

这个项目大部分代码是近一年前开发写的，由于 React Native 生态不够完善，社区组件总有各种各样的差强人意，许多基础的组件 (SlideInMenu、Toast、ContextMenu等) 都是自己写动画手撸的(也借鉴了许多开源项目)。

另外，在写这个项目之前，我对 JavaScript 的掌握程度仅仅是勉强能使用 Jquery 和 Ajax，但 React 使用到了 ES6 的内容，因此许多 JS 的代码都是参照官网和Github上源码照猫画虎写的，并非专业前端，代码写的水平不高见笑了。没有使用到 Redux，都是很普通很基础的 JS 代码，稍微了解 ES6 的类及箭头函数就能看懂代码。

由于需要找工作，如果觉得好用的话，请给我一个小星星，谢谢。

## 下载地址 & 试用

Android: [点此下载](http://asserts.fondoger.cn/personal/app-release.apk)

为了方便大家，提供一个试用账号：
密码：test
账号：这

**为什么没有 iOS 版本？**
因为开发者没有 Mac 和 iPhone 设备。不过，本项目是纯 JS 写的，用到的库全部兼容 iOS 和 Android，本项目稍加调试（主要是样式适配）就能够在运行在 iOS 环境。因此，当具备条件时，该项目能迅速迁移到 iOS 设备上。

## 基本功能介绍

下面图片是该APP的主要功能。整个项目暂时总共写了32个页面，实际功能还是挺多的（当然 Bug 也不少）：

![基本功能](http://ww1.sinaimg.cn/large/0070O95Yly1g36sx92wojj30ox0io410.jpg)

项目截图
-------

<div class="container" style="width: 100%; padding: 50px; background: #2ecc71; box-sizing: border-box;">
    <div class="row" style="display: flex; flex-direction: row;">
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qrwahgnj30u01t0qno.jpg">
        </div>
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qruhk1gj30u01t013q.jpg">
        </div>
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qrtwsyej30u01t0n7g.jpg">
        </div>
    </div>
    <div class="row" style="display: flex; flex-direction: row;">
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qrsa7s3j30u01t0tnm.jpg" >
        </div>
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qrwll2rj30u01t01kx.jpg">
        </div>
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qrx12q2j30u01t0160.jpg">
        </div>
    </div>
    <div class="row" style="display: flex; flex-direction: row;">
    	<div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36spb7511j30u01t00u7.jpg">
        </div>
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36qrq8qxqj30u01t041m.jpg">
        </div>
        <div class="card" style="flex: 1; margin: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); border-radius: 30px;">
            <img class="img" style="width: 100%; height: auto; border-radius: 30px;" src="http://ww1.sinaimg.cn/large/0070O95Yly1g36spuxfghj30u01t0qci.jpg">
        </div>
    </div>
</div>


## 诚邀您参与开发

这个项目是两年前开始的，绝大部分代码是一年多前写好的，由于我比较懒，鸽了一个学期没咋提交代码。因为工程量太大了，一个人单打独斗实在是吃不消。现在想要完善它，希望得到大家的帮助。

本项目是基于 React Native 的，基本没有 Java 代码，学习起来还算比较轻松。如果您想要参与开发，我可以提供一些技术指导，不过你需要有足够的 Google + StackOverflow 技能，并能具备阅读英文文档的能力。

当你提交过一个有效的 PR（新功能或修复Bug) ，我会将您纳入本项目的开发成员组（目前开发者只有我一个人）。

欢迎在 issue 区提出任何问题或改进建议。
