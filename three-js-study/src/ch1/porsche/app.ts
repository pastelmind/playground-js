import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { initScene } from "../../bootstrap/bootstrap";
import { floatingFloor } from "../../bootstrap/floor";
import { initializeHelperControls } from "../../controls/helpers-control";
import { intializeRendererControls } from "../../controls/renderer-control";
import { exrCubeMap } from "../../util/cubemap";

import GUI from "lil-gui";
import { visitChildren } from "../../util/modelUtil";

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff,
};

const gui = new GUI();

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.x = -3;
  camera.position.z = 3;
  camera.position.y = 0;
  orbitControls?.update();

  floatingFloor(scene);

  const loader = new GLTFLoader();
  loader.load("/assets/gltf/porsche/scene.gltf", (loadedObject) => {
    const porsche = loadedObject.scene.children[0];
    visitChildren(porsche, (el) => {
      if (el.type === "Mesh") {
        const mesh = el as THREE.Mesh;

        for (const material of [mesh.material].flat()) {
          if (material.name === "paint") {
            const paintMaterial = material as THREE.MeshStandardMaterial;
            paintMaterial.color = new THREE.Color(0xffffff);
            paintMaterial.metalness = 1;
            paintMaterial.roughness = 0.2;

            exrCubeMap(renderer, (texture) => {
              const material = [mesh.material]
                .flat()
                .find((m) => m.id === paintMaterial.id);
              if (material) {
                (material as typeof paintMaterial).envMap = texture;
                material.needsUpdate = true;
              }
            });
          }
        }

        el.castShadow = true;
        el.receiveShadow = true;
      }
    });
    porsche.translateZ(-1.9);
    porsche.translateX(0.3);
    porsche.translateY(0.6);
    porsche.rotateZ(-Math.PI / 2);
    scene.add(porsche);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    orbitControls?.update();
  }
  animate();

  intializeRendererControls(gui, renderer);
  initializeHelperControls(gui, scene);
});
