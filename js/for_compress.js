//****************************************************************************************************************************
//      ***********************************         CLASSES           **************************************************
//****************************************************************************************************************************
var dx = 20;
var dy = 20;
var y_upper=-20;
//******************* some help classes for snake **************************************************************************************
function point(x0,y0){
    this.x = x0;
    this.y = y0;
}

function element(x0,y0){
    this.position = {x:x0,y:y0};
    this.classN = "element";
}
function life(x0,y0){
    this.position = {x:x0,y:y0};
    this.ID ="";
}

//******************* SNAKE class **************************************************************************************
function Snake(name0){
    this.score = 0;
    this.savedScore = 0;
    this.elements = [];
    this.elements[0] = new element(0,0);
    this.elements[0].ID =name0 + "0";
    this.elements[0].visible = true;
    this.timeStep = 300;
    this.Name = name0;
    this.currentMoveDirrection = "down";
    this.newMoveDirrection = "down";
    this.punished = [];
    this.punish_n = 0;
    this.lifeCount = 5;
    this.lifes=[];
    this.lifes[0] = new life(0,y_upper);
    this.lifes[0].ID = name0 + "life_0";
    this.alive = true;
}
Snake.prototype.hide =function()
{
	$(("#"+this.elements[0].ID) ).hide();
	//$(("#"+this.elements[0].ID) ).animate({opacity:'0.5'},100);	
};
Snake.prototype.show =function()
{
	$(("#"+this.elements[0].ID) ).show();
	//$(("#"+this.elements[0].ID) ).animate({opacity:'1'},100);	
};
Snake.prototype.attention = function(Sn)
{
	//stopcount();
	var n_show = 3;
	var timer2 = 500; //ms
	var ready = false;
	for(j=1;j<=n_show;j++)
	{
		setTimeout(function() {Sn.hide();},(j-1)*timer2);
		setTimeout(function() {Sn.show();},j*timer2 - timer2/2);
	}
	setTimeout(function() {Sn.LifeDown();},n_show*timer2);
	//Sn.LifeDown();
};
Snake.prototype.LifePosition = function(x)
{
	var n = this.lifes.length;
	if (n>0)
	{
		for (i=0;i<=n-1;i++)
		{
			this.lifes[i].position.x = x - dx * i;
		}
	}
};
Snake.prototype.Set_new_out = function()
{
      if (this.out1 && (!this.out2))
      {
        this.new_out = true;
      }
      else
      {
        this.new_out = false;
      }
};
Snake.prototype.Reset = function()
{
    var n = this.elements.length;
    for (var i = 1; i<n;i++)
    {
        var i_id ="#"+ this.elements[i].ID;
        $(i_id).remove();
    }
    this.elements = [];
    this.elements[0] = new element(0,0);
    this.elements[0].ID =this.Name + "0";
    this.elements[0].visible = true;
    this.currentMoveDirrection = "down";
    this.newMoveDirrection = "down";
    this.score = 0;    
};
Snake.prototype.FullReset = function()
{
    var n = this.elements.length;
    for (var i = 1; i<n;i++)
    {
        var i_id ="#"+ this.elements[i].ID;
        $(i_id).remove();
    }
    this.elements = [];
    this.elements[0] = new element(0,0);
    this.elements[0].ID =this.Name + "0";
    this.elements[0].visible = true;
    this.currentMoveDirrection = "down";
    this.newMoveDirrection = "down";
    this.score = 0;
    this.savedScore = 0;
    this.punished = [];
    this.punish_n = 0;
    this.lifeCount = 5;
    this.alive = true;
    this.ResetLife();
        
};
Snake.prototype.levelUp = function()
{
    var n = this.elements.length;
    for (var i = 1; i<n;i++)
    {
        var i_id ="#"+ this.elements[i].ID;
        $(i_id).remove();
    }
    this.elements = [];
    this.elements[0] = new element(0,0);
    this.elements[0].ID =this.Name + "0";
    this.elements[0].visible = true;
    this.currentMoveDirrection = "down";
    this.newMoveDirrection = "down";
    this.savedScore = this.score;
};
Snake.prototype.addElement = function () {
    var n =this.elements.length;
    this.elements[n]= new element(this.elements[n-1].position.x,this.elements[n-1].position.y);
    this.elements[n].ID = this.Name + n;
    this.elements[n].visible = false;
    var newElement = $(("#"+this.elements[0].ID) ).clone();
    newElement.attr("id", this.elements[n].ID);
    newElement.prependTo("#end");
};
Snake.prototype.MoveTo = function (x,y){
    var n =this.elements.length;
    var tmp = new point(x,y);
    if (n>0)
    {
        for(i=n-1;i>0;i--)
        {
            this.elements[i].position.x = this.elements[i-1].position.x;
            this.elements[i].position.y = this.elements[i-1].position.y;
        }
        this.elements[0].position.x = tmp.x;
        this.elements[0].position.y = tmp.y;
    }
    else
    {
        console.log("'MoveTo' error: elements.length=" + n);
    }
};
Snake.prototype.IsOut_i = function(x1,y1,x2,y2,i)
{
        var x = this.elements[i].position.x;
        var y = this.elements[i].position.y;
        if (((x< x1)||(x > x2))||((y < y1)||(y > y2)))
        {
            return true;
        }
        else
        {
            return false;
        }

};
Snake.prototype.Punish = function(F,x,y)
{
    var n =this.elements.length;
    if (n>1)
    {
        var x00 = F.position.x;
        var y00 = F.position.y;
        var xx = F.width + x00;
        var yy = F.height + y00;
        //return Sn.IsOut(x00,y00,xx,yy);
        var out_0 = this.IsOut_i(x00,y00,xx,yy,0);
        var out_1 = this.IsOut_i(x00,y00,xx,yy,1);


        var pn = this.punish_n;
       // console.log(this.punished);
        if (out_0 && !out_1)
        {
            pn ++;
            this.punish_n = pn;
            this.punished[pn] = 1;
            $(("#"+this.elements[0].ID) ).hide();
            this.elements[0].visible = false;
        }
        else
        {
            if((this.punished[pn]<n)&&(this.punished[pn]>0))
            {
                $(("#"+this.elements[this.punished[pn]].ID) ).hide();
                this.elements[this.punished[pn]].visible = false;
                this.punished[pn]++;
            }
            else
            {
                if (this.punished[pn]==0)
                {
                    if (pn>0)
                    {
                        pn --;
                        this.punish_n = pn;
                    }
                }
                else
                {
                    if (this.punished[pn] ==n)
                    {
                        this.MoveTo(x,y);
                    }
                    if(this.punished[pn] < 2*n)
                    {
                        $(("#"+this.elements[this.punished[pn]-n].ID) ).show();
                        this.elements[this.punished[pn]-n].visible = true;
                        this.punished[pn]++;
                    }
                    else
                    {
                        this.punished[pn] = 0;
                    }
                }
            }
        }
        for (var i=n;i>0;i--)
        {
            if (this.elements[i-1].visible)
            {
                if (i<n)
                {
                    this.elements[i].visible = true;
                }
                $(("#"+this.elements[i-1].ID) ).show();
            }
            else
            {
               $(("#"+this.elements[i-1].ID) ).hide();
            }
        }
    }
};

