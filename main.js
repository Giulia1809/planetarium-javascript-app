var scene = new THREE.Scene();
var gui = new dat.GUI();

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class AxisGridHelper {
    constructor(node) {
      this.textures = ['images/titan/titan_surf.jpg', 'images/mars/mars_surf.jpg', 'images/venus/venus_surf.jpeg', 'images/vulcan/vulcan_surf.jpg', 'images/moon/moon_surf.jpg', 'images/mercury/mercury_surf.jpg'];
      shuffle(this.textures);
      this.idx = 0;
      this.node = node;
      this.visible = false;
    }
    get visible() {
      return this._visible;
    }
    set visible(v) {
      this.idx = (this.idx + 1) % this.textures.length;
      this.node.material.map = new THREE.TextureLoader().load(this.textures[this.idx]);
      this._visible = v;
    }
}

function makeAxisGrid(node, label) {
  const helper = new AxisGridHelper(node);
  gui.add(helper, 'visible').name(label);
}
  
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var clock = new THREE.Clock();

// Controls:
var controls = new THREE.FlyControls(camera, renderer.domElement);
controls.movementSpeed = 1;
controls.rollSpeed = Math.PI / 24.0;
controls.dragToLook = true;

// Add lights:
var directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
var hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

// Add main planet:
var titan_geometry = new THREE.SphereGeometry(4, 80, 80);
var texture_titan = new THREE.TextureLoader().load('images/titan/titan_surf.jpg');
var titan_material = new THREE.MeshLambertMaterial( { map: texture_titan } );
var titan_sphere = new THREE.Mesh(titan_geometry, titan_material);

// Add main moon:
var moon_geometry = new THREE.SphereGeometry(1, 80, 80);
var texture_moon = new THREE.TextureLoader().load('images/moon/moon_surf.jpg');
var moon_material = new THREE.MeshPhongMaterial( { map: texture_moon } );
var moon_sphere = new THREE.Mesh(moon_geometry, moon_material);
moon_sphere.position.z = 5;
moon_sphere.position.x = 8;
titan_sphere.add(moon_sphere);

// Add "satellite" planet:
var planet_geometry = new THREE.SphereGeometry(2, 80, 80);
var texture_planet = new THREE.TextureLoader().load('images/venus/venus_surf.jpeg');
var planet_material = new THREE.MeshLambertMaterial( { map: texture_planet } );
var planet_sphere = new THREE.Mesh(planet_geometry, planet_material);
planet_sphere.position.x = -8;
planet_sphere.position.z = -5;
titan_sphere.add(planet_sphere);

// Add planet moon:
var planet_moon_geometry = new THREE.SphereGeometry(0.9, 80, 80);
var texture_planet_moon = new THREE.TextureLoader().load('images/moon/golden_moon.jpg');
var planet_moon_material = new THREE.MeshPhongMaterial( { map: texture_planet_moon } );
var planet_moon_sphere = new THREE.Mesh(planet_moon_geometry, planet_moon_material);
planet_moon_sphere.position.z = -8;
planet_moon_sphere.position.x = -11;
planet_sphere.add(planet_moon_sphere);

// Add asteroid belt - main planet's child:
for (var i = 0; i < 50; ++i) {
  var asteroid_geometry = new THREE.SphereGeometry(0.2, 3, 4);
  var asteroid_texture = new THREE.TextureLoader().load('images/asteroid/asteroid.jpg');
  var asteroid_material = new THREE.MeshLambertMaterial( { map: asteroid_texture } );
  var asteroid_mesh = new THREE.Mesh( asteroid_geometry, asteroid_material );
  asteroid_mesh.position.x = -5 + 10 * Math.random();
  asteroid_mesh.position.y = -1.0 + 2 * Math.random();
  asteroid_mesh.position.z = 5 + 2 * Math.random();
  titan_sphere.add(asteroid_mesh);
}

