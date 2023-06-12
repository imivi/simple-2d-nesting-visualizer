import { MeshBasicMaterial, MeshLambertMaterial } from "three"

// Define materials
export const containerMaterial = new MeshBasicMaterial({ transparent: true, wireframe: true })

export const containerFloorMaterial = new MeshLambertMaterial({ color: "#eee" })

export const blockMaterial = new MeshLambertMaterial({ color: "#1288d6" })
