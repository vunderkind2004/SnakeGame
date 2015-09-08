//****************************************************************************************************************************
//      ***********************************     SET BTN      **************************************************
//****************************************************************************************************************************

//var x0 = 0;
//var y0 = 0;
var startF =  "#StartField";
var gameCont = "#gameContainer";
function OnLoadStart()
{
    setMenuButtonHover2("SnakeStart2");
    $("#needJS").hide();
    $(gameCont).hide();
    setPoint();
     //setBtnPosition();
     setMainMenu();
}
function setMainMenu()
{
      clearBox();
      setStartBtns();
      setBtnPosition();
}
function setPoint()
{
  x0 = $(startF).position().left;
  y0 = $(startF).position().top;
}
function clearBox()
{
     $(startF+">*").remove();
}

function setStartBtns()
{
    var str = '<img id="start_page" src="img/Star_Page.png" />';
        str+='<div class="Btn1" onclick="goToMode(1)">';
        str+='<img src="img/Play_game.png" /></div> ';
        str+='<div class="Btn2" onclick="goToMode(2)"><img src="img/How_to_play.png" /></div>';
        str+='<div class="Btn3" onclick="goToMode(3)"><img src="img/About_game.png" /></div>';
   $(startF).append(str);

}
function setBtnPosition()
{

    for (var i =1; i<=3;i++)
    {
      var c =  ".Btn" + i;
      var x = $(c).position().left;
      var y = $(c).position().top;
        $(c).css('left',x+x0);
        $(c).css('top',y+y0);
    }
}
function howToPlaySW()
{

}
 function goToMode(modeN)
 {
   //alert("test");
   $("#start_page").remove() ;
   $(".Btn1").remove() ;
   $(".Btn2").remove() ;
   $(".Btn3").remove() ;

   var str ="";
   var btn1 ="";
   var btn2 ="";
   var btn3 ="";

   var x1 = 60;     //offset first btn
   var x2 = 360;    //offset second btn
   var x3 = 215;    //offset 3-rd btn

   var y1 = 145;
   var y2 = 348;

   switch(modeN)
   {
     case 1:
        str = "<img id='start_page' src='img/Choose_Mode_1.png' />";
        btn1 = "<div id='goTo1'><img src='img/One_player.png'  /></div>";
        btn2 = "<div id='goTo2'><img src='img/Two_players.png'  /></div>";
        btn3 = "<div id='goToM'><img src='img/Main_page.png'  /></div>";
        $(startF).append(str);
        $(startF).append(btn1);
        $(startF).append(btn2);
        $(startF).append(btn3);
        $("#goTo1").css('left',x0+x1);
        $("#goTo1").css('top',y0+y1);
        $("#goTo1").click(function(){
          //window.location="OneSnake.html";
            loadOneSnake();
        });
        $("#goTo2").css('left',x0+x2);
        $("#goTo2").css('top',y0+y1);
        $("#goTo2").click(function(){
          //window.location="TwoSnakes.html";
            loadTwoSnakes();
        });
        $("#goToM").css('left',x0+x3);
        $("#goToM").css('top',y0+y2);
        $("#goToM").click(function(){
            setMainMenu();
        });
        break;
     case 2:
        str = "<img id='start_page' src='img/How_To_Play_Main.png' />";
        btn3 = "<div id='goToM'><img src='img/Main_page.png'  /></div>";
        //btn3 = "<div id='goToM'></div>";
        $(startF).append(str);
        $(startF).append(btn3);
        $("#goToM").css('left',x0+x3);
        $("#goToM").css('top',y0+y2);
        $("#goToM").click(function(){
            setMainMenu();
        });
        break;
     case 3:
        //str = "<img id='start_page' src='img/How_To_Play_Main.png' />";
        str = "<div> Something about game .....<br/> <br/> Sorry, this part is under construction... </div>";
        btn3 = "<div id='goToM'><img src='img/Main_page.png'  /></div>";
        $(startF).append(str);
        $(startF).append(btn3);
        $("#goToM").css('left',x0+x3);
        $("#goToM").css('top',y0+y2);
        $("#goToM").click(function(){
            setMainMenu();
        });
        break;
     default:
        break;
   }
 }
 function addGameField()
 {
   $(startF).hide();
    var str='';
    str+= '<div id="field">';
    str+='<div id="gameOver"><img src="img/Game_Over.png" /></div>';
    str+='<div id="levelUp"><img src="img/Level_Up.png" /></div>';
    //str+='<div id="score">Score: 0</div>';
    if(snake2)
    {
        str+='<div id="snake2_0" class="element2"></div>';
    }
    str+= '<div id="snake1_0" class="element"></div>';
    //for stone:
    str+= '<div id="stone0" class="stone"></div>';
    //for life:
    str+= '<div id="snake1_life_0" class="life1"></div>';
    str+= '<div id="snake2_life_0" class="life2"></div>';
    str+= '<div id="end"><div id="apple"></div></div></div>';
    str+= '<div id="controls">';
    str+= '<input id="startBt" type="button" value="Start" onclick="StartReset()"/>';
    str+= '<input id="pauseBt" type="button" value="Pause" disabled="disabled" onclick="pause()"/>';
    str+='<span id="score">Score: 0</span>';
    str+= '</div>';
    //str+='<div id="score">Score: 0</div>';
    $(gameCont).append(str);
    $(gameCont).show();
 }
 function loadGame()
 {
    clearBox();
    addGameField();
    onLoad();
 }
 function loadOneSnake()
 {
       snake2 = false;
       loadGame();
 }
function loadTwoSnakes()
 {
       snake2 = new Snake("snake2_");
       //snake2.life.ID = life2_id
       loadGame();
 }