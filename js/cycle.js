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

