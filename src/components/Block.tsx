import { Vector2, Vector3 } from "three"


type BlockProps = {
    box: THREE.Box2,
    height: number,
    material: THREE.MeshNormalMaterial,
    geometry: THREE.BoxGeometry,
    margin: number,
}


export function Block({ box, height, material, geometry, margin }: BlockProps) {

    // const { x, y, z } = position
    // const { x:width, y:height, z:depth } = size

    // const offset = size.clone().divideScalar(2)
    // const offset = new THREE.Vector3(size.x/2, size.y/2, size.z/2)

    // const margin = 0.1

    /*
    const margins = new Vector2(margin, margin)
    const size2d = box.max.clone().sub(box.min).sub(margins)
    
    // const offset = size2d.clone().divideScalar(2)
    // const position = new Vector3(box.min.x+offset.x, height/2, box.min.y+offset.y)
    const position = new Vector3(box.min.x+size2d.x, height, box.min.y+size2d.y).divideScalar(2)
    */
    
    // const size3d = new Vector3(size2d.x, height-margin, size2d.y)
    // const offset3d = size3d.clone().divideScalar(2)
    // const position = box.min.clone().add(offset3d)

    const margins = new Vector3(margin, margin, margin)

    // Calculate length and width of the block
    const size2d = box.max.clone().sub(box.min)

    // Add the block height, then reduce the block size by the margin
    // const minMargins = new Vector3(0.1, 0.1, 0.1)
    const size3d = new Vector3(size2d.x, height, size2d.y).sub(margins)

    // Calculate the position offset and the final position
    const offset = size3d.clone().divideScalar(2)
    const position = new Vector3(box.min.x, 0, box.min.y).add(offset)

    
    // console.log("Rendering box:", { height, box, position, size3d, offset })
    
    return <mesh position={ position } material={ material } geometry={ geometry }/>
}
