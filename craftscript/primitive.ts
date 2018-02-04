import * as ut from '../algorithm/utility';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as cv from '../algorithm/curve';

export interface Primitive {
    apply(translation: Translation|Translation[]): void;
    to_bool(): (v: vc.V3) => boolean;
    to_geo(): any; //al.Geo;
}
export class BasePrimitive implements Primitive {
    constructor(
        public b3: (v: vc.V3) => boolean,
        public translations: Translation[] = [],
    ){}

    apply(translation: Translation|Translation[]): void {
        this.translations = this.translations.concat(translation);
    }
    to_bool(): (v: vc.V3) => boolean {
        const map = this.merge_translation_rev();
        const sub = this.b3;
        return v => sub(map.map_v3(v, 1));
    }
    to_geo(): any {}

    merge_translation(): mx.M4 {
        return mx.compose(this.translations.map(t => t.do()));
    }
    merge_translation_rev(): mx.M4 {
        return mx.compose_rev(this.translations.map(t => t.doRev()));
    }
}

export interface Translation {
    do(): mx.M4;
    doRev(): mx.M4;
}
export class BaseTranslation<T> implements Translation {
    constructor(
        public value: T,
        public map: (value: T) => mx.M4,
        public rev: (value: T) => T,
    ) {}

    do(): mx.M4 {
        return this.map(this.value);
    }
    doRev(): mx.M4 {
        return this.map(this.rev(this.value));
    }
}
export class Trans extends BaseTranslation<vc.V3> {
    constructor(
        v: vc.V3|number[],
    ) {
        super(
            vc.to_v3_if(v),
            mx.trans_m4,
            v => v.scalar(-1),
        );
    }
}
export class Rot extends BaseTranslation<number> {
    constructor(
        rad: number,
        map: (rad: number) => mx.M4,
    ) {
        super(
            rad,
            map,
            rad => -rad,
        );
    }
}
export class RotX extends Rot {
    constructor(rad: number) {
        super(rad, mx.rot_x_m4);
    }
}
export class RotY extends Rot {
    constructor(rad: number) {
        super(rad, mx.rot_y_m4);
    }
}
export class RotZ extends Rot {
    constructor(rad: number) {
        super(rad, mx.rot_z_m4);
    }
}
export class Scale extends BaseTranslation<vc.V3> {
    constructor(
        v: vc.V3|number[],
    ) {
        super(
            vc.to_v3_if(v),
            mx.scale_m4,
            v => vc.v3(1, 1, 1).el_div(v),
        );
    }
}

/** 任意の平面形状の角柱 */
export function Prism(xy: (v: vc.V2) => boolean): Primitive {
    return new BasePrimitive(v => {
        if (v.z < 0 || v.z > 1) return false;
        return xy(vc.v3_to_v2(v));
    });
}
/** 任意の平面形状の角錐 */
export function Cone(xy: (v: vc.V2) => boolean): Primitive {
    return new BasePrimitive(v => {
        if (v.z < 0 || v.z > 1) return false;
        if (v.z == 1) {
            v = vc.v3(0, 0, 1);
        } else {
            v = v.scalar(1 / (1 - v.z));
        }
        return xy(vc.v3_to_v2(v));
    });
}

/** 半径1の円 */
export function b2_circle(v: vc.V2): boolean {
    v = v.el_mul(v);
    return v.x + v.y <= 1;
}
/** 半径1の円に外接する正方形 */
export function b2_square(v: vc.V2): boolean {
    return Math.max(Math.abs(v.x), Math.abs(v.y)) <= 1;
}
/** 半径1の円に内接するひし形 */
export function b2_rhombus(v: vc.V2): boolean {
    return Math.abs(v.x) + Math.abs(v.y) <= 1;
}
/** 半径1のパイ */
export function build_b2_pie(deg_max: number): (v: vc.V2) => boolean {
    return v => {
        const r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1) return false;
        const deg = ut.rad_to_deg(r_r[1]);
        return ut.isin(0, deg_max, deg);
    }
}

/** 半径1の球 */
export function b3_sphere(v: vc.V3): boolean {
    v = v.el_mul(v);
    return v.x + v.y + v.z <= 1;
}
/** 半径1の球に外接する立方体 */
export function b3_cube(v: vc.V3): boolean {
    return Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)) <= 1;
}
/** 半径1の球に内接する正八面体 */
export function b3_octahedron(v: vc.V3): boolean {
    return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z) <= 1;
}
/** 半径1の球の一部 */
export function build_b3_pie(deg_h_max: number, deg_v_min: number, deg_v_max: number): (v: vc.V3) => boolean {
    return v => {
        const r_rh_rv = vc.v3_to_sphere(v);
        if (r_rh_rv[0] > 1) return false;
        const deg_h = ut.rad_to_deg(r_rh_rv[1]);
        const deg_v = ut.rad_to_deg(r_rh_rv[2]);
        return ut.isin(0, deg_h_max, deg_h) && ut.isin(deg_v_min, deg_v_max, deg_v);
    }
}
/** 線分 */
export function build_b3_segment(p1: vc.V3, p2: vc.V3, r: number): (v: vc.V3) => boolean {
    return v => cv.distance_sp(p1, p2, v) <= r;
}

/** 半径1の球 */
export function Sphere(): Primitive {
    return new BasePrimitive(b3_sphere);
}
/** 半径1の球に外接する立方体 */
export function Cube(): Primitive {
    return new BasePrimitive(b3_cube);
}
/** 半径1の球に内接する正八面体 */
export function Octahedron(): Primitive {
    return new BasePrimitive(b3_octahedron);
}





export function hoge() {
    //const map = new Map();
    //const set = new Set();
}
