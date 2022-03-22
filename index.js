function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    // set some state - here just clear color
    renderer.setClearColor(new THREE.Color(0x333333));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);


    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
    // A camera with fovy = 90deg means the z distance is y/2
    szScreen = 120;

    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // Adding teapot
    var teapotGeometry = new THREE.TeapotGeometry(5, 20, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'pink' }));
    teapot.position.set(0, 0, 0);
    scene.add(teapot);

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.y = 45 
    camera.position.z = 200;
    camera.lookAt(scene.position);

    // render the scene
    renderer.render(scene, camera);

    // setup the control gui
    var controls = new function () {
        this.camera = -10
        this.switchCamera = function(){
            if(camera.position.z == 0){
                camera.position.z = 200
                camera.position.y = 55 
            }else{
                camera.position.z = 0
                camera.position.y = 200
            }
            camera.lookAt(scene.position);
        }
        this.redraw = function () {
            camera.lookAt(scene.position);
        };
    };


    var gui = new dat.GUI();
    gui.add(controls, 'switchCamera')
    gui.add(camera.position, 'x', -360, 360).onChange(controls.redraw);
    gui.add(camera.position, 'y', -360, 360).onChange(controls.redraw);
    gui.add(camera.position, 'z', 0, 360 ).onChange(controls.redraw);
    render();

    
    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    }

}

window.onload = init;

function onResize() {
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// register our resize event function
window.addEventListener('resize', onResize, true);