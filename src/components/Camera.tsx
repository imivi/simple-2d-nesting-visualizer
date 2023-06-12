import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import { Vector3 } from "three"
import { useNestingStore } from "../store/store"



export default function Camera() {

    const { camera } = useThree()

    const cameraPosition    = useNestingStore(store => store.cameraPosition)
    const setCameraPosition = useNestingStore(store => store.setCameraPosition)

    // console.log(camera.position)

    // function logPosition() {
    //     console.log(camera.position, cameraPosition)
    // }

    useEffect(() => {
        console.log("Loaded camera position:", camera.position)
        const { x, y, z } = cameraPosition
        camera.position.set(x,y,z)
        camera.lookAt(new Vector3(0,0,0))

        return () => {
            console.log("Unmounting...", camera.position)
            setCameraPosition(camera.position.clone())
        }
    }, [camera, cameraPosition, setCameraPosition])
    
    return null
}
