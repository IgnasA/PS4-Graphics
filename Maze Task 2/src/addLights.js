function addLights() {
  var pointColor = "#ccffcc";
  var color= '#ed0735';
  var pointLight = new THREE.PointLight(pointColor);
  pointLight.distance = 50;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(color);
  pointLight.position.set(160, 5, 15)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(210, 5, 200)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(70, 5, 70)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(200, 5, 0)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(0, 5, 200)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(100, 5, 200)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(0, 5, 70)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(300, 5, 300)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(300, 5, 150)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight.position.set(200, 5, 260)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight.position.set(350, 5, 350)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight = new THREE.PointLight(pointColor);
  pointLight.position.set(70, 5, 0)
  pointLight.distance = 100;
  scene.add(pointLight);

  pointLight.position.set(100, 5, 100)
  pointLight.distance = 100;
  scene.add(pointLight);

}