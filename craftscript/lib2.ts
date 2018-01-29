import * as ut from '../algorithm/utility';
import * as seq from '../algorithm/sequence';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as cv from '../algorithm/curve';

type V2 = vc.V2;
type V3 = vc.V3;
//type V4 = vc.V4;
type Ray2 = cv.Ray2;

/** 2点間の距離 */
export function distance<T extends vc.Vector<T>>(p1: T, p2: T): number {
    return p2.sub(p1).length();
}

/** 点と直線の距離 */
export function distance_lp(ray: Ray2, p: V2): number {
    // 平行四辺形の面積
    const n1 = ray.d.cp(p.sub(ray.c));
    // 平行四辺形の底面
    const n2 = ray.d.length();
    // 平行四辺形の高さ＝距離
    return Math.abs(n1 / n2);
}

/** 点と線分の距離 */
export function distance_sp(s1: V2, s2: V2, p: V2): number {
    const d1 = s2.sub(s1);
    const s1p = p.sub(s1);
    if (d1.ip(s1p) < 0) return s1p.length();
    const d2 = s1.sub(s2);
    const s2p = p.sub(s2);
    if (d2.ip(s2p) < 0) return s2p.length();
    const ray = cv.ray(s1, d1);
    return distance_lp(ray, p);
}

export class Voxel {
    public d: V3;
    constructor(
        public p1: V3,
        public p2: V3,
    ) {
        this.d = p2.sub(p1);
    }

    static seq(n1: number, n2: number): number[] {
        return seq.range_step(n1, n2, n1 <= n2 ? 1 : -1);
    }
    seq_x(): number[] {
        return Voxel.seq(this.p1.x, this.p2.x);
    }
    seq_y(): number[] {
        return Voxel.seq(this.p1.y, this.p2.y);
    }
    seq_z(): number[] {
        return Voxel.seq(this.p1.z, this.p2.z);
    }
    scan(ii: number[], jj: number[], kk: number[], fn: (i: number, j: number, k: number) => void): void {
        ii.forEach(i => {
            jj.forEach(j => {
                kk.forEach(k => {
                    fn(i, j, k);
                });
            });
        });
    }
    scan_xyz(fn: (x: number, y: number, z: number) => void): void {
        this.scan(this.seq_x(), this.seq_y(), this.seq_z(), (x, y, z) => fn(x, y, z));
    }
    scan_yxz(fn: (x: number, y: number, z: number) => void): void {
        this.scan(this.seq_y(), this.seq_x(), this.seq_z(), (y, x, z) => fn(x, y, z));
    }
    scan_zxy(fn: (x: number, y: number, z: number) => void): void {
        this.scan(this.seq_z(), this.seq_x(), this.seq_y(), (z, x, y) => fn(x, y, z));
    }
    scan_zyx(fn: (x: number, y: number, z: number) => void): void {
        this.scan(this.seq_z(), this.seq_y(), this.seq_x(), (z, y, x) => fn(x, y, z));
    }
}

/** 円の内外判定機. 1より小:内側, 1:周上, 1より大:外側 */
export function f_circle(o: V2, r: V2): (x: number, y: number) => number {
    const r2 = r.el_mul(r);
    return (x, y) => {
        const p = vc.v2(x, y).sub(o);
        const d = p.el_mul(p).el_div(r2);
        return d.x + d.y;
    };
}
/** 球の内外判定機. 1より小:内側, 1:面上, 1より大:外側 */
export function f_sphere(o: V3, r: V3): (x: number, y: number, z: number) => number {
    const r2 = r.el_mul(r);
    return (x, y, z) => {
        const p = vc.v3(x, y, z).sub(o);
        const d = p.el_mul(p).el_div(r2);
        return d.x + d.y + d.z;
    };
}

/** 長方形の内外判定機. 1より小:内側, 1:周上, 1より大:外側 */
export function f_square(o: V2, r: V2): (x: number, y: number) => number {
    return (x, y) => {
        const p = vc.v2(x, y).sub(o);
        const d = p.el_div(r);
        return Math.max(Math.abs(d.x), Math.abs(d.y));
    };
}
/** 直方体の内外判定機. 1より小:内側, 1:面上, 1より大:外側 */
export function f_cube(o: V3, r: V3): (x: number, y: number, z: number) => number {
    return (x, y, z) => {
        const p = vc.v3(x, y, z).sub(o);
        const d = p.el_div(r);
        return Math.max(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
    };
}

/** ひし形の内外判定機. 1より小:内側, 1:周上, 1より大:外側 */
export function f_rhombus(o: V2, r: V2): (x: number, y: number) => number {
    return (x, y) => {
        const p = vc.v2(x, y).sub(o);
        const d = p.el_div(r);
        return Math.abs(d.x) + Math.abs(d.y);
    };
}
/** 八面体の内外判定機. 1より小:内側, 1:面上, 1より大:外側 */
export function f_octahedron(o: V3, r: V3): (x: number, y: number, z: number) => number {
    return (x, y, z) => {
        const p = vc.v3(x, y, z).sub(o);
        const d = p.el_div(r);
        return Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z);
    };
}

export namespace voxel3 {
    export enum IO {
        Inner = -1,
        Face = 0,
        Outer = 1,
    }
    export let E = 1e-6;

    export function set_E(new_E: number): void {
        E = new_E;
    }

