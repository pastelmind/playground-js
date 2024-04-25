import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initOrbitControls } from "../controller/orbit-controller";
import { onResize } from "../util/update-on-resize";
import { initLighting } from "./lighting";

export const initScene = ({
  backgroundColor,
  fogColor,
  disableShadows,
  disableLights,
  disableDefaultControls,
}: {
  backgroundColor: THREE.ColorRepresentation;
  fogColor: THREE.ColorRepresentation;
  disableShadows?: boolean;
  disableLights?: boolean;
  disableDefaultControls?: boolean;
}) => {
  const init = (
    fn: (props: {
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      renderer: THREE.WebGLRenderer;
      orbitControls: OrbitControls | undefined;
    }) => void,
  ) => {
    // basic scene setup
    const scene = new THREE.Scene();
    if (backgroundColor !== undefined) {
      scene.background = new THREE.Color(backgroundColor);
    }

    if (fogColor !== undefined) {
      scene.fog = new THREE.Fog(fogColor, 0.0025, 50);
    }

    // setup camera and basic renderer
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    if (backgroundColor !== undefined) {
      renderer.setClearColor(backgroundColor);
    }

    onResize(camera, renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // initialize orbit controls
    let orbitControls;
    if (!disableDefaultControls) {
      orbitControls = initOrbitControls(camera, renderer);
    }

    // add some basic lighting to the scene
    if (!disableLights ?? false) {
      initLighting(scene, { disableShadows });
    }

    fn({ scene, camera, renderer, orbitControls });
  };

  return init;
};
