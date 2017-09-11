var voterData;
var states;
var bbox;
var features;

var topology,
  geometries,
  carto_features;

var myData = [];

var proj = d3.geo.albers()
    .origin([24.7, -29.2])
    .parallels([-22.1, -34.1])
    .scale(2000)
    .translate([300, 300]);

var carto = d3.cartogram()
  .projection(proj)
  .properties(function (d) {
      // this add the "properties" properties to the geometries
      return d.properties;
  });


var drawMode = 2;

function preload(){
  voterData = loadTable("data/voting_data.csv", "csv", "header");
  states = loadJSON("data/za-munics-topo-simp.json");
}


var grow = true;
var counter = 0;


function setup() {

  createCanvas(600, 600);
  bbox = states.bbox;
  // [ 16.45189, -34.83378483630043, 
  // 32.944985, -22.137283311334716 ]
  topology = states;
  geometries = topology.objects.layer1.geometries;
  
  features = carto.features(topology, geometries);

  carto.value(function(d,i){
    return +voterData.rows[i].arr[2];
  })

  carto_features = carto(topology, geometries).features;

  features.forEach(function(geometries, i){
    var output = {id: i, orig: [], dest: []};
    geometries.geometry.coordinates[0].forEach(function(coords){
      output.orig.push(proj(coords));
      
    })
    myData.push(output);
  })

  carto_features.forEach(function(geometries, i){
    geometries.geometry.coordinates[0].forEach(function(coords){
      myData[i].dest.push(coords);
      
    })
  })

  
  // console.log(myData);
  // noLoop();
}

function draw() {
  background(255);

  
  if(grow === true){
    distort();
    counter +=0.05;

    if(counter >10){
      grow = false;
    }
  }

  
  if(grow === false){
    distort();
    counter -=0.01;

    if(counter <0){
      grow = true;
    }
  }

  


/*
if the counter is less than 1
then call the function and increment,

if the counter reaches 1, then decrement

*/

  // if(drawMode === 1){
    
  //   undistort();

    
  //   counter-= 0.0001;
    

  // } else if (drawMode === 2) {
    
  //   distort();
    
    
  //   console.log(counter);
  //   counter+= 0.0001;
    
  // }

}


function distort(){
    
    myData.forEach(function(obj){
      beginShape();
      obj.orig.forEach(function(coords, i){
        var x = lerp(obj.orig[i][0], obj.dest[i][0], counter);
        var y = lerp(obj.orig[i][1], obj.dest[i][1], counter);
        curveVertex(x,y);
      })
      endShape(CLOSE); 
    })
    
}

// function undistort(){
    
//     myData.forEach(function(obj){
//       beginShape();
//       obj.orig.forEach(function(coords, i){
//         var x = lerp(obj.dest[i][0], obj.orig[i][0], counter);
//         var y = lerp(obj.dest[i][1], obj.orig[i][1], counter);
//         curveVertex(x,y);
        
//       })
//       endShape(CLOSE); 
//     })
//     counter += 0.05;
  
// }

// Show untransformed geometry
function showMap(){
  features.forEach(function(geometries){
    beginShape();
    geometries.geometry.coordinates[0].forEach(function(coords){
      // curveVertex(mapLon(coords[0]), mapLat(coords[1]))  
      curveVertex(proj(coords)[0], proj(coords)[1]);
    })
    endShape(CLOSE);
  })
}

// transform geometry
function distortMap(i){
  console.log("distort me!");

    carto.value(function(d,i){
      return +voterData.rows[i].arr[2];
    })

  carto_features = carto(topology, geometries).features;
  // console.log(features[0].geometry.coordinates[0][0]);

  carto_features.forEach(function(geometries){
    beginShape();
    geometries.geometry.coordinates[0].forEach(function(coords){
      // curveVertex(coords[0], coords[1])
      curveVertex(coords[0],coords[1]);   
    })
    endShape();
  })


}

function keyReleased(){
  if(key === "1") drawMode = 1;
  if(key === "2") drawMode = 2;
}

/*
function mapLat(num){
  return map(num, bbox[1], bbox[3], height, 0);

}

function mapLon(num){
  return map(num, bbox[0], bbox[2], 0, width);
}


function unmapLat(num){
  return map(num,height, 0, bbox[1], bbox[3]);
}

function unmapLon(num){
  return map(num,  0, width, bbox[0], bbox[2]);
}
*/