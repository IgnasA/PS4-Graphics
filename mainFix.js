const N_POINTS = 10000;
const H = 30;
const R = 15;

let camera, scene, renderer, controls, points;
const texture = new THREE.TextureLoader().load("checkers.jpg");
points = getPointsInsideGeom(generatePoints());
var geometry = new THREE.ConvexGeometry(points);
var material = new THREE.MeshBasicMaterial( { map: texture } );
mapUV(geometry);

init();
animate();

function generatePoints() {
  const result = [];
  for (var i = 0; i < N_POINTS; i++) {
     var x =  Math.random() * (R*2) -R;
     var y =  Math.random() * (H/2 - (-H/2)) + (-H/2);
     var z =  Math.random() * (R*2) -R;

    result.push({x, y, z});
  }

  return result;
}


function getPointsInsideGeom(points) {
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
          if (uv1.u < uv2.u) {
              uv2.u = 0;
          } else {
              uv1.u = 0;

          }
      } 
	  if (Math.abs(uv2.u - uv3.u) > 0.8) {
          if (uv3.u < uv2.u) {
              uv2.u = 0;
          } else {
              uv2.u = 0;

          }
      } 
	  if (Math.abs(uv1.u - uv3.u) > 0.8) {
          if (uv1.u < uv3.u) {
              uv3.u = 0;
          } else {
              uv1.u = 0;

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
  var urez =  (Math.atan2( l1*v1.z, l1*v1.x) + Math.PI) / (Math.PI*2);

  var retVal =  { u:urez, v: (v1.y + H/2) / H };
  return retVal;
}

function animate() {
  window.requestAnimationFrame(animate, renderer.domElement);
  controls.update();
  renderer.render(scene, camera);
}

function init() {
  // create a render and set the size
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  document.getElementById("canvasContainer").appendChild(renderer.domElement);
  scene = new THREE.Scene();
  
  let secondMaterial = new THREE.MeshNormalMaterial(
        {
          // shading: THREE.NoShading
          // wireframe: true
        }
      );
  var geometryMesh = new THREE.Mesh( geometry, material );
  scene.add( geometryMesh );
  
  
  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -50;
  camera.position.y = 30;
  camera.position.z = 20;

  camera.lookAt(geometryMesh.position);

  // position and point the camera to the center of the scene
  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight( Math.random() * 0xffffff, 0.5 );
  scene.add( ambientLight );
  scene.background = new THREE.Color( 0x877ff8 );
  
  controls = new THREE.OrbitControls( camera );
  //controls.autoRotate = true;
  //scene.add(new THREE.FaceNormalsHelper(geometryMesh, 1));
  
	var helper = new THREE.WireframeHelper(geometryMesh);
	//helper.material.depthTest = false;
	//helper.material.opacity = 0.25;
	//helper.material.transparent = false;
	//scene.add(helper);
}