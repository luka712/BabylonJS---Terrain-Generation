window.onload = function () {

    var canvas = document.getElementById("renderCanvas");

    var engine = new BABYLON.Engine(canvas, true);


    function createScene() {
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(25, 15, 35), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        // Change position and direction of light
        var light = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, -1, 0), scene);
        light.position = new BABYLON.Vector3(0, 0, 10);

        var customMesh = new BABYLON.Mesh("custom", scene);
        var material = new BABYLON.StandardMaterial("myMaterial", scene);
        material.specularColor = new BABYLON.Color3(0, 0, 0);

        customMesh.material = material;
        customMesh.material.wireframe = false;
        var vertexData = new BABYLON.VertexData();
        var terrainData = createTerrainData(32, 32);
        vertexData.positions = terrainData.positions;
        vertexData.indices = terrainData.indices;
        vertexData.colors = terrainData.colors;
        vertexData.normals = [];
        BABYLON.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);

        vertexData.applyToMesh(customMesh);

        customMesh.translate(new BABYLON.Vector3(-20, 0, -15), 1, BABYLON.Space.WORLD);
        customMesh.convertToFlatShadedMesh();

        return scene;
    }

    function createTerrainData(width, length) {
        var index = 0,
            positions = [],
            indices = [],
            colors = [];


        for (var z = 0; z <= length; z++) {
            for (var x = 0; x <= width; x++) {
                positions.push(x);
                positions.push(0);
                positions.push(z);
            }
        }

        var numOfIndicesInRow = width + 1;
        for (var z = 0; z < length; z++) {
            for (var x = 0; x < width; x++) {
                var bottomLeft = x + z * numOfIndicesInRow;
                var bottomRight = x + 1 + z * numOfIndicesInRow;
                var topLeft = x + (z + 1) * numOfIndicesInRow;
                var topRight = x + 1 + (z + 1) * numOfIndicesInRow;

                // first triangle
                indices.push(topLeft);
                indices.push(bottomLeft);
                indices.push(bottomRight);
                // second triangle
                indices.push(bottomRight);
                indices.push(topRight);
                indices.push(topLeft);
            }
        }

        var hills = [
            new Hill(16, 16, 1, 22, function (distance) {
                return Math.random() * 0.5;
            }),
            new Hill(15, 15, 8, 15, function (distance) {
                return this.height * Math.pow(distance, 2);
            }),
            new Hill(5, 23, 3, 6, function (distance) {
                return this.height * Math.sin(distance * Math.PI);
            }),
            new Hill(15, 7.5, 9, 8, function (distance) {
                return this.height * Math.pow(distance, 1.5);
            })
        ]

        for (var i = 0; i <= positions.length; i += 3) {
            var x = positions[i];
            var y = positions[i + 1];
            var z = positions[i + 2];

            for (var j = 0; j < hills.length; j++) {
                var hill = hills[j];
                var dx = hill.x - x;
                var dz = hill.z - z;

                var distance = Math.sqrt(dx * dx + dz * dz) / hill.radius;
                var distanceReversed = 1 - distance;
                if (distanceReversed > 0) {
                    var newHeight = hill.heightCallback(distanceReversed);
                    if (newHeight > positions[i + 1]) {
                        positions[i + 1] = newHeight;
                    }

                }

            }
        }


        for (var i = 0; i <= positions.length; i += 3) {
            var y = positions[i + 1];
            if(y > 5){
                colors.push(1);
                colors.push(1);
                colors.push(1);
                colors.push(1);
            }
            else if (y > 4) {
                colors.push(0.6);
                colors.push(0.6);
                colors.push(0.6);
                colors.push(1);
            } 
            else if (y > 1.5) {
                colors.push(0.5);
                colors.push(0.2);
                colors.push(0.1);
                colors.push(1);
            } else {
                colors.push(0);
                colors.push(1);
                colors.push(0);
                colors.push(1);
            }

        }

        return {
            positions: positions,
            indices: indices,
            colors: colors
        }
    }

    function Hill(x, z, height, radius, heightCallback) {
        this.x = x;
        this.z = z;
        this.height = height;
        this.radius = radius;
        this.heightCallback = heightCallback;
    }

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
}