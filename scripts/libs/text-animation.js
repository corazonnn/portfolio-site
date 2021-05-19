class TextAnimation {
    constructor(el) {//const ta = new TweenTextAnimation(el);のtaにはプロパティとその値が入っているので扱いにくい。
        this.DOM = {};//だからconstructorの中で分割して使いやすくしている
        this.DOM.el = el instanceof HTMLElement ? el : document.querySelector(el);
        this.chars = this.DOM.el.innerHTML.trim().split("");//この時点でanimationが配列に変わってる。[a,n,i,m,a,t,i,o,n]
        this.DOM.el.innerHTML = this._splitText();//animationの文字列を取得しているが、animationdelayを設定したいからspan要素で囲むためのメソッドが_splitText()
    }
    _splitText() {//animationの文字列に対してspan要素で囲むためのメソッド。index.html内でspan要素で囲んでもいいのだが今回はこうしている
        return this.chars.reduce((acc, curr) => {//reduceメソッドは配列のthis.charをループしている。最初はaccu="",curr=aだけど、２回目のループでは１回目のループのreturnに入っているものが次のaccuになる
            curr = curr.replace(/\s+/, '&nbsp;');//replaceメソッドはstr.replace("こいつを", "こいつで");置き換える
            return `${acc}<span class="char">${curr}</span>`;
        }, "");
    }
    animate() {//オブジェクトを生成して、constructorを抜けたらようやくここに辿り着く
        this.DOM.el.classList.toggle('inview');//監視対象のclassにinviewを付与する。そんだけかーーい。
    }
}
class TweenTextAnimation extends TextAnimation {
    constructor(el) {
        super(el);//親クラスのconstrctorをまるまるパクります
        this.DOM.chars = this.DOM.el.querySelectorAll('.char');//なんでcharを取得する必要があるんだろう
    }
    
    animate() {
        this.DOM.el.classList.add('inview');//監視対象のclassにinviewを付与する。
        this.DOM.chars.forEach((c, i) => {//文字列とそのインデックスをループして、TweenMaxになんかしてるけどなにしてるんだろう
            TweenMax.to(c, .6, {//アニメーションを実現するときはcssで書くか、jsで記述するかの2パターンある。今回はjsを用いて記述する。その上複雑な処理も簡単に実現できるライブラリgreensockのTweenMaxを使うことにする
                  //.to(対象となるDOM,アニメーションの間隔,アニメーションの詳細を記述したオプション) 
                ease: Back.easeOut,//TweenMaxにも色々なメソッドがあるが、今回はtoメソッドを使う。toメソッドは３つの引数をとる
                delay: i * .05,
                startAt: { y: '-50%', opacity: 0},
                y: '0%',
                opacity: 1
            });
        });
    }
}
