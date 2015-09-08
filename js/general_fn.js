//****************************************************************************************************************************
//      ***********************************         GENERAL fn       **************************************************
//****************************************************************************************************************************
function onLoad()
{
    //вкл. обработчик событий нажатия клавы
    //$("#needJS").hide();
    $("#startBt").focus();
    $("#textBox").focus();
    $("body").click(function (){$("#textBox").focus();});
    $("body").keydown(function(event){
        //$('p').text('Character typed is: '+event.keyCode);
        keyDownHandler(event.keyCode);
        $("#textBox").val("");
        });
    initComponent(snake1,field1,apple1);
    if (snake2)
    {
      initComponent2(snake2);
    }
    //init stone
    initComponentStone(stone1);
    initComponentLife();
    gameOverHide();
    levelUpHide();
    startGame();
}
function initComponent(Sn,Fld,apl)
{
    var elem0_id ="#"+ Sn.elements[0].ID;
    var appleID ="#"+ apl.ID;
    var fieldID ="#"+ Fld.ID;
    $(elem0_id).innerWidth(dx);
    $(elem0_id).innerHeight(dy);
    $(elem0_id).width(dx-ElementSpace);
    $(elem0_id).height(dy-ElementSpace);
    $(appleID).innerWidth(dx);
    $(appleID).innerHeight(dy);
    $(appleID).width(dx-ElementSpace);
    $(appleID).height(dy-ElementSpace);
    $(fieldID).width(FieldWidth +1);//+ 2*ElementSpace);
    $(fieldID).height(FieldHeight+1);// + 2*ElementSpace);
}
function initComponent2(Sn)
{
    var elem0_id ="#"+ Sn.elements[0].ID;
    $(elem0_id).innerWidth(dx);
    $(elem0_id).innerHeight(dy);
    $(elem0_id).width(dx-ElementSpace);
    $(elem0_id).height(dy-ElementSpace);
}
function initComponentStone(St)
{
	var elem0_id ="#"+ St.elements[0].ID;
    $(elem0_id).innerWidth(dx);
    $(elem0_id).innerHeight(dy);
    $(elem0_id).width(dx-ElementSpace);
    $(elem0_id).height(dy-ElementSpace);
	if (St.enable)
    {
	    $(elem0_id).show();
	}
	else
	{
		$(elem0_id).hide();
	}
}
function initComponentLife()
{
    snake1.ResetLife();
    if (snake2)
    {
        snake2.lifes[0].position.x = 500;
        snake2.ResetLife();    
    }
}
function gameOverHide()
{
    $("#gameOver").hide();
}
function gameOverShow()
{
    $("#gameOver").show();
    //$("#gameOverOk").focus();
    $("#startBt").focus();
    $("#pauseBt").attr("disabled", "disabled");
    pauseEnable=false;
}

function levelUpShow(dur)
{
    $("#levelUp").show(dur);
}
function levelUpHide(dur)
{
    $("#levelUp").hide(dur);
}
function startGame()
{
    var fieldID ="#"+ field1.ID;
    $(fieldID).css('left',0);
    $(fieldID).css('top',0);
    //запомнить начало координат для field
    X0=$(fieldID).position().left +1;// + ElementSpace;
    Y0=$(fieldID).position().top +1;//+ ElementSpace;

    snake1.MoveTo(field1.width,snake1.elements[0].position.y);
    snake1.LifePosition(field1.width);
    if(!start)
    {   //добавить элементов к змейке со сдвигом
        for(var i=1;i<=3;i++)
        {
            snake1.addElement();
            if (snake2)
            {
                snake2.addElement();
                //console.log("add element");
            }
        }
    }
    snake1.Refresh(X0,Y0);
    if (snake2)
    {
      snake2.Refresh(X0,Y0);
      //randomAppleCorrect(snake2);
    }
    randomStone();
    stone1.Refresh(X0,Y0);
    //randomAppleCorrect();
    randomAppleCorrect();
    apple1.Refresh();
    setTimeStep();
    csoreUpdate();
}
function randomStone()
{
	var w = field1.width;
    	var h = field1.height;
	stone1.Random(w,h);
}
function addStone()
{
	stone1.addElement();
	randomStone();
    stone1.Refresh(X0,Y0);
}
function randomAppleCorrect()
{
    var w = field1.width;
    var h = field1.height;
    apple1.Random(w,h);
    if (snake2)
    {
	    while (snake1.isContainPoint(apple1.x,apple1.y)||(snake2.isContainPoint(apple1.x,apple1.y) && snake2)||(stone1.enable && stone1.isContainPoint(apple1.x,apple1.y)))
	    {
	        apple1.Random(w,h);
	    }
    	
    }
    else
    {
		while (snake1.isContainPoint(apple1.x,apple1.y)||(stone1.enable && stone1.isContainPoint(apple1.x,apple1.y)))
	    {
	        apple1.Random(w,h);
	    }
    }

}

