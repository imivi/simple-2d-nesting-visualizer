import { Suspense, useRef, useState } from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import { useNestingStore } from '../store/store'


type Props = {
    color?: string,
}

export default function Scene({ color }: Props) {
    // const [count, setCount] = useState(0)

    const boxSize: [number,number,number]   = [9, 0.2, 5]
    // const boxOffset = boxSize.map(dim => -dim/2) as [number,number,number]

    // const controlsRef = useRef()

    const size = useNestingStore(store => store.size)

    return (
        <Canvas>
            <ambientLight intensity={ 2 }/>
            <spotLight position={[1, 6, 1.5]} angle={0.2} penumbra={1} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
            {/* <PerspectiveCamera makeDefault/> */}
            <OrbitControls/>
            <gridHelper args={ [10, 20, "#bbb", "#666"] }/>
            <Suspense fallback={ null }>
                <group position={ [0,0,0] }>

                    <Cube position={ [0,0,0] } size={ boxSize }/>

                    {/* <Cube position={ [1,1,1] }/> */}
                    {
                        [...Array(10).keys()].map(i => (
                            <Cube
                                key={ i }
                                position={ [i*(size.x + 0.1), 1, 0] }
                                size={ [size.x, size.z, size.y] }
                            />
                        ))
                    }
                </group>
            </Suspense>
        </Canvas>
    )
}


type BoxProps = {
    position: [number, number, number],
    size?: [number, number, number],
}

function Cube({ size=[1,1,1], position=[0,0,0] }: BoxProps) {

    const [ x, y, z ] = position
    const [ width, height, depth ] = size
    
    return (
        <mesh position={ [x,y,z] }>
            <boxGeometry args={ [width, height, depth] }/>
            <meshNormalMaterial/>
        </mesh>
    )
}