"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var BasePrimitive = /** @class */ (function () {
    function BasePrimitive(b3, translations) {
        if (translations === void 0) { translations = []; }
        this.b3 = b3;
        this.translations = translations;
    }
    BasePrimitive.prototype.apply = function (translation) {
        this.translations = this.translations.concat(translation);
    };
    BasePrimitive.prototype.to_bool = function () {
        var map = this.merge_translation_rev();
        var sub = this.b3;
        return function (v) { return sub(map.map_v3(v, 1)); };
    };
    BasePrimitive.prototype.to_geo = function () { };
    BasePrimitive.prototype.merge_translation = function () {
        return mx.compose(this.translations.map(function (t) { return t.do(); }));
    };
    BasePrimitive.prototype.merge_translation_rev = function () {
        return mx.compose_rev(this.translations.map(function (t) { return t.doRev(); }));
    };
    return BasePrimitive;
}());
exports.BasePrimitive = BasePrimitive;
var BaseTranslation = /** @class */ (function () {
    function BaseTranslation(value, map, rev) {
        this.value = value;
        this.map = map;
        this.rev = rev;
    }
    BaseTranslation.prototype.do = function () {
        return this.map(this.value);
    };
    BaseTranslation.prototype.doRev = function () {
        return this.map(this.rev(this.value));
    };
    return BaseTranslation;
}());
exports.BaseTranslation = BaseTranslation;
var Trans = /** @class */ (function (_super) {
    __extends(Trans, _super);
    function Trans(v) {
        return _super.call(this, vc.to_v3_if(v), mx.trans_m4, function (v) { return v.scalar(-1); }) || this;
    }
    return Trans;
}(BaseTranslation));
exports.Trans = Trans;
var Rot = /** @class */ (function (_super) {
    __extends(Rot, _super);
    function Rot(rad, map) {
        return _super.call(this, rad, map, function (rad) { return -rad; }) || this;
    }
    return Rot;
}(BaseTranslation));
exports.Rot = Rot;
var RotX = /** @class */ (function (_super) {
    __extends(RotX, _super);
    function RotX(rad) {
        return _super.call(this, rad, mx.rot_x_m4) || this;
    }
    return RotX;
}(Rot));
exports.RotX = RotX;
var RotY = /** @class */ (function (_super) {
    __extends(RotY, _super);
    function RotY(rad) {
        return _super.call(this, rad, mx.rot_y_m4) || this;
    }
    return RotY;
}(Rot));
exports.RotY = RotY;
var RotZ = /** @class */ (function (_super) {
    __extends(RotZ, _super);
    function RotZ(rad) {
        return _super.call(this, rad, mx.rot_z_m4) || this;
    }
    return RotZ;
}(Rot));
exports.RotZ = RotZ;
var Scale = /** @class */ (function (_super) {
    __extends(Scale, _super);
    function Scale(v) {
        return _super.call(this, vc.to_v3_if(v), mx.scale_m4, function (v) { return vc.v3(1, 1, 1).el_div(v); }) || this;
    }
    return Scale;
}(BaseTranslation));
exports.Scale = Scale;
/** 任意の平面形状の角柱 */
function Prism(xy) {
    return new BasePrimitive(function (v) {
        if (v.z < 0 || v.z > 1)
            return false;
        return xy(vc.v3_to_v2(v));
    });
}
exports.Prism = Prism;
/** 任意の平面形状の角錐 */
function Cone(xy) {
    return new BasePrimitive(function (v) {
        if (v.z < 0 || v.z > 1)
            return false;
        if (v.z == 1) {
            v = vc.v3(0, 0, 1);
        }
        else {
            v = v.scalar(1 / (1 - v.z));
        }
        return xy(vc.v3_to_v2(v));
    });
}
exports.Cone = Cone;
/** 半径1の円 */
function b2_circle(v) {
    v = v.el_mul(v);
    return v.x + v.y <= 1;
}
exports.b2_circle = b2_circle;
/** 半径1の円に外接する正方形 */
function b2_square(v) {
    return Math.max(Math.abs(v.x), Math.abs(v.y)) <= 1;
}
exports.b2_square = b2_square;
/** 半径1の円に内接するひし形 */
function b2_rhombus(v) {
    return Math.abs(v.x) + Math.abs(v.y) <= 1;
}
exports.b2_rhombus = b2_rhombus;
/** 半径1のパイ */
function build_b2_pie(deg_max) {
    return function (v) {
        var r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1)
            return false;
        var deg = ut.rad_to_deg(r_r[1]);
        return ut.isin(0, deg_max, deg);
    };
}
exports.build_b2_pie = build_b2_pie;
/** 半径1の球 */
function b3_sphere(v) {
    v = v.el_mul(v);
    return v.x + v.y + v.z <= 1;
}
exports.b3_sphere = b3_sphere;
/** 半径1の球に外接する立方体 */
function b3_cube(v) {
    return Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)) <= 1;
}
exports.b3_cube = b3_cube;
/** 半径1の球に内接する正八面体 */
function b3_octahedron(v) {
    return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z) <= 1;
}
exports.b3_octahedron = b3_octahedron;
/** 半径1の球の一部 */
function build_b3_pie(deg_h_max, deg_v_min, deg_v_max) {
    return function (v) {
        var r_rh_rv = vc.v3_to_sphere(v);
        if (r_rh_rv[0] > 1)
            return false;
        var deg_h = ut.rad_to_deg(r_rh_rv[1]);
        var deg_v = ut.rad_to_deg(r_rh_rv[2]);
        return ut.isin(0, deg_h_max, deg_h) && ut.isin(deg_v_min, deg_v_max, deg_v);
    };
}
exports.build_b3_pie = build_b3_pie;
/** 線分 */
function build_b3_segment(p1, p2, r) {
    return function (v) { return cv.distance_sp(p1, p2, v) <= r; };
}
exports.build_b3_segment = build_b3_segment;
/** 半径1の球 */
function Sphere() {
    return new BasePrimitive(b3_sphere);
}
exports.Sphere = Sphere;
/** 半径1の球に外接する立方体 */
function Cube() {
    return new BasePrimitive(b3_cube);
}
exports.Cube = Cube;
/** 半径1の球に内接する正八面体 */
function Octahedron() {
    return new BasePrimitive(b3_octahedron);
}
exports.Octahedron = Octahedron;
function hoge() {
    var map = new Map();
    var set = new Set();
}
exports.hoge = hoge;
