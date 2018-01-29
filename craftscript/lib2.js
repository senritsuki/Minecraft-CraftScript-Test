"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
/** 2点間の距離 */
function distance(p1, p2) {
    return p2.sub(p1).length();
}
exports.distance = distance;
/** 点と直線の距離 */
function distance_lp(ray, p) {
    // 平行四辺形の面積
    var n1 = ray.d.cp(p.sub(ray.c));
    // 平行四辺形の底面
    var n2 = ray.d.length();
    // 平行四辺形の高さ＝距離
    return Math.abs(n1 / n2);
}
exports.distance_lp = distance_lp;
/** 点と線分の距離 */
function distance_sp(s1, s2, p) {
    var d1 = s2.sub(s1);
    var s1p = p.sub(s1);
    if (d1.ip(s1p) < 0)
        return s1p.length();
    var d2 = s1.sub(s2);
    var s2p = p.sub(s2);
    if (d2.ip(s2p) < 0)
        return s2p.length();
    var ray = cv.ray(s1, d1);
    return distance_lp(ray, p);
}
exports.distance_sp = distance_sp;
var Voxel = /** @class */ (function () {
    function Voxel(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.d = p2.sub(p1);
    }
    Voxel.seq = function (n1, n2) {
        return seq.range_step(n1, n2, n1 <= n2 ? 1 : -1);
    };
    Voxel.prototype.seq_x = function () {
        return Voxel.seq(this.p1.x, this.p2.x);
    };
    Voxel.prototype.seq_y = function () {
        return Voxel.seq(this.p1.y, this.p2.y);
    };
    Voxel.prototype.seq_z = function () {
        return Voxel.seq(this.p1.z, this.p2.z);
    };
    Voxel.prototype.scan = function (ii, jj, kk, fn) {
        ii.forEach(function (i) {
            jj.forEach(function (j) {
                kk.forEach(function (k) {
                    fn(i, j, k);
                });
            });
        });
    };
    Voxel.prototype.scan_xyz = function (fn) {
        this.scan(this.seq_x(), this.seq_y(), this.seq_z(), function (x, y, z) { return fn(x, y, z); });
    };
    Voxel.prototype.scan_yxz = function (fn) {
        this.scan(this.seq_y(), this.seq_x(), this.seq_z(), function (y, x, z) { return fn(x, y, z); });
    };
    Voxel.prototype.scan_zxy = function (fn) {
        this.scan(this.seq_z(), this.seq_x(), this.seq_y(), function (z, x, y) { return fn(x, y, z); });
    };
    Voxel.prototype.scan_zyx = function (fn) {
        this.scan(this.seq_z(), this.seq_y(), this.seq_x(), function (z, y, x) { return fn(x, y, z); });
    };
    return Voxel;
}());
exports.Voxel = Voxel;
/** 円の内外判定機. 1より小:内側, 1:周上, 1より大:外側 */
function f_circle(o, r) {
    var r2 = r.el_mul(r);
    return function (x, y) {
        var p = vc.v2(x, y).sub(o);
        var d = p.el_mul(p).el_div(r2);
        return d.x + d.y;
    };
}
exports.f_circle = f_circle;
/** 球の内外判定機. 1より小:内側, 1:面上, 1より大:外側 */
function f_sphere(o, r) {
    var r2 = r.el_mul(r);
    return function (x, y, z) {
        var p = vc.v3(x, y, z).sub(o);
        var d = p.el_mul(p).el_div(r2);
        return d.x + d.y + d.z;
    };
}
exports.f_sphere = f_sphere;
/** 長方形の内外判定機. 1より小:内側, 1:周上, 1より大:外側 */
function f_square(o, r) {
    return function (x, y) {
        var p = vc.v2(x, y).sub(o);
        var d = p.el_div(r);
        return Math.max(Math.abs(d.x), Math.abs(d.y));
    };
}
exports.f_square = f_square;
/** 直方体の内外判定機. 1より小:内側, 1:面上, 1より大:外側 */
function f_cube(o, r) {
    return function (x, y, z) {
        var p = vc.v3(x, y, z).sub(o);
        var d = p.el_div(r);
        return Math.max(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
    };
}
exports.f_cube = f_cube;
/** ひし形の内外判定機. 1より小:内側, 1:周上, 1より大:外側 */
function f_rhombus(o, r) {
    return function (x, y) {
        var p = vc.v2(x, y).sub(o);
        var d = p.el_div(r);
        return Math.abs(d.x) + Math.abs(d.y);
    };
}
exports.f_rhombus = f_rhombus;
/** 八面体の内外判定機. 1より小:内側, 1:面上, 1より大:外側 */
function f_octahedron(o, r) {
    return function (x, y, z) {
        var p = vc.v3(x, y, z).sub(o);
        var d = p.el_div(r);
        return Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z);
    };
}
exports.f_octahedron = f_octahedron;
var voxel3;
(function (voxel3) {
    var IO;
    (function (IO) {
        IO[IO["Inner"] = -1] = "Inner";
        IO[IO["Face"] = 0] = "Face";
        IO[IO["Outer"] = 1] = "Outer";
    })(IO = voxel3.IO || (voxel3.IO = {}));
    voxel3.E = 1e-6;
    function set_E(new_E) {
        voxel3.E = new_E;
    }
    voxel3.set_E = set_E;
    function is_near(n1, n2) {
        return Math.abs(n2 - n1) < voxel3.E;
    }
    voxel3.is_near = is_near;
    function io_base(n) {
        if (Math.abs(n) < voxel3.E)
            return IO.Face;
        return n < 0 ? IO.Inner : IO.Outer;
    }
    voxel3.io_base = io_base;
    function io_isin(n, min, max) {
        if (min > max) {
            var min_tmp = min;
            min = max;
            max = min_tmp;
        }
        if (min < n && n < max)
            return IO.Inner;
        if (is_near(n, min) || is_near(n, max))
            return IO.Face;
        return IO.Outer;
    }
    voxel3.io_isin = io_isin;
    function merge_io(ios) {
        return ios.reduce(function (a, b) {
            if (a == IO.Outer || b == IO.Outer)
                return IO.Outer;
            if (a == IO.Inner && b == IO.Inner)
                return IO.Inner;
            return IO.Face;
        });
    }
    voxel3.merge_io = merge_io;
    function to_rate(t0, t1, n) {
        var d = t1 - t0;
        var dn = n - t0;
        return dn / d;
    }
    voxel3.to_rate = to_rate;
    /** マイナス:内側, 0:面上, プラス:外側 */
    function base_circle(r, p) {
        var d1 = p.el_div(r);
        var d2 = d1.el_mul(d1);
        var n = d2.x + d2.y - 1;
        return io_base(n);
    }
    voxel3.base_circle = base_circle;
    function base_sphere(r, p) {
        var d1 = p.el_div(r);
        var d2 = d1.el_mul(d1);
        var n = d2.x + d2.y + d2.z - 1;
        return io_base(n);
    }
    voxel3.base_sphere = base_sphere;
    function base_cube(r, p) {
        var d = p.el_div(r);
        var n = Math.max(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z)) - 1;
        return io_base(n);
    }
    voxel3.base_cube = base_cube;
    function base_octahedron(r, p) {
        var d = p.el_div(r);
        var n = Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z) - 1;
        return io_base(n);
    }
    voxel3.base_octahedron = base_octahedron;
    function sphere(r, f) {
        return function (x, y, z) { return base_sphere(r, f(vc.v3(x, y, z))); };
    }
    voxel3.sphere = sphere;
    function cube(r, f) {
        return function (x, y, z) { return base_cube(r, f(vc.v3(x, y, z))); };
    }
    voxel3.cube = cube;
    function octahedron(r, f) {
        return function (x, y, z) { return base_octahedron(r, f(vc.v3(x, y, z))); };
    }
    voxel3.octahedron = octahedron;
    function base_cyrinder(r, h, p) {
        var io_z = io_isin(p.z, 0, h);
        if (io_z == IO.Outer)
            return IO.Outer;
        var io_xy = base_circle(r, vc.v2(p.x, p.y));
        return merge_io([io_z, io_xy]);
    }
    voxel3.base_cyrinder = base_cyrinder;
    function base_cone(r, h, p) {
        var io_z = io_isin(p.z, 0, h);
        if (io_z == IO.Outer)
            return IO.Outer;
        var rz = vc.to_v2_if(r).scalar(1 - p.z);
        var io_xy = base_circle(rz, vc.v2(p.x, p.y));
        return merge_io([io_z, io_xy]);
    }
    voxel3.base_cone = base_cone;
    function cyrinder(r, h, f) {
        return function (x, y, z) { return base_cyrinder(r, h, f(vc.v3(x, y, z))); };
    }
    voxel3.cyrinder = cyrinder;
    function cone(r, h, f) {
        return function (x, y, z) { return base_cone(r, h, f(vc.v3(x, y, z))); };
    }
    voxel3.cone = cone;
    function rev_trans(v) {
        return mx.trans_m4(vc.to_v3_if(v).scalar(-1));
    }
    voxel3.rev_trans = rev_trans;
    function rev_rot_x(rad) {
        return mx.rot_x_m4(-rad);
    }
    voxel3.rev_rot_x = rev_rot_x;
    function rev_rot_y(rad) {
        return mx.rot_y_m4(-rad);
    }
    voxel3.rev_rot_y = rev_rot_y;
    function rev_rot_z(rad) {
        return mx.rot_z_m4(-rad);
    }
    voxel3.rev_rot_z = rev_rot_z;
    function rev_scale(v) {
        return mx.scale_m4(vc.v3(1, 1, 1).el_div(v));
    }
    voxel3.rev_scale = rev_scale;
    function rev_compose(mx_array) {
        return function (v) { return mx.compose_rev(mx_array).map_v3(v, 1); };
    }
    voxel3.rev_compose = rev_compose;
})(voxel3 = exports.voxel3 || (exports.voxel3 = {}));
var vseq;
(function (vseq) {
    function arc_xy(rads) {
        return rads.map(function (rad) { return vc.polar_to_v2(1, rad); });
    }
    vseq.arc_xy = arc_xy;
    function arc_x2y(xx) {
        return xx.map(function (x) { return [x, Math.acos(x)]; }).map(function (x_rad) { return vc.v2(x_rad[0], Math.sin(x_rad[1])); });
    }
    vseq.arc_x2y = arc_x2y;
    function arc_y2x(yy) {
        return yy.map(function (y) { return [y, Math.asin(y)]; }).map(function (y_rad) { return vc.v2(Math.cos(y_rad[1]), y_rad[0]); });
    }
    vseq.arc_y2x = arc_y2x;
    function deg2_to_rads(deg1, deg2, count, wo_last) {
        if (wo_last === void 0) { wo_last = false; }
        var f = !wo_last ? seq.range : seq.range_wo_last;
        return f(ut.deg_to_rad(deg1), ut.deg_to_rad(deg2), count);
    }
    vseq.deg2_to_rads = deg2_to_rads;
})(vseq = exports.vseq || (exports.vseq = {}));
