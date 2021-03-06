(function(window){

    var _LEGO_EV3 = window.LEGO_EV3;
    if(_LEGO_EV3 === undefined){
        _LEGO_EV3 = function () {};
        window.LEGO_EV3 = new _LEGO_EV3();
    }

})(window);

LEGO_EV3.createBody = function(){

    const body = new BABYLON.TransformNode("EV3_BODY");

    // Loads structure
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_structure.glb", scene, function (newMeshes) {
        const structure = newMeshes[0];
        structure.parent = body;
        structure.position = new BABYLON.Vector3(0, 6.14804, 2.63665);
    });

    // Loads brick
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_brick.glb", scene, function (newMeshes) {
        const structure = newMeshes[0];
        structure.parent = body;
        structure.position = new BABYLON.Vector3(0, 10.19805, 3.19668);
    });

    // Loads clips
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_clips.glb", scene, function (newMeshes) {
        const structure = newMeshes[0];
        structure.parent = body;
        structure.position = new BABYLON.Vector3(0, 6.83879, 2.56352);
    });

    // Loads ultrasonic sensor
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_ultrasonic.glb", scene, function (newMeshes) {
        const ultrasonic = newMeshes[0];
        ultrasonic.parent = body;
        ultrasonic.position = new BABYLON.Vector3(0, 2.41806, -3.64434);
    });

    // Loads color sensor
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_color.glb", scene, function (newMeshes) {
        const color = newMeshes[0];
        color.parent = body;
        color.position = new BABYLON.Vector3(5.57809, 2.6548, -5.92201);
    });

    // Loads motors
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_motor.glb", scene, function (newMeshes) {
        const leftMotor = BABYLON.Mesh.MergeMeshes([newMeshes[1], newMeshes[2], newMeshes[3], newMeshes[4]], true, true, undefined, false, true);
        leftMotor.parent = body;
        leftMotor.position = new BABYLON.Vector3(2.40597, 4.40292, 4.19073);
        const rightMotor = leftMotor.createInstance();
        rightMotor.parent = body;
        rightMotor.position = new BABYLON.Vector3(-2.40597, 4.40292, 4.19073);
    });

    return body;

}

LEGO_EV3.createWheels = function(callback){

    const wheels = {left: undefined, right: undefined};

    // Loads wheels
    BABYLON.SceneLoader.ImportMesh("", "resources/", "ev3_wheel.glb", scene, function (newMeshes) {

        const left = new BABYLON.TransformNode("EV3_BODY");

        // Creates left and right wheels
        const leftWheel = BABYLON.Mesh.MergeMeshes([newMeshes[1], newMeshes[2], newMeshes[3]], true, true, undefined, false, true);
        const rightWheel = leftWheel.createInstance();

        // Places and rotates
        leftWheel.position = new BABYLON.Vector3(5.95316, 2.81535, 0.03433);
        rightWheel.position = new BABYLON.Vector3(-5.95316, 2.81535, 0.03433);
        rightWheel.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);

        // Creates physics impostors
        const mass = 0.05;
        const restitution = 0.8;
        leftWheel.physicsImpostor = new BABYLON.PhysicsImpostor(leftWheel, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: mass,
            restitution: restitution
        }, scene);
        rightWheel.physicsImpostor = new BABYLON.PhysicsImpostor(rightWheel, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: mass,
            restitution: restitution
        }, scene);

        // Callback
        wheels.left = leftWheel;
        wheels.right = rightWheel;
        callback(wheels);


    });

}