// Add asteroid belt - moon's child:
for (var i = 0; i < 50; ++i) {
  var asteroid_geometry = new THREE.SphereGeometry(0.1, 3, 4);
  var asteroid_texture = new THREE.TextureLoader().load('images/asteroid/asteroid.jpg');
  var asteroid_material = new THREE.MeshLambertMaterial( { map: asteroid_texture } );
  var asteroid_mesh = new THREE.Mesh( asteroid_geometry, asteroid_material );
  asteroid_mesh.position.x = -5 + 10 * Math.random();
  asteroid_mesh.position.y = -1.0 + 2 * Math.random();
  asteroid_mesh.position.z = 5 + 2 * Math.random();
  moon_sphere.add(asteroid_mesh);
}

// Add "eccentric" planet:
var ecc_planet_geometry = new THREE.SphereGeometry(2, 80, 80);
var texture_ecc_planet = new THREE.TextureLoader().load('images/mercury/mercury_surf.jpg');
var ecc_planet_material = new THREE.MeshPhongMaterial( { map: texture_ecc_planet } );
var ecc_planet_sphere = new THREE.Mesh(ecc_planet_geometry, ecc_planet_material);
ecc_planet_sphere.position.z = 5;
ecc_planet_sphere.position.x = -8;
titan_sphere.add(ecc_planet_sphere);

// Add asteroid belt - eccentric planet's child:
for (var i = 0; i < 50; ++i) {
  var asteroid_geometry = new THREE.SphereGeometry(0.1, 3, 4);
  var asteroid_texture = new THREE.TextureLoader().load('images/asteroid/fire_surf.jpeg');
  var asteroid_material = new THREE.MeshLambertMaterial( { map: asteroid_texture } );
  var asteroid_mesh = new THREE.Mesh( asteroid_geometry, asteroid_material );
  asteroid_mesh.position.x = -5 + 10 * Math.random();
  asteroid_mesh.position.y = -1.0 + 2 * Math.random();
  asteroid_mesh.position.z = 5 + 2 * Math.random();
  ecc_planet_sphere.add(asteroid_mesh);
}

// Add starfield:
var starfieldSphere = new THREE.SphereGeometry(100, 80, 80);
//for (var i = 0; i < starfieldSphere.vertices.length; ++i) {
 // starfieldSphere.vertices[i].normalize().multiplyScalar(2500);
//}
var texture = new THREE.TextureLoader().load('images/galaxy_starfield.png');
var starfieldMaterial = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
var starfieldMesh = new THREE.Mesh(starfieldSphere, starfieldMaterial);

scene.add(titan_sphere);
scene.add(starfieldMesh);

scene.add(directionalLight);
scene.add(hemisphereLight);

makeAxisGrid(titan_sphere, 'Main Planet', 50);
makeAxisGrid(planet_sphere, 'Moon');
makeAxisGrid(moon_sphere, 'Satellite Planet');
makeAxisGrid(ecc_planet_sphere, 'Out-of-plane Planet');

// Set light direction and position:
directionalLight.position.set(-8.0, 0.0, 4.0);
hemisphereLight.position.set(8.0, 8.0, 4.0);

var params = {
  lightIntensity: 1.0
}

var lightIntensitySlider = gui.add(params, "lightIntensity", 0.0, 1.0).name("Day Light").onChange(
  function(value) {
    hemisphereLight.intensity = value;
  }
);


//directional light has no proper prosition(sun light) but requires a target:
directionalLight.target = titan_sphere; 

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 18;

var animate = function () {
	requestAnimationFrame(animate);
	var delta = clock.getDelta();
	titan_sphere.rotation.y += delta * 0.25; //0.005;
	planet_sphere.rotation.y += delta * 0.25; //0.005;
	moon_sphere.rotation.y += delta * 0.5; //0.01;
	planet_moon_sphere.rotation.y += delta * 1.5; //0.03;
	ecc_planet_sphere.rotation.x += delta * 0.5; //0.01;
	controls.update(delta);

	renderer.render(scene, camera);
};

animate();
