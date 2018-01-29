"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
importPackage(Packages.com.sk89q.worldedit);
var lib = require("./lib");
function move() {
    context.checkArgs(1, 5, '<front> [left] [top] [loop] [interval]');
    var d_flont = lib.yaw_to_v(player.getYaw());
    var d_left = lib.rot_z(d_flont, 1);
    var df = d_flont.scalar(+argv[1]);
    var dl = d_left.scalar(+argv[2]);
    var d = df.add(dl).add([0, 0, +argv[3]]);
    var loop = +argv[4];
    var pos = lib.jv_to_v(player.getPosition());
    var count = 0;
    var fn = function () {
        pos = pos.add(d);
        player.setPosition(lib.v_to_jv(pos));
        count++;
        if (count < loop)
            fn();
    };
    if (count < loop)
        fn();
}
exports.move = move;
move();
