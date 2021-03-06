const HELPER = function(){

}

HELPER.createScene = function(engine){
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
}

HELPER.createCamera = function(scene, distance){
    const target = new BABYLON.Vector3(0, 0, 0);
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, distance, target, scene);
    camera.setPosition(new BABYLON.Vector3(0, distance, -distance));
    camera.attachControl(canvas, true);
}

HELPER.createLights = function(scene){
    // mainLight = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), scene);
    mainLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
}

HELPER.createCylinder = function(scene){
    let cylinderMaterial = new BABYLON.StandardMaterial("material", scene);
    cylinderMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    cylinderMaterial.specularColor = new BABYLON.Color3(1.0, 0.0, 0.0);

    let cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 20, 1, scene);

}