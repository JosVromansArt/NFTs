/*
CHANGELOG V8

- randomize option

*/

//C=document.getElementById('C');
W=window;
w=W.innerWidth;
h=W.innerHeight;
ratio = [2,3];
if (w >= h*ratio[0]/ratio[1]){w = h*ratio[0]/ratio[1];} else {h = w/ratio[0]*ratio[1];}
pR=W.devicePixelRatio;
C.width=~~(w*pR);
C.height=~~(h*pR);
C.style.width=`${w}px`;
C.style.height=`${h}px`;
X=C.getContext('2d');
X.scale(pR,pR);

R=fxrand;
randomInt=(a, b)=>Math.floor(a + (b - a) * R());
choice=(x)=>x[randomInt(0, x.length * 0.99)];
var file_name;  //  = fxhash;

function hsl_to_str(h,s,l,a=1){return 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';}
get_midpoint=(a,b)=>[(a[0] + b[0])/2,(a[1] + b[1])/2];

PALETTES = [
    [
        'red', 'yellow', 'orange',
        'red', 'yellow', 'orange',
        '#def', '#eef',
        'black',
    ],
    [
      hsl_to_str(202,46,73),
      hsl_to_str(228,59,43),
      hsl_to_str(56,63,86),
      hsl_to_str(40,86,78),
      hsl_to_str(36,75,63),
    ],
]

//PALETTES = [
//	['#dcd7d1','#090100','#d22e25','#3f2d43','#8b6b22','#402e08','#bf956b','#99322d','#cc5721','#545857','#422c6c','#140929'],
//	['#010101','#386cb4','#feffba','#3e0705','#feff91','#f3bb42','#62411b','#fbee56','#ed8634','#c16426','#f3c06d','#943a19'],
//]

PALETTES = [
	['#111216','#cbd1cf','#3b3c40','#7a848d','#515c6e','#f9f7c7','#92a2bb','#3d2f14','#c0bda0','#8f8759','#c6952c','#669aea','#f2e69c','#e2c353'],
	['#171717','#5f6160','#70f1fc','#bebbba','#479f87','#f2e5d7','#878789','#36443a','#5cc8f5','#4db2b6','#a7f1a9','#f7d866','#a8b491','#a44370'],
	['#230000','#ffedbb','#eacd91','#221449','#d2b7c0','#cd9f7b','#491d74','#e09752','#ca6d66','#bf6c3a','#b16a94','#924f56','#8e492c','#653e2f'],
	['#010101','#232c3b','#ae8c70','#f29200','#efe8de','#3b5065','#ad4367','#acc4a0','#5881ad','#0076d0','#7b3f9f','#2f1f12','#00a8cf','#bfccdf'],
	['#dcd7d1','#090100','#d22e25','#3f2d43','#8b6b22','#402e08','#bf956b','#99322d','#cc5721','#545857','#422c6c','#140929','#d9c290','#d96a57'],
	['#010101','#386cb4','#feffba','#3e0705','#feff91','#f3bb42','#62411b','#fbee56','#ed8634','#c16426','#f3c06d','#943a19','#7fa0c6','#eb5b8d'],
	['#fdf5fe','#2a292d','#415250','#608482','#cbfdfd','#7eafa0','#725c4a','#a1e7d1','#46547f','#938d54','#584021','#d1efa6','#c9cf6d','#afbc9a'],
	['#050505','#0182c4','#dfa818','#013821','#007737','#d4cdc5','#96050c','#007f86','#004d51','#2ba4c3','#0d0a4f','#0959d6','#0a32ab','#a5bebb'],
]


function get_new_color(hue, s, l){return choice(PALETTE)}


randomize=(xy, factor=10)=>{
    if (!xy[1]){return xy}

    factor = 10 * h/xy[1];
    return [xy[0] + R()*2*factor-factor, xy[1] + R()*2*factor-factor]
}

class Triangle {
    constructor(p1,p2,p3, hue, s=50, l=50){
//        if (hue === undefined){hue=R()*300|0;}
        this.p1=p1;
        this.p2=p2;
        this.p3=p3;

        this.hue=hue;
        this.s=s;
        this.l=l;
    }

    draw(){
        X.fillStyle = choice(PALETTE);
        X.beginPath();
        X.moveTo(...this.p1);
        X.lineTo(...this.p2);
        X.lineTo(...this.p3);
        X.closePath();
        X.fill();
	if (OUTLINE !== 'none'){
        //if (R()<.1){
            X.stroke();
        }
    }

    // one triangle A,B,C is converted into a list of one or more triangles
    subdivide(){
        SUBDIV_COUNTER += 1;
        let [a,b,c, hue, s, l] = [this.p1, this.p2, this.p3, this.hue, this.s, this.l];
        let random_value = R();

        a = randomize(a, 50);
        b = randomize(b, 50);
        c = randomize(c, 50);

        let ab = get_midpoint(a,b);

        if (random_value < .4){
            let t1 = new Triangle(a, ab, c, ...get_new_color(hue, s, l));
            let t2 = new Triangle(b, ab, c, ...get_new_color(hue, s, l));
            return [t1,t2]
        }
        else if (random_value < .75){
            let cab = get_midpoint(ab,c);

            let tr1 = new Triangle(a, ab, cab, ...get_new_color(hue, s, l))
            let tr2 = new Triangle(b,  ab, cab, ...get_new_color(hue, s, l))
            let tr3 = new Triangle(a, c, cab, ...get_new_color(hue, s, l))
            let tr4 = new Triangle(b,  c, cab, ...get_new_color(hue, s, l))
            return [tr1, tr2, tr3, tr4];
        }

        return [this]; // return the original triangle
    }
}


function transform_color(triangle, d1=0, d2=0, d3=0){
    if (triangle.color === undefined){
        return [0,80,40];
    }

    return [triangle.color[0] + d1, triangle.color[1] + d2,  triangle.color[2] + d3]
}

SUBDIV_COUNTER = 0;




function subdivide(triangle_list, depth=0){
    let next_tri_list = []
    for (let i=0;i<triangle_list.length;i++){
        next_tri_list = next_tri_list.concat(triangle_list[i].subdivide());
    }
    if (depth < DEPTH){
        subdivide(next_tri_list, depth+choice([1,2,3,5,5,5,5,6,8,8]));
        subdivide(next_tri_list, depth+choice([1,2,3,5,5,5,5,6,8,8]));
//        subdivide(next_tri_list, depth+1);
//        subdivide(next_tri_list, depth+2);
    } else {
        TO_DRAW = TO_DRAW.concat(next_tri_list);
    }
}

TO_DRAW = [];

function draw_frame_rounded_corners(r, margin){
    X.fillStyle = "black";
    X.beginPath();

    x=margin;
    y=margin;
    ww=w-2*margin;
    hh=h-2*margin;

    X.beginPath();
    X.moveTo(x+r, y);
    X.arcTo(x+ww, y,   x+ww, y+hh, r);
    X.arcTo(x+ww, y+hh, x,   y+hh, r);
    X.arcTo(x,   y+hh, x,   y,   r);
    X.arcTo(x,   y,   x+ww, y,   r);
    X.closePath();

    X.rect(w, 0, -w, h);
    X.fill();
}


function get_start_triangles(){
    let random_value = R();

    let A = [0,0];
    let B = [w,0];
    let C = [w,h];
    let D = [0,h];


    let random_hue1 = R()*360|0
//    let random_hue2 = random_hue1 + (R()*100 - 50)|0
//    let random_hue3 = random_hue2 + (R()*100 - 50)|0
//    let random_hue4 = random_hue3 + (R()*100 - 50)|0

    let random_hue2= random_hue1; // + 180;
    let random_hue3= random_hue1;
    let random_hue4= random_hue1 + 180;



    if (random_value < .3){
        return [
            new Triangle(A, B, C, random_hue1),
            new Triangle(C, A, D, random_hue2),
        ]
    } else if (random_value < .66){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);

        return [
            new Triangle(A, B, BC, random_hue1),
            new Triangle(BC, A, DA, random_hue2),
            new Triangle(DA, BC, D, random_hue3),
            new Triangle(BC, D,C, random_hue4),
        ]
    }
    let DA = get_midpoint(D,A);
    let DAB = get_midpoint(DA, B);

    return [
        new Triangle(A, B, DA, random_hue1),
        new Triangle(B, DAB, C, random_hue2),
        new Triangle(DAB, C, DA, random_hue3),
        new Triangle(DA, C, D, random_hue4),
    ];
}

