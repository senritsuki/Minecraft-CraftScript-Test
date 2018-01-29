importPackage(Packages.com.sk89q.worldedit);
import * as lib from './lib';

export function move() {
    context.checkArgs(1, 5, '<front> [left] [top] [loop] [interval]');

    const d_flont = lib.yaw_to_v(player.getYaw());
    const d_left = lib.rot_z(d_flont, 1);
    const df = d_flont.scalar(+argv[1]);
    const dl = d_left.scalar(+argv[2]);
    const d = df.add(dl).add([0, 0, +argv[3]]);

    const loop = +argv[4];
    let pos = lib.jv_to_v(player.getPosition());
    let count = 0;

    const fn = () => {
        pos = pos.add(d);
        player.setPosition(lib.v_to_jv(pos));
        count++;
        if (count < loop) fn();
    };
    if (count < loop) fn();
}

move();
