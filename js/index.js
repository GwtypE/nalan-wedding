$(function () {
    //鼠标移入导航改变状态
    $('.common-header-nav').on('mouseenter', 'li', function () {
        $('.common-header-nav a').removeClass();
        $(this).find('a').addClass('active-tab');
    });

    //banner底部滚动条

    var $banner_item = $('.banner-list li');
    var banner_item_w = parseFloat($banner_item.width());
    var $banner_list = $('.banner-list');

    $banner_list.append($banner_item.clone())
        .css('width', banner_item_w * $banner_item.length * 2);

    var banner_list_w = parseFloat($banner_list.css('width'));
    var banner_list_l = parseInt($banner_list.css('left'));

    var timer = setInterval(function () {
        Move();
    }, 1000);

    //保存当前滚动方向
    var currentDire = 'r';

    $('#carousel-leftBtn').click(function () {
        //如果先执行一次Move函数（把下面的注释打开），在快速多次点击方向按钮之后滚动条会异常。而不先执行一次Move函数（把下面一行注释掉）则点击按钮后会停顿，定时器时间到了之后滚动条才会继续滚动
        //正常使用应该不会出现快速多次点击一个方向的方向按钮，故而还是把注释打开
        Move('l');
        clearInterval(timer);
        timer = setInterval(function () {
            Move('l');
        }, 1000);
        currentDire = 'l';
    });

    $('#carousel-rightBtn').click(function () {
        Move('r');
        clearInterval(timer);
        timer = setInterval(function () {
            Move('r');
        }, 1000);
        currentDire = 'r';
    });

    //合并写成on'mousedown mouseup'之后滚动带也会有奇怪的bug。
    $('#carousel-leftBtn #carousel-rightBtn').on('mousedown', function (event) {
        event.preventDefault();
        $(this).addClass('banner-btn-active');
    }).on('mouseup', function () {
        $(this).removeClass('banner-btn-active');
    });


    //function mouseleaveDire(curDire){
    //    var cDire = curDire;
    //
    //    timer = setInterval(function (cDire) {
    //        Move(cDire);
    //    },1000);
    //}

    //鼠标移入暂停，移出继续。
    $banner_list.on('mouseenter', function () {
        clearInterval(timer);
    }).on('mouseleave', function () {
        //当前问题：鼠标移入移出之后没法保持当前滚动方向
        //timer = setInterval(function (currentDire) {
        //已解决，Move外层嵌套函数不需要传入currentDire参数。
        timer = setInterval(function () {
            Move(currentDire);
        }, 1000);
    });

    //滚动条滚动函数
    function Move(direction) {
        if (direction) {
            var dire = direction;
        } else {
            dire = 'r'
        }

        if (banner_list_l <= -banner_list_w / 2) {
            $banner_list.css('left', 0);
            banner_list_l = parseFloat($banner_list.css('left'));
        } else if (banner_list_l >= 0 && dire == 'r') {
            $banner_list.css('left', -banner_list_w / 2);
            banner_list_l = parseFloat($banner_list.css('left'));
        }
        if (dire == 'l') {
            banner_list_l -= banner_item_w
        } else if (dire == 'r') {
            banner_list_l += banner_item_w
        } else {
            //抛出错误
            //throw error();
        }
        $banner_list.animate({'left': banner_list_l}, 'slow');
    }
});


//setInterval("fun()",1000); 这种调用报未定义，在全局我们已经说过了 。我们可以把带引号的参数理解为 可执行代码 。而setInterval现在把以引号包括的可执行代码进行处理。就像eval一样给予执行。
//相当于把fun()放到 最外面的全局环境中执行了。而如果fun()函数是写在window.onload内的话，就会访问不到fun()函数本身从而报错。







