//C=document.getElementById('C');
R=fxrand;
W=window;
w=W.innerWidth;
h=W.innerHeight;
SAVE_EACH_FRAME=false;
if (SAVE_EACH_FRAME){h=1080}  // just so that the export format is in convenient dimension
ratio = [2,3];
if (w >= h*ratio[0]/ratio[1]){w = h*ratio[0]/ratio[1];} else {h = w/ratio[0]*ratio[1];}
pR=W.devicePixelRatio;
C.width=~~(w*pR);
C.height=~~(h*pR);
C.style.width=`${w}px`;
C.style.height=`${h}px`;
X=C.getContext('2d');
X.scale(pR,pR);

X.fillStyle='beige';
X.fillStyle='#fff';
X.fillRect(0,0,w,h);
//PALETTES=[
//    ["#cdd0c4","#000000","#aebbb4","#f6fae5","#5e0000","#fda201","#370000","#8f0000","#96857b","#cdbda2","#fd8301","#b70000","#fcc301","#016f8f","#d2a7c3","#0184b1","#fc5a01","#d90101","#ad805b","#aea577"],
//    ["#000000","#001427","#145872","#01334d","#2c3848","#6e4a46","#009cb7","#d4b081","#ab6047","#943f3d","#60232f","#2e2529","#d22424","#ae9b7f","#61827f","#336f7d","#bef6e8","#ebf9e7","#d68666","#71e0e1"],
//    ["#000000","#171a18","#2a2e31","#444949","#990007","#6a5231","#b70000","#050019","#d40000","#f5efe7","#730003","#aca896","#7c7d76","#997546","#61696d","#53341c","#ffc700","#f9ab00","#e8d3bf","#ecc41f"],["#000000","#191c16","#2e342f","#6f0101","#880201","#a90201","#464c4a","#4f0101","#fcc202","#fb8603","#f74a03","#c50301","#abaa95","#eff8f1","#765f3f","#2a0100","#f9a305","#c9c5b4","#5d686b","#fa6603"],["#0a0e1a","#000000","#624139","#31272b","#ed836a","#06395c","#f6c500","#f5df9d","#290d0d","#4b2723","#ab0000","#570102","#cf0002","#fb325b","#cfc9b7","#d6a002","#007feb","#f95a14","#10004e","#64321d"],["#f3f0e9","#54676a","#dddac9","#c4c2b6","#1e1c27","#224f62","#4b4b56","#94a0a2","#6d6d75","#3d383c","#9ed1cf","#888687","#36b4cb","#60cfd2","#112759","#1a47a5","#583b32","#13347d","#bdd7d3","#79d0cf"],["#ffffff","#cda4b4","#cc7a86","#cb5314","#d8cbd4","#d2742c","#c3464e","#c6e0ed","#c32f2f","#c83a12","#dabeb2","#ca6064","#68a9ed","#af88a7","#9ec9f3","#b2b5c4","#4d7fc8","#d68945","#0a0a0a","#91b5d9"],["#c21","orange","#026","#000","gray","brown"],["#230000","#0e0c19","#ffedbb","#fae1a1","#221449","#070000","#eac380","#2f1522","#cd9f7b","#341f6c","#d2b7c0","#b37560","#2874c0","#784160","#bd9361","#421540","#712d42","#f4c0ab"],["#050505","#0182c4","#dfa818","#013821","#007737","#d4cdc5","#96050c","#00463e","#b00b12","#007f86","#005e60","#019bb7","#0192e1","#00627f","#051f12","#0065a9","#1f9fc4","#0d0a4f"],["#000000","#2f3336","#faca8a","#71767b","#046169","#e7e9ea","#f4c92c","#9fae2d","#f1784d"],["#000000","#fb5c02","#fbb603","#2a2221","#faf79d","#e7f8da","#fa8d02","#fbcab3","#f9eb6c"],["#000001","#01012b","#ca0206","#041b54","#046477","#f73a06","#c8a605","#9a0305","#fada04"],["#0a0e1a","#bb0000","#d5ba76","#564a1b","#00007f","#a08d50","#900000","#c9952d","#000054"],["#f3ead5","#061826","#deceac","#d7231a","#a20010","#441319","#1c3b51","#4b6372","#fac332"],['#000','#111','#222','#333','#444','#555','#666','#777','#888','#999','#aaa','#bbb','#ccc','#ddd','#eee','#fff']]
//PALETTE_INDEX = R()*PALETTES.length|0;
PALETTE_INDEX=0
//PALETTE = PALETTES[PALETTE_INDEX];

