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

    containerSize: Vector3,
    setContainerSize: (v: Vector3) => void,

    visibleBlocks: number,
    setVisibleBlocks: (n: number) => void,
}

// https://github.com/pmndrs/zustand#typescript-usage
export const useNestingStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                size: new Vector3(30, 10, 5),
                setSize: (size) => set({ size }),

                containerSize: new Vector3(20, 0.1, 10),
                setContainerSize: (containerSize) => set({ containerSize }),

                visibleBlocks: 1,
                setVisibleBlocks: (n) => set({ visibleBlocks: n }),
            }),
            { name: "nesting-store" }
        )
    )
)
