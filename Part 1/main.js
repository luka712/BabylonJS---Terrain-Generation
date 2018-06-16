window.onload = function () {

    var canvas = document.getElementById("renderCanvas");

    var engine = new BABYLON.Engine(canvas, true);


    function createScene() {
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.TargetCamera('camera', new BABYLON.Vector3(0, 0, -5), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        // Change position and direction of light
        var light = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0,0,1), scene);
        light.position = new BABYLON.Vector3(0, 0, 1);

        var customMesh = new BABYLON.Mesh("custom", scene);
        var material = new BABYLON.StandardMaterial("myMaterial", scene);
        material.specularColor = new BABYLON.Color3(0, 0, 0);

        customMesh.material = material;
        var vertexData = new BABYLON.VertexData();

        var index = 0;
        var face = createFace([0,1,0], [0,0,0], [1,0,0], [1,1,0], index, [0,1,0,1]);;
        vertexData.positions = face.positions;
        vertexData.indices = face.indices;
        vertexData.colors = face.colors;
        vertexData.normals = [];
        BABYLON.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);

        vertexData.applyToMesh(customMesh);

        return scene;
    }

    function createFace(topLeft, bottomLeft, bottomRight, topRight, i, color){
        var v1 = topLeft;
        var v2 = bottomLeft;
        var v3 = bottomRight;
        var v4 = topRight;

        // first triangle 
        var triangle1 = [i, i+1, i+2];
        // second triangle
        var triangle2 = [i+2, i+3, i];
    
        return {
            positions: v1.concat(v2, v3, v4),
            indices: triangle1.concat(triangle2),
            colors: color.concat(color, color, color),
            i: i + 4
        }
    }

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
}