// import { useRef, useState } from 'react'
import { Suspense, useMemo } from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { useNestingStore } from '../store/store'
import * as THREE from "three"
import { fill } from '../utils/fill'
import Controls from './Controls'
import { range } from '../utils/range'


const ZERO = new THREE.Vector3(0,0,0)

// type Props = {
//     color?: string,
// }

export default function Scene() {
    // const [count, setCount] = useState(0)

    const requiredBlocks = useNestingStore(store => store.requiredBlocks)

    // const boxSize = new THREE.Vector3(20, 0.1, 10)
    const boxSize = useNestingStore(store => store.containerSize)
    const { x=10, y=1, z=10 } = boxSize
    const defaultBoxSize = new THREE.Vector3(x,y,z)
    // const boxOffset = boxSize.map(dim => dim/2) as [number,number,number]
    // const boxOffset = boxSize.clone().divideScalar(2)

    const showAllBlocks = useNestingStore(store => store.showAllBlocks)
    const visibleBlocks = useNestingStore(store => store.visibleBlocks)
    // const controlsRef = useRef()

    const size = useNestingStore(store => store.size)
    const gridSize = Math.max(boxSize.x, boxSize.z) * 2

    const containerMaterial = new THREE.MeshStandardMaterial({ transparent: true, wireframe: true })

    const cubeMaterial = new THREE.MeshNormalMaterial()

    const transparentMaterial = new THREE.MeshNormalMaterial({ transparent: true })
    transparentMaterial.opacity = 0.1
    transparentMaterial.visible = false
    // const boxGeometry  = new THREE.BoxGeometry(size.x, size.z, size.y)

    const blocks = useMemo(() => {
        const surface = new THREE.Box2(new THREE.Vector2(0,0), new THREE.Vector2(boxSize.x, boxSize.z))
        const shape = new THREE.Vector2(size.x, size.y)
        const blocks = fill(surface, shape)

        // (optimization)
        // Create an object that stores all unique BoxGeometries.
        // Then assign each geometries to all blocks in order to
        // minimize the number of geometries used.
        const geometries: { [key:string]: THREE.BoxGeometry } = {}
        const blocksWithGeometries: { box: THREE.Box2, geometry: THREE.BoxGeometry }[] = []
        for(const block of blocks) {

            const blockSize = block.max.clone().sub(block.min)
            const key = JSON.stringify(blockSize)

            // Create a new BoxGeometry if necessary
            if(!(key in geometries)) {
                const margin = 0.1
                const margins = new THREE.Vector2(margin, margin)
                const size2d = block.max.clone().sub(block.min).sub(margins)
                const size3d = [size2d.x, size.z-margin, size2d.y]
                const geometry = new THREE.BoxGeometry(...size3d)
                geometries[key] = geometry
            }
            blocksWithGeometries.push({
                box: block,
                geometry: geometries[key],
            })
        }
        // console.info('Geometries:', Object.keys(geometries).length, Object.keys(geometries))

        return blocksWithGeometries
    }, [boxSize.x, boxSize.z, size.x, size.y, size.z])

    // console.log("Blocks:", blocks)


    // Calculate how many layers can fit inside the container,
    // but always show at least 1 layer.
    const fullLayers = Math.max(Math.floor(boxSize.y / size.z), 1)


    // const extraBlocks = requiredBlocks % blocks.length
    // console.log("fullLayers:", fullLayers)
    // console.log("extraBlocks:", extraBlocks)

    // console.info({ size, boxes })

    // console.log(`range(${fullLayers}) =`, range(fullLayers))
    

    return <>
        <Controls boxCount={ blocks.length * fullLayers }/>

        <Canvas frameloop="demand">
            <ambientLight intensity={ 2 }/>
            <spotLight position={[1, 6, 1.5]} angle={0.2} penumbra={1} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
            {/* <PerspectiveCamera makeDefault/> */}
            <OrbitControls/>
            <gridHelper args={ [gridSize, gridSize, "#bbb", "#666"] }/>
            <Suspense fallback={ <div>Loading...</div> }>

                <group position={ ZERO }>

                    {/* Render the container */}
                    <CubeMesh
                        position={ new THREE.Vector3(0, 0.1, 0) }
                        size={ defaultBoxSize }
                        geometry={ new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z) }
                        material={ containerMaterial }
                    />
                    {/* Render the container floor */}
                    <CubeMesh
                        position={ new THREE.Vector3(0, 0, 0) }
                        size={ new THREE.Vector3(boxSize.x, 0.1, boxSize.z) }
                        geometry={ new THREE.BoxGeometry(boxSize.x, 0.1, boxSize.z) }
                        material={ cubeMaterial }
                    />

                    <group position={ ZERO /*boxOffset.clone().divideScalar(-1)*/ }>
                        {
                            range(fullLayers).map(layer => (
                                <group key={ layer } position={ new THREE.Vector3(0, layer*size.z+0.1, 0) }>
                                {
                                    blocks.map((block,i) => {
                                        // Show the block if all blocks are supposed to be visible,
                                        // or the block number is less than the maximum picked in the slider.
                                        const blockIsVisible = showAllBlocks || (layer*blocks.length + i) < visibleBlocks
                                        return (
                                            <Block
                                                key={ i }
                                                box={ block.box }
                                                height={ size.z /* + boxSize.y*/ }
                                                material={ blockIsVisible ? cubeMaterial : transparentMaterial }
                                                geometry={ block.geometry }
                                            />
                                        )
                                    })
                                }
                                </group>
                            ))
                        }
                    </group>

                </group>

            </Suspense>
        </Canvas>
    </>
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
    // const offset = size

    // const offset = new THREE.Vector3(size.x/2, size.y/2, size.z/2)

    // console.log({ position, size, offset })
    
    return <mesh position={ position.clone().add(offset) } material={ material } geometry={ geometry } scale={ 1 }/>
}



