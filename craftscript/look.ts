importPackage(Packages.com.sk89q.worldedit);
import * as lib from './lib';

export function look() {
    const curPos = player.getPosition();
    const curYaw = player.getYaw();
    const curPitch = player.getPitch();

    if (!argv[1] || !argv[2]) {
        player.print('position: ' + curPos.toString());
        player.print('yaw: ' + curYaw);
        player.print('pitch: ' + curPitch);
    }
    let newYaw = curYaw;
    let newPitch = curPitch;

    if (argv[3] != null) {
        context.checkArgs(1, 3, "<x> <y> <z>");
        const dst = new Vector(+argv[1], +argv[2], +argv[3]);
        const yaw_pitch = lib.dir_yaw_pitch(curPos, dst);
        newYaw = yaw_pitch[0];
        newPitch = yaw_pitch[1];
    } else {
        context.checkArgs(1, 2, "<yaw(0:South, 90:West, 180:North, 270:East)> [pitch(-90:Up, 0:Hor, 90:Down)]");
        newYaw = argv[1] ? parseInt(argv[1], 10) : curYaw;
        newPitch = argv[2] ? parseInt(argv[2], 10) : curPitch;
    }
    player.setPosition(curPos, newPitch, newYaw);
    player.print('yaw: ' + curYaw + ' -> ' + newYaw);
    player.print('pitch: ' + curPitch + ' -> ' + newPitch);
}

look();
