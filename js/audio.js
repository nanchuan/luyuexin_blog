
//音乐资源
var myMusics = new Array(
	{title:"纯音乐-彼岸.mp3"},
	{title:"周杰伦-路小雨.mp3"},
	{title:"老狼-晴朗-晴朗.mp3"},
	{title:"李健-为你而来-为你而来.mp3"},
	{title:"王梵瑞-时光谣-时光谣.mp3"},
	{title:"拜金小姐-The Good The Bad ...-蝶恋花.mp3"}
);	

//数组下标
var index = -1;	

//播放状态 单曲循环：0 列表循环：1 随机播放：2
var playState = 1;

//创建音乐列表
function createBox(){
	var html = "";
	for(var i=0; i<myMusics.length; i++){
		html += "<li>"+(i+1)+"  <a href='javascript:clickName("+i+");'>"+myMusics[i].title+"</a></li>"
	}
	return html
}

//页面加载		
$(document).ready(function(){
	$("#"+"box").append(createBox());
	playMusic(1);
	$("#playMusic").val("播放");
	document.getElementById("myaudio").pause();
	
	//按钮"下一首"单击事件
	$("#nextMusic").click(function(){
		playMusic(1,1);
	});
	
	//按钮"上一首"单击事件
	$("#lastMusic").click(function(){
		playMusic(2);
	});
	
	////按钮"播放/暂停"单击事件
	$("#playMusic").click(function(){
		if($(this).val()=="播放"){
			$(this).val("暂停");
			document.getElementById("myaudio").play();
		}else if($(this).val()=="暂停"){
			$(this).val("播放");
			document.getElementById("myaudio").pause();
		}
	});
	
	//快进
	$("#fast").click(function(){
		var myaudio = document.getElementById("myaudio");
		myaudio.currentTime+=5;
	});
	
	//快退
	$("#rewind").click(function(){
		var myaudio = document.getElementById("myaudio");
		myaudio.currentTime-=5;
	});
	
	//播放状态
	$("#playState").change(function(){
		playState = $(this).val();				
	});
	
	$("li").mouseover(function(){
		$(this).css("background-color","#666666");
	});
	
	$("li").mouseout(function(){
		$(this).css("background-color","transparent");
		$($("li")[index]).css("background-color","#666666");
	});
});

//点击名字播放音乐
function clickName(i){
	index=i;
	playMusic(0);
}

//音乐播放
function playMusic(s,n){
	$("#playMusic").val("暂停");
	if(s==0){//点击名字播放音乐
	
	}else if(s==1){//下一首
		$("#playMusic").val("暂停");
		if(playState==0){//单曲循环
			if(n==0){
			
			}else if(n==1){
				index++;
				if(index>=myMusics.length){
					index=0;
				}
			}
		}else if(playState==1){//列表循环
			index++;
			if(index>=myMusics.length){
				index=0;
			}
		}else if(playState==2){//随机播放
			index = Math.floor(Math.random()*myMusics.length);
		}
	}else if(s==2){//上一首
		index--;
		if(index<0){
			index=myMusics.length-1;
		}
	}
	
	//修改audio资源路径
	$("#myaudio").attr("src","music/"+myMusics[index].title);
	
	//音乐播放
	$("#myaudio").play;
	
	//显示音乐名称
	$("#musicTitle").text(myMusics[index].title);
	$("title").text(myMusics[index].title);
	
	//重置li列表背景色
	$("#box").children("li").css("background-color","transparent");
	$("#box").children("li").css("font-weight","normal");
	
	//修改播放音乐背景色
	$($("#box").children("li")[index]).css("background-color","#666666");
	$($("#box").children("li")[index]).css("font-weight","bold");
	
	$("#sliding").offset({left:60});
}

//时间获取
function timeupdate(){

	//获取audio元素
	var myaudio = document.getElementById("myaudio");
	
	//音乐当前位置
	var curr = Math.floor(myaudio.currentTime);
	
	//音乐长度
	var dur = Math.floor(myaudio.duration);
	$("#totalTime").text(formatTime(dur));
	$("#currTime").text(formatTime(curr));
}

//音乐计时格式
function formatTime(time){
	
	var h=0,i=0,s=parseInt(time);
	if(s>60){
		i=parseInt(s/60);
		s=parseInt(s%60);
		if(i > 60) {
			h=parseInt(i/60);
			i = parseInt(i%60);
		}
	}
	var zero=function(v){
		return (v>>0)<10?"0"+v:v;
	};
	return (zero(h)+":"+zero(i)+":"+zero(s));
};

// 显示更新的进度条
function progressBar()
{
	var oAudio = document.getElementById('myaudio');
	
	// 获取当前播放的时间秒数
	var elapsedTime = Math.round(oAudio.currentTime);
	
	// 绘制进度条，显示进度信息
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		
		// 清除当前的矩形区域
		ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
		ctx.fillStyle = "rgb(200,100,0)";

		var fWidth = (elapsedTime / oAudio.duration) * (canvas.clientWidth);
		if (fWidth > 0) {
			// 重新绘制矩形区域
			ctx.fillRect(0, 0, fWidth, canvas.clientHeight);
		}
	}
	drawScreen(oAudio); // 刷新音频属性信息
}

// 添加事件关联
function initEvents() 
{
	var canvas = document.getElementById('canvas');
	var oAudio = document.getElementById('myaudio');

	// 当停止播放时，清空进度条并且清空属性信息
	oAudio.addEventListener("ended", function() {
		var canvas = document.getElementById('canvas');
		if (canvas.getContext) {
			var ctx = canvas.getContext("2d");
			// 清空矩形区域
			ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
		}
		//document.getElementById("idInfo").innerHTML="";//清空进度条信息
	}, true);

	// 当 currentTime 更改时，调用 progressBar 方法更新进度条
	oAudio.addEventListener("timeupdate", progressBar, true);
	
	// 当单击画布时，从当前单击的位置开始进行播放
	canvas.addEventListener("click", function(e) {
		var oAudio = document.getElementById('myaudio');
		var canvas = document.getElementById('canvas');
		if (!e) {
			e = window.event;
		}
		try {
			//将当前单击的位置作为 currentTime 的播放位置
			oAudio.currentTime = oAudio.duration * (e.offsetX / canvas.clientWidth);
		}
		catch (err) {
			// 如果出现异常则显示错误信息
			if (window.console && console.error("错误:" + err));
		}
	}, true);
}

// 当页面加载完成之后调用<em>initEvents</em>方法关联事件处理代码
window.addEventListener("DOMContentLoaded", initEvents, false);

