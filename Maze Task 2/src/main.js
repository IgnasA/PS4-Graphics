var svgManager = new THREE.SVGLoader();
var url = 'maps/maze_7.svg';
var camera, scene, renderer, cube, SVGRenderer,
  trackballControls, clock, controls, tetr, tetrMat, tetrParticles, lines;
var human = {height:1.8, speed:0.4, turnSpeed:Math.PI*0.06};
var keyboard = {};
var meshWalls = false;
var explode = false;
var lookAtVector = new THREE.Vector3(0, 200, 200)


function svg_loading_done_callback(doc) {
  init(new THREE.SVGObject(doc));
  animate();
};

svgManager.load(url,
  svg_loading_done_callback,
  function() {
    console.log("Loading SVG...");
  },
  function() {
    console.log("Error loading SVG!");
  });

var AMOUNT = 100;

function init(svgObject) {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  drawShapes(svgObject.node)
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    //camera.position.set(200, 200, 800);
    //camera.lookAt(lookAtVector);
  
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setClearColor(0xEEEEEE, 1);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  var planeGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: '#63434a',
    side: THREE.DoubleSided
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 150
  plane.position.y = 0
  plane.position.z = 150

  scene.add(plane);

  camera.position.x = 300;
  camera.position.y = 500;
  camera.position.z = 800;
  var ambiColor = "#33333";
  var ambientLight = new THREE.AmbientLight(ambiColor, 0.5);
  scene.add(ambientLight);

  var axes = new THREE.AxisHelper(20);
  //scene.add(axes);

  addLights();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target= new THREE.Vector3(100,0,100);
  
  tetr = new THREE.TetrahedronGeometry(5, 2);
  var material = new THREE.MeshLambertMaterial({
    color: 0xff4000
  });

  tetrMat = new THREE.Mesh(tetr, material);
  tetrMat.position.x = 200;
  tetrMat.position.y = 8;
  tetrMat.position.z = 200;

  divideTetr();
}

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y -=0.01;
  //keyControls();
  render();
}

function render() {
  var delta = clock.getDelta();
  controls.update(delta);
  var a = new THREE.Vector3(tetrMat.position.x, tetrMat.position.y, tetrMat.position.z);
  var b = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

  if (a.distanceTo(b) < 70) {
    explode = true;
  }

  if (explode) {
    moveTetrParticles(delta);
  }

  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  renderer.render(scene, camera);
}

function drawShapes(node) {
  var geoms = [];
  lines = node.getElementsByTagName("line");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var x1 = parseInt(line.getAttribute("x1"));
    var x2 = parseInt(line.getAttribute("x2"));
    var y1 = parseInt(line.getAttribute("y1"));
    var y2 = parseInt(line.getAttribute("y2"));

    var xLen = x2 - x1;
    var yLen = y2 - y1;


    if (meshWalls) {
      var vec1 = new THREE.Vector3(x1, 0, y1);
      var vec2 = new THREE.Vector3(x1, 2, y1);
      var vec3 = new THREE.Vector3(x2, 0, y2);
      var vec4 = new THREE.Vector3(x2, 2, y2);

      var vec5, vec6, vec7, vec8;

      if (xLen === 0) {
        vec5 = new THREE.Vector3(1, 0, y2);
        vec6 = new THREE.Vector3(1, 2, y2);
        vec7 = new THREE.Vector3(1, 0, y1);
        vec8 = new THREE.Vector3(1, 2, y1);
      }

      if (yLen === 0) {
        vec5 = new THREE.Vector3(x1, 0, 1);
        vec6 = new THREE.Vector3(x1, 2, 1);
        vec7 = new THREE.Vector3(x2, 0, 1);
        vec8 = new THREE.Vector3(x2, 2, 1);
      }

      var geometry = new THREE.Geometry();
      var material = new THREE.MeshStandardMaterial({
        color: 0x00cc00,
        side:THREE.DoubleSide
      });

      geometry.vertices.push(vec1);
      geometry.vertices.push(vec2);
      geometry.vertices.push(vec3);
      geometry.vertices.push(vec4);

      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(2, 1, 3));

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      geometry.mergeVertices();
      var box = new THREE.Mesh(geometry, material);
      
      geoms.push(box);
      scene.add(box);
    } else {
      if (xLen === 0) {
        xLen = 2;
        yLen += 2;
      }

      if (yLen === 0) {
        yLen = 2;
      }
      var geom = new THREE.BoxGeometry(xLen, 50, yLen);
      var material = new THREE.MeshLambertMaterial({
        color: 0x0ffff0,
        shading: THREE.FlatShading
      });
      var box = new THREE.Mesh(geom, material);
      box.position.x = xLen / 2 + x1;
      box.position.z = y1 + yLen / 2;

      geoms.push(box);
      scene.add(box);
    }
  }
}

function divideTetr() {
  var holes = [];
  var vertices = tetr.vertices;
  var faces = tetr.faces;
  var i = 0;

  tetrParticles = [];

  faces.forEach(face => {
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial({
      color:0xff4000
    });

    geometry.vertices.push(vertices[face.a]);
    geometry.vertices.push(vertices[face.b])
    geometry.vertices.push(vertices[face.c])

    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 200;
    mesh.position.y = 3;
    mesh.position.z = 200;
    scene.add(mesh);
    i++;

    tetrParticles.push(mesh)
  });
}

function moveTetrParticles(delta) {
  var rotationStep = Math.PI / tetrParticles.length;

  tetrParticles.forEach((particle, i) => {
    var hitsWall = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var x1 = parseInt(line.getAttribute("x1"));
      var x2 = parseInt(line.getAttribute("x2"));
      var y1 = parseInt(line.getAttribute("y1"));
      var y2 = parseInt(line.getAttribute("y2"));

      if ((particle.position.x >= x1 && particle.position.x <= x2) || (particle.position.x <= x1 && particle.position.x >= x2)) {
        hitsWall = particle.position.y < 2.5;
        break;
      }

      if ((particle.position.z >= y1 && particle.position.z <= y2) || (particle.position.z <= y1 && particle.position.z >= y2)) {
        hitsWall = particle.position.y < 2.5;
        break;
      }
    }

    var restricted = hitsWall;
    if (!restricted) {
      particle.translateOnAxis(particle.geometry.faces[0].normal, delta * 5);
    }
  });
}