function do_blur(){
    // original blur was /18 instead of 28
    r = w/28;  // corner radius
//    X.filter='blur('+parseInt(w/150)+'px)'
    draw_frame_rounded_corners(r, margin=r/1.1);

    X.filter='none'
    draw_frame_rounded_corners(r, margin=r/3.9);
}

function make_artwork(){
    X.fillStyle='black';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black']);  //, 'white', 'none', 'none', 'none'])
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
    DEPTH = choice([5,8,10,12, 14,14, 16, 18]);

    //DEPTH = 12;
    //LINE_WIDTH = 1000;


    PALETTE_INDEX = choice([0,1,2,3,4,5,6,7])  // 0 = soft, 1 = fire
    PALETTE = PALETTES[PALETTE_INDEX];

    X.lineWidth=h/LINE_WIDTH;
    FEATURES_DICT = {
        'Outline': OUTLINE,
        'Line Width': LINE_WIDTH,
        'Depth': DEPTH,
        'Palette': ['Fire', 'Soft'][PALETTE_INDEX],
    }
    file_name = '_depth' + DEPTH.toString();
    if (OUTLINE !== 'none'){file_name += '_' + OUTLINE + ' outline'}

    X.strokeStyle=OUTLINE;

    console.table(FEATURES_DICT)
//    Object.keys(FEATURES_DICT).map(k=>console.log(k, ' : ', FEATURES_DICT[k]))

    subdivide(get_start_triangles());
    //alert(TO_DRAW.length);
    TO_DRAW.forEach(t=>t.draw());

    do_blur();

    //alert(SUBDIV_COUNTER);
    console.log('DONE')
}




// image save stuff
function pad0(nr){
    str = nr.toString();
    if (str.length<2){
        return '0' + str;
    }
    return str;
}

function get_timestamp(){
    const date = new Date();
    year=date.getFullYear();
    month=pad0(date.getMonth()+1);
    day=pad0(date.getDate());
    hour=pad0(date.getHours());
    mins=pad0(date.getMinutes());
    sec=pad0(date.getSeconds());
    return `${year}${month}${day}_${hour}${mins}${sec}`
}
function save_image(){
    file_name = get_timestamp() + '_' + file_name;
    link.setAttribute('download', file_name);   // add fxhash and datetime stamp?
    link.setAttribute('href', C.toDataURL("image/jpeg"));
    link.click();
    console.log('Saved ' + file_name + '.jpeg');
}

window.addEventListener('DOMContentLoaded', (event) => {
  make_artwork();
//  window.addEventListener('resize', E);  dont implement resize
  C.addEventListener('click',e=>{
    console.clear();
    make_artwork();
  });

  document.onkeydown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      save_image();
    }
  }
});
