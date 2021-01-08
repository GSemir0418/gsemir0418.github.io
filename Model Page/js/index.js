let container, stats;
let camera, scene, renderer;
let group;
let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let THREE = window.THREE;


// 模型组的外接盒
let envelopeBox = new THREE.Box3();

//模型路径
let mat1 = 'models/lancuiting/lancuiting.mtl';
let obj1 = 'models/lancuiting/lancuiting.obj';

let model1 = null;
model5 = null;
model6 = null;
currentModel = model1;


// 模型是否自传
let rotation = true;


init();
animate();

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 10000000);
    camera.position.z = 800;
    camera.position.y = 200;

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add(group);

    //scene.add(new THREE.AmbientLight(0xFFFFFF, 1.5));

    let dLight = new THREE.DirectionalLight(0xFFFFFF,2);
    dLight.position.set(500, 1000,4000);
    dLight.castShadow = true;
    scene.add(dLight);


    new THREE.MTLLoader()
        .load(mat1, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj1, function (loadedMesh) {
                    model1 = loadedMesh;
                    let k;
                    for (k in model1.children) {
                        model1.children[k].castShadow = true;
                        model1.children[k].receiveShadow = true;
                    }
                    model1.traverse(function (value) {
                        if (value.isMesh) {
                            value.castShadow = true;
                            value.receiveShadow = true;
                        }
                    });
                    model1.scale.set(1.4, 1.4, 1.4);
                    console.log(loadedMesh);
                    group.add(model1);
                    envelopeBox.expandByObject(group);
                });
        });


    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true, autoClear: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    let orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = false;

    //onClick();

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

/*function onClick() {
    //renderer.domElement.style.cursor = 'crosshair';
    renderer.domElement.addEventListener('click', clickFn);
}

function clickFn(e) {
    rotation = false;
}*/

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {
    if (rotation) {
        group.rotation.y += 0.01;
    }
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);


}


/**
 * 递归循环模型，并执行相应的操作
 * @param mesh 贷循环的模型
 * @param fn function(mesh)
 */
function recursionFn(mesh, fn) {
    if (mesh.children.length !== 0) {
        fn(mesh);
        mesh.children.forEach(m => {
            recursionFn(m, fn);
        })
    } else {
        fn(mesh);
    }
}