Snake.prototype.Move = function (){
    var tmp = new point(this.elements[0].position.x,this.elements[0].position.y );
    var dir = this.currentMoveDirrection;
    switch (dir)
    {
        case "up":
           tmp.y-=dy;
           break;
        case "down":
           tmp.y+=dy;
           break;
        case "left":
           tmp.x-=dx;
           break;
        case "right":
           tmp.x+=dx;
           break;
        default:
            console.log("move error: uknow dirrection word comand");
            break;
    }
   this.MoveTo(tmp.x,tmp.y);
};
Snake.prototype.UpdateMoveDirr = function ()
{
    this.currentMoveDirrection = this.newMoveDirrection;
    this.Move();
};
Snake.prototype.isContainPoint = function(x,y){
    var n =this.elements.length;
    if (n>0)
    {
        for(i=0;i<n;i++)
        {
           if((this.elements[i].position.x == x) && (this.elements[i].position.y == y))
           {return true;}
        }
    }
    else
    {
        console.log("'isContainPoint' error: elements.length=" + n);
    }
    return false;
};
Snake.prototype.IsEatApple = function(x,y)
{
    var x0=this.elements[0].position.x;
    var y0=this.elements[0].position.y;
    if(x==x0 && y==y0)
    {
        return true;
    }
    else
    {
        return false;
    }
};
Snake.prototype.IsEatSelf = function()
{
    var x_0=this.elements[0].position.x;
    var y_0=this.elements[0].position.y;
    
    var n =this.elements.length;
    if (n>0)
    {
        for(i=1;i<n;i++)
        {
           if((this.elements[i].position.x == x_0) && (this.elements[i].position.y == y_0))
           {return true;}
        }
    }
    else
    {
        console.log("'isContainPoint' error: elements.length=" + n);
    }
    return false;
};
Snake.prototype.Refresh = function(x0,y0)
{
    var n =this.elements.length;
    if (n>0)
    {
        for(i=0;i<n;i++)
        {
            var x=this.elements[i].position.x;
            var y=this.elements[i].position.y;
            $(("#"+this.elements[i].ID) ).css('left',x + x0);
            $(("#"+this.elements[i].ID) ).css('top',y + y0);
        }
        var ln = this.lifes.length;
        for (j=0;j<ln;j++)
        {
            var x=this.lifes[j].position.x;
            var y=this.lifes[j].position.y;
            $(("#"+this.lifes[j].ID) ).css('left',x + x0);
            $(("#"+this.lifes[j].ID) ).css('top',y + y0);
        }
    }
    else
    {
        console.log("'Refresh' error: elements.length=" + n);
    }
};
Snake.prototype.IsOut = function(x1,y1,x2,y2)
{
        var x = this.elements[0].position.x;
        var y = this.elements[0].position.y;
        if (((x< x1)||(x > x2))||((y < y1)||(y > y2)))
        {
            return true;
        }
        else
        {
            return false;
        }

};
Snake.prototype.LifeUp = function()
{
	var n =this.lifes.length;
    this.lifes[n]= new life(this.lifes[n-1].position.x + dx,this.lifes[n-1].position.y);
    this.lifes[n].ID = this.Name + "life_" + n;
    var newElement = $(("#"+this.lifes[0].ID) ).clone();
    newElement.attr("id", this.lifes[n].ID);
    newElement.prependTo("#end");	
};
Snake.prototype.ResetLife = function()
{
    var v = this.lifes.length;
    for (i=1;i<v;i++)
    {
        var i_id ="#"+ this.lifes[i].ID;
        $(i_id).remove();
    }
    this.lifes=[];
    this.lifes[0] = new life(0,y_upper);
    this.lifes[0].ID = this.Name + "life_0";	
    var n = this.lifeCount;
    for (i=1;i<n;i++)
    {
        this.LifeUp();
    }
};
Snake.prototype.LifeDown = function()
{
	//this.attention(this);	
	var v = this.lifes.length;	
	if (v <= 1)
	{
		this.alive = false;
		//return false;
	}
	else
	{
	    var arr = [];
	    for (i=0;i<v-1;i++)
	    {
	        arr[i] = this.lifes[i];
	    }
	    var sc = this.savedScore;
		this.Reset();
		this.score = sc;
		this.savedScore = sc;
		var i_id ="#"+ this.lifes[v-1].ID;
        $(i_id).remove();
        this.lifes = arr;
		//return true;	
	}		
};
Snake.prototype.LifeDownReset = function()
{
    var arr = [];
    arr = this.lifes;
    var sc = this.savedScore;
	this.Reset();
	this.score = sc;
	this.savedScore = sc;
    this.lifes = arr;		
};

