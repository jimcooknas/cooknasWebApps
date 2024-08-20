import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/AfterimagePass.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

var panel = document.getElementById("panel");
var panelHandle = document.getElementById("panelHandle");
var panelHidden = false;
var fogValSlider = document.getElementById("fogValSlider");
var fogValLabel = document.getElementById("fogValLabel");
var icosDetailSlider = document.getElementById("icosDetailSlider");
var icosDetailLabel = document.getElementById("icosDetailLabel");
var bloomPassStrengthSlider = document.getElementById("bloomPassStrengthSlider");
var bloomPassStrengthLabel = document.getElementById("bloomPassStrengthLabel");
var xRotationSlider = document.getElementById("xRotationSlider");
var xRotationLabel = document.getElementById("xRotationLabel");
var yRotationSlider = document.getElementById("yRotationSlider");
var yRotationLabel = document.getElementById("yRotationLabel");
var dampEffectSlider = document.getElementById("dampEffectSlider");
var dampEffectLabel = document.getElementById("dampEffectLabel");
var colorHueSlider = document.getElementById("colorHueSlider");
var colorHueLabel = document.getElementById("colorHueLabel");
var checkShowWireframe = document.getElementById("checkShowWireframe");

var renderId;
var isRunning = true;
var fogVal = 0.06;//0.01-0.10 (divided by 100)
var icosDetail = 3;//0-5
var bloomPassStrength=3.0;//0.0-10.0 (divided by 10)
var rotationX = 0.0075;//0.0000-0.0200 (divided by 10000)
var rotationY = 0.005;//0.0000-0.0200 (divided by 10000)
var dampEffect = 0.975;//0.000-0.975 (divided by 1000)
var colorHue = 0.5;//0.0-1.0 (divided by 100)

var w;
var h;
var scene; 
var camera;
var renderer;
var controls;
var renderScene;
var bloomPass;
var afterImagePass;
var composer;
var wireframe;
var points;
var showWireframe;

function runAnim(){
  w = window.innerWidth;
  h = window.innerHeight;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, fogVal);
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 15;
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: rendererCanvas });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  // Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // effects
  renderScene = new RenderPass(scene, camera);
                                        // resolution, strength, radius, threshold
  bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), bloomPassStrength, 0, 0);//bloomPassStrength=3.0

  afterImagePass = new AfterimagePass();
  afterImagePass.uniforms["damp"].value =dampEffect;

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(afterImagePass);

  const ballGeo = new THREE.IcosahedronGeometry(8, icosDetail);
  //set wireframe
  const wire = new THREE.WireframeGeometry(ballGeo);
  wireframe = new THREE.LineSegments(wire);
  wireframe.material.depthTest = false;
  wireframe.material.opacity = checkShowWireframe.checked ? 0.2 : 0;
  wireframe.material.transparent = true;
  //set points
  const verts = [];
  const colors = [];
  let col;
  const ballVerts = ballGeo.vertices;
  const numVerts = ballVerts.length;
  for (let i = 0; i < numVerts; i += 1) {
    let p = ballVerts[i];
    col = new THREE.Color().setHSL(colorHue + p.x * 0.025 + 0, 1.0, 0.5);
    verts.push(p.x, p.y, p.z);
    colors.push(col.r, col.g, col.b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.09, vertexColors: true });
  points = new THREE.Points(geo, mat);
  scene.add(wireframe);
  scene.add(points);
}

function animate() {
  if(isRunning){
    renderId = requestAnimationFrame(animate);
    points.rotation.x += rotationX;
    points.rotation.y += rotationY;
    wireframe.rotation.x += rotationX;
    wireframe.rotation.y += rotationY;
    controls.update();
    composer.render(scene, camera);
  }else{
    renderId = requestAnimationFrame(animate);
    controls.update();
    composer.render(scene, camera);
  }
}

function handleWindowResize () {
  w = window.innerWidth;
  h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function showHidePanel(){
  if(panelHidden){
      panel.style.transform = "translateX(0)";
      document.getElementById("eyeSymbol").classList.remove("fa-eye");
      document.getElementById("eyeSymbol").classList.add("fa-eye-slash");
  }else{
      panel.style.transform = "translateX(-100%)";
      document.getElementById("eyeSymbol").classList.remove("fa-eye-slash");
      document.getElementById("eyeSymbol").classList.add("fa-eye");
  }
  panelHidden = !panelHidden;
}

window.addEventListener('resize', handleWindowResize, false);

document.getElementById("btnStartStop").addEventListener('click', function(ev){
  isRunning = !isRunning;
    if(isRunning){
        cancelAnimationFrame(renderId);
        document.getElementById("btnStartStop").value="Stop";
        animate();
    }else{
        document.getElementById("btnStartStop").value="Start";
        //cancelAnimationFrame(renderId);
    }
});

fogValSlider.addEventListener('input', function(ev){
  fogVal = parseInt(fogValSlider.value)/100;
  fogValLabel.textContent = fogVal.toFixed(2);
  runAnim();
});

icosDetailSlider.addEventListener('input', function(ev){
  icosDetail = parseInt(icosDetailSlider.value);
  icosDetailLabel.textContent = icosDetail.toFixed(0);
  runAnim();
});

bloomPassStrengthSlider.addEventListener('input', function(ev){
  bloomPassStrength = parseInt(bloomPassStrengthSlider.value)/10;
  bloomPassStrengthLabel.textContent = bloomPassStrength.toFixed(1);
  runAnim();
});

dampEffectSlider.addEventListener('input', function(ev){
  dampEffect = parseInt(dampEffectSlider.value)/1000;
  dampEffectLabel.textContent = dampEffect.toFixed(3);
  runAnim();
});

colorHueSlider.addEventListener('input', function(ev){
  colorHue = parseInt(colorHueSlider.value)/100;
  colorHueLabel.textContent = colorHue.toFixed(2);
  runAnim();
});

xRotationSlider.addEventListener('input', function(ev){
  rotationX = parseInt(xRotationSlider.value)/10000;
  xRotationLabel.textContent = rotationX.toFixed(4);
});

yRotationSlider.addEventListener('input', function(ev){
  rotationY = parseInt(yRotationSlider.value)/10000;
  yRotationLabel.textContent = rotationY.toFixed(4);
});

panelHandle.addEventListener('click', function(ev){
  showHidePanel();
});

checkShowWireframe.addEventListener('change', function(ev){
  showWireframe = checkShowWireframe.checked;
  if(showWireframe)
    wireframe.material.opacity=0.2;
  else
    wireframe.material.opacity=0;
});

runAnim();
animate();
