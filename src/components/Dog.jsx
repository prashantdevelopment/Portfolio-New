import React from "react";
import { useThree } from "@react-three/fiber";

import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { sample } from "three/tsl";

const Dog = () => {


    const  model  = useGLTF("/models/dog.drc.glb");
    const  model1  = useGLTF("/models/supernova_remnant__lighting_2.glb");
    useThree(({ camera, scene ,gl }) => {
       camera.position.set(0, 0, 0.60);
       gl.toneMapping = THREE.ReinhardToneMapping;
       gl.outputColorSpace = THREE.SRGBColorSpace;

    });


    const [
        normalMap,
        sampleMatCap,
    ] = (useTexture([
        "/models/dog_normals.jpg",
        "/models/mat-2.png",
    ])).map((texture) => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    });


    const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: sampleMatCap,
    });

    
    model.scene.traverse((child) => {
        if (child.name.includes("DOG")){
            child.material = dogMaterial;
                }
    });

    model1.scene.traverse((child) => {
    if (child.isPoints) {
        child.material.color.set("#00c8ff"); // apna color yahan
    }
});

    
  return (
    <>

         <primitive object={model.scene} position={[0.25, -0.55, 0]} rotation={[0, Math.PI/4.6, 0]} />
         <primitive object={model1.scene} position={[0, -1, 0]} scale={[2, 2, 2]} />

         <directionalLight position={[10, 10, 5]} intensity={10} color={0xFFFFFF} />

        <OrbitControls />
    </>
  );
};

export default Dog;
