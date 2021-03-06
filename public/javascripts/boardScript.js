/* ===========================Three JS=========================== */
let boardName = document.getElementById('boardName')
let modelName = boardName.textContent.replace(" ", "")
console.log("board:", modelName)
const MODEL_PATH = "/3Dmodels/" + modelName + ".glb";
console.log(MODEL_PATH)
const DRAG_NOTICE = document.getElementById('js-drag-notice');
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
const cameraFar = 6
camera.position.z = cameraFar;
camera.position.x = 0;
var loaded = false;

/*test*/
const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
const points = []; 
points.push( new THREE.Vector3(1, -2, 0 ) ); 
points.push( new THREE.Vector3( 1, 1.75, 0 ) ); 
// points.push( new THREE.Vector3( 10, 0, 0 ) ); 
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometry, material )
line.name = 'y-line'

const material2 = new THREE.LineBasicMaterial( { color: 0xffffff } );
const points2 = []; 
points2.push( new THREE.Vector3(-0.5, -2.1, 0 ) ); 
points2.push( new THREE.Vector3( 0.5, -2.1, 0 ) ); 
const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
const line2 = new THREE.Line( geometry2, material2 )
line2.name = 'x-line'

var mesh, mesh2, textGeometry, fontloader
  

function updateLength(lengthObject) {
  let testObject = scene.getObjectByName("length")
  scene.remove(testObject)
  fontloader = new THREE.FontLoader();
  fontloader.load( '/PTMono.js', function ( font ) {

  textGeometry = new THREE.TextGeometry( `${lengthObject}`, {

    font: font,

    size: 0.1,
    height: 0.01,
    curveSegments: 12,

    bevelEnabled: false

  });

  textMaterial = new THREE.MeshPhongMaterial( 
    { color: 0xffffff, specular: 0xffffff }
  );

  mesh = new THREE.Mesh( textGeometry, textMaterial );
  mesh.name = 'length'
  mesh.position.x = 1.1

  scene.add( mesh );
});  
}

function updateWidth(width) {
  let testObject2 = scene.getObjectByName("width")
  scene.remove(testObject2)
  fontloader = new THREE.FontLoader();
  fontloader.load( '/PTMono.js', function ( font ) {

  textGeometry = new THREE.TextGeometry( `${width + `"`}`, {

    font: font,

    size: 0.1,
    height: 0.01,
    curveSegments: 12,

    bevelEnabled: false

  });

  textMaterial = new THREE.MeshPhongMaterial( 
    { color: 0xffffff, specular: 0xffffff }
  );

  mesh2 = new THREE.Mesh( textGeometry, textMaterial );
  mesh2.name = 'width'
  mesh2.position.x = -0.2
  mesh2.position.y = -2.3

  scene.add( mesh2 );
}); 
}


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
  if(modelName == 'thegem'){
    surfboard.rotation.y = -Math.PI/2;
  }
  else{
    surfboard.rotation.y = Math.PI / 2;
  }
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
  if (surfboard != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
}

animate();

let initRotate = 0;

