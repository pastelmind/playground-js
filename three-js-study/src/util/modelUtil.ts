import * as THREE from "three";

export const visitChildren = (
  object: THREE.Object3D,
  fn: (object: THREE.Object3D) => void,
) => {
  if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      visitChildren(child, fn);
    }
  } else {
    fn(object);
  }
};

export const applyShadowsAndDepthWrite = (object: THREE.Object3D) => {
  visitChildren(object, (child) => {
    if ("material" in child && child.material) {
      for (const material of [child.material].flat()) {
        if (!(material instanceof THREE.Material)) {
          throw new Error(`Unexpected value in child.material: ${material}`);
        }
        material.depthWrite = true;
      }
    }

    child.castShadow = true;
    child.receiveShadow = true;
  });
};

export const findChild = (
  object: THREE.Object3D,
  name: string,
): THREE.Object3D | undefined => {
  if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      if (name === child.name) {
        return child;
      } else {
        const res = findChild(child, name);
        if (res) {
          return res;
        }
      }
    }
  } else {
    if (name === object.name) {
      return object;
    } else {
      return undefined;
    }
  }
};