function setTimeStep()
{
    timeStep = minTimeStep + (maxSpeed-speed)*(maxTimeStep-minTimeStep)/maxSpeed;
    //$("#speedValue").text("Скорость"+speed);
}
function timedCount()
{
    t=setTimeout("timedCount()",timeStep);
    cycle();
}
function isSnakeOut(Sn,F)
{
    var x00 = F.position.x;
    var y00 = F.position.y;
    var xx = F.width + x00;
    var yy = F.height + y00;
    return Sn.IsOut(x00,y00,xx,yy);
}
function teleport(Sn,F)
{
    var x00 = F.position.x;
    var y00 = F.position.y;
    var xx = F.width + x00;
    var yy = F.height + y00;
    var x1 = Sn.elements[0].position.x;
    var y1 = Sn.elements[0].position.y;
    switch(x1)
    {
    case x00-dx:
        Sn.elements[0].position.x = xx;
        break;
    case xx+dx:
        Sn.elements[0].position.x = x00;
        break;
    default:
        break;
    }
    switch (y1)
    {
    case y00-dy:
        Sn.elements[0].position.y = yy;
        break;
    case yy+dy:
        Sn.elements[0].position.y = y00;
        break;
    default:
        break;
    }
}
function PunishSnake(Sn,F)
{
    var x00 = F.position.x;
    var y00 = F.position.y;
    var xx = F.width + x00;
    var yy = F.height + y00;
    var x1 = Sn.elements[0].position.x;
    var y1 = Sn.elements[0].position.y;
    var x = x1;
    var y = y1;
    if(x1<x00)
    {
        x=xx;
    }
    if(x1>xx)
    {
        x=x00;
    }
    if(y1<y00)
    {
        y = yy;
    }
    if(y1>yy)
    {
        y = y00;
    }
    Sn.Punish(F,x,y);
}
function doTimer()
 {
 if (!timer_is_on)
   {
   timer_is_on=1;
   timedCount();
   }
 }

function stopCount()
 {
 clearTimeout(t);
 timer_is_on=0;
 }