function initialRotation() {
  initRotate++;
if (initRotate <= 120) {
    surfboard.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}

function add_materials (d_mtl, b_mtl) {
  surfboard.traverse((o) => {
    if ((o.isMesh && o.nameID != null)) {
      if (o.nameID == 'bottom') {
          console.log('bottomFirst')
           o.material = b_mtl;
        }
      if (o.nameID == 'deck'){
        console.log('deckFirst')
        o.material = d_mtl;
      }
    }
  });
}

/* ===========================End Three JS=========================== */
let contour = document.getElementById('contour')
let fins = document.getElementById('fins')
let rockers = document.getElementById('rocker')
let finishes = document.getElementById('finish')
var deckColor = document.getElementById('deckColor')
var bottomColor = document.getElementById('bottomColor')
var userLength = document.getElementById('height')
var userWidth = document.getElementById('width')
var userThickness = document.getElementById('thickness')


var ready = document.getElementById('ready')
ready.addEventListener('click', event =>{
  var bottom_mtl = new THREE.MeshPhongMaterial({
    color: parseInt('0x' + bottomColor.textContent),
    shininess: 10      
  });

  var deck_mtl = new THREE.MeshPhongMaterial({
    color: parseInt('0x' + deckColor.textContent),
    shininess: 10      
  });

  add_materials(deck_mtl, bottom_mtl);
})

let inchesToFeet = function(inches){
  let feet = Math.floor(inches / 12);
  let remainder = inches % 12
  console.log(feet + "'" + remainder)
  return feet + "'" + remainder
}
let property = document.querySelectorAll('.property');
var saved_color = 'EFF2F2';

property.forEach(item => {
  item.addEventListener('click', event => {
  document.querySelector('.slideMenu') ? document.querySelector('.slideMenu').remove() : console.log(item.id);
  var customizer = document.getElementById('custom')
  customizer.style.left = "17%";
  var templateHtml = Handlebars.partials[`${item.id}`]();
  console.log(item.classList)
  var slideMenu = document.querySelector('.test')
  if (item.classList[1] == 'active'){
    while (slideMenu.firstChild) {
      slideMenu.removeChild(slideMenu.firstChild);
    }
  }
  else{
    item.classList.add('active')
  }
  slideMenu.insertAdjacentHTML('beforebegin', templateHtml)

if(item.id == 'dims'){
  let dimSlider = document.getElementById('dimSlider');
  let widthSlider = document.getElementById('widthSlider')
  let thicknessSlider = document.getElementById('thicknessSlider');
  let length = document.getElementById('lengthContent')
  let width = document.getElementById('widthContent')
  let thickness = document.getElementById('thicknessContent')
  width.textContent = userWidth.textContent + `"`
  widthSlider.value = userWidth.textContent
  thickness.textContent = userThickness.textContent + `"`
  thicknessSlider.value = userThickness.textContent
  length.textContent = inchesToFeet(userLength.textContent)
  dimSlider.defaultValue = userLength.textContent
  var lengthObject = scene.getObjectByName("length")
  var widthObject = scene.getObjectByName("width")

  scene.add(line)
  scene.add(line2)
  updateLength(length.textContent)
  updateWidth(userWidth.textContent)
  if (dimSlider) {  
    dimSlider.oninput = function () {
      length.textContent = inchesToFeet(this.value)  
      lengthObject = scene.getObjectByName("length")
      scene.remove(lengthObject)
      updateLength(length.textContent)
      dimSlider.defaultValue = this.value 
      userLength.textContent = this.value
      
    }
    dimSlider.onmouseup = function() {
    lengthObject = scene.getObjectByName("length")
    scene.remove(lengthObject)
    updateLength(length.textContent)
    }
  }
  widthSlider.oninput = function () {
    userWidth.textContent = this.value
    width.textContent = userWidth.textContent + `"`
    widthObject = scene.getObjectByName("width")
    scene.remove(widthObject)
    updateWidth(userWidth.textContent)
  }
  widthSlider.onmouseup = function () {
    widthObject = scene.getObjectByName("width")
    scene.remove(widthObject)
    updateWidth(userWidth.textContent)
  }
  thicknessSlider.oninput = function () {
    userThickness.textContent = this.value
    thickness.textContent = userThickness.textContent + `"`
  }
}

else if (item.id == 'contours'){
  clearScene()
  let allContours = document.querySelectorAll('.contour')
  let contours = document.getElementById('contour')
  allContours.forEach(item => {
    item.childNodes[1].childNodes[3].addEventListener('click', event =>{
      contours.textContent = item.childNodes[1].childNodes[3].id
    })
    if (item.childNodes[1].childNodes[3].id == contours.textContent){
      document.getElementById(`${contours.textContent}`).checked = true
    }
  })
}

else if (item.id == 'fins'){
  clearScene()
  let allFins = document.querySelectorAll('.fin')
  let fins = document.getElementById('fins')
  allFins.forEach(item => {
    item.childNodes[1].childNodes[3].addEventListener('click', event =>{
      console.log("id:", item.childNodes[1].childNodes[3].id)
      fins.textContent = item.childNodes[1].childNodes[3].id
    })
    console.log("item:", item.childNodes[1].childNodes[3].id)
    console.log("fins:" , fins.textContent)
    console.log('check: ', item.childNodes[1].childNodes[3].id == fins.textContent)
    if (item.childNodes[1].childNodes[3].id == fins.textContent){
      console.log("inside check")
      document.getElementById(`${fins.textContent}`).checked = true
    }
  })
}

else if (item.id == 'rocker'){
  clearScene()
  let allRockers = document.querySelectorAll('.rocker')
  let rockers = document.getElementById('rocker')
  allRockers.forEach(item => {
    item.childNodes[1].childNodes[3].addEventListener('click', event =>{
      rockers.textContent = item.childNodes[1].childNodes[3].id
    })
    if (item.childNodes[1].childNodes[3].id == rockers.textContent){
      document.getElementById(`${rockers.textContent}`).checked = true
    }
  })
}

else if (item.id == 'finish'){
  clearScene()
  let allFinishes = document.querySelectorAll('.finish')
  let finishes = document.getElementById('finish')
  allFinishes.forEach(item => {
    item.childNodes[1].childNodes[3].addEventListener('click', event =>{
      finishes.textContent = item.childNodes[1].childNodes[3].id
    })
    console.log("item:", item.childNodes[1].childNodes[3].id)
    console.log("fins:" , finishes.textContent)
    console.log('check: ', item.childNodes[1].childNodes[3].id == finishes.textContent)
    if (item.childNodes[1].childNodes[3].id == finishes.textContent){
      console.log("inside check")
      document.getElementById(`${finishes.textContent}`).checked = true
    }
  })
}
 /*=======Colors========*/


else if (item.id == 'colors'){
  clearScene()
  const dropButtons = document.querySelectorAll(".dropButton");
  const dropDownColors = document.querySelector('.dropDownColors');
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
          let color = colors[parseInt(e.target.dataset.key)];
          let new_mtl;
          if (colortest.parentElement.id == 'deck'){
            saved_color = color.color
            deckColor.textContent = color.color
            var deck_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: color.shininess ? color.shininess : 10
            });
            if (typeof bottom_mtl == 'undefined'){
              var bottom_mtl = INITIAL_MTL
            }

          }
          else if(colortest.parentElement.id == 'bottom') {
            bottomColor.textContent = color.color
            var bottom_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: color.shininess ? color.shininess : 10      
            });
            var deck_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + saved_color),
              shininess: 10});
          }

          else if(colortest.parentElement.id == 'full') {
            bottomColor.textContent = color.color
            deckColor.textContent = color.color
            var bottom_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: color.shininess ? color.shininess : 10      
            });
            var deck_mtl = new THREE.MeshPhongMaterial({
              color: parseInt('0x' + color.color),
              shininess: 10});
          }     
          add_materials(deck_mtl, bottom_mtl)
        }); 
        const dropButtons = document.querySelectorAll(".dropButton");
        const dropDownColors = document.querySelector('.dropDownColors')
        }
      }
    })
  })
}
/*=======End Colors========*/


