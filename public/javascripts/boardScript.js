/* ===========================Three JS=========================== */
const MODEL_PATH = './javascripts/flyinRabbitV4.glb';
var surfboard;

const BACKGROUND_COLOR = 0x000000;

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
    surfboard = gltf.scene
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
// var Fraction = require('fractional').Fraction
// console.log((new Fraction(7,3)).multiply(new Fraction(1,2)).toString())

let inchesToFeet = function(inches){
  let feet = Math.floor(inches / 12);
  let remainder = inches % 12
  console.log(feet + "'" + remainder)
  return feet + "'" + remainder
}
console.log('test')

let property = document.querySelectorAll('.property');
var selection;
var saved_color = 'EFF2F2';

property.forEach(item => {
  item.addEventListener('click', event => {
  document.querySelector('.slideMenu') ? document.querySelector('.slideMenu').remove() : console.log(item.id);
  var customizer = document.getElementById('custom')
  customizer.style.left = "17%";
  var templateHtml = Handlebars.partials[`${item.id}`]();
  var slideMenu = document.querySelector('.test')
  slideMenu.insertAdjacentHTML('beforebegin', templateHtml)

if(item.id == 'dims'){
  let dimSlider = document.getElementById('dimSlider');
  let length = document.getElementById('length')
  if (dimSlider) {  
    dimSlider.oninput = function() {
    length.textContent = inchesToFeet(this.value)
  }}
}
 /*=======Colors========*/
else if (item.id == 'colors'){
  const dropButtons = document.querySelectorAll(".dropButton");
  const dropDownColors = document.querySelector('.dropDownColors')
  dropButtons.forEach(dropButton => {
    dropButton.addEventListener('click', event => {
      console.log(dropButton.textContent.split(" ")[0].toLowerCase())
      let removedChooser = dropButton.parentElement.querySelector('.colorChooser')
      if (removedChooser){
        removedChooser.remove()
      }
      else{
        let newColors = document.createElement('div')
        newColors.classList.add("colorChooser")
        newColors.setAttribute("id", `${dropButton.textContent.split(" ")[0].toLowerCase()}`)
        dropButton.parentElement.append(newColors);
        buildColors(colors);
        const allColors = document.querySelectorAll(".color");
        for (const colortest of allColors) {
        colortest.addEventListener('click', function(e){
          console.log("colortest:" ,colortest.parentElement.id)
          selection = colortest.parentElement.id
          let color = colors[parseInt(e.target.dataset.key)];
          let new_mtl;
          if (colortest.parentElement.id == 'deck'){
            console.log('in deck')
            saved_color = color.color
            var deck_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: color.shininess ? color.shininess : 10
            });
            if (typeof bottom_mtl == 'undefined'){
              var bottom_mtl = INITIAL_MTL
            }

          }
          else if(colortest.parentElement.id == 'bottom') {
            console.log('in bottom')
            var bottom_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: color.shininess ? color.shininess : 10      
            });
            var deck_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + saved_color),
              shininess: 10});
          }

          else if(colortest.parentElement.id == 'full') {
            var bottom_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: color.shininess ? color.shininess : 10      
            });
            var deck_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: 10});
          }
         
          surfboard.traverse((o) => {
            var saved_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + '131417'),
              shininess: 10});
          if ((o.isMesh && o.nameID != null)) {
            if (o.nameID == 'bottom') {
                console.log('bottomFirst')
                 o.material = bottom_mtl;
              }
            if (o.nameID == 'deck'){
              console.log('deckFirst')
              o.material = deck_mtl;
            }
          }
        });
        }); 
        const dropButtons = document.querySelectorAll(".dropButton");
        const dropDownColors = document.querySelector('.dropDownColors')
        }
      }
    })
  })
}
/*=======End Colors========*/


  let closeButton = document.querySelector('.closeButton')
  closeButton.addEventListener('click', event => {
    console.log('click')
    removed = document.querySelector('.slideMenu')
    removed.remove()
    customizer.style.left = "0";
  })
  });
});

const colors = [
  {
    color: '131417'  
},
{
    color: '374047'  
},
{
    color: '5f6e78'  
},
{
    color: '7f8a93'  
},
{
    color: '97a1a7'  
},
{
    color: 'acb4b9'  
},
{
    color: 'DF9998',
},
{
    color: '7C6862'
},
{
    color: 'A3AB84'
},
{
    color: 'D6CCB1'
},
{
    color: 'F8D5C4'
},
{
    color: 'A3AE99'
},
{
    color: 'EFF2F2'
},
{
    color: 'B0C5C1'
},
{
    color: '8B8C8C'
},
{
    color: '565F59'
},
{
    color: 'CB304A'
},
{
    color: 'FED7C8'
},
{
    color: 'C7BDBD'
},
{
    color: '3DCBBE'
},
{
    color: '264B4F'
},
{
    color: '389389'
},
{
    color: '85BEAE'
},
{
    color: 'F2DABA'
},
{
    color: 'F2A97F'
},
{
    color: 'D85F52'
},
{
    color: 'D92E37'
},
{
    color: 'FC9736'
},
{
    color: 'F7BD69'
},
{
    color: 'A4D09C'
},
{
    color: '4C8A67'
},
{
    color: '25608A'
},
{
    color: '75C8C6'
},
{
    color: 'F5E4B7'
},
{
    color: 'E69041'
},
{
    color: 'E56013'
},
{
    color: '11101D'
},
{
    color: '630609'
},
{
    color: 'C9240E'
},
{
    color: 'EC4B17'
},
{
    color: '281A1C'
},
{
    color: '4F556F'
},
{
    color: '64739B'
},
{
    color: 'CDBAC7'
},
{
    color: '946F43'
},
{
    color: '66533C'
},
{
    color: '173A2F'
},
{
    color: '153944'
},
{
    color: '27548D'
},
{
    color: '438AAC'
}
  ]


function buildColors(colors) {
  console.log('bop ')
  let colorChooser = document.querySelectorAll('.colorChooser');

  colorChooser.forEach(section => {
    for (let [i, color] of colors.entries()) {
      let colorBlob = document.createElement('button');
      colorBlob.classList.add('color');
  
        colorBlob.style.background = "#" + color.color;
  
      colorBlob.setAttribute('data-key', i);
      section.append(colorBlob);
    }
  })
}






