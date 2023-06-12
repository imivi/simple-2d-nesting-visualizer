// import { useRef, useState } from 'react'
import { Suspense, useMemo } from 'react'
import { Canvas, RootState } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { useNestingStore } from '../store/store'
import * as THREE from "three"
import { fill } from '../utils/fill'
import Controls from './Controls'
import { range } from '../utils/range'
import { Block } from './Block'
import { blockMaterial, containerFloorMaterial, containerMaterial } from '../threejs/materials'
// import Camera from './Camera'


const ZERO = Object.freeze(new THREE.Vector3(0,0,0))

// type Props = {
//     color?: string,
// }



export default function Scene() {
    // const [count, setCount] = useState(0)

    // const requiredBlocks = useNestingStore(store => store.requiredBlocks)

    // const containerSize = new THREE.Vector3(20, 0.1, 10)
    const cameraPosition = useNestingStore(store => store.cameraPosition)
    // const cameraPosition = new THREE.Vector3(100,10,10)

    const containerSize = useNestingStore(store => store.containerSize)
    const { x=10, y=1, z=10 } = containerSize
    const defaultcontainerSize = new THREE.Vector3(x,y,z)
    // const boxOffset = containerSize.map(dim => dim/2) as [number,number,number]
    // const boxOffset = containerSize.clone().divideScalar(2)

    const showAllBlocks = useNestingStore(store => store.showAllBlocks)
    const visibleBlocks = useNestingStore(store => store.visibleBlocks)
    // const controlsRef = useRef()

    const baseBlockSize = useNestingStore(store => store.size)
    const margin = useNestingStore(store => store.margin)
    let blockSize = baseBlockSize
    try {
        // console.log('baseBlockSize:', baseBlockSize)
        const { x, y, z } = baseBlockSize
        blockSize = new THREE.Vector3(x,y,z).add(new THREE.Vector3(margin,margin,margin))
    }
    catch (error) {
        // console.log('blockSize:', blockSize)
        const size = new THREE.Vector3(x, y, z)
        console.log('baseBlockSize:', size,
            size.add(new THREE.Vector3(margin,margin,margin))
        )
        // console.error(error)
    }
    // const blockSize = baseBlockSize.clone().add(new THREE.Vector3(margin,margin,margin))
    
    const gridSize = Math.max(containerSize.x, containerSize.z) * 2

    const transparentMaterial = new THREE.MeshNormalMaterial({ transparent: true })
    transparentMaterial.opacity = 0.1
    transparentMaterial.visible = false
    // const boxGeometry  = new THREE.BoxGeometry(size.x, size.z, size.y)

    const blockColor = useNestingStore(store => store.blockColor)
    blockMaterial.color = new THREE.Color(blockColor)



    const blocks = useMemo(() => {
        const surface = new THREE.Box2(new THREE.Vector2(0,0), new THREE.Vector2(containerSize.x+margin, containerSize.z+margin))
        const shape = new THREE.Vector2(blockSize.x, blockSize.y)
        const blocks = fill(surface, shape)

        // (optimization)
        // Create an object that stores all unique BoxGeometries.
        // Then assign each geometries to all blocks in order to
        // minimize the number of geometries used.
        const geometries: { [key:string]: THREE.BoxGeometry } = {}
        const blocksWithGeometries: { box: THREE.Box2, geometry: THREE.BoxGeometry }[] = []
        for(const block of blocks) {

            const thisBlockSize = block.max.clone().sub(block.min)
            const key = JSON.stringify(thisBlockSize)

            // Create a new BoxGeometry if necessary
            if(!(key in geometries)) {
                // If the margin is zero, reduce the block size anyway by 0.1 so that single blocks are visible

                const margins = margin>0 ? new THREE.Vector2(margin, margin) : new THREE.Vector2(0.1,0.1)
                const size2d = block.max.clone().sub(block.min).sub(margins)
                const verticalMargin = margin === 0 ? 0.1 : margin
                const size3d = [size2d.x, blockSize.z-verticalMargin, size2d.y]
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
    }, [containerSize.x, containerSize.z, blockSize.x, blockSize.y, blockSize.z, margin])

    // console.log("Blocks:", blocks)


    // Calculate how many layers can fit inside the container,
    // but always show at least 1 layer.
    const fullLayers = Math.max(Math.floor(containerSize.y / blockSize.z), 1)


    // const extraBlocks = requiredBlocks % blocks.length
    // console.log("fullLayers:", fullLayers)
    // console.log("extraBlocks:", extraBlocks)

    // console.info({ size, boxes })

    // console.log(`range(${fullLayers}) =`, range(fullLayers))

    function onLoadScene(state: RootState) {
        // Set camera position
        state.camera.position.set(cameraPosition.x,cameraPosition.y,cameraPosition.z)

        // Set background
        /*
        console.log("Loading texture")
        const texture = new THREE.TextureLoader().load("/background.jpg")
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        state.scene.background = texture
        */

        // https://threejs.org/docs/#api/en/textures/CubeTexture
        const loader = new THREE.CubeTextureLoader()
        loader.setPath("pano/")
        const textureCube = loader.load([
            "a.jpg",
            "b.jpg",
            "c.jpg",
            "d.jpg",
            "e.jpg",
            "f.jpg",
        ])
        // const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0xfff, envMap: textureCube })
        state.scene.background = textureCube
        
        // state.scene.background = new THREE.Color("#fff")
    }
    

    return <>
        <Controls boxCount={ blocks.length * fullLayers }/>

        <Canvas
            frameloop="demand"
            onCreated={ onLoadScene }
            // camera={{ position: cameraPosition, fov: 35 }}
        >

            {/* <Camera/> */}
            
            <ambientLight intensity={ 0.1 }/>
            <directionalLight position={ new THREE.Vector3(40,20,50) } intensity={ 1 } />
            {/* <spotLight position={[1, 30, 1.5]} angle={0.5} penumbra={1} intensity={0.5} castShadow shadow-mapSize={[2048, 2048]} /> */}

            {/* <PerspectiveCamera makeDefault/> */}
            <OrbitControls/>
            <gridHelper args={ [gridSize, gridSize, "#bbb", "#666"] }/>
            <Suspense fallback={ <div>Loading...</div> }>

                <group position={ ZERO }>

                    {/* Render the container */}
                    <CubeMesh
                        position={ new THREE.Vector3(0, 0.1, 0) }
                        size={ defaultcontainerSize }
                        geometry={ new THREE.BoxGeometry(containerSize.x, containerSize.y, containerSize.z) }
                        material={ containerMaterial }
                    />
                    {/* Render the container floor */}
                    <CubeMesh
                        position={ new THREE.Vector3(0, 0, 0) }
                        size={ new THREE.Vector3(containerSize.x, 0.1, containerSize.z) }
                        geometry={ new THREE.BoxGeometry(containerSize.x, 0.1, containerSize.z) }
                        material={ containerFloorMaterial }
                    />

                    <group position={ ZERO /*boxOffset.clone().divideScalar(-1)*/ }>
                        {
                            range(fullLayers).map(layer => (
                                <group key={ layer } position={ new THREE.Vector3(0, layer*blockSize.z+0.1, 0) }>
                                {
                                    blocks.map((block,i) => {
                                        // Show the block if all blocks are supposed to be visible,
                                        // or the block number is less than the maximum picked in the slider.
                                        const blockIsVisible = showAllBlocks || (layer*blocks.length + i) < visibleBlocks
                                        return (
                                            <Block
                                                key={ i }
                                                box={ block.box }
                                                height={ blockSize.z /* + containerSize.y*/ }
                                                material={ blockIsVisible ? blockMaterial : transparentMaterial }
                                                geometry={ block.geometry }
                                                margin={ margin }
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
    material: THREE.Material,
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




/*
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
*/







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