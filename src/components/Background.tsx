import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import { TextureLoader, RepeatWrapping } from "three"
// import { useNestingStore } from "../store/store"
import backgroundImage from "../../public/background.jpg"



export default function Background() {

    const { scene } = useThree()
    // const get = useThree(store => store.get)
    // const set = useThree(store => store.set)
    // scene.background = new THREE.CubeTexture()

    
    
    useEffect(() => {
        console.log(backgroundImage)
        console.log("Loading texture")
        const texture = new TextureLoader().load("/background.jpg")
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set( 4, 4 );

        scene.background = texture
        
        // loader.load(["background.jpg"], (cubeTexture) => {
        //     scene.background = cubeTexture
        // })

        // scene.background = new Color("#eee")
        // const newScene = {
        //     ...scene,
        //     background: new Color("#eee"),
        // }
        // set({ scene: newScene })
    }, [scene])

    return null
}
