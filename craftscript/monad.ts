// Maybeモナド
export namespace Maybe {
    // 型構成子：関手の対象部分
    export class Data<X> {
        private _val: X | undefined;
        private _hasVal: boolean;
    
        constructor(val?: X) {
            this._val = val;
            this._hasVal = val != undefined;
        }
      
        get hasVal(): boolean {
            return this._hasVal;
        }
        get val(): X | undefined {
            return this._val;
        }
    }
    
    // 定数：値がないことを表すオブジェクト
    export const None = new Data<any>();

    // マップ関数：関手の射部分
    export function fmap<X, Y>(f: (x: X) => Y): (mx: Data<X>) => Data<Y> {
        return mx => !mx.hasVal ? <Data<Y>>None : new Data<Y>(f(<X>mx.val));
    }
    // モナド単位
    export function just<X>(x: X) : Data<X> {
        return new Data<X>(x);
    }
    // モナド乗法
    export function flatten<X>(mmx: Data<Data<X>>): Data<X> {
        return !mmx.hasVal ? <Data<X>>None : <Data<X>>mmx.val;
    }
}
