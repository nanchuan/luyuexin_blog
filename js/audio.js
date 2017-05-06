
//数组下标
var index = -1;	

//播放状态 单曲循环：0 列表循环：1 随机播放：2
var playState = 2;

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
	$("#box").append(createBox());
	//playMusic(1);
	//document.getElementById("myaudio").pause();
	//$("#playMusic").val("播放");
	index=0;
	$("#myaudio").attr("src","music/"+myMusics[index].title);
	$("#musicTitle").text(myMusics[index].title);
	//$("title").text(myMusics[index].title);
	//$("#box").children("li").css("background-color","transparent");
	//$("#box").children("li").css("font-weight","normal");
	$($("#box").children("li")[index]).css("background-color","#666666");
	$($("#box").children("li")[index]).css("font-weight","bold");
	
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
	
	$("#box").children("li").mouseover(function(){
		$(this).css("background-color","#666666");
	});
	
	$("#box").children("li").mouseout(function(){
		$(this).css("background-color","transparent");
		$($("#box").children("li")[index]).css("background-color","#666666");
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
	//$("#myaudio").play;
	document.getElementById("myaudio").play();
	
	//显示音乐名称
	$("#musicTitle").text(myMusics[index].title);
	//$("title").text(myMusics[index].title);
	
	//重置li列表背景色
	$("#box").children("li").css("background-color","transparent");
	$("#box").children("li").css("font-weight","normal");
	
	//修改播放音乐背景色
	$($("#box").children("li")[index]).css("background-color","#666666");
	$($("#box").children("li")[index]).css("font-weight","bold");
	
	//$("#sliding").offset({left:60});
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

//音乐资源
var myMusics = new Array(
	{title: "929-2008 Future Maker-也许像星星.mp3                                                                       "},
	{title: "Amethystium-Evermind-Shadowlands.mp3                                                                       "},
	{title: "Amethystium-Isabliss-Pluie.mp3                                                                             "},
	{title: "Amethystium-Isabliss-Silken Twine.mp3                                                                      "},
	{title: "Avril Lavigne-Goodbye Lullaby-Everybody Hurts.mp3                                                          "},
	{title: "Avril Lavigne-Goodbye Lullaby-I Love You.mp3                                                               "},
	{title: "Avril Lavigne-Goodbye Lullaby-Smile.mp3                                                                    "},
	{title: "AZU  Spontania-同じ空みつめてる...-同じ空みつめてるあなたに.mp3                                            "},
	{title: "B. Fleischmann-The humbucking coil-Broken Monitors.mp3                                                     "},
	{title: "Balmorhea-Balmorhea-Attesa.mp3                                                                             "},
	{title: "Blue Foundation-Life of a Ghost-Ghost.mp3                                                                  "},
	{title: "Coldplay-Parachutes-Yellow.mp3                                                                             "},
	{title: "David Archuleta-David Archuleta-Touch My Hand.mp3                                                          "},
	{title: "DJ Mickey(张然)-西尔德斯·新世纪...-火烧云.mp3                                                              "},
	{title: "DJ Okawari-Mirror-Luv Letter.mp3                                                                           "},
	{title: "Dolores O'riordan-Are You Listening-Ordinary Day.mp3                                                       "},
	{title: "Eminem  Rihanna-Love The Way You Lie-Love The Way You Lie.mp3                                              "},
	{title: "Eno-Stea.alto-Aalto.mp3                                                                                    "},
	{title: "Epic45-May Your Heart Be...-The Stars In Spring.mp3                                                        "},
	{title: "F.I.R.-F.I.R.-Lydia.mp3                                                                                    "},
	{title: "F.I.R.-无限-千年之恋.mp3                                                                                   "},
	{title: "F.I.R.-无限-应许之地.mp3                                                                                   "},
	{title: "F.I.R.-爱.歌姬-月牙湾.mp3                                                                                  "},
	{title: "God Is An Astronaut-A Moment of Still...-Forever Lost (Reprise).mp3                                        "},
	{title: "God Is An Astronaut-Age of the Fifth Sun-Golden Sky.mp3                                                    "},
	{title: "haruka nakamura  Akira Kosemura-Afterglow-Haze.mp3                                                         "},
	{title: "Helios-Unomia-Clementine.mp3                                                                               "},
	{title: "Helios-Unomia-Velius.mp3                                                                                   "},
	{title: "I Am Robot And Proud-Grace Days-Her Version.mp3                                                            "},
	{title: "James Blunt-1973-1973 (the Remixes) (orginal Radio Edit).mp3                                               "},
	{title: "JS-《仙剑奇侠传》电...-花与剑.mp3                                                                          "},
	{title: "Karunesh-Global Spirit-Solitude.mp3                                                                        "},
	{title: "Kavinsky  Lovefoxxx-Drive-Nightcall.mp3                                                                    "},
	{title: "Kazumasa Hashimoto-Gllia-Drama.mp3                                                                         "},
	{title: "Ke$ha-Animal-TiK ToK.mp3                                                                                   "},
	{title: "Koan-Cierdes In IWD T...-Girl From Heavens.mp3                                                             "},
	{title: "Koan-When Silence Is-Odysseus Under The Old Tree.mp3                                                       "},
	{title: "Koan-When Silence Is-When The Silence Is Speaking (Blue Mix).mp3                                           "},
	{title: "Lights Out Asia-In The Days Of Ju...-Shifting Sands Wreck Ships.mp3                                        "},
	{title: "Lights Out Asia-Tanks and Recogni...-Roy.mp3                                                               "},
	{title: "Limp Bizkit-Greatest Hitz-Behind Blue Eyes.mp3                                                             "},
	{title: "Little West-Into The Little W...-Breeze.mp3                                                                "},
	{title: "Little West-Into The Little W...-Lost In My View.mp3                                                       "},
	{title: "Little West-Into The Little W...-Once.mp3                                                                  "},
	{title: "Ludacris  Justin Bieber-My World 2.0-Baby.mp3                                                              "},
	{title: "Maksim Mrvica-钢琴手马克西姆-Exodus.mp3                                                                    "},
	{title: "Maroon 5-2012 Grammy Nominees-Moves Like Jagger.mp3                                                        "},
	{title: "Mew-Half the World Is...-Comforting Sounds.mp3                                                             "},
	{title: "Miaou-All Around Us-Hopefulness.mp3                                                                        "},
	{title: "No.9-Usual Revolution ...-found it.mp3                                                                     "},
	{title: "No.9-Usual Revolution ...-I hope.mp3                                                                       "},
	{title: "No.9-Usual Revolution ...-meguru.mp3                                                                       "},
	{title: "OneRepublic-Dreaming Out Loud-Won't Stop.mp3                                                               "},
	{title: "OneRepublic-Now That's What I...-Stop And Stare.mp3                                                        "},
	{title: "Pg.Lost-It's  Not Me,  It...-Pascal's Law.mp3                                                              "},
	{title: "Pg.Lost-Yes I Am-Kardusen.mp3                                                                              "},
	{title: "Port Blue-The Airship-Into The Gymnasium.mp3                                                               "},
	{title: "Port Blue-The Airship-Of The Airship Academy.mp3                                                           "},
	{title: "Port Blue-The Airship-Under The Glass Observation Dome.mp3                                                 "},
	{title: "RQTN-Monolithes En Mou...-Remuer Les Pieds Dans L'Eau, Les Yeux Clairs.mp3                                 "},
	{title: "RQTN-RQTN-Hope.mp3                                                                                         "},
	{title: "RQTN-RQTN-Wires.mp3                                                                                        "},
	{title: "S.H.E-2006移动城堡香港...-星光.mp3                                                                         "},
	{title: "S.H.E-2006移动城堡香港...-痛快.mp3                                                                         "},
	{title: "S.H.E-Super Star-Super Star.mp3                                                                            "},
	{title: "S.H.E-Super Star-夏天的微笑.mp3                                                                            "},
	{title: "S.H.E-《爱的地图》新歌+...-我爱你.mp3                                                                      "},
	{title: "S.H.E-不想长大-月桂女神.mp3                                                                                "},
	{title: "S.H.E-奇幻旅程-波斯猫.mp3                                                                                  "},
	{title: "S.H.E-美丽新世界-美丽新世界.mp3                                                                            "},
	{title: "Sleepmakeswaves-In Today Already ...-One Day You Will Teach Me To Let Go Of My Fears.mp3                   "},
	{title: "Snow Patrol-Up to Now-Run.mp3                                                                              "},
	{title: "Suede-Singles-Beautiful Ones.mp3                                                                           "},
	{title: "The American Dollar-The Technicolor S...-Signaling Through The Flames.mp3                                  "},
	{title: "The Guggenheim Grotto-Happy the Man-Fee Da Da Dee.mp3                                                      "},
	{title: "The Police-Crimewatch-Every Breath You Take.mp3                                                            "},
	{title: "The Seven Mile Journey-The Journey Studies-The MurdererVictim Monologues.mp3                               "},
	{title: "The Seven Mile Journey-The Journey Studies-Through the Alter Ego Justifications.mp3                        "},
	{title: "Thirteen Senses-Falls In The Dark-The Salt Wound Routine.mp3                                               "},
	{title: "Thirteen Senses-The Invitation-Into The Fire.mp3                                                           "},
	{title: "This Will Destroy You-This Will Destroy...-They Move on Tracks of Never-Ending Light.mp3                   "},
	{title: "This Will Destroy You-Young Mountain-I Believe In Your Victory.mp3                                         "},
	{title: "This Will Destroy You-Young Mountain-Quiet.mp3                                                             "},
	{title: "Time in muscat-Names-Isadora (序).mp3                                                                      "},
	{title: "Vega4-You and Others-Life Is Beautiful.mp3                                                                 "},
	{title: "与非门-11-我睡在你眼睛的沙漠里.mp3                                                                         "},
	{title: "与非门-11-风起云涌.mp3                                                                                     "},
	{title: "与非门-与非门-Happy New Year.mp3                                                                           "},
	{title: "与非门-与非门-梦蝶男生版.mp3                                                                               "},
	{title: "丢火车-火车日记-角落.mp3                                                                                   "},
	{title: "中国歌剧舞剧院交响乐团-天浴 中国歌剧舞剧...-大话西游.mp3                                                   "},
	{title: "五月天-後。青春期的詩-你不是真正的快乐.mp3                                                                 "},
	{title: "五月天-盛夏光年 电影主题...-盛夏光年.mp3                                                                   "},
	{title: "任贤齐-為愛走天涯-呢喃.mp3                                                                                 "},
	{title: "任贤齐-為愛走天涯-沧海一声笑.mp3                                                                           "},
	{title: "伍佰-一起飛-白鸽.mp3                                                                                       "},
	{title: "元卫觉醒-幸福下载-夏天的風.mp3                                                                             "},
	{title: "刘若英-Love And The City-一辈子的孤单.mp3                                                                  "},
	{title: "刘若英-Love And The City-当爱在靠近.mp3                                                                    "},
	{title: "刘若英-我的失败与伟大-蝴蝶.mp3                                                                             "},
	{title: "南拳妈妈-调色盘-悄悄告诉他.mp3                                                                             "},
	{title: "卡奇社-卡奇社-坏唇味(remix).mp3                                                                            "},
	{title: "卡奇社-卡奇社-蜚(demo).mp3                                                                                 "},
	{title: "卢冠廷-大话西游-一生所爱.mp3                                                                               "},
	{title: "叶倩文-最动听的...叶倩文-潇洒走一回.mp3                                                                    "},
	{title: "叶倩文-真心真意过一生-真心真意过一生(快乐随风版).mp3                                                       "},
	{title: "叶倩文-真心真意过一生-真心真意过一生(潇洒自在版).mp3                                                       "},
	{title: "叶蓓-双鱼-彩虹.mp3                                                                                         "},
	{title: "叶蓓-双鱼-蓝色.mp3                                                                                         "},
	{title: "叶蓓-我要的自由-花儿.mp3                                                                                   "},
	{title: "叶蓓-纯真年代-B小调雨后.mp3                                                                                "},
	{title: "叶蓓-纯真年代-在劫难逃.mp3                                                                                 "},
	{title: "吉田潔-日本人はるかな旅-懐かしい人々.mp3                                                                   "},
	{title: "吉田潔-祭-龙虎合体舞.mp3                                                                                   "},
	{title: "周子雷-千年风雅-千年风雅.mp3                                                                               "},
	{title: "周笔畅-周游拾光 周笔畅音...-鱼罐头.mp3                                                                     "},
	{title: "周笔畅-时间-醒着梦游.mp3                                                                                   "},
	{title: "大乔小乔-渔樵问答-波涛.mp3                                                                                 "},
	{title: "姜昕-五月-有的时候.mp3                                                                                     "},
	{title: "姜昕-姜昕-温暖的房间.mp3                                                                                   "},
	{title: "姜昕-我不是随便的花朵-你知道我才知道.mp3                                                                   "},
	{title: "姜昕-我不是随便的花朵-彩虹 2006.mp3                                                                        "},
	{title: "姜昕-我不是随便的花朵-情绪.mp3                                                                             "},
	{title: "姜昕-我不是随便的花朵-我不是随便的花朵.mp3                                                                 "},
	{title: "姜昕-我不是随便的花朵-摇摇晃晃.mp3                                                                         "},
	{title: "姜昕-我不是随便的花朵-爱琴海.mp3                                                                           "},
	{title: "孙俪-爱如空气-爱如空气.mp3                                                                                 "},
	{title: "孙楠  那英-孙楠-楠得精彩巡回...-只要有你.mp3                                                               "},
	{title: "孙燕姿-完美的一天-完美的一天.mp3                                                                           "},
	{title: "孙燕姿-完美的一天-第一天.mp3                                                                               "},
	{title: "孟庭苇-红花-羞答答的玫瑰静敲敲地开 (2005新.mp3                                                             "},
	{title: "孟庭苇-谁的眼泪在飞-谁的眼泪在飞.mp3                                                                       "},
	{title: "小娟&山谷里的居民-台北到淡水-乡间小路.mp3                                                                  "},
	{title: "崔弦亮-西尔德斯·新世纪...-闲情·荡舟.mp3                                                                    "},
	{title: "左宏元  张慧清-新白娘子传奇-渡情.mp3                                                                       "},
	{title: "张宇-用心良苦-用心良苦.mp3                                                                                 "},
	{title: "张惠妹-姊妹-姐妹.mp3                                                                                       "},
	{title: "张震岳-我是海雅谷慕-先这样吧.mp3                                                                           "},
	{title: "张震岳-秘密基地-爱不要停摆.mp3                                                                             "},
	{title: "张震岳-这个下午很无聊-秘密.mp3                                                                             "},
	{title: "张震岳-阿岳正传-不要说爱我.mp3                                                                             "},
	{title: "张震岳-阿岳正传-我给的爱.mp3                                                                               "},
	{title: "张韶涵-百变张韶涵世界巡...-梦里花 (Live).mp3                                                               "},
	{title: "张韶涵-飞越彩虹-寓言.mp3                                                                                   "},
	{title: "彭坦-Easy-风儿.mp3                                                                                         "},
	{title: "彭坦-少年故事-Game Over.mp3                                                                                "},
	{title: "彭坦-少年故事-风儿带着我们飘.mp3                                                                           "},
	{title: "彭坦-迁徙-墨荭潮.mp3                                                                                       "},
	{title: "彭坦-迁徙-慢慢的.mp3                                                                                       "},
	{title: "徐怀钰-Love-分飞.mp3                                                                                       "},
	{title: "徐怀钰-滚石香港黄金十年-...-我是女生.mp3                                                                   "},
	{title: "戴佩妮-iPenny-一个人的行李.mp3                                                                             "},
	{title: "拜金小姐-The Good The Bad ...-蝶恋花.mp3                                                                   "},
	{title: "拜金小姐-拜金小姐-小鸟探戈.mp3                                                                             "},
	{title: "拜金小姐-拜金小姐第二弹-青春骊歌.mp3                                                                       "},
	{title: "明萌派-Simple Band-茶汤.mp3                                                                                "},
	{title: "曲婉婷-春娇与志明-Drenched.mp3                                                                             "},
	{title: "曹方-住在春天-住在春天.mp3                                                                                 "},
	{title: "曹方-浅彩虹-蜜糖果树.mp3                                                                                   "},
	{title: "木箱-へいわのうた-メスメル.mp3                                                                             "},
	{title: "朴树-Hey，我在-Hey,我在.mp3                                                                                "},
	{title: "朴树-我去2000年-那些花儿 (吉他版).mp3                                                                      "},
	{title: "朴树-生如夏花-Colorful Days.mp3                                                                            "},
	{title: "朴树-生如夏花-今夜的滋味.mp3                                                                               "},
	{title: "朴树-生如夏花-生如夏花.mp3                                                                                 "},
	{title: "李健-为你而来-为你而来.mp3                                                                                 "},
	{title: "李健-为你而来-向往.mp3                                                                                     "},
	{title: "李健-似水流年-什刹海.mp3                                                                                   "},
	{title: "李健-似水流年-绽放.mp3                                                                                     "},
	{title: "李健-想念你-天狐.mp3                                                                                       "},
	{title: "李健-遥远的天空底下……-溺爱.mp3                                                                             "},
	{title: "李志辉-我们远去的家园-阳朔美景画中游.mp3                                                                   "},
	{title: "李志辉-我们远去的家园-青瓦白墙恋徽州.mp3                                                                   "},
	{title: "李志辉-我们远去的家园Ⅱ-The Dream of Chibi Startles St.mp3                                                 "},
	{title: "李翊君-李翊君：七情六欲-雨蝶.mp3                                                                           "},
	{title: "林宥嘉-大小說家-傻子.mp3                                                                                   "},
	{title: "梵天-凱風-热风.mp3                                                                                         "},
	{title: "梵天-凱風-龙奔流.mp3                                                                                       "},
	{title: "江美琪-又寂寞又美丽(新歌...-亲爱的你怎么不在我身边.mp3                                                     "},
	{title: "江美琪-想起-想起.mp3                                                                                       "},
	{title: "江美琪-美乐地-静止.mp3                                                                                     "},
	{title: "汪峰-Live In Beijing ...-绽放.mp3                                                                          "},
	{title: "爱乐团-天涯-天涯.mp3                                                                                       "},
	{title: "王力宏  Selina-改变自己-你是我心内的一首歌.mp3                                                             "},
	{title: "王力宏-公转自转-爱你等于爱自己.mp3                                                                         "},
	{title: "王心凌-Cyndi With U-睫毛弯弯.mp3                                                                           "},
	{title: "王月明-西尔德斯·新世纪...-青海青.mp3                                                                       "},
	{title: "王杰-是否我真的一无所有-是否我真的一无所有.mp3                                                             "},
	{title: "王梵瑞  王梵瑞-等候-一切从这儿开始.mp3                                                                     "},
	{title: "王梵瑞-时光谣-时光谣.mp3                                                                                   "},
	{title: "王梵瑞-等候-如果冬天…告别(bonus track).mp3                                                                 "},
	{title: "王梵瑞-等候-我是绽放的花.mp3                                                                               "},
	{title: "王梵瑞-等候-笑容.mp3                                                                                       "},
	{title: "王梵瑞-青春-海.mp3                                                                                         "},
	{title: "王梵瑞-青春-这座城市.mp3                                                                                   "},
	{title: "王梵瑞-青春-青春.mp3                                                                                       "},
	{title: "王菲-浮躁-野三坡.mp3                                                                                       "},
	{title: "王蓉-多爱-爸爸妈妈.mp3                                                                                     "},
	{title: "瞿颖-+速度-加速度.mp3                                                                                      "},
	{title: "窦唯-希望之光　精選輯-Don't Break My Heart.mp3                                                             "},
	{title: "童安格-童周共聚-其实你不懂我的心.mp3                                                                       "},
	{title: "简婕、简廷芮-蜂蜜幸运草 电视原...-一起遨游（插曲）.mp3                                                     "},
	{title: "纵贯线-北上列车-纵贯线兄弟姐妹.mp3                                                                         "},
	{title: "罗大佑-爱人同志-恋曲1990.mp3                                                                               "},
	{title: "羽·泉-雕刻时光 中国歌曲...-深呼吸.mp3                                                                      "},
	{title: "老狼-北京的冬天-有多远就走多远.mp3                                                                         "},
	{title: "老狼-晴朗-晴朗.mp3                                                                                         "},
	{title: "老狼-晴朗-歌.mp3                                                                                           "},
	{title: "胡彦斌-MuSiC 混合体-红颜.mp3                                                                               "},
	{title: "胡畔-胡畔麦子-春天.mp3                                                                                     "},
	{title: "自然卷-大卷包小卷-Ich Liebe Dich.mp3                                                                       "},
	{title: "自然卷-大卷包小卷-鱼罐头.mp3                                                                               "},
	{title: "花儿乐队-幸福的旁边-静止.mp3                                                                               "},
	{title: "苏慧伦-鸭子-鸭子.mp3                                                                                       "},
	{title: "苏打绿-小宇宙-小宇宙.mp3                                                                                   "},
	{title: "苏打绿-無與倫比的美麗-无与伦比的美丽.mp3                                                                   "},
	{title: "苏打绿-迟到千年-迟到千年.mp3                                                                               "},
	{title: "苏打绿-陪我歌唱-频率.mp3                                                                                   "},
	{title: "范玮琪-真善美-那些花儿.mp3                                                                                 "},
	{title: "萤火虫-風和，日麗-秘密花园.mp3                                                                             "},
	{title: "董贞-贞江湖-剑如虹.mp3                                                                                     "},
	{title: "董贞-贞江湖-墨魂.mp3                                                                                       "},
	{title: "董贞-返璞归贞-回到起点.mp3                                                                                 "},
	{title: "董贞-返璞归贞-情醉.mp3                                                                                     "},
	{title: "董贞-返璞归贞-追梦人.mp3                                                                                   "},
	{title: "蔡依林-特务J-特务 J.mp3                                                                                    "},
	{title: "蔡健雅  张震岳-思念是一种病-思念是一种病.mp3                                                               "},
	{title: "蔡健雅-若你碰到他-红色高跟鞋.mp3                                                                           "},
	{title: "蔡健雅-若你碰到他-谁.mp3                                                                                   "},
	{title: "蔡淳佳-时间的礼盒 新歌+...-依恋.mp3                                                                        "},
	{title: "许巍-每一刻都是崭新的-坐看云起.mp3                                                                         "},
	{title: "许巍-每一刻都是崭新的-小鱼的理想.mp3                                                                       "},
	{title: "许巍-留声十年 绝版青春...-星空.mp3                                                                         "},
	{title: "许茹芸-如果云知道-如果云知道.mp3                                                                           "},
	{title: "许茹芸-如果云知道-独角戏.mp3                                                                               "},
	{title: "谢霆锋-Reborn演唱会-只要为你活一天 (Live).mp3                                                              "},
	{title: "谭盾-Hero-For The World - Theme Music.mp3                                                                  "},
	{title: "超载乐队-魔幻藍天-不要告别.mp3                                                                             "},
	{title: "超载乐队-魔幻藍天-如果我现在.mp3                                                                           "},
	{title: "达达乐队-黄金时代-Song F.mp3                                                                               "},
	{title: "邵容-兰-传奇 One More Tale.mp3                                                                             "},
	{title: "郝蕾-恋爱的犀牛-氧气-明明之歌.mp3                                                                          "},
	{title: "铁竹堂-《惡作劇之吻》電...-能不能.mp3                                                                      "},
	{title: "闫月-月-敦煌.mp3                                                                                           "},
	{title: "陈勋奇-东邪西毒-幻影交叠.mp3                                                                               "},
	{title: "陈勋奇-东邪西毒-昔情难追.mp3                                                                               "},
	{title: "陈奕迅-special thanks to-你的背包.mp3                                                                      "},
	{title: "陈奕迅-认了吧-爱是一本书.mp3                                                                               "},
	{title: "陈志远-天一生水-怅惘.mp3                                                                                   "},
	{title: "陈绮贞-半成年主张-雨天的尾巴(沪尾小情歌).mp3                                                               "},
	{title: "陶喆-黑色柳丁-蝴蝶.mp3                                                                                     "},
	{title: "面孔乐队-火的本能-梦.mp3                                                                                   "},
	{title: "高胜美-经典金选2-青青河边草.mp3                                                                            "},
	{title: "魏如萱-甜蜜生活-一起去旅行.mp3                                                                             "},
	{title: "黄品源-海浪-海浪.mp3                                                                                       "},
	{title: "黄永灿-如诗般 宁静-光影之歌.mp3                                                                            "},
	{title: "黄永灿-如诗般 宁静-如诗般 宁静 (钢琴弦乐版).mp3                                                            "},
	{title: "龙宽-乐活女王-乐活女王.mp3                                                                                 "},
	{title: "龙宽-龙宽EP-这里怎么有这么多奇怪的人.mp3                                                                   "},
	{title: "龙宽九段-我听这种音乐的时...-夜里.mp3                                                                      "},
	{title: "龙宽九段-我听这种音乐的时...-洗衣机.mp3                                                                    "}
);