//******************* FIELD class **************************************************************************************

function field(id1,r,c){
    this.rows = r;
    this.columns = c;
    this.position = new point(0,0);
    this.width = (this.columns-1) * dx;
    this.height = (this.rows-1) * dy;
    this.ID = id1;
}

//******************* APPLE class **************************************************************************************

function apple(id1){
    this.x = 0;
    this.y = 0;
    this.ID = id1;
}
apple.prototype.Random = function (FieldW,FieldH){
    var ElementW = dx;
    var ElementH = dy;
    var x = Math.random()*(FieldW -ElementW);
    x = dx* Math.round(x/dx);
    var y = Math.random()*(FieldH -ElementH);
    y = dy* Math.round(y/dy);
    this.x = x;
    this.y = y;
};
apple.prototype.Refresh = function ()
{
    var x=this.x;
    var y=this.y;
    $(("#"+this.ID) ).css('left',x + X0);
    $(("#"+this.ID) ).css('top',y + Y0);
};

//******************* STONE class **************************************************************************************

function stone(name0){
    this.enable	= false;
    this.elements = [];
    this.elements[0] = new element(0,0);
    this.elements[0].ID =name0 + "0";
    this.elements[0].visible = true;    
    this.Name = name0;      
}
stone.prototype.addElement = function () {
    var n =this.elements.length;
    this.elements[n]= new element(this.elements[n-1].position.x,this.elements[n-1].position.y);
    this.elements[n].ID = this.Name + n;
    this.elements[n].visible = false;
    var newElement = $(("#"+this.elements[0].ID) ).clone();
    newElement.attr("id", this.elements[n].ID);
    newElement.prependTo("#end");
};

stone.prototype.Reset = function()
{
    var n = this.elements.length;
    //delete all exept [0]
    for (var i = 1; i<n;i++)
    {
        var i_id ="#"+ this.elements[i].ID;
        $(i_id).remove();
    }    
    this.enable	= false;
};

