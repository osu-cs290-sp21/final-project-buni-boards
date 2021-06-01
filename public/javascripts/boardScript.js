/* ===========================Three JS=========================== */
const MODEL_PATH = './javascripts/flyinRabbitV4.glb';

const BACKGROUND_COLOR = 0xf1f1f1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const canvas = document.querySelector('#boardCanvas')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.shadowMap.enabled = true; //We’ve set the pixel ratio to whatever the device’s pixel ratio is
renderer.setPixelRatio(window.devicePixelRatio);  //make them relavant to shadows

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000); //field view, size of window, default clipping planes
const cameraFar = 5
camera.position.z = cameraFar;
camera.position.x = 0;

const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );

const INITIAL_MAP = [
  {childID: 'bottom', mtl: INITIAL_MTL},
  {childID: 'deck', mtl: INITIAL_MTL},
];

/* =====Loader===== */
  const loader = new THREE.GLTFLoader();

  loader.load(MODEL_PATH, function(gltf) {
    const surfboard = gltf.scene
    surfboard.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
      }
    });

  surfboard.scale.set(2, 2, 2);
  surfboard.rotation.y = Math.PI / 2;
  surfboard.position.y = -2

  for (const object of INITIAL_MAP) {
    initColor(surfboard, object.childID, object.mtl)
  }

  scene.add(surfboard)
}, undefined, function(error) {
  console.log(error)
});

/* =====End Loader===== */
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh) {
     if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type; // Set a new property to identify this object
       }
   }
 });
}

/* =====Lights===== */
const color = 0xEBEBEB;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set (0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight)

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight2.position.set(-8, 12, -8);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight2)

/* =====End Lights===== */

/* =====Controls===== */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
/* =====End Controls===== */

/*
* This function listens to the canvas and window size
* Is used inside the animate function to determine whether to re-render the scene
* The division by the device pixel ration ensure the canvas is sharp on mobile phones
 */
function resizeRendererToDisplaySize (renderer) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvasPixelWidth = canvas.width / window.devicePixelRatio;
  const canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function animate () {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

animate();

/* ===========================End Three JS=========================== */

