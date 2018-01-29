importPackage(Packages.com.sk89q.worldedit);
import * as ut from '../algorithm/utility';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';

type V3 = vc.V3;

export function jv_to_v(v: Vector): V3 {
    return vc.v3(v.getX(), -v.getZ(), v.getY());
}
export function v_to_jv(v: V3): Vector {
    return new Vector(v.x, -v.z, v.y);
}

export function yaw_to_rad(yaw: number): number {
    return ut.deg_to_rad(-1 * yaw + 270);
}
export function rad_to_yaw(rad: number): number {
    return (ut.rad_to_deg(rad) - 270) * -1;
}
export function pitch_to_rad(pitch: number): number {
    return ut.deg_to_rad(-1 * pitch);
}
export function rad_to_pitch(rad: number): number {
    return ut.rad_to_deg(rad) * -1;
}

export function rot_x(v: V3, angle4: number): V3 {
    return mx.rot_x_m3(ut.deg90 * angle4).map(v);
}
export function rot_y(v: V3, angle4: number): V3 {
    return mx.rot_y_m3(ut.deg90 * angle4).map(v);
}
export function rot_z(v: V3, angle4: number): V3 {
    return mx.rot_z_m3(ut.deg90 * angle4).map(v);
}

export function yaw_to_v(yaw: number): V3 {
    return vc.polar_to_v3(1, yaw_to_rad(yaw), 0);
}

/** V3 -> [yaw, pitch] */
export function v_to_yaw_pitch(v: V3): [number, number] {
    const rad_h = Math.atan2(v.y, v.x);
    const rad_v = Math.atan2(v.z, Math.sqrt(v.x * v.x + v.y * v.y));
    const yaw = rad_to_yaw(rad_h);
    const pitch = rad_to_yaw(rad_v);
    return [yaw, pitch];
}

/** (src: Vector, dst: Vector) -> [yaw, pitch] */
export function dir_yaw_pitch(src: Vector, dst: Vector): [number, number] {
    const d = jv_to_v(dst).sub(jv_to_v(src));
    return v_to_yaw_pitch(d);
}


export const Stair_E = 0;
export const Stair_N = 3;
export const Stair_W = 1;
export const Stair_S = 2;
export const Stair_ER = Stair_E | 4;
export const Stair_NR = Stair_N | 4;
export const Stair_WR = Stair_W | 4;
export const Stair_SR = Stair_S | 4;

export function normalize_angle4(angle4: number): number {
    angle4 %= 4;
    if (angle4 < 0) angle4 += 4;
    return angle4;
}

/** meta: 0東 / 3北 / 1西 / 2南 -> angle4: 0右 / 1上 / 2左 / 3下 */
export function meta_to_angle4z(meta: number): number {
    meta &= 3;
    switch(meta) {
        case 0: return 0;
        case 3: return 1;
        case 1: return 2;
        case 2: return 3;
        default: return NaN;
    }
}
/** meta: 0東上 / 1西上 / 5西上逆 / 4東上逆 -> angle4: 0右上 / 1左上 / 2左下 / 3右下 */
/** meta: 2南上 / 3北上 / 7北上逆 / 6南上逆 -> angle4: 0右上 / 1左上 / 2左下 / 3右下 */
export function meta_to_angle4xy(meta: number): number {
    meta &= 5;  // 2ビット目が0なら東西, 1なら南北. 落とせば共通
    switch(meta) {
        case 0: return 0;
        case 1: return 1;
        case 5: return 2;
        case 4: return 3;
        default: return NaN;
    }
}

/** angle4: 0右 / 1上 / 2左 / 3下 -> meta: 0東 / 3北 / 1西 / 2南 */
export function angle4z_to_meta(angle4: number): number {
    switch(normalize_angle4(angle4)) {
        case 0: return 0;
        case 1: return 3;
        case 2: return 1;
        case 3: return 2;
        default: return NaN;
    }
}
/** angle4: 0右 / 1上 / 2左 / 3下 -> meta: 2南上 / 3北上 / 7北上逆 / 6南上逆 */
export function angle4x_to_meta(angle4: number): number {
    switch(normalize_angle4(angle4)) {
        case 0: return 2;
        case 1: return 3;
        case 2: return 7;
        case 3: return 6;
        default: return NaN;
    }
}
/** angle4: 0右 / 1上 / 2左 / 3下 -> meta: 0東上 / 1西上 / 5西上逆 / 4東上逆 */
export function angle4y_to_meta(angle4: number): number {
    switch(normalize_angle4(angle4)) {
        case 0: return 0;
        case 1: return 1;
        case 2: return 5;
        case 3: return 4;
        default: return NaN;
    }
}

export function rot_stairmeta(meta: number, angle4: number, f1: (meta: number) => number, f2: (angle4: number) => number): number {
    const upper_bit = meta & 12;
    const new_angle4 = f1(meta) + angle4;
    const new_meta = f2(new_angle4);
    return new_meta | upper_bit;
}
/** meta, angle4 -> new_meta */
export function rot_stairmeta_x(meta: number, angle4: number): number {
    return rot_stairmeta(meta, angle4, meta_to_angle4xy, angle4x_to_meta);
}
/** meta, angle4 -> new_meta */
export function rot_stairmeta_y(meta: number, angle4: number): number {
    return rot_stairmeta(meta, angle4, meta_to_angle4xy, angle4y_to_meta);
}
/** meta, angle4 -> new_meta */
export function rot_stairmeta_z(meta: number, angle4: number): number {
    return rot_stairmeta(meta, angle4, meta_to_angle4z, angle4z_to_meta);
}
export function rev_stairmeta_x(meta: number): number {
    return meta ^ 1;
}
export function rev_stairmeta_y(meta: number): number {
    return meta ^ 2;
}
export function rev_stairmeta_z(meta: number): number {
    return meta ^ 4;
}

