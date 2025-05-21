// region VEHICLE

function createCarPath() {
    /*-----------------------Path------------------------------------------*/

    // Create array of points to describe the curve
    var points = [];
    var n = 450; // number of points
    var r = 50; //radius
    for (var i = 0; i < n + 1; i++) {
        points.push( new BABYLON.Vector3((r + (r/5)*Math.sin(8*i*Math.PI/n))* Math.sin(2*i*Math.PI/n), 0, (r + (r/10)*Math.sin(6*i*Math.PI/n)) * Math.cos(2*i*Math.PI/n)));
    }

    //Draw the curve
    var track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
    track.color = new BABYLON.Color3(0, 0, 0);
    /*-----------------------End Path------------------------------------------*/

    /*-----------------------Ground------------------------------------------*/
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 3*r, height: 3*r}, scene);
    /*-----------------------End Ground------------------------------------------*/

    /*----------------Position and Rotate Car at Start---------------------------*/
    carBody.position.y = 4;
    carBody.position.z = r;

    var path3d = new BABYLON.Path3D(points);
    var normals = path3d.getNormals();
    var theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z,normals[0]));
    carBody.rotate(BABYLON.Axis.Y, theta, BABYLON.Space.WORLD);
    var startRotation = carBody.rotationQuaternion;
    /*----------------End Position and Rotate Car at Start---------------------*/

    return points;

}

function createCarAnimation(){
    /*----------------Animation Loop---------------------------*/
    var i=0;
    scene.registerAfterRender(function() {
        carBody.position.x = points[i].x;
        carBody.position.z = points[i].z;
        // wheelFI.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
        // wheelFO.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
        // wheelRI.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);
        // wheelRO.rotate(normals[i], Math.PI/32, BABYLON.Space.WORLD);

        theta = Math.acos(BABYLON.Vector3.Dot(normals[i],normals[i+1]));
        var dir = BABYLON.Vector3.Cross(normals[i],normals[i+1]).y;
        var dir = dir/Math.abs(dir);
        carBody.rotate(BABYLON.Axis.Y, dir * theta, BABYLON.Space.WORLD);

        i = (i + 1) % (n-1);	//continuous looping

        if(i == 0) {
            carBody.rotationQuaternion = startRotation;
        }
    });
}

//endregion

// region OSM

function createOsmDemo(){
    // Part 1 : Creation of Tiled Ground
    // Parameters
    const xmin = -100;
    const zmin = -100;
    const xmax =  100;
    const zmax =  100;
    const precision = {
        "h" : 2,
        "w" : 2
    };
    const subdivisions = {
        'h' : 8,
        'w' : 8
    };
    // Create the Tiled Ground
    const tiledGround = new BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene);

    // Create Multi Material
    const multimat = new BABYLON.MultiMaterial("multi", scene);
    const zoom = 12;
    const xTileBase = 2120;
    const yTileBase = 1498;
    for (let row = 0; row < subdivisions.h; row++) {
        for (let col = 0; col < subdivisions.w; col++) {
            const material = new BABYLON.StandardMaterial(
                "material" + row + "-" + col,
                scene
            );
            material.diffuseTexture = new BABYLON.Texture(
                "http://b.tile.openstreetmap.org/" + zoom + "/" + (xTileBase + col) + "/" + (yTileBase - row) + ".png",
                scene
            );
            material.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            material.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            material.specularColor = new BABYLON.Color4(0, 0, 0, 0);
            material.backFaceCulling = false;
            multimat.subMaterials.push(material);
        }
    }


    // Part 3 : Apply the multi material
    // Define multimat as material of the tiled ground
    tiledGround.material = multimat;

    // Needed variables to set subMeshes
    const verticesCount = tiledGround.getTotalVertices();
    const tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);

    // Set subMeshes of the tiled ground
    tiledGround.subMeshes = [];
    let index = 0;
    let base = 0;
    for (var row = 0; row < subdivisions.h; row++) {
        for (let col = 0; col < subdivisions.w; col++) {
            let submesh = new BABYLON.SubMesh(
                index++, 0, verticesCount, base , tileIndicesLength, tiledGround
            );
            tiledGround.subMeshes.push(submesh);
            base += tileIndicesLength;
        }
    }
}

// endregion