//**************************         RESET          ************************************************************
function Reset()
{
    GameOver(false);
    //stopCount();
    score=0;
    speed =Start_speed;
    csoreUpdate();
    timer_is_on=0;
    start = false;
    snake1.FullReset();
    if (snake2)
    {
        snake2.FullReset();
    }  
    initComponentLife();  
    startGame();
    
}
function GameOver(needShow)
{
    stopCount();
	SetDefaultConfig();	
	stone1.Reset();
	initComponentStone(stone1);	
	if(needShow)
	{
	    gameOverShow();
	}
}
//**************************************************************************************
function keyDownHandler(code)
{
    var currentMoveDirection = snake1.currentMoveDirrection;
    var currentMoveDirection2 = "down";
    if (snake2)
    {
         currentMoveDirection2 = snake2.currentMoveDirrection;      //for snake 2
    }
    else
    {
        currentMoveDirection2 =  currentMoveDirection;
    }
    var NewCurrentMoveDirection2 = "down";
    var NewCurrentMoveDirection = "down";
    var isChanged = false;
    var isChanged2 = false;
    //if (start)
    if(timer_is_on==1)
    {
        switch(code)
        {
        case 65:
            if(currentMoveDirection2!="right")
                {
                    NewCurrentMoveDirection2="left";
                    isChanged2 = true;
                }
            break;
        case 37:
            if(currentMoveDirection!="right")
                {
                    NewCurrentMoveDirection="left";
                    isChanged = true;
                }
            break;
        case 87:
            if(currentMoveDirection2!="down")
                {
                    NewCurrentMoveDirection2="up";
                    isChanged2 = true;
                }
            break;
        case 38:
            if(currentMoveDirection!="down")
                {
                    NewCurrentMoveDirection="up";
                    isChanged = true;
                }
            break;
        case 68:
            if(currentMoveDirection2!="left")
                {
                    NewCurrentMoveDirection2="right";
                    isChanged2 = true;
                }
            break;
        case 39:
            if(currentMoveDirection!="left")
                {
                    NewCurrentMoveDirection="right";
                    isChanged = true;
                }
            break;
        case 83:
            if(currentMoveDirection2!="up")
                {
                    NewCurrentMoveDirection2="down";
                    isChanged2 = true;
                }
            break;
        case 40:
            if(currentMoveDirection!="up")
                {
                    NewCurrentMoveDirection="down";
                    isChanged = true;
                }
            break;
//        case 27:
//            if(pauseEnable)
//            {
//                pause();
//            }
//            break;

        default:
            break;
        }
    }
    switch(code)
    {
        case 13://ENTER
        //case 46: //DEL
            {
                StartReset();
            }
            break;
        case 27:
            if(pauseEnable)
            {
                pause();
            }
            break;
        default:
            break;
    }


    if(isChanged)
    {
        var Sn = snake1;
        var pn = Sn.punish_n;
        var pnd = Sn.punished[pn];
        var n = Sn.elements.length;

        if ((pn==0) || (pnd > n ))
        {
            Sn.newMoveDirrection = NewCurrentMoveDirection;
        }
    }
    if(isChanged2)
    {
        var Sn = snake1;
        if (snake2)
        {
            var Sn = snake2;
        }
        var pn = Sn.punish_n;
        var pnd = Sn.punished[pn];
        var n = Sn.elements.length;

        if ((pn==0) || (pnd > n ))
        {
            Sn.newMoveDirrection = NewCurrentMoveDirection2;
        }
    }
}
function addSpeed()
{
    if(speed != maxSpeed)
        {
            speed++;
            setTimeStep();
            $("#subSpeed").removeAttr("disabled");
        }
    else
    {
        $("#addSpeed").attr("disabled", "disabled");
    }

}
function subSpeed()
{
    if(speed != minSpeed)
    {
        speed--;
        setTimeStep();
        $("#addSpeed").removeAttr("disabled");
    }
    else
    {
        $("#subSpeed").attr("disabled", "disabled");
    }
}
function csoreUpdate()
{
    var txt1 =  "Score ";
    if (snake2)
    {
         txt1= txt1 + snake2.score +" : " + snake1.score
    }
    else
    {
         txt1= txt1 + snake1.score
    }
    txt1 += "; Level " + level;
    $("#score").text(txt1);
}
function StartReset()
{
    gameOverHide();
    if(!start)
    {
        start=true;
        $("#startBt").attr("value", "Reset");
        $("#pauseBt").attr("value", "Pause");
        $("#pauseBt").removeAttr("disabled");
        pauseEnable=true;
        startGame();
        doTimer();

    }
    else
    {
        $("#startBt").attr("value", "Start");
        $("#pauseBt").attr("value", "Pause");
        $("#pauseBt").attr("disabled", "disabled");
        pauseEnable=false;
        Reset();
    }
}
function pause()
{
    if(timer_is_on==1)
    {
        stopCount();
        $("#pauseBt").attr("value", "Continue");
    }
    else
    {
        if(start)
        {
            $("#pauseBt").attr("value", "Pause");
            doTimer();
        }
    }
}
function levelUpDo()
{
	stopCount();
	csoreUpdate();
	timer_is_on=0;
	start = false;
	snake1.levelUp();
	if (snake2)
	{
	snake2.levelUp();
	}
	startGame();
	levelUpShow( );		
	setTimeout(function() {levelUpHide();doTimer();start=true;},1000);       			
}
function lifeDownDo()
{
	snake1.LifeDownReset();
	if (snake2)
	{
		snake2.LifeDownReset();	
	}		
	timer_is_on=0;
	start = false;
	startGame();
	setTimeout(function() {doTimer();start=true;pauseEnable=true;},1000);       			
}