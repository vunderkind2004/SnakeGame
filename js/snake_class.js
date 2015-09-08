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