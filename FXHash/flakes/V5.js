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



palette_hsv = [
    [0.5601*360, 0.4623*100, 0.7294*100],
    [0.6333*360, 0.5909*100, 0.4314*100],
    [0.1558*360, 0.6272*100, 0.8627*100],
    [0.1114*360, 0.8643*100, 0.7804*100],
    [0.1*360, 0.7453*100, 0.6314*100],
]



function get_new_color(hue, s, l){
    return choice(palette_hsv)
}


SUBDIV_COUNTER = 0;


FIRE_COLORS = [
            'red', 'yellow', 'orange', 
            'red', 'yellow', 'orange', 
            
            //'white', 'white',
//            'white', 'white',
            '#def', '#eef', 
            'black',
    	]


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
    	if (PALETTE==='fire'){
    	    X.fillStyle = choice(FIRE_COLORS);
    	} else {
    	    X.fillStyle = hsl_to_str(...choice(palette_hsv), 1);
    	}
        
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
    
    
    PALETTE = choice(['fire', 'soft', 'soft']);

    X.lineWidth=h/LINE_WIDTH;
    FEATURES_DICT = {
        'Outline': OUTLINE,
        'Line Width': LINE_WIDTH,
        'Depth': DEPTH,
        'Palette': PALETTE,
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
