// License: CC BY-NC 4.0
// Created by: www.josvromans.com
SCALE = 3;
PLOT_LINES = [];


LAYER1 = [];
LAYER2 = [];
LAYER3 = [];
LAYER4 = [];
LAYER5 = [];


getRandomInt=_=>Math.random()*256|0;
function get_random_color(){
    return 'rgb(' + getRandomInt(0, 255) + ',' +getRandomInt(0, 255) + ',' +getRandomInt(0, 255) + ')';
}

COLORS = ['red', 'black', 'blue', 'green','orange'];
COLORS = [
    get_random_color(),
    get_random_color(),
    get_random_color(),
    get_random_color(),
    get_random_color(),
    get_random_color(),
];


//ALL_LINES = []; // populate with the lines for each layer




function get_frame_lines(tl, tr, br, bl, extra){
    return [
        [[tl[0]-extra, tl[1]-extra], [tr[0]+extra, tr[1]-extra]],
        [[bl[0]-extra, bl[1]+extra], [br[0]+extra, br[1]+extra]],
        [[tl[0]-extra, tl[1]-extra], [bl[0]-extra, bl[1]+extra]],
        [[tr[0]+extra, tr[1]-extra], [br[0]+extra, br[1]+extra]],
    ]
}
round2=v=>v.toFixed(2);
convert_co=(co)=>[round2(co[0]), round2(co[1])]