PALETTE = [[0, 0, 2],[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]]
function hsl_to_str(h,s,l,a=1){return 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';}
//PALETTE = PALETTE.map(c=>hsl_to_str(...c))

PALETTES=[PALETTE]


VERTEX_COUNT = 4+ R()*20|0;

function get_ngon_points(n, radius, xoff, yoff, rot){
    let phi = 2 * 3.14159265 / n;
    let points = [];
    for (let j=0; j<n; j++){
        points.push([Math.sin(phi * j + rot * 2) * radius + xoff, Math.cos(phi * j + rot) * radius + yoff]);
    }
    return points;
}

get_midpoint=(a,b)=>[(a[0] + b[0])/2,(a[1] + b[1])/2];

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
        let random_value = R();

        a = randomize(a, RANDOM_OFFSET);  // TODO: make this depend on the triangle size (roughly)
        b = randomize(b, RANDOM_OFFSET);
        c = randomize(c, RANDOM_OFFSET);

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

        return [this]; // return the original triangle
    }
}


COMPOSITION_TYPE = 'unknown'
function get_start_triangles(){
    let random_value = R();

    let A = [0,0];
    let B = [w,0];
    let C = [w,h];
    let D = [0,h];

    if (random_value < .2){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);
        let BBC = get_midpoint(B, BC);
        let DAD = get_midpoint(DA, D);

        COMPOSITION_TYPE = 'Z'
        return [
            new Triangle(A, B, BBC),
            new Triangle(BBC, A, DAD),
            new Triangle(BBC, C, DAD),
            new Triangle(DAD,D,C),
        ]


    } else if (random_value < .3){
        COMPOSITION_TYPE = 'A'
        return [
            new Triangle(A, B, C),
            new Triangle(C, A, D),
        ]
    } else if (random_value < .66){
        COMPOSITION_TYPE = 'B'
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
    COMPOSITION_TYPE = 'C'
    return [
        new Triangle(A, B, DA),
        new Triangle(B, DAB, C),
        new Triangle(DAB, C, DA),
        new Triangle(DA, C, D),
    ];
}


START_TRIANGLES = get_start_triangles();

X.globalAlpha=.4;
X.globalCompositeOperation='multiply';

randomInt=(a, b)=>Math.floor(a + (b - a) * R());
FILE_NAME = `SUBDIVIDED_FLAKES_`;

function draw_line(a, b, color, width){
    X.lineWidth = width;
    X.strokeStyle = color;
    X.beginPath();
    X.moveTo(...a);
    X.lineTo(...b);
    X.stroke();
}

function get_distance(pointA, pointB){
    diffX = pointA[0] - pointB[0];
    diffY = pointA[1] - pointB[1];

    // dont take the square root, because we only compare distance, so rooting is not necessary, the order stays the same
    return diffX ** 2 + diffY ** 2
}



//
//
function get_point_on_line(a,b,perc){  // relative to a !!
    let diffX = perc * (b[0] - a[0]);
    let diffY = perc * (b[1] - a[1]);
    return [diffX,diffY]
}
function draw_triangle(a,b,c,color='black'){
    draw_line(a,b,color,.2)
    draw_line(b,c,color,.2)
    draw_line(c,a,color,.2)
}

