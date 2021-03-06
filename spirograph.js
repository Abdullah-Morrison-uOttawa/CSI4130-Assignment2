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
    var teapotGeometry = new THREE.TeapotGeometry(5, 14, true, true, true, false, false);
    var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshLambertMaterial({ color: 'pink' }));
    teapot.position.set(0, 0, 0);
    scene.add(teapot);

    var teapot2Geometry = new THREE.TeapotGeometry(5, 10, true, true, true, false, false);
    var teapot2 = new THREE.Mesh(teapot2Geometry, new THREE.MeshLambertMaterial({ color: 'blue' }));
    teapot2.position.set(0, 0, 0);
    scene.add(teapot2);

    var light1 = new THREE.PointLight('white', 1, 2000)
    light1.position.set(100, 100, 100);
    scene.add(light1);

    // need a camera to look at things
    // calcaulate aspectRatio
    var aspectRatio = window.innerWidth / window.innerHeight;
    // Camera needs to be global
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.y = 0;
    camera.position.z = 100;
    camera.lookAt(scene.position);

    // render the scene
    renderer.render(scene, camera);

    const radius = 20;
    var k = 0.4;
    var l = 0.73;
    var time = 0;

    var spGroup = new THREE.Group();
    scene.add(spGroup)

    function spCurve() {
        THREE.Curve.call(this);
    }

    spCurve.prototype = Object.create(THREE.Curve.prototype);
    spCurve.prototype.constructor = spCurve;

    spCurve.prototype.getPoint = function (t) {
        var tx = radius * ((1 - k) * Math.cos(100 * t) + l * k * Math.cos((1 - k) * 100 * t / k));
        var ty = radius * ((1 - k) * Math.sin(100 * t) - l * k * Math.sin((1 - k) * 100 * t / k));
        var tz = 0;
        return new THREE.Vector3(tx, ty, tz);
    };

    function update_sp(segments, radius, radialSegments) {
        spGroup.remove(spMesh);
        var spPath = new spCurve;
        var geometry = new THREE.TubeGeometry(spPath, segments, radius, radialSegments, false);

        var vertColMat = new THREE.MeshLambertMaterial({ color: 'pink' });
        spMesh = new THREE.Mesh(geometry, vertColMat);
        spGroup.add(spMesh);
    }
 
    spMesh = new THREE.Group();
    update_sp(1000, 0.05, 8);


    //-----------------------------------------------------------------------------


    var spGroup2 = new THREE.Group();
    scene.add(spGroup2)

    function spCurve2() {
        THREE.Curve.call(this);
    }

    spCurve2.prototype = Object.create(THREE.Curve.prototype);
    spCurve2.prototype.constructor = spCurve2;

    spCurve2.prototype.getPoint = function (t) {
        var tx = radius * ((1 - k) * Math.cos(100 * t) + l * k * Math.cos((1 - k) * 100 * t / k));
        var tz = radius * ((1 - k) * Math.sin(100 * t) - l * k * Math.sin((1 - k) * 100 * t / k));
        var ty = 0;
        return new THREE.Vector3(tx, ty, tz);
    };

    function update_sp2(segments, radius, radialSegments) {
        spGroup2.remove(spMesh2);
        var spPath2 = new spCurve2;
        var geometry = new THREE.TubeGeometry(spPath2, segments, radius, radialSegments, false);

        var vertColMat = new THREE.MeshLambertMaterial({ color: 'blue' });
        spMesh2 = new THREE.Mesh(geometry, vertColMat);
        spGroup2.add(spMesh2);
    }

    spMesh2 = new THREE.Group();
    update_sp2(1000, 0.05, 8);


    //-----------------------------------------------------------------------------


    function makeSpirograph2D(radius, k, l, time) {
        var x = radius * ((1 - k) * Math.cos(time) + l * k * Math.cos((1 - k) * time / k));
        var y = radius * ((1 - k) * Math.sin(time) - l * k * Math.sin((1 - k) * time / k));
        return { x, y };
    }

    // setup the control gui
    var controls = new function () {
        this.Change_k = k;
        this.Change_l = l;
        this.Change_Camera = function(){
            if(camera.position.z == 0){
                camera.position.z = 100;
                camera.position.y = 0;
            }else{
                camera.position.z = 0;
                camera.position.y = 100;
            }
            camera.lookAt(scene.position);
        }
        this.update = function () {
            if (controls.Change_k) {
                k = controls.Change_k;
            }
            if (controls.Change_l) {
                l = controls.Change_l;
            }
            update_sp(1000, 0.05, 8);
            update_sp2(1000, 0.05, 8);
        }
    };


    var gui = new dat.GUI();
    gui.add(controls, 'Change_Camera');
    gui.add(controls, 'Change_k', 0.05, 0.95).onChange(controls.update);
    gui.add(controls, 'Change_l', 0.5, 0.95).onChange(controls.update);
    
    render();

    
    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);

        time = time + 6 * Math.PI / 300;
        let { x, y } = makeSpirograph2D(radius, k, l, time);
        teapot.position.set(x, y);
        teapot2.position.set(x, 0, y);

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