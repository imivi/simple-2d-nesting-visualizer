// import { useRef, useState } from 'react'
import { Suspense } from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { useNestingStore } from '../store/store'
import * as THREE from "three"


const ZERO = new THREE.Vector3(0,0,0)

// type Props = {
//     color?: string,
// }

export default function Scene() {
    // const [count, setCount] = useState(0)

    const boxSize = new THREE.Vector3(20, 0.1, 10)
    // const boxOffset = boxSize.map(dim => dim/2) as [number,number,number]
    const boxOffset = boxSize.clone().divideScalar(2)

    // const controlsRef = useRef()

    const size = useNestingStore(store => store.size)
    const gridSize = Math.max(boxSize.x, boxSize.z) * 2

    const cubeMaterial = new THREE.MeshNormalMaterial()
    const boxGeometry  = new THREE.BoxGeometry(size.x, size.z, size.y)

    return (
        <Canvas frameloop="demand">
            <ambientLight intensity={ 2 }/>
            <spotLight position={[1, 6, 1.5]} angle={0.2} penumbra={1} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
            {/* <PerspectiveCamera makeDefault/> */}
            <OrbitControls/>
            <gridHelper args={ [gridSize, gridSize, "#bbb", "#666"] }/>
            <Suspense fallback={ <div>Loading...</div> }>

                <group position={ ZERO }>

                    {/* Render the container */}
                    {/* <Cube position={ ZERO } size={ boxSize }/> */}
                    <CubeMesh
                        position={ new THREE.Vector3(0, 0, 0) }
                        size={ boxSize }
                        geometry={ new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z) }
                        material={ cubeMaterial }
                    />

                    {/* Render the items inside the container */}
                    <group position={ ZERO /*boxOffset.clone().divideScalar(-1)*/ }>
                    {
                        [...Array(3).keys()].map(i => (
                            // <mesh
                            //     key={ i }
                            //     position={ [i*(size.x + 0.1), 1, 0] }
                            //     material={ cubeMaterial }
                            //     geometry={ boxGeometry }
                            // />
                            <CubeMesh
                                key={ i }
                                size={ new THREE.Vector3(size.x, size.z, size.y) }
                                position={ new THREE.Vector3(i*(size.x + 0.1), boxSize.y, 0) }
                                material={ cubeMaterial }
                                geometry={ boxGeometry }
                            />
                        ))
                    }
                    </group>

                </group>

            </Suspense>
        </Canvas>
    )
}



type CubeMeshProps = {
    position: THREE.Vector3,
    size: THREE.Vector3,
    material: THREE.MeshNormalMaterial,
    geometry: THREE.BoxGeometry,
}

function CubeMesh({ size, position, material, geometry }: CubeMeshProps) {

    // const { x, y, z } = position
    // const { x:width, y:height, z:depth } = size

    const offset = size.clone().divideScalar(2)
    // const offset = new THREE.Vector3(size.x/2, size.y/2, size.z/2)

    // console.log({ position, size, offset })
    
    return <mesh position={ position.clone().add(offset) } material={ material } geometry={ geometry } scale={ 1 }/>
}













type CubeProps = {
    position: THREE.Vector3,
    size?: THREE.Vector3,
}

function Cube({ size=new THREE.Vector3(1,1,1), position=ZERO }: CubeProps) {

    // const { x, y, z } = position
    const { x:width, y:height, z:depth } = size
    
    return (
        <mesh position={ position }>
            <boxGeometry args={ [width, height, depth] }/>
            <meshNormalMaterial/>
        </mesh>
    )
}