function init() {
    var container = document.createElement('div');
    document.body.appendChild(container);

    document.body.appendChild(container);
    info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '5px';
    info.style.left = '5px';
    info.style.width = '100%';
    info.style.textAlign = 'left';
    info.style.color = "lightblue";
    info.innerHTML = "row 0<br>row 1<br>row 2<br>row 3";
    container.appendChild(info);

    renderer = new THREE.WebGLRenderer();
    // set some state - here just clear color
    renderer.setClearColor(new THREE.Color(0x333333));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add the output of the renderer to the html element
    container.appendChild(renderer.domElement);


    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
    // A camera with fovy = 90deg means the z distance is y/2
    szScreen = 120;

    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);

    // Solar system group
    var solar = new THREE.Group();
    scene.add(solar)

    // Adding teapot to the earth
    // var teapotGeometry = new THREE.TeapotBufferGeometry(1, 15, true, true, true, false, false);
    var teapotGeometry = new THREE.TeapotGeometry(5, 15, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'pink' }));
    // Set position on top of earth
    teapot.position.set(0, 0, 0);
    solar.add(teapot);

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    var width = 20;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.y = 45 
    camera.position.z = 200;
    camera.lookAt(scene.position);
    camera.position.y = 55 

    // render the scene
    renderer.render(scene, camera);

    //declared once at the top of your code
    var camera_axis = new THREE.Vector3(-30,30,30).normalize(); // viewing axis
    
    // setup the control gui
    var controls = new function () {
        this.camera = -10
        this.redraw = function () {
            camera.lookAt(scene.position);
        };
    };


    var gui = new dat.GUI();
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

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);