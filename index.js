// initialization of Three.js
function init() {
    // Check if WebGL is available see Three/examples
    // No need for webgl2 here - change as appropriate
    // if (WEBGL.isWebGLAvailable() === false) {
    //     // if not print error on console and exit
    //     document.body.appendChild(WEBGL.getWebGLErrorMessage());
    // }
    // add our rendering surface and initialize the renderer
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


    // WebGL2 examples suggest we need a canvas
    // canvas = document.createElement( 'canvas' );
    // var context = canvas.getContext( 'webgl2' );
    // var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
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
        // sun is a child
    var faceMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
    var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    sun = new THREE.Mesh(sphereGeometry, faceMaterial);
    // position the sun - center
    sun.position.set(0, 0, 0);
    // add the sun to the scene
    solar.add(sun);

    // earth and group
    var earthRotGroup = new THREE.Group()
    solar.add(earthRotGroup)
    var earthGroup = new THREE.Group()
    earthGroup.position.set(15, 0, 0);
    earthRotGroup.add(earthGroup)

    var faceMaterial_earth = new THREE.MeshBasicMaterial({ color: 'blue' });
    var sphereGeometry_earth = new THREE.SphereGeometry(2, 8, 8);
    earth = new THREE.Mesh(sphereGeometry_earth, faceMaterial_earth);
    // add the earth to the scene
    earthGroup.add(earth)

    // Adding teapot to the earth
    // var teapotGeometry = new THREE.TeapotBufferGeometry(1, 15, true, true, true, false, false);
    var teapotGeometry = new THREE.TeapotGeometry(1, 15, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'pink' }));
    // Set position on top of earth
    teapot.position.set(0, 3, 0);
    earthGroup.add(teapot);

    // saturn and group
    var saturnRotGroup = new THREE.Group()
    saturnRotGroup.rotation.y = Math.PI / 2;
    solar.add(saturnRotGroup)
    var saturnGroup = new THREE.Group()
        // position the saturn relative to sun but offset 30deg rel to earth
    saturnGroup.position.set(35 * Math.cos(Math.PI / 6), 35 * Math.sin(Math.PI / 6), 0);
    saturnRotGroup.add(saturnGroup)

    var faceMaterial_saturn = new THREE.MeshBasicMaterial({ color: 'saddlebrown' });
    var sphereGeometry_saturn = new THREE.SphereGeometry(3, 16, 16);
    var saturn = new THREE.Mesh(sphereGeometry_saturn, faceMaterial_saturn);
    // add the saturn to the sun - saturn rotates around sun
    saturnGroup.add(saturn);

    // Adding a ring around saturn
    torusGeometry = new THREE.TorusGeometry(4, 0.5, 32, 16);
    var torus = new THREE.Mesh(torusGeometry,
        new THREE.MeshBasicMaterial({ color: 'dimgray' }));
    // scale
    torus.scale.z = 0.1
    saturnGroup.add(torus); // as torus should rotate with saturn

    // Create Moon with 15 deg offest to torus ring
    var faceMaterial_moon = new THREE.MeshBasicMaterial({ color: 'wheat' });
    var sphereGeometry_moon = new THREE.SphereGeometry(0.5, 8, 8);
    var moon = new THREE.Mesh(sphereGeometry_moon, faceMaterial_moon);

    moon.position.set(6 * Math.cos(Math.PI / 12), 6 * Math.sin(Math.PI / 12), 0);
    saturnGroup.add(moon);

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(90, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.z = szScreen / 2;
    camera.lookAt(scene.position);

    // render the scene
    renderer.render(scene, camera);

    //declared once at the top of your code
    var camera_axis = new THREE.Vector3(-30, 30, 30).normalize(); // viewing axis

    center = 'Sun'
        // setup the control gui
    var controls = new function() {
        this.speed = -10
        this.center = center
        this.perspective = "Perspective";
        this.switchCamera = function() {
            if (camera instanceof THREE.PerspectiveCamera) {
                // ToDo: Create orthographic camera
                var aspect = window.innerWidth / window.innerHeight;
                camera = new THREE.OrthographicCamera(szScreen * aspect / -2, szScreen * aspect / 2, szScreen / 2, szScreen / -2, -500, 500);
                camera.position.z = szScreen / 2;
                updateAt(this.center);
                this.perspective = "Orthographic";
                updateMatDisplay()

            } else {
                camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
                camera.position.z = szScreen / 2;
                updateAt(this.center);
                this.perspective = "Perspective";
                updateMatDisplay();
            }
            center = this.center
        };
        this.look = function() {
            if (this.center == "Sun") {
                this.center = "Earth";
            } else {
                this.center = "Sun";
            }
            updateAt(this.center);
            center = this.center
        };
    };

    updateMatDisplay = function() {
        // Change message in tag "output" in the HTML
        var projMat = camera.projectionMatrix.clone();
        projMat.transpose();
        var proj = projMat.elements;
        proj = proj.map(function(nEle) {
            return nEle.toFixed(3);
        })
        var projString = "<pre>".concat("[ ", proj.slice(0, 4), " ]\n");
        projString = projString.concat("[ ", proj.slice(4, 8), " ]\n");
        projString = projString.concat("[ ", proj.slice(8, 12), " ]\n");
        projString = projString.concat("[ ", proj.slice(12, 16), " ]</pre>");
        // Change info message
        info.innerHTML = projString
    }

    updateAt = function(locStr) {
        if (locStr == "Sun") {
            camera.lookAt(sun.position);
        } else {
            // ToDo: Looking at the earth
            camera.lookAt(earth.getWorldPosition(camera_axis));
        }
    }


    var gui = new dat.GUI();
    gui.add(controls, 'speed', -15, -1).onChange(controls.redraw);
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective').listen();
    gui.add(controls, 'look');
    gui.add(controls, 'center').listen();
    updateMatDisplay()
    render();

    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);
        speed = 2 ** controls.speed
            // earth group rotates arond sun
        earthRotGroup.rotation.z = (earthRotGroup.rotation.z + 3 * speed) % (2.0 * Math.PI);
        // Teapot has to compensate to stay on top of earth
        earthGroup.rotation.z = (earthGroup.rotation.z - 3 * speed) % (2.0 * Math.PI);
        // console.log(earthRotGroup.rotation.z , earthGroup.rotation.z)
        // saturn group rotates arond sun
        saturnRotGroup.rotation.z = (saturnRotGroup.rotation.z + speed) % (2.0 * Math.PI);
        // saturn ring and moon rotate around saturn
        saturnGroup.rotation.x = (saturnGroup.rotation.x + 5 * speed) % (2.0 * Math.PI);
        saturnGroup.rotation.y = (saturnGroup.rotation.y + 5 * speed) % (2.0 * Math.PI);
        // Todo: Make sure to look at Earth (moves!) or Sun (does not move)
        updateAt(center)

        renderer.render(scene, camera);
    }

}


function onResize() {
    var aspect = window.innerWidth / window.innerHeight;
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect;
    } else {
        // ToDo: Must update projection matrix
        camera = new THREE.OrthographicCamera(szScreen * aspect / -2, szScreen * aspect / 2, szScreen / 2, szScreen / -2, -500, 500);

    }
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateMatDisplay()
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);