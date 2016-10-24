(function () {
    var renderer;
    var camera;
    var controls;
    var effect;
    var scene;
    var manager;
    var objectModel;
    var obj;

    this.initialize = function(){
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        // カメラを生成
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(0, 0, 0);

        // VR用コントローラを生成
        controls = new THREE.VRControls(camera);

        // VR用エフェクトを生成（2分割の画面を構築する）
        effect = new THREE.VREffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);

        // VRマネージャの生成
        manager = new WebVRManager(renderer, effect);

        var light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.set(-1, 1, 1);
        light.castShadow = true;
        scene.add(light);
        var ambient = new THREE.AmbientLight(0xffffff, 0.5);
        ambient.castShadow = true;
        ambient.position.set(0,0,-5);
        scene.add(ambient);
        var pointlight = new THREE.PointLight(0xffffff, 0.8);
        pointlight.position.set(0.3, 0.4, -3);
        pointlight.scale.set(1, 1, 1);
        pointlight.castShadow = true;
        scene.add(pointlight);
        var axis = new THREE.AxisHelper(2000); // 補助線を2000px分表示
        axis.position.set(0, -1, 0); // 零戦の真ん中に合わせるため、少しずらす
        scene.add(axis);

        // obj mtl を読み込んでいる時の処理
        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
            }
        };
        // obj mtl が読み込めなかったときのエラー処理
        var onError = function (xhr) { };
        // obj mtlの読み込み
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load("models/pumpkin.mtl", function(targetMaterial) {
            targetMaterial.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(targetMaterial);
            objLoader.load("models/pumpkin.obj", function (targetObject) {
                objectModel = targetObject.clone();
                objectModel.scale.set(1, 1, 1); // 縮尺の初期化
                objectModel.rotation.set(0, 3, 0); // 角度の初期化
                objectModel.position.set(0, 0, 0); // 位置の初期化
                // objをObject3Dで包む
                obj = new THREE.Object3D();
                obj.add(objectModel);
                scene.add(obj); // sceneに追加
            }, onProgress, onError); // obj mtl データは(.obj, .mtl. 初期処理, 読み込み時の処理, エラー処理)

        });

    };
    this.animate = function(timestamp) {
        // VRコントローラのupdate
        controls.update();
        // VRマネージャを通してシーンをレンダリング
        manager.render(scene, camera, timestamp);

        // アニメーションループ
        requestAnimationFrame(animate);
    };
    initialize();
    // アニメーションの開始
    animate(performance ? performance.now() : Date.now());
}).call(this);