stone.prototype.Random = function (FieldW,FieldH){
    var ElementW = dx;
    var ElementH = dy;
    var n =this.elements.length;
    if (n>0)
    {
        for(i=0;i<n;i++)
        {
		var x = Math.random()*(FieldW - 2 * ElementW);
		x = dx* Math.round(x/dx) + dx;
		var y = Math.random()*(FieldH - 2 * ElementH);
		y = dy* Math.round(y/dy) + dy;
	    	this.elements[i].position.x = x;
	    	this.elements[i].position.y = y;
        }
    }
    else
    {
        console.log("'stone random' error: elements.length=" + n);
    }
};
stone.prototype.Refresh = function(x0,y0)
{
    var n =this.elements.length;
    if (n>0)
    {
        for(i=0;i<n;i++)
        {
            var x=this.elements[i].position.x;
            var y=this.elements[i].position.y;
            $(("#"+this.elements[i].ID) ).css('left',x + x0);
            $(("#"+this.elements[i].ID) ).css('top',y + y0);
        }
    }
    else
    {
        console.log("'Refresh of stone' error: elements.length=" + n);
    }
};
stone.prototype.isContainPoint = function(x,y){
    var n =this.elements.length;
    if (n>0)
    {
        for(i=0;i<n;i++)
        {
           if((this.elements[i].position.x == x) && (this.elements[i].position.y == y))
           {return true;}
        }
    }
    else
    {
        console.log("'isContainPoint' error: elements.length=" + n);
    }
    return false;
};
stone.prototype.isMeetSnake = function(Sn){
	if (!(this.enable))
	{
		return false;
	}
    var x=Sn.elements[0].position.x;
    var y=Sn.elements[0].position.y;
    var n =this.elements.length;
    if (n>0)
    {
        for(i=0;i<n;i++)
        {
           if((this.elements[i].position.x == x) && (this.elements[i].position.y == y))
           {return true;}
        }
    }
    else
    {
        console.log("'isContainPoint' error: elements.length=" + n);
    }
    return false;
};



//****************************************************************************************************************************
//      ***********************************         CONFIG       **************************************************
//****************************************************************************************************************************
var X0 = 0;
var Y0 = 0; 
var timeStep = 100;
var minTimeStep = 20;
var maxTimeStep = 150;
var Start_speed = 1;
var speed = Start_speed;
var minSpeed = 1;
var maxSpeed = 20;
var pauseEnable = false;
var score = 0;
var score2 = 0;
var rows = 20;
var columns = 30;
var FieldWidth = columns*dx;
var FieldHeight = rows*dy;
var ElementSpace =3;
var t;
var timer_is_on=0;
var start = false;
var isTeleportOn = true;
var levelUp;
var level;
var levelUp_val;
var snake1 = new Snake("snake1_");
var snake2 = false;
var field1 = new field("field",rows,columns);
var apple1 = new apple("apple");
var stone1 = new stone("stone");
//for test:
stone1.enable = false;
//var snake2 = new Snake("snake2_");
SetDefaultConfig();

function SetDefaultConfig()
{
    levelUp = 0;
    level = 1;
    levelUp_val = 5;

}


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

//****************************************************************************************************************************
//      ***********************************     cycle   functions for 1 or 2 players       **************************************************
//****************************************************************************************************************************
function cycle()
{
    if (cycleSn(snake1))
    {
		if (snake2)
		{
		    cycleSn(snake2);
		}
	}	
}
function cycleSn(Sn)
{
	Sn.UpdateMoveDirr();
	if (stone1.isMeetSnake(Sn))
	{
		LifeDown(Sn);
		return false;
	}
    if (snake2)
	{
    	PunishSnake(Sn,field1);
    	Sn.Refresh(X0,Y0);
	}
	else
	{
		if (isSnakeOut(Sn,field1) || Sn.IsEatSelf())
		{
			LifeDown(Sn);
		}
		else
		{
			Sn.Refresh(X0,Y0);
		}
	}
    BonAppetite(Sn,apple1);
    return true;
}
function BonAppetite(Sn,apl)
{
    if(Sn.IsEatApple(apl.x,apl.y))
    {   //if snake1 eat apple        
        Sn.addElement();
        randomAppleCorrect();
        //randomAppleCorrect(snake2);
        apl.Refresh();
        Sn.score++;
        levelUp++;	
	if(levelUp==levelUp_val)
	{
		levelUp_val+=3;
		level++;
		levelUp=0;
		if(level % 2 ==0)
		{
			if (level==2)
			{
				stone1.enable=true;
				initComponentStone(stone1);				
			}
			else
			{
				addStone();
			}
		}
		else
		{
			addSpeed();
		}
		levelUpDo();
	}
        csoreUpdate();
    }    
}
function LifeDown(Sn)
{
	stopCount();
	pauseEnable=false;
	Sn.attention(Sn);
	levelUp=0;
	setTimeout(after_wait,1500);
	function after_wait()
	{
		if(Sn.alive)
		{
			//Sn.Refresh(X0,Y0);
			lifeDownDo();
		}
		else
		{
			GameOver(true);
		}
	}
}
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