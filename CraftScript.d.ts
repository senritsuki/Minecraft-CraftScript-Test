
type int = number;
type float = number;
type double = number;

declare interface Object {
    /** Returns a string representation of the Object. */
    toString(): string;
}

/** java.lang.Object > com.sk89q.worldedit.scripting.CraftScriptEnvironment */
declare class CraftScriptEnvironment implements Object {
}

/** java.lang.Object > com.sk89q.worldedit.scripting.CraftScriptEnvironment > com.sk89q.worldedit.scripting.CraftScriptContext */
declare class CraftScriptContext extends CraftScriptEnvironment {
    /** Checks to make sure that there are enough but not too many arguments. 
        min: int.
        max: int. -1 for no maximum
        usage: usage string
        Throws: InsufficientArgumentsException */
    checkArgs(min: int, max: int, usage: string): void;
    /** Get a block.*/
    getBlock(id: string): BaseBlock;
    /**  Get the player's session. */
    getSession(): LocalSession;
    /** Print a regular message to the user. */
    print(msg: string): void;
    /** Print an raw message to the user. */
    printRaw(msg: string): void;
    /** Get an edit session. Every subsequent call returns a new edit session. Usually you only need to use one edit session. */
    remember(): EditSession;
}
 
/** java.lang.Object > com.sk89q.worldedit.LocalPlayer */
declare class LocalPlayer implements Object {
    /** Get the point of the block that is being stood upon. */
    getBlockOn(): WorldVector;
    /** Get the player's position. */
    getPosition(): WorldVector;
    /** Get the player's view yaw. number: double.
        0: South,
        90: West,
        180: North,
        270: East */
    getYaw(): double;
    /** Get the player's view pitch. number: double.
        -90: Up,
        0: Horizontal,
        90: Down */
    getPitch(): double;
    /** Print a WorldEdit message. */
    print(msg: string): void;
    /** Print a message. */
    printRaw(msg: string): void;
    /** Move the player. pitch: float, yaw: float. */
    setPosition(pos: Vector, pitch?: float, yaw?: float): void;
}

/** java.lang.Object > com.sk89q.worldedit.EditSession */
declare class EditSession implements Object {
    /** Gets the block type at a position x, y, z. */
    getBlock(pt: Vector): BaseBlock;
    /** Gets the block type at a position x, y, z. */
    getBlockType(pt: Vector): int;
    /** Sets the block at position x, y, z with a block type. If queue mode is enabled, blocks may not be actually set in world until flushQueue() is called.*/
    setBlock(pt: Vector, block: BaseBlock): boolean;
}

/** java.lang.Object > com.sk89q.worldedit.LocalSession */
declare class LocalSession implements Object {
    /** Get the selection region. */
    getSelection(world: LocalWorld): Region;
    /** Get the selection world. */
    getSelectionWorld(): LocalWorld;
}

/** java.lang.Object > com.sk89q.worldedit.LocalWorld */
declare class LocalWorld implements Object {
}

/** com.sk89q.worldedit.regions */
declare class Region {
    /** Returns true based on whether the region contains the point, */
    contains(pt: Vector): boolean;
    /** Get the center point of a region. Note: Coordinates will not be integers if the corresponding lengths are even. */
    getCenter(): Vector;
    /** Get Y-size. */
    getHeight(): int;
    /** Get Z-size. */
    getLength(): int;
    /** Get the upper point of a region. */
    getMaximumPoint(): Vector;
    /** Get the lower point of a region. */
    getMinimumPoint(): Vector;
    /** Get X-size. */
    getWidth(): int;
}

/** java.lang.Object > com.sk89q.worldedit.Vector */
declare class Vector implements Object {
    constructor(x: double, y: double, z: double);

    /** Adds two points. */
    add(x: double, y: double, z: double): Vector;
    /** get x. */
    getX(): double; 
    /** get y. */
    getY(): double; 
    /** get z. */
    getZ(): double; 
    /** set x. */
    setX(x: double): Vector; 
    /** set y. */
    setY(y: double): Vector; 
    /** set z. */
    setZ(z: double): Vector; 
}
/** java.lang.Object > com.sk89q.worldedit.Vector > com.sk89q.worldedit.WorldVector */
declare class WorldVector extends Vector {
}

/** java.lang.Object > com.sk89q.worldedit.foundation.Block */
declare class Block implements Object {
    /** Get the ID of the block.
        Returns: ID (between 0 and MAX_ID) */
    getId(): int;
    /** Set the block ID. 
        id - block id (between 0 and MAX_ID). */
    setId(id: int): void;
    /** Get the block's data value.
        Returns: data value (0-15) */
    getData(): int;
    /** Set the block's data value.
        data - block data value (between 0 and MAX_DATA). */
    setData(data: int): void;
    /** Return the name of the title entity ID.
        Returns: tile entity ID, non-null string */
    getNbtId(): string;
    /** Get the object's NBT data (tile entity data). 
        The returned tag, if modified in any way, should be sent to NbtValued.setNbtData(CompoundTag) so that the instance knows of the changes. 
        Making changes without calling NbtValued.setNbtData(CompoundTag) could have unintended consequences.
        Returns: compound tag, or null */
    getNbtData(): CompoundTag;
    /** Set the object's NBT data (tile entity data).
        nbtData - NBT data, or null if no data
        Throws: DataException - if possibly the data is invalid */
    setNbtData(nbtData: CompoundTag): void;
}
/** java.lang.Object > com.sk89q.worldedit.foundation.Block > com.sk89q.worldedit.blocks.BaseBlock */
declare class BaseBlock extends Block {
    constructor(type: int, data?: int);
    /** Cycle the damage value of the block forward or backward. 
        Parameters: increment - 1 for forward, -1 for backward. 
        Returns: new data value */
    cycleData(increment: int): int;
}
/** java.lang.Object > com.sk89q.jnbt.Tag
    Represents a single NBT tag. */
declare class Tag implements Object {
}
/** java.lang.Object > com.sk89q.jnbt.Tag > com.sk89q.jnbt.CompoundTag
    The TAG_Compound tag. */
declare class CompoundTag extends Tag {
}

/** an instance of CraftScriptContext */
declare var context: CraftScriptContext;
/** a copy of the player, an instance of LocalPlayer */
declare var player: LocalPlayer;
/** a Java array of arguments as strings */
declare var argv: string[];

declare var Packages: any;
declare function importPackage(name: any): any;