type BlockProps = {
    box: THREE.Box2,
    height: number,
    material: THREE.MeshNormalMaterial,
    geometry: THREE.BoxGeometry,
}

function Block({ box, height, material, geometry }: BlockProps) {

    // const { x, y, z } = position
    // const { x:width, y:height, z:depth } = size

    // const offset = size.clone().divideScalar(2)
    // const offset = new THREE.Vector3(size.x/2, size.y/2, size.z/2)

    const margin = 0.1

    const margins = new THREE.Vector2(margin, margin)
    const size2d = box.max.clone().sub(box.min).sub(margins)
    
    const offset = size2d.clone().divideScalar(2)
    const position = new THREE.Vector3(box.min.x+offset.x, height/2, box.min.y+offset.y)

    
    // console.log("Rendering box:", { height, box, position, size3d, offset })
    
    return <mesh position={ position } material={ material } geometry={ geometry }/>
}



type BoxProps = {
    box: THREE.Box2,
    height: number,
    // from: THREE.Vector3,
    // to: THREE.Vector3,
    material: THREE.MeshNormalMaterial,
    // geometry: THREE.BoxGeometry,
}

function Box({ box, height, material }: BoxProps) {

    // const { x, y, z } = position
    // const { x:width, y:height, z:depth } = size

    // const offset = size.clone().divideScalar(2)
    // const offset = new THREE.Vector3(size.x/2, size.y/2, size.z/2)

    const margin = 0.1

    const margins = new THREE.Vector2(margin, margin)
    const size2d = box.max.clone().sub(box.min).sub(margins)
    const size3d = [size2d.x, height-margin, size2d.y]
    const geometry = new THREE.BoxGeometry(...size3d)
    
    const offset = size2d.clone().divideScalar(2)
    const position = new THREE.Vector3(box.min.x+offset.x, height/2, box.min.y+offset.y)

    
    // console.log("Rendering box:", { height, box, position, size3d, offset })
    
    return <mesh position={ position } material={ material } geometry={ geometry }/>
}








/*
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
*/