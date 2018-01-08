importPackage(Packages.com.sk89q.worldedit);
import * as ut from '../algorithm/utility';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';

type V3 = vc.V3;

export function jv_to_v(v: Vector): V3 {
    return vc.v3(v.getX(), -v.getZ(), v.getY());
}
export function v_to_jv(v: V3): Vector {
    return new Vector(v.x(), -v.z(), v.y());
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
export function rot_l(v: V3): V3 {
    return mx.rot_z_m3(ut.deg90).map(v);
}
export function rot_r(v: V3): V3 {
    return mx.rot_z_m3(-ut.deg90).map(v);
}

export function yaw_to_v(yaw: number): V3 {
    return vc.polar_to_v3(1, yaw_to_rad(yaw), 0);
}

/** V3 -> [yaw, pitch] */
export function v_to_yaw_pitch(v: V3): [number, number] {
    const rad_h = Math.atan2(v.y(), v.x());
    const rad_v = Math.atan2(v.z(), Math.sqrt(v.x() * v.x() + v.y() * v.y()));
    const yaw = rad_to_yaw(rad_h);
    const pitch = rad_to_yaw(rad_v);
    return [yaw, pitch];
}

/** (src: Vector, dst: Vector) -> [yaw, pitch] */
export function dir_yaw_pitch(src: Vector, dst: Vector): [number, number] {
    const d = jv_to_v(dst).sub(jv_to_v(src));
    return v_to_yaw_pitch(d);
}

