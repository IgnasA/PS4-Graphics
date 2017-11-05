function keyControls() {
    if (keyboard[37]) {
        camera.rotation.y -= human.turnSpeed;
    }
    if (keyboard[39]) {
        camera.rotation.y += human.turnSpeed;
    }
    if (keyboard[87]) { //W
        camera.position.x -= Math.sin(camera.rotation.y) * human.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * human.speed;
    }
    if (keyboard[83]) { //S
        camera.position.x += Math.sin(camera.rotation.y) * human.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * human.speed;
    }
    if (keyboard[65]) { //A
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * human.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * human.speed;
    }
    if (keyboard[68]) { //D
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * human.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * human.speed;
    }
}
