function menuItem (src_,srcActive_,srcPush_)
{
    this.src= src_;
    this.srcActive = srcActive_;
    this.srcPush=srcPush_;
}

function setMenuButtonHover2 (selectedID)
{
    var menuImg = $(".menu2");
    var item = [];
    item["creatorsBtn"] = new menuItem("img/menu/btn_creators.png","img/menu/btn_creators_active.png","img/menu/btn_creators_selected.png");
    item["SnakeStart1"] = new menuItem("img/menu/btn_games.png","img/menu/btn_games.png","btn_games.png");
    item["SnakeStart2"] = new menuItem("img/menu/btn_snake.png","img/menu/btn_snake_active.png","img/menu/btn_snake_selected.png");
    
    for (var i = 0; i<menuImg.length;i++)
    {   
        //console.log("menuImg["+i+"].id="+menuImg[i].id);
        if(menuImg[i].id==selectedID)
        {
            menuImg[i].src = item[menuImg[i].id].srcPush;
        }
        else
        {
            $(("#"+menuImg[i].id)).mouseover(function(){
                this.src=item[this.id].srcActive;    
                });
            $(("#"+menuImg[i].id)).mouseout(function(){
                this.src=item[this.id].src;    
                });
        }
    }    
}
