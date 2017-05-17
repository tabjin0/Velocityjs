(function($) {

//1.定义变量（动画元素，事件变量比如按钮）

	// 将DOM中的元素选出来
	var container = $(".container");
	var box = $(".box");
	var head_img = $("#head_img");
	var back_box = $(".back_box");
	var open = $(".bottom_button");
	var close = $(".close");
	var back_box_imgs = back_box.find("img");//z这边的imgs将是一个数组

//2.自定义动画（入场动画，出场动画，背面图片单独的入场动画，背面图片单独的出场动画）

	// 首先入场动画
	//2.自定义动画，即从下往上入场，Y轴上的变化
	$.Velocity.RegisterEffect("Tabbits.fromBottomToTop",{
		defaultDuration: 500,
		//定义数组calls,calls里面的每一个元素也是数组
		calls: [
			[{opacity:[1,0], translateY:[0,100]}]
			//{opacity:[1,0]中的1指的是动画结束时的状态，0指的是动画开始时的状态
			//Y方向上的位移使用translateY，translateY:[0,100]，结束的时候为0，开始的时候向下100px
		]
	});
	// 5.自定义出场动画，Y轴上的变化
	$.Velocity.RegisterEffect("Tabbits.fromTopToBottom",{
		defaultDuration: 200,		//时间稍微改短一下，收尾快点
		calls: [
			[{opacity: [0,1], translateY: [100,0]}]
		]
	});
	//6.自定义back_img入场动画，有由小变到原来的尺寸，用scale
	$.Velocity.RegisterEffect("Tabbits.back_imgIn",{
		defaultDuration: 1000,
		calls: [
			[{opacity: [1,0], scale: [1,0.3]}]  //以0.2倍大小到1倍大小的动画出现，注意始终值别弄反了，尤其是opacity弄反了直接看不来哦效果
		] 
	});
	// $.Velocity.RegisterEffect("Tabbits.back_imgIn",{
	// 		defaultDuration: 200,		//时间稍微改短一下，收尾快点
	// 		calls: [
	// 			[{opacity: [1,0], scale: [1,0.3]}]
	// 		]
	// 	});

	//8.自定义back_img出场动画
	$.Velocity.RegisterEffect("Tabbits.back_imgOut",{
		defaultDuration: 3000,
		calls: [
			[{opacity: [0,1],scale: [0.3,1]}]
		]
	});

//3.sequence动画序列（入场动画序列、点击按钮出场序列和入场序列、点击关闭的入场和出场序列）

	//3.定义入场动画sequnence动画序列
	var sequenceInit = [{
		elements: container,//每个元素都有elements
		properties: "Tabbits.fromBottomToTop",//properties使用上面的自定义动画
		//还有options，不希望页面刚打开动画就开始
		options: {
			delay: 300
		}
	},{
		elements: box,//每个元素都有elements
		properties: "Tabbits.fromBottomToTop",//properties使用上面的自定义动画
		//还有options，不希望页面刚打开动画就开始
		options: {
			// delay: 300 //box不需要delay
			sequneceQueue: false
		}
	},{
		elements: head_img,//每个元素都有elements
		properties: "Tabbits.fromBottomToTop",//properties使用上面的自定义动画
		//还有options，不希望页面刚打开动画就开始
		options: {
			sequneceQueue: false,
			delay: 60
		}
	}];

	//7.定义点击按钮动画的sequence动画序列
	var sequenceButtonClick = [{
		elements: container,
		properties: "Tabbits.fromTopToBottom",
		options: {
			sequenceQueue: false,
			delay: 300
		}
	},{//正面出场
		elements: box,
		properties: "Tabbits.fromTopToBottom",
		options: {
			sequenceQueue: false
		}
	},{//容器重新入场
		elements: container,
		properties: "Tabbits.fromBottomToTop",//再让container进来
	},{//背面入场
		elements: back_box,
		properties: "Tabbits.fromBottomToTop",
		options: {
			sequenceQueue: false
		}
	},{//背面图片入场
		// elememts: imgs,
		// properties: "Tabbits.back_imgIn",
		elements: back_box_imgs,
		properties: "Tabbits.back_imgIn",
		options: {
			sequenceQueue: false
		}
	}];

	//9.定义关闭按钮的sequence动画序列
	var sequenceClose = [{
		elements: back_box_imgs,
		properties: "Tabbits.back_imgOut"
	},{
		elements: container,
		properties: "Tabbits.fromTopToBottom",
		options: {
			sequenceQueue: false,
			delay: 3000
		}
	},{//背面出场
		elements: back_box,
		properties: "Tabbits.fromTopToBottom",
		options: {
			sequenceQueue: false
		}
	},{//容器重新入场
		elements: container,
		properties: "Tabbits.fromBottomToTop",//再让container进来
	},{//正面入场
		elements: box,
		properties: "Tabbits.fromBottomToTop",
		options: {
			sequenceQueue: false
		}
	}];

//4.事件绑定（在相应的事件发生的时候跑相应的动画序列）

	//4.调用RunSequence函数将自定义动画跑起来
	$.Velocity.RunSequence(sequenceInit);
	open.on('click',function() {
		$.Velocity.RunSequence(sequenceButtonClick);
	});
	close.on('click',function() {
		$.Velocity.RunSequence(sequenceClose);
	});

})(jQuery);
