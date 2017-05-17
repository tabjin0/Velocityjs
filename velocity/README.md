Velocity.js-demo

http://velocityjs.org
Velocity works everywhere — back to IE8 and Android 2.3. 
Velocity兼容IE8和安卓2.3，但是css3做动画在IE8x下面是没有效果的，这是因为css3不兼容IE8,又比如用jquery来做动画，由于jquery是PC端的插件，在移动端表现出来的性能可能没有那么出色，经常会出现卡顿，但是Velocity在这个方面是做了优化的。

<!-- 引入query库 -->
    <script type="text/javascript" src="jquery-3.2.1.js"></script>
<!-- 引入Velocity的两个库 -->
    <script type="text/javascript" src="velocity.min.js"></script>
    <script type="text/javascript" src="velocity.ui.min.js"></script>

注意浏览器执行js的是从上往下执行的
<div id="div1" class="box"></div>
    <script type="text/javascript" src="script.js"></script>

//script.js
(function($) {
    $('#div1').velocity(
    {
        width:"300px",
        height:"300px"
    },
    {
        duration:3000    //动画效果为3000ms，也就是3s
    });
})(jQuery);
有了Velocity，就会有一个自动过渡的效果

下面看看这是怎么实现的，查看官方文档
Module Loader: RequireJS

1) If you're using Velocity with jQuery, shim jQuery as a dependency of Velocity. For the Velocity UI pack (optional), shim Velocity as a dependency of the UI pack.

(Keep in mind that jQuery must be global when using RequireJS with jQuery plugins; you cannot use jQuery.noConflict().)
require.config({
//下面是我们引入的jquery和velocity一个三个module
    paths: {
        "jquery": "/path/to/jquery-x.x.x",
        "velocity": "path/to/velocity",
        // Optional, if you're using the UI pack:
        "velocity-ui": "path/to/velocity.ui"
    },
    shim: {
        "velocity": {
            deps: [ "jquery" ]
        },
        // Optional, if you're using the UI pack:
        "velocity-ui": {
            deps: [ "velocity" ]
        }
    }
});
require([ "jquery", "velocity", "velocity-ui" ], function ($, Velocity) {
    /* Your app code here. */
    $("body").velocity({ opacity: 0.5 });
});




Basics: Arguments 

Overview

Velocity takes a map of CSS properties and values as its first argument. An options object can optionally be passed in as a second argument:

$element.velocity({
    width: "500px",
    property2: value2
}, {
    /* Velocity's default options */
    duration: 400,
    easing: "swing",
    queue: "",
    begin: undefined,
    progress: undefined,
    complete: undefined,
    display: undefined,
    visibility: undefined,
    loop: false,
    delay: false,
    mobileHA: true
});


动画序列
添加需求，再添加一个div2
(function($) {
    $('#div1').velocity({//第一个参数是CSS属性
        width: "300px",
        // height:"300px"
    },{//第一个参数是Velocity的选项
        duration: 3000    //动画效果为3000ms，也就是3s
    });
    $('#div2').velocity({//第一个参数是CSS属性
        width: "300px",
        // height:"300px"
    },{//第一个参数是Velocity的选项
        duration: 3000    //动画效果为3000ms，也就是3s
    });
})(jQuery);
效果：div1和div2同时动

