# Minecraft CraftScript Test

Minecraft MOD の WorldEdit の CraftScript を試す。

## CraftScriptメモ

3つのグローバル変数：

- context: [CraftScriptContext](http://docs.sk89q.com/worldedit/apidocs/com/sk89q/worldedit/scripting/CraftScriptContext.html)
- player: [LocalPlayer](http://docs.sk89q.com/worldedit/apidocs/com/sk89q/worldedit/LocalPlayer.html)
- argv: string[]

足元のブロックを黄色い羊毛（35:4, CLOTH:YELLOW）に置換する例：

```JavaScript
importPackage(Packages.com.sk89q.worldedit.blocks);
const target_block = new BaseBlock(BlockID.CLOTH, 4);   // 黄色い羊毛
const target_pos = player.getBlockOn();     // 足元
const sess = context.remember();
sess.setBlock(target_pos, target_block);    // 足元に黄色い羊毛を設置
```

スクリプト引数チェックの例：

```TypeScript
context.checkArgs(1, 3, "<block> [width] [height]");
const block = context.getBlock(argv[1]);
```



## ブロックメモ

### 空

- 0 AIR

### 地

- 1 Stone
- 2 Grass
- 3 Dirt
- 12 Sand

### 木

木材

- 5 Wood Plank

原木

- 17 Wood
- 162 Wood 2

葉

- 18 Leaves
- 161 Leaves 2

木材の階段

- 53 Oak Wood Stairs
- 134 Spruce Wood Stairs
- 135 Birch Wood Stairs
- 136 Jungle Wood Stairs
- 163 Acacia Wood Stairs
- 164 Dark Oak Wood Stairs

木材の種類はメタ値で指定する。

- 0 Oak
- 1 Spruce
- 2 Birch
- 3 Jungle
- 4 Acacia
- 5 Dark Ork

原木と葉の種類はメタ値で指定する。

- 0 Oak
- 1 Spruce
- 2 Birch
- 3 Jungle
- 0 Acacia
- 1 Dark Ork

原木の向きはメタ値で指定する。（ビットマスク）

- 0 上下
- 4 東西
- 8 南北
- 12 全面

階段の向きはメタ値で指定する。（方法は後述）

### 植物

- 37 Dandelion
- 38:0 Poppy
- 38:1 Blue Orchid
- 38:2 Allium
- 38:3 Azure Bluet
- 38:4 Red Tulip
- 38:5 Orange Tulip
- 38:6 White Tulip
- 38:7 Pink Tulip
- 38:8 Oxeye Daisy

### 液体

- 8 Flowing Water
- 9 Still Water
- 10 Flowing Lava
- 11 Still Lava

### 氷

- 78 Snow
- 79 Ice
- 80 Snow Block

### 石・鉱石

- 22 Lapis Lazuli Block
- 41 Gold Block
- 42 Iron Block
- 57 Diamond Block
- 133 Emerald Block
- 152 Redstone Block

レンガ、石

- 45 Bricks
- 98 Stone Bricks
- 155 Quartz

階段

- 108 Brick Stairs
- 109 Stone Brick Stairs
- 156 Quartz Stairs

### 照明

- 50 Torch
- 89 Glowstone
- 123 Redstone Lamp (inactive)
- 124 Redstone Lamp (active)
- 138 Beacon

### ガラス

- 20 Glass
- 95 Stained Glass
- 102 Glass Pane
- 160 Stained Glass Pane

色付きガラスの色はメタ値で指定する。（方法は後述）

### ハーフブロック

- 43 Double Slab
- 44 Slab
- 125 Double Wood Slab
- 126 Wood Slab

ハーフブロックの種類はメタ値で指定する。

- 0 Stone
- 1 Sandstone
- 2 Wooden
- 3 Cobblestone
- 4 Brick
- 5 Stone Brick
- 6 Nether Brick
- 7 Quartz
- 0 Oak
- 1 Spruce
- 2 Birch
- 3 Jungle
- 4 Acacia
- 5 Dark Oak


### 階段

- 53 Oak Wood Stairs
- 67 Cobblestone Stairs
- 108 Brick Stairs
- 109 Stone Brick Stairs
- 114 Nether Brick Stairs
- 128 Sandstone Stairs
- 134 Spruce Wood Stairs
- 135 Birch Wood Stairs
- 136 Jungle Wood Stairs
- 156 Quartz Stairs
- 163 Acacia Wood Stairs
- 164 Dark Oak Wood Stairs

階段の向きはメタ値で指定する。

- 0 西が下、東が上
- 1 東が下、西が上
- 2 北が下、南が上
- 3 南が下、北が上
- 4～7 0～3の天地反転

### 色付きブロック

- 35 Wool
- 95 Stained Glass
- 159 Hardened Clay
- 160 Stained Glass Pane

色付きブロックの色はメタ値で指定する。

- 0 White
- 1 Orange
- 2 Magenta
- 3 Light Blue
- 4 Yellow
- 5 Lime
- 6 Pink
- 7 Gray
- 8 Light Gray
- 9 Cyan
- 10 Purple
- 11 Blue
- 12 Brown
- 13 Green
- 14 Red
- 15 Black


## リンク集

### EngineHub Wiki

- [WorldEdit](http://wiki.sk89q.com/wiki/WorldEdit)
- [WorldEdit/Scripting](http://wiki.sk89q.com/wiki/WorldEdit/Scripting)
- [WorldEdit/Scripting/Development](http://wiki.sk89q.com/wiki/WorldEdit/Scripting/Development)

### WorldEdit 5.5.7-SNAPSHOT API

- [CraftScriptContext](http://docs.sk89q.com/worldedit/apidocs/com/sk89q/worldedit/scripting/CraftScriptContext.html)
- [LocalPlayer](http://docs.sk89q.com/worldedit/apidocs/com/sk89q/worldedit/LocalPlayer.html)
- [Constant Field Values](http://docs.sk89q.com/worldedit/apidocs/constant-values.html)

### Others

- [Minecraft ID List](https://minecraft-ids.grahamedgecombe.com/)
