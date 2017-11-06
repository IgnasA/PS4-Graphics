function addLights() {
  var pointColor = '#ccffcc';
  var finishColor= '#ff0000';
  var startColor = '#1be833';
  var pointLight = new THREE.PointLight(pointColor);
  pointLight.distance = 80;
  var distance = pointLight.distance;
  var height = 15;
  scene.add(pointLight);

  addLight(160,height,12,distance,finishColor);
  addLight(185,height,15,distance,pointColor);
  addLight(95,height,15,distance,pointColor);
  addLight(122,height,70,distance,pointColor);
  addLight(122,height,120,distance,pointColor);
  addLight(122,height,170,distance,pointColor);
  addLight(95,height,170,distance,pointColor);
  addLight(110,height,220,distance,pointColor);
  addLight(122,height,220,distance,pointColor);
  addLight(142,height,220,distance,pointColor);
  addLight(154,height,260,distance,pointColor);
  addLight(154,height,300,distance,pointColor);
  addLight(170,height,320,distance,startColor);

}

function addLight(x,y,z,d,color) {
  pointLight = new THREE.PointLight(color);
  pointLight.position.set(x, y, z)
  pointLight.distance = d;
  var material = new THREE.MeshLambertMaterial({
    color:0x00ff00
  });
  var sphereGeometry = new THREE.SphereGeometry( 1, 1, 1 );
	this.sphere = new THREE.Mesh( sphereGeometry, material );
	sphere.position.set(x, y, z);
	scene.add(sphere);
  scene.add(pointLight);
}