增加需求，在div1结束之后再开设div2的动画
(function($) {
    $('#div1').velocity({//第一个参数是CSS属性
        width: "300px",
        // height:"300px"
    },{//第一个参数是Velocity的选项
        duration: 3000    //动画效果为3000ms，也就是3s
    });
    $('#div2').velocity({//第一个参数是CSS属性
        width: "300px",
        // height:"300px"
    },{//第一个参数是Velocity的选项
        duration: 3000,    //动画效果为3000ms，也就是3s
        delay: 3000    //延迟3s，实现div1动画结束之后div2才开始
    });
})(jQuery);
上面代码有什么问题？
假如div1动画效果时间为1s，div2的动画效果时间为3s，div2的delay仍然为3s，那么div1动画结束之后还有多等2s，尽管手动将div2的delay修改为1s可以实现，但是如果页面的复杂度提高，这个问题将会变得尖锐起来，手动维护很麻烦。
一个解决方案是
(function($) {
    $('#div1').velocity({//第一个参数是CSS属性
        width: "300px",
    },{//第一个参数是Velocity的选项
        duration: 3000,    //动画效果为3000ms，也就是3s
        complete: function () {
            $('#div2').velocity({//第一个参数是CSS属性
                width: "300px",
            },{//第一个参数是Velocity的选项
                duration: 3000,    //动画效果为3000ms，也就是3s
            });
        }
    });
})(jQuery);
说明：complete会在div1动画结束的时候调用一个函数，在这个匿名函数里面开始div2的动画。
至此，手动维护的问题解决了么？未必。假如现在又添加了div3，我们希望这三个div依次执行动画。
//现在添加div3，手动维护的问题解决了么
(function($) {
    $('#div1').velocity({//第一个参数是CSS属性
        width: "300px",
    },{//第一个参数是Velocity的选项
        duration: 3000,    //动画效果为3000ms，也就是3s
        complete: function () {
            $('#div2').velocity({//第一个参数是CSS属性
                width: "300px",
            },{//第一个参数是Velocity的选项
                duration: 3000,    //动画效果为3000ms，也就是3s
                complete: function() {
                    $('#div3').velocity({//第一个参数是CSS属性
                        width: "300px",
                    },{//第一个参数是Velocity的选项
                        duration: 3000,    //动画效果为3000ms，也就是3s
                    });
                }
            });
        }
    });
})(jQuery);//至此，解决了3个div手动维护依次动画的问题
至此，这个代码的可读性已经很差，继续寻找更好的高效 的维护方法，velocity确实给我们提供了一种很好的方法。
//velocity解决动画序列问题
(function($) {
    // $('#div1').velocity({//第一个参数是CSS属性
    //     width: "300px",
    // },{//第一个参数是Velocity的选项
    //     duration: 3000,    //动画效果为3000ms，也就是3s
    //     complete: function () {
    //         $('#div2').velocity({//第一个参数是CSS属性
    //             width: "300px",
    //         },{//第一个参数是Velocity的选项
    //             duration: 3000,    //动画效果为3000ms，也就是3s
    //             complete: function() {
    //                 $('#div3').velocity({//第一个参数是CSS属性
    //                     width: "300px",
    //                 },{//第一个参数是Velocity的选项
    //                     duration: 3000,    //动画效果为3000ms，也就是3s
    //                 });
    //             }
    //         });
    //     }
    // });
    var seq = [
    {
        elements: $('#div1'),
        properties: {width: '300px'},
        options: {duration: 3000}
    },
    {
        elements: $('#div2'),
        properties: {width: '300px'},
        options: {duration: 3000}
    },
    {
        elements: $('#div3'),
        properties: {width: '300px'},
        options: {duration: 3000}
    }
    ];//定义好动画序列
    $.Velocity.RunSequence(seq);//将动画序列跑起来
})(jQuery);
这个sequence的可读性比嵌套complete好太多。所以需要处理动画序列就是用这种方法。
下面是velocity处理动画序列的官方api文档
Single Object

Velocity also supports a single-argument syntax (which allows for more expressive CoffeeScript code). Simply pass in a single object with properties (or p) and options (or o) members:

$element.velocity({
    properties: { opacity: 1 },
    options: { duration: 500 }
});
Or:
$element.velocity({
    p: { opacity: 1 },
    o: { duration: 500 }
});

预定义动画和自定义动画
需求，当鼠标放到div上面的时候，这个div左右摆动。
(function($) {
    //首先给div1绑定事件，当鼠标在上面会有回调事件
    $('#div1').on('mouseover',function() {
        //将元素选中，给他一个velocity，在velocity的参数里面添加callout.shake
        $(this).velocity('callout.shake');
    })
})(jQuery);
原因在于callout.shake是Velocity的预定义动画。

预定义动画官方API：Effects: Pre-Registered