function random_in_triangle(a,b,c){
    let perc1 = 0.2+R()*.6;

    let maxrange = 1-perc1;
    let perc2 = R() * maxrange * .8 + maxrange*.1;

//    console.log('total less than 1 :')
//    console.log(perc1, perc2, perc1+perc2)

    let P1 = get_point_on_line(a,b,perc1)
    let P2 = get_point_on_line(a,c,perc2)

    return [
        a[0]+P1[0]+P2[0],
        a[1]+P1[1]+P2[1]
    ]
}


//draw_triangle(pA,pB,pC)
//inside = random_in_triangle(pA,pB,pC)


// recursively draw division lines
draw_y=(a,b,c, iter=0,color='#000')=>{
    let inside = random_in_triangle(a,b,c);

    X.globalAlpha=1;
    draw_line(a, inside, color, 1)
    draw_line(b, inside, color, 1)
    draw_line(c, inside, color, 1)

    X.globalAlpha=.05;
    X.lineWidth=.6;

    if (iter<2){
        draw_y(a,b,inside,iter+1);
        draw_y(b,c,inside,iter+1);
        draw_y(c,a,inside,iter+1);
    }
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
    X.globalAlpha=1;
    X.fill();
    X.globalAlpha=.05;
    if (outline_hue){
        X.strokeStyle=hsl_to_str(outline_hue,80,80)
        X.stroke();
    }


    // draw black lines on large triangles
//    if (Math.abs(vertices[0][0]-vertices[1][0])>100){
//        draw_y(...vertices);
//    }
}

handle_final=(a,b,c,inside, hue)=>{
//    draw_triangle(a,inside, b)
//    draw_triangle(a,inside,c)
//    draw_triangle(inside,b,c)


    fill_polygon([a,inside, b], hsl_to_str(hue,60,40), hue)
    fill_polygon([a,inside,c], hsl_to_str(hue,60,60), hue)
    fill_polygon([inside,b,c], hsl_to_str(hue,60,80), hue)
}

function subdivide(a,b,c,depth=0, previous_hue=180){
    let inside = random_in_triangle(a,b,c)

//    BSIZE = 10
//    X.fillStyle='black'
//    X.fillRect(inside[0]-BSIZE/2, inside[1]-BSIZE/2, BSIZE,BSIZE)

    if (depth>8 || (depth>1&&R()<.2)){
        handle_final(a,b,c,inside, previous_hue)
        return
    }

    subdivide(inside, a,b, depth+1, PALETTE[R()*PALETTE.length|0][0] )
    subdivide(inside, b,c, depth+1, PALETTE[R()*PALETTE.length|0][0] )
    subdivide(inside, c,a, depth+1, PALETTE[R()*PALETTE.length|0][0] )

//    subdivide(inside, a,b, depth+1, previous_hue+R()*64-32|0)  // previous_hue+R()*64-32|0
//    subdivide(inside, b,c, depth+1, previous_hue+R()*64-32|0)
//    subdivide(inside, c,a, depth+1, previous_hue+R()*64-32|0)
//
//    return [
//        [inside, a,b],
//        [inside, b,c],
//        [inside, c,a],
//    ]
}


pA = [0,0];
pB = [0,h];
pC = [w,0];
//TRIANGLE = [pA,pB,pC];


START_TRIANGLES.forEach(t=>subdivide(t.p1, t.p2, t.p3, 0, START_HUE+=64))

//subdivide(pA,pB,pC, 0, START_HUE)
//subdivide(pB,pC, [w,h], 0, START_HUE+64)


//
// Save image functionality
//
function prefix_zeros(s, total_length){
    let prefix = '';
    for (let i=0; i<total_length - s.length; i++){
        prefix += '0';
    }
    return prefix + s;
}

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
function save_image(prefix){
    let file_name = prefix + get_timestamp() + '_' + FILE_NAME;
    link.setAttribute('download', file_name);   // add fxhash and datetime stamp?
    link.setAttribute('href', C.toDataURL("image/jpeg"));
    link.click();
    console.log('Saved ' + file_name + '.jpeg');
}
window.addEventListener('DOMContentLoaded', (event) => {
  document.onkeydown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      save_image('');
    }
  }
});