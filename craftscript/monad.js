"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Maybeモナド
var Maybe;
(function (Maybe) {
    // 型構成子：関手の対象部分
    var Data = /** @class */ (function () {
        function Data(val) {
            this._val = val;
            this._hasVal = val != undefined;
        }
        Object.defineProperty(Data.prototype, "hasVal", {
            get: function () {
                return this._hasVal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Data.prototype, "val", {
            get: function () {
                return this._val;
            },
            enumerable: true,
            configurable: true
        });
        return Data;
    }());
    Maybe.Data = Data;
    // 定数：値がないことを表すオブジェクト
    Maybe.None = new Data();
    // マップ関数：関手の射部分
    function fmap(f) {
        return function (mx) { return !mx.hasVal ? Maybe.None : new Data(f(mx.val)); };
    }
    Maybe.fmap = fmap;
    // モナド単位
    function just(x) {
        return new Data(x);
    }
    Maybe.just = just;
    // モナド乗法
    function flatten(mmx) {
        return !mmx.hasVal ? Maybe.None : mmx.val;
    }
    Maybe.flatten = flatten;
})(Maybe = exports.Maybe || (exports.Maybe = {}));
