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
importPackage(Packages.com.sk89q.worldedit);
var ut = require("../algorithm/utility");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
function jv_to_v(v) {
    return vc.v3(v.getX(), -v.getZ(), v.getY());
}
exports.jv_to_v = jv_to_v;
function v_to_jv(v) {
    return new Vector(v.x, -v.z, v.y);
}
exports.v_to_jv = v_to_jv;
function yaw_to_rad(yaw) {
    return ut.deg_to_rad(-1 * yaw + 270);
}
exports.yaw_to_rad = yaw_to_rad;
function rad_to_yaw(rad) {
    return (ut.rad_to_deg(rad) - 270) * -1;
}
exports.rad_to_yaw = rad_to_yaw;
function pitch_to_rad(pitch) {
    return ut.deg_to_rad(-1 * pitch);
}
exports.pitch_to_rad = pitch_to_rad;
function rad_to_pitch(rad) {
    return ut.rad_to_deg(rad) * -1;
}
exports.rad_to_pitch = rad_to_pitch;
function rot_x(v, angle4) {
    return mx.rot_x_m3(ut.deg90 * angle4).map(v);
}
exports.rot_x = rot_x;
function rot_y(v, angle4) {
    return mx.rot_y_m3(ut.deg90 * angle4).map(v);
}
exports.rot_y = rot_y;
function rot_z(v, angle4) {
    return mx.rot_z_m3(ut.deg90 * angle4).map(v);
}
exports.rot_z = rot_z;
function yaw_to_v(yaw) {
    return vc.polar_to_v3(1, yaw_to_rad(yaw), 0);
}
exports.yaw_to_v = yaw_to_v;
/** V3 -> [yaw, pitch] */
function v_to_yaw_pitch(v) {
    var rad_h = Math.atan2(v.y, v.x);
    var rad_v = Math.atan2(v.z, Math.sqrt(v.x * v.x + v.y * v.y));
    var yaw = rad_to_yaw(rad_h);
    var pitch = rad_to_yaw(rad_v);
    return [yaw, pitch];
}
exports.v_to_yaw_pitch = v_to_yaw_pitch;
/** (src: Vector, dst: Vector) -> [yaw, pitch] */
function dir_yaw_pitch(src, dst) {
    var d = jv_to_v(dst).sub(jv_to_v(src));
    return v_to_yaw_pitch(d);
}
exports.dir_yaw_pitch = dir_yaw_pitch;
exports.Stair_E = 0;
exports.Stair_N = 3;
exports.Stair_W = 1;
exports.Stair_S = 2;
exports.Stair_ER = exports.Stair_E | 4;
exports.Stair_NR = exports.Stair_N | 4;
exports.Stair_WR = exports.Stair_W | 4;
exports.Stair_SR = exports.Stair_S | 4;
function normalize_angle4(angle4) {
    angle4 %= 4;
    if (angle4 < 0)
        angle4 += 4;
    return angle4;
}
exports.normalize_angle4 = normalize_angle4;
/** meta: 0東 / 3北 / 1西 / 2南 -> angle4: 0右 / 1上 / 2左 / 3下 */
function meta_to_angle4z(meta) {
    meta &= 3;
    switch (meta) {
        case 0: return 0;
        case 3: return 1;
        case 1: return 2;
        case 2: return 3;
        default: return NaN;
    }
}
exports.meta_to_angle4z = meta_to_angle4z;
/** meta: 0東上 / 1西上 / 5西上逆 / 4東上逆 -> angle4: 0右上 / 1左上 / 2左下 / 3右下 */
/** meta: 2南上 / 3北上 / 7北上逆 / 6南上逆 -> angle4: 0右上 / 1左上 / 2左下 / 3右下 */
function meta_to_angle4xy(meta) {
    meta &= 5; // 2ビット目が0なら東西, 1なら南北. 落とせば共通
    switch (meta) {
        case 0: return 0;
        case 1: return 1;
        case 5: return 2;
        case 4: return 3;
        default: return NaN;
    }
}
exports.meta_to_angle4xy = meta_to_angle4xy;
/** angle4: 0右 / 1上 / 2左 / 3下 -> meta: 0東 / 3北 / 1西 / 2南 */
function angle4z_to_meta(angle4) {
    switch (normalize_angle4(angle4)) {
        case 0: return 0;
        case 1: return 3;
        case 2: return 1;
        case 3: return 2;
        default: return NaN;
    }
}
exports.angle4z_to_meta = angle4z_to_meta;
/** angle4: 0右 / 1上 / 2左 / 3下 -> meta: 2南上 / 3北上 / 7北上逆 / 6南上逆 */
function angle4x_to_meta(angle4) {
    switch (normalize_angle4(angle4)) {
        case 0: return 2;
        case 1: return 3;
        case 2: return 7;
        case 3: return 6;
        default: return NaN;
    }
}
exports.angle4x_to_meta = angle4x_to_meta;
/** angle4: 0右 / 1上 / 2左 / 3下 -> meta: 0東上 / 1西上 / 5西上逆 / 4東上逆 */
function angle4y_to_meta(angle4) {
    switch (normalize_angle4(angle4)) {
        case 0: return 0;
        case 1: return 1;
        case 2: return 5;
        case 3: return 4;
        default: return NaN;
    }
}
exports.angle4y_to_meta = angle4y_to_meta;
function rot_stairmeta(meta, angle4, f1, f2) {
    var upper_bit = meta & 12;
    var new_angle4 = f1(meta) + angle4;
    var new_meta = f2(new_angle4);
    return new_meta | upper_bit;
}
exports.rot_stairmeta = rot_stairmeta;
/** meta, angle4 -> new_meta */
function rot_stairmeta_x(meta, angle4) {
    return rot_stairmeta(meta, angle4, meta_to_angle4xy, angle4x_to_meta);
}
exports.rot_stairmeta_x = rot_stairmeta_x;
/** meta, angle4 -> new_meta */
function rot_stairmeta_y(meta, angle4) {
    return rot_stairmeta(meta, angle4, meta_to_angle4xy, angle4y_to_meta);
}
exports.rot_stairmeta_y = rot_stairmeta_y;
/** meta, angle4 -> new_meta */
function rot_stairmeta_z(meta, angle4) {
    return rot_stairmeta(meta, angle4, meta_to_angle4z, angle4z_to_meta);
}
exports.rot_stairmeta_z = rot_stairmeta_z;
function rev_stairmeta_x(meta) {
    return meta ^ 1;
}
exports.rev_stairmeta_x = rev_stairmeta_x;
function rev_stairmeta_y(meta) {
    return meta ^ 2;
}
exports.rev_stairmeta_y = rev_stairmeta_y;
function rev_stairmeta_z(meta) {
    return meta ^ 4;
}
exports.rev_stairmeta_z = rev_stairmeta_z;
var BlockList = /** @class */ (function () {
    function BlockList(list) {
        this.list = list;
    }
    BlockList.prototype.clone = function () {
        return new BlockList(this.list.map(function (b) { return b.clone(); }));
    };
    BlockList.prototype.apply = function (session) {
        this.list.forEach(function (b) { return b.apply(session); });
    };
    BlockList.prototype.move = function (d) {
        this.list.forEach(function (b) { return b.move(d); });
    };
    BlockList.prototype.rot_x = function (angle4) {
        this.list.forEach(function (b) { return b.rot_x(angle4); });
    };
    BlockList.prototype.rot_y = function (angle4) {
        this.list.forEach(function (b) { return b.rot_y(angle4); });
    };
    BlockList.prototype.rot_z = function (angle4) {
        this.list.forEach(function (b) { return b.rot_z(angle4); });
    };
    BlockList.prototype.rev_x = function () {
        this.list.forEach(function (b) { return b.rev_x(); });
    };
    BlockList.prototype.rev_y = function () {
        this.list.forEach(function (b) { return b.rev_y(); });
    };
    BlockList.prototype.rev_z = function () {
        this.list.forEach(function (b) { return b.rev_z(); });
    };
    return BlockList;
}());
exports.BlockList = BlockList;
var BlockDict = /** @class */ (function () {
    function BlockDict(dict) {
        this.dict = dict;
    }
    BlockDict.prototype.keys = function () {
        return Object.keys(this.dict);
    };
    BlockDict.prototype.list = function () {
        var _this = this;
        return this.keys().map(function (key) { return _this.dict[key]; });
    };
    BlockDict.prototype.clone = function () {
        var _this = this;
        var dict = {};
        this.keys().forEach(function (key) { return dict[key] = _this.dict[key].clone(); });
        return new BlockDict(dict);
    };
    BlockDict.prototype.apply = function (session) {
        this.list().forEach(function (b) { return b.apply(session); });
    };
    BlockDict.prototype.move = function (d) {
        this.list().forEach(function (b) { return b.move(d); });
    };
    BlockDict.prototype.rot_x = function (angle4) {
        this.list().forEach(function (b) { return b.rot_x(angle4); });
    };
    BlockDict.prototype.rot_y = function (angle4) {
        this.list().forEach(function (b) { return b.rot_y(angle4); });
    };
    BlockDict.prototype.rot_z = function (angle4) {
        this.list().forEach(function (b) { return b.rot_z(angle4); });
    };
    BlockDict.prototype.rev_x = function () {
        this.list().forEach(function (b) { return b.rev_x(); });
    };
    BlockDict.prototype.rev_y = function () {
        this.list().forEach(function (b) { return b.rev_y(); });
    };
    BlockDict.prototype.rev_z = function () {
        this.list().forEach(function (b) { return b.rev_z(); });
    };
    return BlockDict;
}());
exports.BlockDict = BlockDict;
var Block = /** @class */ (function () {
    function Block(pos) {
        this.pos = pos;
    }
    Block.prototype.move = function (d) {
        this.pos = this.pos.add(d);
    };
    Block.prototype.rot_x = function (angle4) {
        this.pos = rot_x(this.pos, angle4);
    };
    Block.prototype.rot_y = function (angle4) {
        this.pos = rot_y(this.pos, angle4);
    };
    Block.prototype.rot_z = function (angle4) {
        this.pos = rot_z(this.pos, angle4);
    };
    Block.prototype.rev_x = function () {
        this.pos = this.pos.el_mul([-1, 1, 1]);
    };
    Block.prototype.rev_y = function () {
        this.pos = this.pos.el_mul([1, -1, 1]);
    };
    Block.prototype.rev_z = function () {
        this.pos = this.pos.el_mul([1, 1, -1]);
    };
    return Block;
}());
exports.Block = Block;
var SimpleBlock = /** @class */ (function (_super) {
    __extends(SimpleBlock, _super);
    function SimpleBlock(pos, type) {
        var _this = _super.call(this, pos) || this;
        _this.type = type;
        return _this;
    }
    SimpleBlock.prototype.clone = function () {
        return new SimpleBlock(this.pos, this.type);
    };
    SimpleBlock.prototype.apply = function (session) {
        session.setBlock(v_to_jv(this.pos), this.type);
    };
    return SimpleBlock;
}(Block));
exports.SimpleBlock = SimpleBlock;
var MetaBlock = /** @class */ (function (_super) {
    __extends(MetaBlock, _super);
    function MetaBlock(pos, id, meta) {
        var _this = _super.call(this, pos) || this;
        _this.id = id;
        _this.meta = meta;
        return _this;
    }
    MetaBlock.prototype.clone = function () {
        return new MetaBlock(this.pos, this.id, this.meta);
    };
    MetaBlock.prototype.apply = function (session) {
        session.setBlock(v_to_jv(this.pos), new BaseBlock(this.id, this.meta));
    };
    return MetaBlock;
}(Block));
exports.MetaBlock = MetaBlock;
var StairBlock = /** @class */ (function (_super) {
    __extends(StairBlock, _super);
    function StairBlock(pos, id, meta) {
        var _this = _super.call(this, pos) || this;
        _this.id = id;
        _this.meta = meta;
        return _this;
    }
    StairBlock.prototype.clone = function () {
        return new StairBlock(this.pos, this.id, this.meta);
    };
    StairBlock.prototype.apply = function (session) {
        session.setBlock(v_to_jv(this.pos), new BaseBlock(this.id, this.meta));
    };
    StairBlock.prototype._override = function (f1, f2) {
        var new_block = f1();
        new_block.meta = f2(this.meta);
        return new_block;
    };
    StairBlock.prototype.rot_x = function (angle4) {
        _super.prototype.rot_x.call(this, angle4);
        this.meta = rot_stairmeta_x(this.meta, angle4);
    };
    StairBlock.prototype.rot_y = function (angle4) {
        _super.prototype.rot_y.call(this, angle4);
        this.meta = rot_stairmeta_y(this.meta, angle4);
    };
    StairBlock.prototype.rot_z = function (angle4) {
        _super.prototype.rot_z.call(this, angle4);
        this.meta = rot_stairmeta_z(this.meta, angle4);
    };
    StairBlock.prototype.rev_x = function () {
        _super.prototype.rev_x.call(this);
        this.meta = rev_stairmeta_x(this.meta);
    };
    StairBlock.prototype.rev_y = function () {
        _super.prototype.rev_y.call(this);
        this.meta = rev_stairmeta_y(this.meta);
    };
    StairBlock.prototype.rev_z = function () {
        _super.prototype.rev_z.call(this);
        this.meta = rev_stairmeta_z(this.meta);
    };
    return StairBlock;
}(Block));
exports.StairBlock = StairBlock;
