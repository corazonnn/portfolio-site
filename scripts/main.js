document.addEventListener('DOMContentLoaded', function () {
    const main = new Main();
});

class Main {
    constructor() {
        this.header = document.querySelector('.header');
        this.sides = document.querySelectorAll('.side');
        this._observers = [];
        this._init();//初期化の時点で呼び出す。こっちに書けばいいじゃんとも思うが、constructorは変数の代入したい、綺麗を保ちたいから。そうなるとそのほかのやるべきことは_init()に記述する必要がある
    }

    set observers(val) {
        this._observers.push(val);
    }

    get observers() {
        return this._observers;
    }

    _init() {
        new MobileMenu();
        this.hero = new HeroSlider('.swiper-container');
        Pace.on('done', this._paceDone.bind(this));
    }

    _paceDone() {
        this._scrollInit();
    }

    _inviewAnimation(el, inview) {
        if(inview) {
            el.classList.add('inview');
        }else {
            el.classList.remove('inview');
        }
    }

    _navAnimation(el, inview) {
        if(inview) {//もし画面に入ってきたらtriggeredを取り除く。これはheaderのbackgroundcolorを設定しているやつだから画面が下に行けば（＝ウィンドウから見えなくなれば）addする必要がある。
            this.header.classList.remove('triggered');
        } else {
            this.header.classList.add('triggered');
        }
    }

    _sideAnimation(el, inview) {
        if(inview) {
            this.sides.forEach(side => side.classList.add('inview'));
        } else {
            this.sides.forEach(side => side.classList.remove('inview'));
        }
    }

    //ここのel,inviewは何かというと、scroll.jsのthis.cb(entry.target, true)
    _textAnimation(el, inview) {//下から呼び出されたものは軽く処理した後で本格的な関数の方に飛ばす
        if(inview) {//監視対象がウィンドウに入ってきた時に実行する
            const ta = new TweenTextAnimation(el);//この時点でconstructorが呼び出されている
            ta.animate();
        }
    }

    _toggleSlideAnimation(el, inview) {
        if(inview) {
            this.hero.start();
        } else {
            this.hero.stop();
        }
    }

    _destroyObservers() {
        this.observers.forEach(ob => {
            ob.destroy();
        });
    }

    destroy() {
        this._destroyObservers();
    }

    _scrollInit() {
                       //new ScrollObserver('監視しているclass', 上にある中からどのcbを呼び出すか);
                       //new Scrollobserverが呼ばれたタイミングではまだ('監視しているclass', 上にある中からどのcbを呼び出すか)は何も関係ない。ScrollObserverの初期化のメソッドscroll.jsのconstructorか_initメソッドの中で初めてコールバック関数ここでいう第二引数が呼び出される。
        this.observers = new ScrollObserver('.nav-trigger', this._navAnimation.bind(this), {once: false});//OK!!!{once: false}一度きりじゃない
        this.observers = new ScrollObserver('.cover-slide', this._inviewAnimation);//OK!!!
        this.observers = new ScrollObserver('.appear', this._inviewAnimation);//OK!!!
        //監視対象.tween-animate-titlが画面の中に入ってきたら、_textAnimationを呼び出す
        this.observers = new ScrollObserver('.tween-animate-title', this._textAnimation, {rootMargin: "-200px 0px"});//OK！！！理解した。ライブラリのgreensockを使ってる感じ
        this.observers = new ScrollObserver('.swiper-container', this._toggleSlideAnimation.bind(this), {once: false});
        this.observers = new ScrollObserver('#main-content', this._sideAnimation.bind(this), {once: false, rootMargin: "-300px 0px"});
    }
}

