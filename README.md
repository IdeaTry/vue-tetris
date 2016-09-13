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
```
左移：方向键`左`
右移：方向键`右`
变形：方向键`上`
加速：方向键`下`
```

*按钮操作*
```
左移：按钮`左`
右移：按钮`右`
变形：按钮`上`
加速：按钮`下`
```

*手势操作*
```
左移：左划
右移：右划
变形：上划
加速：下划
```


## 模块划分

1. tetris.vue      主界面
2. chessboard.vue  棋盘界面
3. handles.vue     按钮界面
4. score.vue       分数界面
5. shape.js        积木
6. shape.rotator   旋转工具

![ui-components](./doc/images/ui-compnents.png)

## 代码规范

a. 界面由Vue组件组合而成
```html
<template>
    <!-- 容器 -->
    <div class="game">
        
        <!-- 主界面 -->
        <chessboard class="main" v-ref:chessboard
            :col="col" :row="row" :current="current" :start="startOffset">
        </chessboard>
        
        <!-- 侧面 -->
        <div class="side">
            
            <!-- 预览小窗口 -->
            <chessboard v-ref:preview 
                :col="3" :row="3" :current="preview">
            </chessboard>
            
            <!-- 成绩 -->
            <score :score="score"></score>
            
            <!-- 暂停 -->
            <div class="play" v-show="status === 'playing'">
                <div class="suspend">暂停</div>
            </div>

        </div>
        
        <!-- 控制器 -->
        <div class="handles">
            <handles v-ref:handles 
                :status="status">
            </handles>
        </div>
        
        <!-- 全屏覆盖的消息 -->
        <div class="msg" v-show="msg">
            <span>{{msg}}</span>
        </div>
    </div>
</template>
```

b. 父元素可以直接操作子元素，子元素不可以操作父元素，只能通过触发事件来向父元素发送消息
```js
    var vm = this,
        chessboard = vm.$refs.chessboard;

    // 重力作用
    vm.timer = interval(function(){
        if(vm.status === 'playing'){
            chessboard.drop();
        };
    }, 1000/vm.speed);

    // 计分
    chessboard.$on('score', function(times){
        vm.score += vm.col * times;
    });
    // gameover
    chessboard.$on('gameover', function(times){
        vm.status = 'gameover';
    });
```

## 问题反馈

mailhap@qq.com