/*
CHANGELOG V15
- Define more compositions, including grid & distored grid
- Second subdivision type, called 'New' for now

(TODO):
- Add all useful things on the Triangle class
- review coloring with Hue instead of hex, and give the 3 areas similar hue
- set canvas size to fixed dimensions 3000*2000 or so

- To do when finishing up:
- save image should be PNG
- rename features
- add setting that genrates plottable SVG

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
	[[228, 13, 8],[160, 6, 81],[228, 4, 24],[208, 8, 52],[217, 15, 37],[58, 81, 88],[217, 23, 65],[40, 51, 16],[62, 16, 63],[51, 23, 45],[50, 57, 73],[48, 82, 36],[213, 82, 64],[240, 74, 73]],
	[[0, 0, 9],[150, 1, 38],[185, 96, 71],[255, 2, 64],[6, 12, 84],[164, 38, 45],[137, 11, 24],[184, 42, 50],[197, 86, 66],[122, 73, 80],[47, 90, 68],[167, 37, 34],[332, 42, 45],[75, 33, 98]],
	[[0, 100, 7],[44, 100, 87],[40, 68, 74],[256, 57, 18],[26, 45, 64],[270, 60, 28],[340, 23, 77],[15, 35, 54],[210, 66, 45],[326, 30, 36],[359, 39, 22],[310, 18, 55],[25, 42, 34],[29, 70, 60]],
	[[0, 0, 0],[218, 26, 18],[27, 28, 56],[36, 100, 47],[35, 33, 90],[210, 26, 31],[340, 44, 47],[100, 23, 70],[206, 100, 41],[211, 34, 51],[191, 100, 41],[278, 43, 44],[27, 45, 13],[216, 33, 81]],
	[[33, 14, 84],[7, 100, 2],[3, 70, 48],[289, 20, 22],[42, 61, 34],[41, 78, 14],[3, 55, 39],[30, 40, 58],[19, 72, 46],[261, 42, 30],[261, 64, 10],[165, 2, 34],[41, 48, 70],[9, 63, 60]],
	[[0, 0, 0],[215, 53, 46],[61, 100, 86],[2, 85, 13],[61, 100, 78],[38, 87, 60],[32, 57, 25],[55, 95, 66],[27, 84, 57],[24, 67, 45],[37, 85, 69],[16, 71, 34],[212, 38, 64],[338, 78, 64]],
	[[293, 82, 98],[255, 5, 17],[173, 12, 29],[177, 16, 45],[180, 93, 89],[162, 23, 59],[27, 21, 37],[225, 29, 39],[164, 50, 74],[34, 45, 24],[68, 31, 41],[64, 51, 62],[83, 20, 67],[54, 34, 51]],
	[[0, 0, 2],[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]],
    [[312, 3, 78],[228, 9, 23],[33, 56, 77],[4, 55, 68],[181, 46, 60],[1, 48, 49],[355, 18, 73],[183, 38, 39],[0, 0, 0],[0, 0, 100],[0, 100, 100]],
]

COLORS = ['red', 'white','black','red', 'white','orange','orange','white','blue', 'orange','white','black','white','#CCC','#999','#222','#666','#999','#666','#999','#ddd','#eee'];
change_color_step = 265;

get_point_on_line=(a,b,perc)=>{
    let diffX = perc * (b[0] - a[0]);
    let diffY = perc * (b[1] - a[1]);
    return [a[0] + diffX, a[1] + diffY]
}
function get_point_on_line_relative(a,b,perc){  // relative to a !!
    let diffX = perc * (b[0] - a[0]);
    let diffY = perc * (b[1] - a[1]);
    return [diffX,diffY]
}
randomize=(xy, factor=10)=>{
    if (!xy[1]){return xy}
    if (factor===0){return xy}

    factor = factor * h/xy[1];
    return [xy[0] + R()*2*factor-factor, xy[1] + R()*2*factor-factor]
}
//random_step=(tr=.02)=>R()*tr-tr/2
//randomize_co=xy=>[xy[0] + random_step(10),xy[1] + random_step(10)]
class Triangle {
    constructor(p1,p2,p3){
        this.p1=p1;
        this.p2=p2;
        this.p3=p3;
    }

    shrink(shrink_perc=.07){
        let m12 = get_midpoint(this.p1, this.p2);
        let m23 = get_midpoint(this.p2, this.p3);
        let m13 = get_midpoint(this.p1, this.p3);

        let towards_m12 = get_point_on_line(this.p3, m12, shrink_perc);
        let towards_m23 = get_point_on_line(this.p1, m23, shrink_perc);
        let towards_m13 = get_point_on_line(this.p2, m13, shrink_perc);

        this.p1 = towards_m23;
        this.p2 = towards_m13;
        this.p3 = towards_m12;
    }

    random_point_inside(){
        let perc1 = 0.2+R()*.6;
        let maxrange = 1-perc1;
        let perc2 = R() * maxrange * .8 + maxrange*.1;

        let P1 = get_point_on_line(this.p1,this.p2,perc1)
        let P2 = get_point_on_line(this.p1,this.p3,perc2)

        return [
            this.p1[0]+P1[0]+P2[0],
            this.p1[1]+P1[1]+P2[1]
        ]
    }

    draw(){
        X.fillStyle = hsl_to_str(...choice(PALETTE));
        X.beginPath();
        X.moveTo(...this.p1);
        X.lineTo(...this.p2);
        X.lineTo(...this.p3);
        X.closePath();
        X.fill();
    }

//    draw_strokes(){
//        // find the sharpest angle, and start the perc_on_line from that angle.
//        // inherit color from the parent. With a change to divert. So areas with the same color appear,
//        // but also different palette/areas are possible
//        let [a,b,c] = [this.p1, this.p2, this.p3]
//        let color_index = 0;
//        let fill_color = COLORS[color_index];
//        X.lineWidth = w/8000;
//        let perc1 = R();
//        let perc2 = R();
////        COLORS=choice(PALETTES).map(c=>hsl_to_str(...c))
//        COLORS=PALETTES[PALETTE_INDEX].map(c=>hsl_to_str(...c))
//
//        for (let i=0; i<20000; i++){
//            if (i%change_color_step===0){
//                X.strokeStyle = COLORS[color_index % COLORS.length];
//                color_index ++;
//            }
//            let start = get_point_on_line(a,b, perc1)
////            if (same){
//            perc2=perc1  // remove other values, only use same
////            }
//            let end = get_point_on_line(a,c, perc2)
//
//            // draw a single line
//            X.beginPath();
//            X.moveTo(...randomize_co(start));
//            X.lineTo(...randomize_co(end));
//            X.stroke();
//
//            perc1 += random_step();
//            perc2 += random_step();
//
//            perc1 = Math.max(perc1, 0)
//            perc2 = Math.max(perc2, 0)
//            perc1 = Math.min(perc1, 1)
//            perc2 = Math.min(perc2, 1)
//        }
//    }



    // one triangle A,B,C is converted into a list of one or more triangles
    subdivide(){
        SUBDIV_COUNTER += 1;
        let [a,b,c] = [this.p1, this.p2, this.p3];
//        let rrrr = R();  investigate this
//        if (rrrr<.33){
//            [a,b,c] = [this.p2, this.p3, this.p1];
//        } else if (rrrr<.66){
//            [a,b,c] = [this.p3, this.p1, this.p2];
//        }
        let random_value = R();
        let ab = get_midpoint(a,b);

        if (random_value < .4){
            let t1 = new Triangle(a, ab, c);
            let t2 = new Triangle(b, ab, c);
            return [t1,t2]
        }
        else if (random_value < .75){
            let cab = get_midpoint(ab,c);

            let tr1 = new Triangle(a, ab, cab)
            let tr2 = new Triangle(b,  ab, cab)
            let tr3 = new Triangle(a, c, cab)
            let tr4 = new Triangle(b,  c, cab)
            return [tr1, tr2, tr3, tr4];
        }

        return [this]; // return the original triangle, so in some cases, no subdivision happened
    }
}
function subdivide_original(triangle_list, depth=0){
    let next_tri_list = []
    for (let i=0;i<triangle_list.length;i++){
        next_tri_list = next_tri_list.concat(triangle_list[i].subdivide());
    }
    if (depth < DEPTH){
        subdivide_original(next_tri_list, depth+choice([1,2,3,5,5,5,5,6,8,8]));
    } else {
        console.log(next_tri_list.length)
        TO_DRAW = TO_DRAW.concat(next_tri_list);
    }
}


function get_start_triangles(ct){
    let A = [0,0];
    let B = [w,0];
    let C = [w,h];
    let D = [0,h];

    if (ct === 0){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);
        let BBC = get_midpoint(B, BC);
        let DAD = get_midpoint(DA, D);

        return [
            new Triangle(A, B, BBC),
            new Triangle(BBC, A, DAD),
            new Triangle(BBC, C, DAD),
            new Triangle(DAD,D,C),
        ]

    } else if (ct < 3){
        // distorted grid
        let rows = 2+R()*5|0;
        let cols = 2+R()*5|0;
        rows=3+R()*6|0;
        cols=rows-2+ R()*4|0;

        let stepx = w/cols;
        let stepy = h/rows;

        let xoff = 0;
        let yoff = 0;

        if (COMPOSITION_TYPE===2){  // distort the grid
            xoff = stepx/3;
            yoff = stepy/3;
        }

        let trigs = [];
        let coords=[];
        for (let i=0;i<=cols;i++){
            let coords_row = []
            for (let j=0;j<=rows;j++){
                coords_row.push([
                    (i===0||i===cols)?i*stepx:i*stepx+R()*xoff*2-xoff,
                    (j===0||j===rows)?j*stepy:j*stepy+R()*yoff*2-yoff,
                ])
            }
            coords.push(coords_row);
        }
        for (let i=0;i<cols;i++){
            for (let j=0;j<rows;j++){
                let [a,b,c,d] = [coords[i][j], coords[i+1][j], coords[i+1][j+1],coords[i][j+1]]

                if (R()<.5){
                    trigs.push(new Triangle(a,b,c))
                    trigs.push(new Triangle(a,c,d))
                } else {
                    trigs.push(new Triangle(a,b,d))
                    trigs.push(new Triangle(b,d,c))
                }
            }
        }
        return trigs;

    } else if (ct === 3){
        return [
            new Triangle(A, B, C),
            new Triangle(C, A, D),
        ]
    } else if (ct === 4){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);

        return [
            new Triangle(A, B, BC),
            new Triangle(BC, A, DA),
            new Triangle(DA, BC, D),
            new Triangle(BC, D,C),
        ]
    }

    let DA = get_midpoint(D,A);
    let DAB = get_midpoint(DA, B);
    return [
        new Triangle(A, B, DA),
        new Triangle(B, DAB, C),
        new Triangle(DAB, C, DA),
        new Triangle(DA, C, D),
    ];
}


function random_in_triangle(a,b,c){
    let perc1 = 0.2+R()*.6;

    let maxrange = 1-perc1;
    let perc2 = R() * maxrange * .8 + maxrange*.1;

    let P1 = get_point_on_line_relative(a,b,perc1)
    let P2 = get_point_on_line_relative(a,c,perc2)
    return [
        a[0]+P1[0]+P2[0],
        a[1]+P1[1]+P2[1]
    ]
}
START_HUE = R()*360|0;
fill_polygon=(vertices, fill_color, outline_hue)=>{
    // Use the vertex indices, and get the according vertices from SCALED_VERTICES
    X.fillStyle = fill_color;
    X.beginPath();
    X.moveTo(...vertices[0]);

    for (let k=1;k<vertices.length;k++){
        X.lineTo(...vertices[k]);
    }
    X.closePath();
    X.fill();
    if (outline_hue){  // investigate this, could be without the hue
        X.strokeStyle=hsl_to_str(outline_hue,60,20)
        X.stroke();
    }
}
handle_final=(a,b,c,inside, hue)=>{
    fill_polygon([a,inside, b], hsl_to_str(hue,60,42), hue)
    fill_polygon([a,inside,c], hsl_to_str(hue,60,60), hue)
    fill_polygon([inside,b,c], hsl_to_str(hue,60,78), hue)
}

function subdivide_trio(a,b,c,depth=0, previous_hue=180){
    let inside = random_in_triangle(a,b,c)

    PALETTE = [[0, 0, 2],[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]]

    if (depth>6 || (depth>1&&R()<.2)){
        handle_final(a,b,c,inside, previous_hue)
        return
    }
    subdivide_trio(inside, a,b, depth+1, PALETTE[R()*PALETTE.length|0][0] )
    subdivide_trio(inside, b,c, depth+1, PALETTE[R()*PALETTE.length|0][0] )
    subdivide_trio(inside, c,a, depth+1, PALETTE[R()*PALETTE.length|0][0] )
}

function make_artwork(){
    SUBDIV_COUNTER = 0;
    TO_DRAW = [];
    X.fillStyle='#000';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black', 'none', 'none', 'none'])
//    OUTLINE='none';  // TODO: check outline, on different zoom levels
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
    DEPTH = choice([5,8,10,12, 14,14, 16, 18]);
    COMPOSITION_TYPE = choice([0,1,2,3,4,5])
    SUBDIVISION_TYPE = choice(['Original', 'New'])

//    RANDOM_OFFSET = choice([0,0,0,0,1,2,2,3,4,5])
//    SHRINK = choice(['Constant', 'No', 'Sometimes'])
//    PALETTE_INDEX = choice([0,1,2,3,4,5,6,7,8])
    SHRINK = 'no';
    RANDOM_OFFSET=0;
    PALETTE_INDEX = 7;
    PALETTE = PALETTES[PALETTE_INDEX];

    X.lineWidth=h/LINE_WIDTH;
    FEATURES_DICT = {
        'Depth': DEPTH,
//        'Palette': [0,1,2,3,4,5,6,7,8][PALETTE_INDEX],
        'Composition': ['0 - Z', '1 - grid', '2 - grid (distorted)', '3 - A', '4 - B', '5 - C'][COMPOSITION_TYPE],
        'Subdivision Type': SUBDIVISION_TYPE,
        'Line Width': LINE_WIDTH,
//        'Random Offset': RANDOM_OFFSET,
//        'Shrink': SHRINK,
    }
    RANDOM_OFFSET = w * (RANDOM_OFFSET/1000);
    file_name = '_depth' + DEPTH.toString();
    console.table(FEATURES_DICT)

    let start_triangles = get_start_triangles(COMPOSITION_TYPE);

    if (SUBDIVISION_TYPE==='New'){
        start_triangles.forEach(t=>subdivide_trio(t.p1, t.p2, t.p3, 0, START_HUE+=64))
    } else {
        subdivide_original(start_triangles)
        TO_DRAW.forEach(t=>{
    //        t.shrink(-.1+R()*.2)
            t.draw();
    //        t.draw_strokes()
        });
    }

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
    file_name = get_timestamp() + '_Flakes_' + file_name;
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