function clear_canvas(ctx, canvas){
    ctx.fillStyle = document.getElementById('background_color').value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function get_midpoint(point_a, point_b, divisor){
    var diff_x = (point_b[0] - point_a[0]) / divisor;
    var diff_y = (point_b[1] - point_a[1]) / divisor;

    return [point_a[0] + diff_x, point_a[1] + diff_y];
}


function parse_strategy(strategy_string){
    var strategy = [];
    for (var index=0; index<strategy_string.length; index+=1 ){
        var value = parseInt(strategy_string[index]);
        if (value > 2 || value < 0) {
            alert('The strategy can only contain [0, 1, 2]');
            return [];
        }
        strategy.push(value);
    }
    return strategy;
}

function triangle_subdivision(ctx, canvas){
    var iterations = document.getElementById('iterations').value;
    var strategy = parse_strategy(document.getElementById('strategy').value);
    clear_canvas(ctx, canvas);
    var divisor = parseFloat(document.getElementById('divisor').value);
    var color = document.getElementById('current_color').value;
    var line_width = document.getElementById('line_width').value;

    MARGIN = 16;
    let yoff = (297-210)/2;
    var center = [210/2,297/2];
    var top_left = [MARGIN,MARGIN+yoff];
    var top_right = [210-MARGIN, MARGIN+yoff];
    var bottom_left = [MARGIN, 297-MARGIN-yoff];
    var bottom_right = [210-MARGIN, 297-MARGIN-yoff];

    // the outer frame, double lines in black
    PLOT_LINES = get_frame_lines(top_left, top_right, bottom_right, bottom_left, MARGIN*.12);
    PLOT_LINES = PLOT_LINES.concat(get_frame_lines(top_left, top_right, bottom_right, bottom_left, MARGIN*.18));

    LAYER1 = [];
    LAYER2 = [];
    LAYER3 = [];
    LAYER4 = [];
    LAYER5 = [];



    function subdivide(ctx, vertices, i){
        ctx.lineWidth = line_width;
        var strategy_length = strategy.length;
        if (i < iterations) {
            var subdivide_index = strategy[i % strategy_length];
            var subdivide_vertex = vertices.splice(subdivide_index, 1)[0];
            var midpoint = get_midpoint(vertices[0], vertices[1], divisor);
            subdivide(ctx, [subdivide_vertex, midpoint, vertices[0]], i + 1);
            subdivide(ctx, [subdivide_vertex, midpoint, vertices[1]], i + 1);

            // Only the subdivision line will be added to 'lines to be plotted'. So not the entire triangle.
            // uncomment the following statement to only get the final subdivision iteration (less lines to draw)

            if (i===iterations-6){  //
               LAYER1.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-5){  //
               LAYER2.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-4){  //
               LAYER3.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-3){  //
               LAYER4.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-2){  //
               LAYER5.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            }


//            if (i>iterations-2){  //
//               PLOT_LINES.push([convert_co(midpoint),convert_co(subdivide_vertex)])
//            }
        }
    }



    // add the 4 triangles that form a square, and share a vertex in the center of the square
    // calculations will be done for every triangle individually..
    subdivide(ctx, [center, bottom_left, bottom_right], 0);
    subdivide(ctx, [center, top_right, top_left], 0);
    subdivide(ctx, [center, bottom_left, top_left], 0);
    subdivide(ctx, [center, top_right, bottom_right], 0);

    console.log(PLOT_LINES.length, ' line count')

    ctx.strokeStyle=COLORS[1];
    LAYER2.forEach(pl=>{ctx.beginPath();ctx.moveTo(pl[0][0]*SCALE, pl[0][1]*SCALE);ctx.lineTo(pl[1][0]*SCALE, pl[1][1]*SCALE);ctx.stroke();})
    ctx.strokeStyle=COLORS[2];
    LAYER3.forEach(pl=>{ctx.beginPath();ctx.moveTo(pl[0][0]*SCALE, pl[0][1]*SCALE);ctx.lineTo(pl[1][0]*SCALE, pl[1][1]*SCALE);ctx.stroke();})
    ctx.strokeStyle=COLORS[3];
    LAYER4.forEach(pl=>{ctx.beginPath();ctx.moveTo(pl[0][0]*SCALE, pl[0][1]*SCALE);ctx.lineTo(pl[1][0]*SCALE, pl[1][1]*SCALE);ctx.stroke();})
    ctx.strokeStyle=COLORS[4];
    LAYER5.forEach(pl=>{ctx.beginPath();ctx.moveTo(pl[0][0]*SCALE, pl[0][1]*SCALE);ctx.lineTo(pl[1][0]*SCALE, pl[1][1]*SCALE);ctx.stroke();})

    ctx.strokeStyle='#000';
    PLOT_LINES.forEach(pl=>{ctx.beginPath();ctx.moveTo(pl[0][0]*SCALE, pl[0][1]*SCALE);ctx.lineTo(pl[1][0]*SCALE, pl[1][1]*SCALE);ctx.stroke();})
}

function get_random_strategy(){
    let strategy = '0';
    for (let i=0;i<2+Math.random()*15;i++){
        let random_index = Math.random()*3|0;
        strategy += random_index.toString();
    }
    return strategy;
}


function download_svg_file() {
  const a = document.createElement('a');
  const e = new MouseEvent('click');

  let path_str = '';
  PLOT_LINES.forEach(pl=>path_str += `M ${pl[0][0]} ${pl[0][1]} L ${pl[1][0]} ${pl[1][1]} `)

  LINE_WIDTH=document.getElementById('line_width').value;

  let svg_file = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 210 297"
  width="210mm"
  height="297mm"
>
<path d="${path_str}" fill="none" stroke="black" stroke-width="${LINE_WIDTH}" />
</svg>
`
  const base64doc = btoa(unescape(svg_file));

  a.download = 'Triangle_subdivision' + document.getElementById('strategy').value + '.svg';
  a.href = 'data:text/html;base64,' + base64doc;
  a.dispatchEvent(e);
}


document.addEventListener('DOMContentLoaded', function(event) {
    var canvas = document.getElementById('canvas');

    canvas.width  = 210*SCALE;
    canvas.height = 297*SCALE;
    var ctx = canvas.getContext('2d');
    ctx.lineJoin='round'

    document.getElementById('start').addEventListener("mouseup", function() {
        triangle_subdivision(ctx, canvas);
    });
    document.getElementById('clear').addEventListener("mouseup", function() {
        clear_canvas(ctx, canvas);
    });
    document.getElementById('download').addEventListener("mouseup", function() {
        var link = document.getElementById('link');
        link.setAttribute('download', 'Triangle_subdivision' + document.getElementById('strategy').value + '.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    });
    document.getElementById('random').addEventListener("mouseup", function() {
        document.getElementById('strategy').value = get_random_strategy();
        triangle_subdivision(ctx, canvas);
    });

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {triangle_subdivision(ctx, canvas);}  // Enter
        else if (event.keyCode === 67) {clear_canvas(ctx, canvas);}  // c
    });

    // if a strategy was provided by the url, render it
    var queryString = window.location.search;
    var splitted = queryString.split('?strategy=');  // prevent using URLSearchParams, no other parameters are allowed

    if (splitted.length === 2) {
        document.getElementById('strategy').value = splitted[1];
    }
    triangle_subdivision(ctx, canvas);
});