function clearScene() {
  scene.remove(line)
  scene.remove(line2)
  let mesh1Object = scene.getObjectByName('length')
  scene.remove(mesh1Object)
  let mesh2Object = scene.getObjectByName('width')
  scene.remove(mesh2Object)
}
let closeButton = document.querySelector('.closeButton')
closeButton.addEventListener('click', event => {
  removed = document.querySelector('.slideMenu')
  removed.remove()
  customizer.style.left = "0";
  clearScene();
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

/*==================Modal*/

function showModal() {

  var modal = document.getElementById('add-board-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}

function clearModalInputs() {

  var modalInputElements = document.querySelectorAll('#add-board-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = '';
  }

}


function hideModal() {
  var modal = document.getElementById('add-board-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');
  var readyContainer = document.getElementById('readyContainer')
  var readyButton = document.getElementById('ready')

  modal.classList.add('hidden');
  readyContainer.classList.add('hidden')
  readyButton.classList.add('hidden')
  modalBackdrop.classList.add('hidden');

  clearModalInputs();

}

var modalAcceptButton = document.getElementById('modal-accept');
modalAcceptButton.addEventListener('click', event => {
  var customName = document.getElementById('board-name-input').value.trim();
  var userName = document.getElementById('user-name-input').value.trim();
  var boardDescripton = document.getElementById('board-description-input').value.trim();

  if (!customName || !userName || !boardDescripton) {
    alert("You must fill in all of the fields!");
  } else {

  var req = new XMLHttpRequest()
  var reqUrl = '/my-boards'
  console.log("== reqUrl:", reqUrl)
  req.open('POST', reqUrl)
  }

  var userBoard = {
    model: document.getElementById('boardName').textContent.replace(" ", "-"),
    custom: customName,
    creator: userName,
    description: boardDescripton,
    height: height.textContent,
    width: width.textContent,
    thickness: thickness.textContent,
    fins: fins.textContent,
    contour: contour.textContent,
    deckColor: deckColor.textContent,
    bottomColor: bottomColor.textContent,
    rocker: rockers.textContent,
    finish: finishes.textContent,
  }

  console.log("userBoard: ", userBoard)

  var reqBody = JSON.stringify(userBoard)

  req.setRequestHeader('Content-Type', 'application/json')

  req.send(reqBody)

  hideModal()
})

/*==================Modal*/
