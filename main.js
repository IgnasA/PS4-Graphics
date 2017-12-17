const H = 14;
const R = 5;

let camera, scene, renderer, cube, SVGRenderer, lookAtVector,
    trackballControls, clock, camControls, tetr, tetrMat, tetrParticles, lines, points, boundingBox;
const texture = new THREE.TextureLoader().load("Checkerboard_pattern.png");
const cylGeom = new THREE.CylinderGeometry(3, R, H, 32, 16);

cylGeom.computeBoundingBox();
boundingBox = new THREE.Box3 (new THREE.Vector3(cylGeom.boundingBox.min.x + R, cylGeom.boundingBox.min.y + H/2, cylGeom.boundingBox.min.z + R),
                                new THREE.Vector3(cylGeom.boundingBox.max.x + R, cylGeom.boundingBox.max.y + H/2, cylGeom.boundingBox.max.z + R));

points = getPointsInsideCone(generatePoints(-5, 5, 3000));
console.log(points);

var geometry = new THREE.ConvexGeometry(points);
var material = new THREE.MeshBasicMaterial( { map: texture } );
mapUV(geometry);

init();
animate();

function render() {
  var delta = clock.getDelta();
  main();
  
  camControls.update(delta);

  $("#WebGL-output").append(renderer.domElement);
  renderer.render(scene, camera);
}

function main() {
  var mesh = new THREE.Mesh( geometry, material );
  
 scene.add( mesh );
 scene.background = new THREE.Color( 0x877ff8 );

  var lineg = new THREE.Geometry();
  lineg.vertices.push(new THREE.Vector3(5, 0, 0));
  lineg.vertices.push(new THREE.Vector3(0, 0, 0));
  lineg.vertices.push(new THREE.Vector3(0, 0, 5));
  var line = new THREE.Line(lineg, material);
  scene.add(line);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function init() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  //renderer.setClearColor(0xEEEEEE, 1);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x937a98
    });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

 
  // position and point the camera to the center of the scene
  camera.position.x = -50;
  camera.position.y = 30;
  camera.position.z = 20;

  lookAtVector = new THREE.Vector3(10, 0, 0);
  camera.lookAt(lookAtVector);

  // add subtle ambient lighting
  var ambiColor = "#33333";
  var ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  var axes = new THREE.AxisHelper(20);
  scene.add(axes);

  camControls = new THREE.TrackballControls(camera);
  camControls.lookSpeed = 0.2;
  camControls.movementSpeed = 20;
  camControls.noFly = true;
  camControls.lookVertical = true;
  camControls.constrainVertical = true;
  camControls.verticalMin = 1.0;
  camControls.verticalMax = 2.0;
  camControls.lon = -150;
  camControls.lat = 120;
  
}

function generatePoints(min, max,  size) {
  const result = [];
  for (var i = 0; i < size; i++) {
     var x =  Math.random() * (max - min) + min;
     var y =  Math.random() * (H/2 - (-H/2)) + (-H/2);
     var z =  Math.random() * (max - min) + min;

    result.push({x, y, z});
  }

  return result;
}


function getPointsInsideCone(points) {
  let result = [];
  points.forEach(r => {
    
    if ((Math.pow(r.x, 2) + Math.pow(r.z, 2)) <= (Math.pow(R, 2)/(2*Math.pow(H, 2)) * Math.pow(r.y - H, 2))) {
      result.push(new THREE.Vector3(r.x, r.y, r.z ));
    }
  });

  return result;
}

function mapUV(geometry) {
  var faces = geometry.faces;

  geometry.faceVertexUvs[0] = [];

  for (let i = 0; i < faces.length ; i++) {

    let v1 = geometry.vertices[faces[i].a],
        v2 = geometry.vertices[faces[i].b],
        v3 = geometry.vertices[faces[i].c];

      let uv1 = getuv(v1);
      let uv2 = getuv(v2);
      let uv3 = getuv(v3);

      if (Math.abs(uv1.u - uv2.u) > 0.8) {
          if (uv1.u > uv2.u) {
              uv2.u += 1;
          } else {
              uv1.u += 1;

          }
      } else if (Math.abs(uv2.u - uv3.u) > 0.8) {
          if (uv3.u > uv2.u) {
              uv2.u += 1;
          } else {
              uv2.u += 1;

          }
      } else if (Math.abs(uv1.u - uv3.u) > 0.8) {
          if (uv1.u > uv3.u) {
              uv3.u += 1;
          } else {
              uv1.u += 1;

          }
      }

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2(uv1.u ,uv1.v),
        new THREE.Vector2(uv2.u ,uv2.v),
        new THREE.Vector2(uv3.u ,uv3.v)
    ]);
  }
  geometry.uvsNeedUpdate = true;
}

function getuv(v1) {
  var v1Vec = new THREE.Vector3(v1.x , 0, v1.z);
  var d1 = v1Vec.length();
  var l1 = R / d1;
  var p = Math.sqrt(Math.pow(l1*v1.z, 2) + Math.pow(l1*v1.x, 2));
  var urez =  (Math.atan2( l1*v1.z, l1*v1.x) + Math.PI) / (Math.PI*2);

  var retVal =  { u:urez, v: (v1.y + H/2) / H };
  
  return retVal;
}
