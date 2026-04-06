import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Dog = () => {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(ScrollTrigger);

  const model = useGLTF("/models/dog.drc.glb");
  // const  model1  = useGLTF("/models/supernova_remnant__lighting_2.glb");
  useThree(({ camera, scene, gl }) => {
    camera.position.set(0, 0, 0.6);
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  const [normalMap, sampleMatCap] = useTexture([
    "/models/dog_normals.jpg",
    "/models/mat-2.png",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [branchMap, branchNormalsMap] = useTexture([
    "/branches_diffuse.jpeg",
    "/branches_normals.jpeg",
  ]).map((texture) => {
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });

  const branchMaterial = new THREE.MeshStandardMaterial({
    map: branchMap,
    normalMap: branchNormalsMap,
  });

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial;
    } else {
      child.material = branchMaterial;
    }
  });

  const dogModel = useRef(model);

  //     model1.scene.traverse((child) => {
  //     if (child.isPoints) {
  //         child.material.color.set("#0f54e841"); // apna color yahan
  //     }
  // });


  useGSAP(() => {
    const tl = gsap.timeline({
        scrollTrigger: { 
            trigger: "#section-1",
            endTrigger: "#section-3",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            markers: true,
        }
    });
    tl
    .to(dogModel.current.scene.position,{
        z:"-=0.75",
        y:"+=0.25",
    })
    .to(dogModel.current.scene.rotation,{
       x:`+=${Math.PI / 15}`,
    })  
    .to(dogModel.current.scene.rotation,{
        y:`-=${Math.PI}`,
        x:`-=${Math.PI / 15}`
    },"third")
    .to(dogModel.current.scene.position,{
            x:"-=0.5",
            z:"+=0.6",
            y:"-=0.1",
    }, "third")


    });                          
  return (
    <>
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 4.6, 0]}
      />
      {/* <primitive object={model1.scene} position={[0, -1, 0]} scale={[2, 2, 2]} /> */}

      <directionalLight
        position={[10, 10, 5]}
        intensity={10}
        color={0xffffff}
      />

      {/* <OrbitControls /> */}
    </>
  );
};

export default Dog;