export interface BlockInterface {
    clone(): BlockInterface;
    apply(session: EditSession): void;
    move(d: V3): void;
    rot_x(angle4: number): void;
    rot_y(angle4: number): void;
    rot_z(angle4: number): void;
    rev_x(): void;
    rev_y(): void;
    rev_z(): void;
}

export class BlockList implements BlockInterface {
    constructor(
        public list: BlockInterface[],
    ) {}

    clone(): BlockList {
        return new BlockList(this.list.map(b => b.clone()));
    }
    apply(session: EditSession): void {
        this.list.forEach(b => b.apply(session));
    }

    move(d: V3): void {
        this.list.forEach(b => b.move(d));
    }
    rot_x(angle4: number): void {
        this.list.forEach(b => b.rot_x(angle4));
    }
    rot_y(angle4: number): void {
        this.list.forEach(b => b.rot_y(angle4));
    }
    rot_z(angle4: number): void {
        this.list.forEach(b => b.rot_z(angle4));
    }
    rev_x(): void {
        this.list.forEach(b => b.rev_x());
    }
    rev_y(): void {
        this.list.forEach(b => b.rev_y());
    }
    rev_z(): void {
        this.list.forEach(b => b.rev_z());
    }
}

export class BlockDict implements BlockInterface {
    constructor(
        public dict: {[key: string]: BlockInterface},
    ) {}

    keys(): string[] {
        return Object.keys(this.dict);
    }
    list(): BlockInterface[] {
        return this.keys().map(key => this.dict[key]);
    }

    clone(): BlockDict {
        const dict: {[key: string]: BlockInterface} = {};
        this.keys().forEach(key => dict[key] = this.dict[key].clone());
        return new BlockDict(dict);
    }
    apply(session: EditSession): void {
        this.list().forEach(b => b.apply(session));
    }

    move(d: V3): void {
        this.list().forEach(b => b.move(d));
    }
    rot_x(angle4: number): void {
        this.list().forEach(b => b.rot_x(angle4));
    }
    rot_y(angle4: number): void {
        this.list().forEach(b => b.rot_y(angle4));
    }
    rot_z(angle4: number): void {
        this.list().forEach(b => b.rot_z(angle4));
    }
    rev_x(): void {
        this.list().forEach(b => b.rev_x());
    }
    rev_y(): void {
        this.list().forEach(b => b.rev_y());
    }
    rev_z(): void {
        this.list().forEach(b => b.rev_z());
    }
}

export abstract class Block<T extends Block<T>> implements BlockInterface {
    constructor(
        public pos: V3,
    ){}

    abstract clone(): T;
    abstract apply(session: EditSession): void;

    move(d: V3): void {
        this.pos = this.pos.add(d);
    }
    rot_x(angle4: number): void {
        this.pos = rot_x(this.pos, angle4);
    }
    rot_y(angle4: number): void {
        this.pos = rot_y(this.pos, angle4);
    }
    rot_z(angle4: number): void {
        this.pos = rot_z(this.pos, angle4);
    }
    rev_x(): void {
        this.pos = this.pos.el_mul([-1, 1, 1]);
    }
    rev_y(): void {
        this.pos = this.pos.el_mul([1, -1, 1]);
    }
    rev_z(): void {
        this.pos = this.pos.el_mul([1, 1, -1]);
    }
}

export class SimpleBlock extends Block<SimpleBlock> {
    constructor(
        pos: V3,
        public type: BaseBlock,
    ){
        super(pos);
    }
    clone(): SimpleBlock {
        return new SimpleBlock(this.pos, this.type);
    }
    apply(session: EditSession): void {
        session.setBlock(v_to_jv(this.pos), this.type);
    }
}

export class MetaBlock extends Block<MetaBlock> {
    constructor(
        pos: V3,
        public id: number,
        public meta: number
    ){
        super(pos);
    }
    clone(): MetaBlock {
        return new MetaBlock(this.pos, this.id, this.meta);
    }
    apply(session: EditSession): void {
        session.setBlock(v_to_jv(this.pos), new BaseBlock(this.id, this.meta));
    }
}
export class StairBlock extends Block<StairBlock> {
    constructor(
        pos: V3,
        public id: number,
        public meta: number
    ){
        super(pos);
    }
    clone(): StairBlock {
        return new StairBlock(this.pos, this.id, this.meta);
    }
    apply(session: EditSession): void {
        session.setBlock(v_to_jv(this.pos), new BaseBlock(this.id, this.meta));
    }

    _override(f1: () => StairBlock, f2: (meta: number) => number): StairBlock {
        const new_block = f1();
        new_block.meta = f2(this.meta);
        return new_block;
    }
    rot_x(angle4: number): void {
        super.rot_x(angle4);
        this.meta = rot_stairmeta_x(this.meta, angle4);
    }
    rot_y(angle4: number): void {
        super.rot_y(angle4);
        this.meta = rot_stairmeta_y(this.meta, angle4);
    }
    rot_z(angle4: number): void {
        super.rot_z(angle4);
        this.meta = rot_stairmeta_z(this.meta, angle4);
    }
    rev_x(): void {
        super.rev_x();
        this.meta = rev_stairmeta_x(this.meta);
    }
    rev_y(): void {
        super.rev_y();
        this.meta = rev_stairmeta_y(this.meta);
    }
    rev_z(): void {
        super.rev_z();
        this.meta = rev_stairmeta_z(this.meta);
    }
}
