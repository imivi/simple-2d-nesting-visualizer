import { create } from "zustand"
import { devtools, persist } from 'zustand/middleware'
import { Vector3 } from "three"


// type Vector3D = {
//     x: number,
//     y: number,
//     z: number,
// }


type Store = {
    size: Vector3,
    setSize: (v: Vector3) => void,
}

// https://github.com/pmndrs/zustand#typescript-usage
export const useNestingStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                size: new Vector3(30, 10, 5),
                setSize: (size) => set({ size })
            }),
            { name: "nesting-store" }
        )
    )
)
