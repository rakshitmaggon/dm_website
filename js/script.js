let origTop = null,
    origLh = null;

function rand(low, high) {
    return low + Math.random() * (high - low);
}

window.waves = {
    canHeight: 200,
    amplitude: 150,
    waveBase: 50,
    can: null,
    ctx: null,
    wave: [
        [2, 1, -1],
        [4, 1, -1],
        [3, 0, 1],
        [5, 0, 1]
    ],
    resol: 3,
    ptr: 0,
    color: 'rgba(255, 255, 255, 0.7)',
    speed: 0.05,
    moveSpeed: 2,
    setSize: function() {
        if (window.innerWidth < 650) {
            this.canHeight = 110;
            this.waveBase = 60;
            this.amplitude = 50;
        }
        this.can.height = this.canHeight;
        this.can.width = window.innerWidth;
    },
    init: function() {
        this.can = $('#waves')[0];
        this.ctx = this.can.getContext('2d');
        this.setSize();
    },
    render: function() {
        this.can.height = this.can.height;
        this.ctx.fillStyle = this.color;
        for (let i = 0; i < this.wave.length; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.can.height);
            for (let x = 0; x < window.innerWidth; x += this.resol) {
                let waveVal = Math.exp(Math.sin(this.wave[i][0] * (this.ptr + x) * 2 * Math.PI / window.innerWidth)) / Math.E * this.amplitude * this.wave[i][1];
                let y = this.can.height - (this.waveBase + waveVal)
                this.ctx.lineTo(x, y);
            }
            this.ctx.lineTo(this.can.width, this.can.height)
            this.ctx.closePath();
            this.ctx.fill();
        }
    },
    update: function() {
        waves.render();
        if (waves.ptr >= window.innerWidth) {
            waves.ptr = 0;
        } else {
            waves.ptr += waves.moveSpeed;
        }
        for (let i = 0; i < waves.wave.length; i++) {
            let w = waves.wave[i];
            if (w[2] > 0) {
                if (w[1] >= 1) {
                    waves.wave[i][2] = -1;
                } else {
                    waves.wave[i][1] += waves.speed / w[0];
                }
            } else {
                if (w[1] <= 0) {
                    waves.wave[i][2] = 1;
                } else {
                    waves.wave[i][1] -= waves.speed / w[0] / w[0];
                }

            }
        }
    }
};

window.stars = {
    num: 256,
    stars: [],
    rad: 4,
    maxLen: 30,
    color: '#fff',
    velocity: 2.5,
    can: null,
    ctx: null,

    setSize: function() {
        this.can.height = $('#page-4').outerHeight();
        this.can.width = $('#page-4').outerWidth();
        this.stars = [];
        let sq = Math.sqrt(this.num);
        for (let i = 1; i <= sq; i++) {
            for (let j = 1; j < sq; j++) {
                let x = j * this.can.width / sq;
                let y = i * this.can.height / sq;
                let len = rand(this.rad, this.maxLen);
                let velocity = this.velocity + rand(-1, 1);
                this.stars.push([x, y, len, velocity]);
            }
        }
    },

    init: function() {
        this.can = $('#stars')[0];
        this.ctx = this.can.getContext('2d');
        this.setSize();
    },

    render: function() {
        this.can.height = this.can.height;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.rad;
        this.ctx.lineCap = 'round';
        for (let i = 0; i < this.stars.length; i++) {
            let s = this.stars[i];
            this.ctx.beginPath();
            this.ctx.moveTo(s[0], s[1]);
            this.ctx.lineTo(s[0], s[1] + s[2]);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    },
    update: function() {
        stars.render();
        for (let i = 0; i < stars.stars.length; i++) {
            let s = stars.stars[i];
            if (s[1] + s[2] >= stars.can.height) {
                stars.stars[i][1] = -s[2];
            } else {
                stars.stars[i][1] += stars.stars[i][3];
            }
        }
    }
}

window.events = {
    status: false,
    speed: 650,
    easing: 'easeOutExpo',
    init: function() {

        $('#event').velocity({
            'scaleX': '0.8',
            'scaleY': '0.8',
        }, 0);
    },
    open: function($e) {
        $('#event-dis').css('display', 'block');

        let id = Number($e.attr('id').substr(13));
        $("#event-desc").html(eventData[id - 1]);
        $('#event-head').text($e.find('h3').text());

        this.status = true;
        $('#event-dis').velocity({
            'opacity': '1'
        }, {
            duration: events.speed,
            easing: events.easing
        });

        $('#event').velocity({
            'scaleX': '1',
            'scaleY': '1',
            'top': '0px;'
        }, {
            duration: events.speed,
            easing: events.easing
        });

    },
    close: function() {
        this.status = false;
        $('#event-dis').velocity({
            'opacity': '0'
        }, {
            duration: events.speed,
            easing: events.easing
        });

        $('#event').velocity({
            'scaleX': '0.8',
            'scaleY': '0.8',
            'top': '30%'
        }, {
            duration: events.speed,
            easing: events.easing
        });

        setTimeout(() => {
            if (events.status === false) {
                $('#event-dis').css('display', 'none');
            }
        }, this.speed);

    }
};



$(document).ready(function() {

    origTop = $("h1").css('top');
    origTop = Number(origTop.substr(0, origTop.length - 2));
    origLh = $("h1").css('line-height');
    origLh = Number(origLh.substr(0, origLh.length - 2));


    $('h1').css({
        'top': (origTop - 80) + 'px',
        'line-height': (origLh - 60) + 'px'
    });

    $('.sub-head').css({
        'top': (origTop - 60) + 'px'
    });

    $('body').css('overflow', 'hidden');


    $(window).resize(function() {
        waves.setSize();
        stars.setSize();
    });

    $('.page-2-event').click(function() {
        events.open($(this));
    });

    $('#event-close').click(function() {
        events.close();
    });


    $('.menu-item').click(function() {
        let i = $(this).attr('id').substr(10);
        $('html, body').animate({
            'scrollTop': $('#page-' + i).offset().top
        }, 1200);
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27 && events.status) {
            events.close();
        }
    });

    $('#event-dis').click(function(e) {
        if ($(e.target).attr('id') == 'event-dis') {
            events.close();
        }
    });

});

$(window).on('load', function() {

    waves.init();
    stars.init();
    events.init();

    function anim() {
        waves.update();
        stars.update();
        requestAnimationFrame(anim);
    }
    window.requestAnimationFrame(anim);

    $("#load-cont").velocity({
        'opacity': '0'
    }, {
        duration: 600,
        easing: 'easeInQuad',
        complete: function() {
            $(this).remove();
            $('body').css('overflow', 'initial');
            $('h1').velocity({
                'top': (origTop) + 'px',
                'line-height': (origLh) + 'px',
                'opacity': '1'
            }, {
                duration: 1600,
                easing: 'easeOutExpo'
            });

            $('.sub-head').velocity({
                'top': (origTop) + 'px',
                'opacity': '1'
            }, {
                duration: 1600,
                easing: 'easeOutExpo'
            });

            $('#header-logo').velocity({
                'opacity': '1'
            }, {
                duration: 600,
                easing: 'easeInQuad',
                delay: 1150
            });
            for (let i = 1; i <= $('.menu-item').length; i++) {
                let x = i;
                if (x > 2) {
                    x++;
                }
                $('#menu-item-' + x).velocity({
                    'opacity': '1'
                }, {
                    duration: 720,
                    easing: 'easeInQuad',
                    delay: (i - 1) * 230,
                });
            }
        }
    });


});

$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
});