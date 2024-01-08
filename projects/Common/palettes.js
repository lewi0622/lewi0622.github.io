'use strict';
const SAGEANDCITRUS =0;
const BEACHDAY = 1;
const COTTONCANDY =2;
const BUMBLEBEE =3;
const MINTY =4;
const GAMEDAY =5;
const BIRDSOFPARADISE =6;
const DEATHLOOP =7;
const SUMMERTIME =8;
const SOUTHWEST =9;
const MUTEDEARTH =10;
const NURSERY =11;
const SIXTIES =12;
const OASIS =13;
const SUPPERWARE =14;
const JAZZCUP =15;
const TOYBLOCKS = 16;
const LASER = 17;

const palette_names = [
    "Sage and Citrus", "Beach Day", "Cotton Candy", "Bumblebee", "Minty",
    "Game Day", "Birds of Paradise", "Deathloop", "Summertime", "Southwest", "Muted Earth",
    "Nursery", "60s", "Oasis", "Supperware", "Jazz Cup", "Toy Blocks", "Laser"];
    
const exclude_palette = ["Minty", "Deathloop", "Laser"]

const palettes=[
    //citrus & sage
    [[228, 153, 95, 255], //orange
    [145, 202, 195, 255], //light green
    [75, 153, 139, 255], //dark green
    [65, 71, 83, 255],  //dark grey
    [221, 241, 242, 255] //whiteish
    ],
    //beach day
    [[255, 186, 57, 255], //yellow
    [0, 74, 89, 255], // ocean blue
    [0, 190, 211, 255], // turq
    [248, 255, 255, 255], //basically white
    ],
    //cotton candy
    [[39, 46, 69, 255], //dark blue
    [255, 179, 73, 255], // yella
    [156, 144, 127, 255], // deep sand
    [255, 75, 89, 255], //pinky
    [232, 227, 217, 255] //greyish
    ],
    //Bumblebee
    [[19, 26, 30, 255], // deep grey
    [228, 224, 212, 255], // grey
    [248, 165, 64, 255] //yellow
    ],
    //Minty
    [[253, 243, 225, 255], //cream
    [48, 48, 48, 255], // dark grey
    [155, 155, 155, 255], // light grey
    [4, 124, 98, 255], //green
    [6, 200, 158, 255] //light green
    ],
    //Game Day
    [[99, 154, 115, 255], //grass
    [250, 244, 235, 255], // creamy
    [56, 139, 157, 255], // bluey
    [43, 49, 60, 255], //nearly black
    [194, 82, 84, 255], //reddish
    [250, 193, 93, 255] //yellow
    ],
    //birds of paradise
    [[87, 61, 38, 255],//brownish black
    [190, 45, 38, 255],//reddish
    [107, 161, 138 ,255],//greenish
    [233, 157, 42 ,255],//yellowish
    [90, 134, 173, 255],//bluish
    [172, 128, 166, 255],//purplish
    [116, 166, 173, 255],//cyan
    [224, 219, 183,255]//yellowish white
    ],
    //deathloop
    [[191, 61, 23, 255], //red
    [253, 104, 48, 255],//orangeish
    [255, 158, 90, 255], //light orange
    [255, 215, 98, 255], //yellow
    [0, 219, 198, 255], //teal
    [221, 219, 204, 255]//tan
    ],
    //dunno
    [[235, 66, 96, 255], //red
    [240, 205, 91, 255],//yellow
    [0, 202, 173, 255], //teal
    [88, 10, 108, 255] //dark purple
    ],
    //SW
    [[225, 42, 49, 255], //red
    [0, 47, 72, 255], //dark blue
    [234, 226, 185, 255], //tan
    [255, 192, 89, 255], //yellow
    [255, 128, 40, 255] //orange
    ],
    //Muted Earth
    [[238, 237, 233, 255], //tan
    [214, 175, 107, 255], //ochre
    [218, 159, 129, 255], //apricot
    [143, 164, 180, 255], //blue gray
    [223, 203, 185, 255] //cappucino
    ],
    //Nursery
    [[233, 227, 216, 255], //tan
    [246, 169, 185, 255], //Rose
    [228, 175, 100, 255], //Burnt orange
    [168, 203, 191, 255], //Mint
    [98, 106, 197, 255], //Indigo
    [207, 194, 207, 255] //Lavender
    ],
    //60s
    [[228, 219, 201, 255], //tan
    [162, 125, 54, 255], //ochre
    [255, 152, 56, 255], //orange
    [255, 204, 56, 255], //gold
    [245, 70, 55, 255], //campari
    [0, 124, 123, 255], //dark teal
    [255, 149, 132, 255] //rose
    ],
    //Oasis
    [[224, 207, 200, 255], //tan
    [234, 175, 142, 255], //peach
    [227, 139, 82, 255], //orange
    [231, 130, 84, 255], //orangeII
    [207, 121, 74, 255], //burnt orange
    [58, 86, 95, 255], //glue bray
    [43, 78, 49, 255] //dark green
    ],
    //Supperware
    [[14, 70, 87, 255], //Dark Teal
    [243, 101, 60, 255], //Orange
    [244, 175, 55, 255], //Gold
    [136, 204, 184, 255], //Aqua
    [151, 141, 139, 255], //Gray
    [250, 250, 250, 255] //white
    ],
    //Jazz Cup
    [[0, 196, 198, 255], //dark teal
    [154, 41, 166, 255], //purple
    [57, 43, 134, 255], //indigo
    [255, 255, 255, 255] //white
    ],
    //Toy Blocks
    [[23, 167, 150, 255], //dark teal
    [255, 189, 74,255], //gold
    [132, 102, 185,255],//dark purple
    [253, 75, 41, 255] //red
    ],
    //laser cutter colors 
    [[0,0,0,255], //Black
    [255,0,0,255], //Red
    [0,255,0,255], //Green
    [0,0,255,255], //Blue
    [0, 255,255,255], //Cyan
    [255,0,255,255], //Magenta
    [255,255,0,255] //Yellow
    ]
];

function get_longest_palette_length(){
    let max = -Infinity;
    palettes.forEach(function(a){
    if (a.length > max) max = a.length;
    });
    return max;
}

const longest_palette_length = get_longest_palette_length();