除了这些预定义动画， 还可以使用函数RegisterEffect自定义动画。
registerEffect(动画的名字,)
(function($) {
    //首先给div1绑定事件，当鼠标在上面会有回调事件
    $('#div1').on('mouseover',function() {
        //将元素选中，给他一个velocity，在velocity的参数里面添加callout.shake
        $(this).velocity('callout.shake');
    });
    $.Velocity.RegisterEffect('name.pulse',{
        defaultDuration: 300,
        calls: [//这个scaleX指的是把元素在X周的一个尺寸的比例变化,{scaleX: 1.1}这个效果时间为0.5个defaultDuration
            [{scaleX: 1.1},0.5],//在前0.5个defaultDuration内将元素的X轴变为原来的1.1倍    
            [{scaleX: 1.0},0.5]//在后0.5个defaultDuration的将元素的X轴变为原来的1倍，也就是原来的大小        
        ]
    });
    //应用自定义动画，应用在div2
    $('#div2').on('mouseover',function() {
        $(this).velocity('name.pulse');
    })
})(jQuery);
通过RegisterEffect实现动画效果和之前RunSequence实现动画效果有什么区别？
首先RegisterEffect实现动画效果的优势很明显，可复用性高，可以自定义之后在以后直接引用
除了RegisterEffect，还有一个函数RegisterUI效果大同小异。
$.Velocity.RegisterUI('name.pulse_user_defined',{
        defaultDuration: 300,
        calls: [//这个scaleX指的是把元素在X周的一个尺寸的比例变化,{scaleX: 1.1}这个效果时间为0.5个defaultDuration
            [{scaleX: 1.1},0.5],//在前0.5个defaultDuration内将元素的X轴变为原来的1.1倍    
            [{scaleX: 1.0},0.5]//在后0.5个defaultDuration的将元素的X轴变为原来的1倍，也就是原来的大小        
        ]
    });

官方API文档
Effects: Registration 

This feature was added recently. Ensure you're using the latest version of the UI pack.

The UI pack allows you to register custom effects, which also accept the special stagger, drag, and backwards options. Once registered, an effect is called by passing its name as Velocity's first parameter: $element.velocity("name").
Benefits of custom effects include separating UI animation design from UI interaction logic, naming animations for better code organization, and packaging animations for re-use across projects and for sharing with others.
A custom UI pack effect is registered with the following syntax:
$.Velocity.RegisterEffect(name, {
    defaultDuration: duration,
    calls: [
        [ { property: value }, durationPercentage, { options } ],
        [ { property: value }, durationPercentage, { options } ]
    ],
    reset: { property: value, property: value }
});
In the above template, we pass an optional defaultDuration property, which specifies the duration to use for the full effect if one is not passed into the triggering Velocity call, e.g. $element.velocity("name"). Like a value function, defaultDuration also accepts a function to be run at an animation's start. This function is called once per UI pack call (regardless of how many elements are passed into the call), and is passed the raw DOM element set as both its context and its first argument.
Next is the array of Velocity calls to be triggered (in order). Each call takes a standard properties map, followed by the percentage (as a decimal) of the effect's total animation duration that the call should consume (defaults to 1 if unspecified), followed by an optional animation options object. This options object only accepts Velocity's easing and delay options.
Lastly, you may optionally pass in a reset property map (using standard Velocity properties and values), which immediately applies the specified properties upon completion of the effect. This is useful for when you're, say, scaling an element down to 0 (out of view) and want to return the element to scale:1 once the element is hidden so that it’s normally scaled when it’s made visible again sometime in the future.
Sample effect registrations:
Callout:
$.Velocity.RegisterEffect("callout.pulse", {
    defaultDuration: 900,
    calls: [
        [ { scaleX: 1.1 }, 0.50 ],
        [ { scaleX: 1 }, 0.50 ]
    ]
});
$element.velocity("callout.pulse");
Transition:
/* Registration */
$.Velocity
    .RegisterEffect("transition.flipXIn", {
        defaultDuration: 700,
        calls: [
            [ { opacity: 1, rotateY: [ 0, -55 ] } ]
        ]
    });
    .RegisterEffect("transition.flipXOut", {
        defaultDuration: 700,
        calls: [
            [ { opacity: 0, rotateY: 55 } ]
        ],
        reset: { rotateY: 0 }
    });
/* Usage */
$element
    .velocity("transition.flipXIn")
    .velocity("transition.flipXOut", { delay: 1000 });
(For additional examples, browse the UI pack's source.)
Note that, if your effects' names end with In or Out, Velocity will automatically set the display option to "none" or the element’s default type for you. In other words, elements are set to display: block Before beginning an “In” transition or display: none after completing an Outtransition.
/* Bypass the UI pack's automatic display setting. */
$element.velocity("transition.flipXIn", { display: null });

至此，velocity基本告一段落。
小结
1.velocity基本用法和配置属性

duration代表动画的时长，delay代表动画的延迟时间
2.序列动画的3种实现方式
a。方式一：通过delay

缺点是需要手动维护duration和delay之间的关系
b。方法二：通过complete

缺点是实现代码会一层层嵌套，可读性会越来越差。
c。方法三：通过定义sequence动画序列，然后通过RunSequence函数实现动画序列。

这种方法比较好。
3.预定义动画和自定义动画
a。预定义动画

b。自定义动画