    export function is_near(n1: number, n2: number): boolean {
        return Math.abs(n2 - n1) < E;
    }
    export function io_base(n: number): IO {
        if (Math.abs(n) < E) return IO.Face;
        return n < 0 ? IO.Inner : IO.Outer;
    }
    export function io_isin(n: number, min: number, max: number): IO {
        if (min > max) {
            const min_tmp = min;
            min = max;
            max = min_tmp;
        }
        if (min < n && n < max) return IO.Inner;
        if (is_near(n, min) || is_near(n, max)) return IO.Face;
        return IO.Outer;
    }
    export function merge_io(ios: IO[]): IO {
        return ios.reduce((a, b) => {
            if (a == IO.Outer || b == IO.Outer) return IO.Outer;
            if (a == IO.Inner && b == IO.Inner) return IO.Inner;
            return IO.Face;
        });
    }

    export function to_rate(t0: number, t1: number, n: number): number {
        const d = t1 - t0;
        const dn = n - t0;
        return dn / d;
    }

    /** マイナス:内側, 0:面上, プラス:外側 */

    export function base_circle(r: V2|number[], p: V2): IO {
        const d1 = p.el_div(r);
        const d2 = d1.el_mul(d1);
        const n = d2.x + d2.y - 1;
        return io_base(n);
    }

    export function base_sphere(r: V3|number[], p: V3): IO {
        const d1 = p.el_div(r);
        const d2 = d1.el_mul(d1);
        const n = d2.x + d2.y + d2.z - 1;
        return io_base(n);
    }
    export function base_cube(r: V3|number[], p: V3): IO {
        const d = p.el_div(r);
        const n = Math.max(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z)) - 1;
        return io_base(n);
    }
    export function base_octahedron(r: V3|number[], p: V3): IO {
        const d = p.el_div(r);
        const n = Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z) - 1;
        return io_base(n);
    }

    export function sphere(r: V3|number[], f: (v: V3) => V3): (x: number, y: number, z: number) => IO {
        return (x, y, z) => base_sphere(r, f(vc.v3(x, y, z)));
    }
    export function cube(r: V3|number[], f: (v: V3) => V3): (x: number, y: number, z: number) => IO {
        return (x, y, z) => base_cube(r, f(vc.v3(x, y, z)));
    }
    export function octahedron(r: V3|number[], f: (v: V3) => V3): (x: number, y: number, z: number) => IO {
        return (x, y, z) => base_octahedron(r, f(vc.v3(x, y, z)));
    }

    export function base_cyrinder(r: V2|number[], h: number, p: V3): IO {
        const io_z = io_isin(p.z, 0, h);
        if (io_z == IO.Outer) return IO.Outer;
        const io_xy = base_circle(r, vc.v2(p.x, p.y));
        return merge_io([io_z, io_xy]);
    }
    export function base_cone(r: V2|number[], h: number, p: V3): IO {
        const io_z = io_isin(p.z, 0, h);
        if (io_z == IO.Outer) return IO.Outer;
        const rz = vc.to_v2_if(r).scalar(1 - p.z);
        const io_xy = base_circle(rz, vc.v2(p.x, p.y));
        return merge_io([io_z, io_xy]);
    }

    export function cyrinder(r: V2|number[], h: number, f: (v: V3) => V3): (x: number, y: number, z: number) => IO {
        return (x, y, z) => base_cyrinder(r, h, f(vc.v3(x, y, z)));
    }
    export function cone(r: V2|number[], h: number, f: (v: V3) => V3): (x: number, y: number, z: number) => IO {
        return (x, y, z) => base_cone(r, h, f(vc.v3(x, y, z)));
    }


    export function rev_trans(v: number[]|V3): mx.M4 {
        return mx.trans_m4(vc.to_v3_if(v).scalar(-1));
    }
    export function rev_rot_x(rad: number): mx.M4 {
        return mx.rot_x_m4(-rad);
    }
    export function rev_rot_y(rad: number): mx.M4 {
        return mx.rot_y_m4(-rad);
    }
    export function rev_rot_z(rad: number): mx.M4 {
        return mx.rot_z_m4(-rad);
    }
    export function rev_scale(v: number[]|V3): mx.M4 {
        return mx.scale_m4(vc.v3(1, 1, 1).el_div(v));
    }

    export function rev_compose(mx_array: mx.M4[]): (v: V3) => V3 {
        return v => mx.compose_rev(mx_array).map_v3(v, 1);
    }
}

export namespace vseq {
    export function arc_xy(rads: number[]): V2[] {
        return rads.map(rad => vc.polar_to_v2(1, rad));
    }
    export function arc_x2y(xx: number[]): V2[] {
        return xx.map(x => [x, Math.acos(x)]).map(x_rad => vc.v2(x_rad[0], Math.sin(x_rad[1])));
    }
    export function arc_y2x(yy: number[]): V2[] {
        return yy.map(y => [y, Math.asin(y)]).map(y_rad => vc.v2(Math.cos(y_rad[1]), y_rad[0]));
    }
    export function deg2_to_rads(deg1: number, deg2: number, count: number, wo_last: boolean=false): number[] {
        const f = !wo_last ? seq.range : seq.range_wo_last;
        return f(ut.deg_to_rad(deg1), ut.deg_to_rad(deg2), count);
    }
}
