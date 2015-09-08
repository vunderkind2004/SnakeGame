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