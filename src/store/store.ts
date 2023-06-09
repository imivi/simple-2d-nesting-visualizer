import { create } from "zustand"
import { devtools, persist } from 'zustand/middleware'


type Vector3D = {
    x: number,
    y: number,
    z: number,
}


type Store = {
    size: Vector3D,
    setSize: (v: Vector3D) => void,
}

// https://github.com/pmndrs/zustand#typescript-usage
export const useNestingStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                size: { x: 30, y: 10, z: 5 },
                setSize: (size) => set({ size })
            }),
            { name: "nesting-store" }
        )
    )
)
