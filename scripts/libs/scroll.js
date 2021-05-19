class ScrollObserver {
    constructor(els, cb, options) {//初期化
        this.els = document.querySelectorAll(els);//監視対象として入ってきた要素を取ってこい
        const defaultOptions = {
            root: null,
            rootMargin: "0px",//監視対象からどれくらい外側が見えたら発火するのか
            threshold: 0,
            once: true
        };
        this.cb = cb;
        this.options = Object.assign(defaultOptions, options);
        this.once = this.options.once;
        this._init();
    }
    _init() {
        const callback = function (entries, observer) {//entriesには入ってきた監視対象プロパティが続々とくる。observerはよくわからんがunobserveメソッドとかメソッドを呼び出すのに必要っぽい
            entries.forEach(entry => {//監視対象のclassをループする
                if (entry.isIntersecting) {//もし画面に入ってきたなら
                    this.cb(entry.target, true);//main.jsの監視対象の次の第二引数に入っているコールバック関数に(監視対象のDOM、と画面にはいてきたかどうか)を渡す
                    if(this.once) {//もし {once: true}なら一度きりの実行なのでunobserveしてもう二度とアニメーションはさせないようにする
                        observer.unobserve(entry.target);
                    }
                } else {//出た時
                    this.cb(entry.target, false);
                }
            });
        };

        this.io = new IntersectionObserver(callback.bind(this), this.options);

        // @see https://github.com/w3c/IntersectionObserver/tree/master/polyfill
        this.io.POLL_INTERVAL = 100;
        
        this.els.forEach(el => this.io.observe(el));
    }

    destroy() {
        this.io.disconnect();
    }
}