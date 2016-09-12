# vue-tetris

通过开发一款俄罗斯方块的小游戏，来了解webpack和vue的使用。

## 开发环境

1. 下载源代码
2. 安装依赖库，`npm i`
3. 安装Webpack，`npm i -g webpack`
4. 启动构建工具，`webpack --watch`

## 在线DEMO

https://ideatry.github.io/vue-tetris/build/index.html

## 运行游戏

直接用浏览器打开 /build/index.html 即可

## 游戏控制

*键盘操作*

左移：方向键`左`
右移：方向键`右`
变形：方向键`上`
加速：方向键`下`

*按钮操作*

左移：按钮`左`
右移：按钮`右`
变形：按钮`上`
加速：按钮`下`

*手势操作*

左移：左划
右移：右划
变形：上划
加速：下划

## 游戏逻辑

## 模块划分

UI元素

1. 页面
2. 主窗口
3. 预览窗口
4. 控制按钮
5. 分数和历史记录

功能模块

1. 页面控制器（主控制器）
2. 预览控制器
3. 形状类
4. 旋转器
5. 计时器
6. 移动和变形控制器

组件

1. chessboard.vue
2. page.vue
3. handles.vue
4. score.vue
5. preview.vue

## 问题反馈

mailhap@qq.com