$(function () {
    //鼠标移入导航改变状态
    $('.common-header-nav').on('mouseenter', 'li', function () {
        $('.common-header-nav a').removeClass();
        $(this).find('a').addClass('active-tab');
    });

    //banner底部滚动带
    //为了调试方便，定时器时间间隔设置得较短
    var timer = setInterval(function () {
        roller('carousel');
    }, 1000);

    //保存当前滚动方向
    var currentDire = 'r';

    $('#carousel-leftBtn').click(function () {
        //如果先执行一次roller函数（把下面的注释打开），在快速多次点击方向按钮之后滚动条会异常。而不先执行一次roller函数（把下面一行注释掉）则点击按钮后会停顿，定时器时间到了之后滚动条才会继续滚动
        //正常使用应该不会出现快速多次点击一个方向的方向按钮，故而还是把注释打开
        //先执行一次还是有bug，点击方向按钮时会出现越界和奇怪的运动的问题
        //roller('l');
        clearInterval(timer);
        timer = setInterval(function () {
            roller('carousel','l');
        }, 1000);
        currentDire = 'l';
    });

    $('#carousel-rightBtn').click(function () {
        //roller('r');
        clearInterval(timer);
        timer = setInterval(function () {
            roller('carousel','r');
        }, 1000);
        currentDire = 'r';
    });

    $('#carousel-leftBtn,#carousel-rightBtn').on('mousedown mouseup', function (event) {
        event.preventDefault();
        $(this).toggleClass('banner-btn-active');
    });



    //鼠标移入暂停，移出继续。
    $('.banner-list').on('mouseenter', function () {
        clearInterval(timer);
    }).on('mouseleave', function () {
        //当前问题：鼠标移入移出之后没法保持当前滚动方向
        //timer = setInterval(function (currentDire) {
        //已解决，roller外层嵌套函数不需要传入currentDire参数。
        timer = setInterval(function () {
            roller('carousel',currentDire);
        }, 1000);
    });
    //当第一张图在滚动带最左边而且滚动带在向左滚时，点击向右按钮，会出现空白，待修复

    $('body').on('mouseover','img', function () {
        showPic($(this));
    })
        .on('mouseout','img', function () {
            removeImg();
        });



    //function showPic(){
    //    $('<p>456</p>').insertBefore('.text');
    //}
    ////$img.on('mouseenter', function () {
    ////    showPic();
    ////});
    //showPic();
});

var dbUlDone =false;
//这个全局变量用于第一次执行时将滚动带子元素复制一份，目前想到去掉这个全局变量的方法就是在编写html的时候就直接把ul里的li复制一遍，而不用再用js生成。
//或者每次调用这个函数之前先自行把li复制一遍（比较傻）
//滚动条滚动函数
//依次传入父元素id，子元素classname，及滚动方向l/r（不传默认r）
//虽然大部分时候应该都是用ul和li，不过还是写成兼容div样式，不然可以省去第二个参数。
//改写，如果是ul+li结构，可直接传入父元素id及滚动方向l/r(不传默认r)，如果是div结构，则需要传入父元素id、子元素className及滚动方向l/r（不传默认r）。
function roller(parentId,childrenCls,direction) {
    var cParentId = '#'+parentId,
        cChildrenCls = '.'+childrenCls;

    var $children,
    //children_width↓
        children_w,
        $parent,
        parent_w,
    //parent_left↓
        parent_l,
        dire;

    if (direction) {
        dire = direction;
    } else {
        dire = 'r'
    }

    if(childrenCls=='r'||childrenCls=='l'){
        dire = childrenCls;
        $children = $(cParentId).find('li');
    }else if(childrenCls==undefined){
        $children = $(cParentId).find('li');
    } else {
        $children = $(cParentId).find(cChildrenCls);
    }

    children_w = parseFloat($children.width());
    $parent = $(cParentId);

    //检查Ul是否已复制，已复制则跳过。
    if(!dbUlDone){
        $parent.append($children.clone())
            .css('width', children_w * $children.length * 2);
        dbUlDone = true;
    }

    parent_w = parseFloat($parent.css('width'));
    parent_l = parseInt($parent.css('left'));

    if (parent_l <= -parent_w / 2) {
        $parent.css('left', 0);
        parent_l = parseFloat($parent.css('left'));
    } else if (parent_l >= 0 && dire == 'r') {
        $parent.css('left', -parent_w / 2);
        parent_l = parseFloat($parent.css('left'));
    }
    if (dire == 'l') {
        parent_l -= children_w;
    } else if (dire == 'r') {
        parent_l += children_w;
    } else {
        //保持默认向右滚
        parent_l += children_w;
    }
    $parent.animate({'left': parent_l}, 'slow');
}

//放大图片函数
function showPic($img){
    var imgSrc = $img.attr('src');
    var imgWidth =$img.width();
    var imgHeight =$img.height();

    $('<span id="newTriangle"></span>').prependTo('body');
    $('<img id="showImg">').prependTo('body');

    //prop('src'):http://localhost:63342/demo4/img/portrait-list-1.jpg
    //attr('src):img/portrait-list-1.jpg
    $('#showImg').attr('src',imgSrc).css({
        'position':'absolute',
        'width':parseInt(imgWidth *1.5),
        'height':parseInt(imgHeight *1.5),
        'left':parseInt($img.offset().left+imgWidth/2-imgWidth*1.5/2),
        'top':parseInt($img.offset().top-imgHeight/2-imgHeight*1.5/2),
        'z-index':99,
        'border':'5px solid #e5e5e5'
    });
    //$('#newTriangle').css({
    //    'position':'absolute',
    //    'width': 0,
    //    'height': 0,
    //    'left':parseInt($img.offset().left+imgWidth/2-16/2),
    //    'top':parseInt($img.offset().top-16),
    //    'border-left': '16px solid transparent',
    //    'border-top': '16px solid #e5e5e5',
    //    'border-right': '16px solid transparent',
    //    'display': 'inline-block',
    //    'z-index':99
    //});
}
//
function removeImg(){
    $('#showImg').remove();
    $('#newTriangle').remove();
}
//setInterval("fun()",1000); 这种调用报未定义，在全局我们已经说过了 。我们可以把带引号的参数理解为 可执行代码 。而setInterval现在把以引号包括的可执行代码进行处理。就像eval一样给予执行。
//相当于把fun()放到 最外面的全局环境中执行了。而如果fun()函数是写在window.onload内的话，就会访问不到fun()函数本身从而报错。







