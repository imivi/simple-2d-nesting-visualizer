import { create } from "zustand"
import { devtools, persist } from 'zustand/middleware'
import { Vector3 } from "three"


// type Vector3D = {
//     x: number,
//     y: number,
//     z: number,
// }



export type Orientation =
    "flat"   | "up"   | "side" |
    "flat_r" | "up_r" | "side_r"


export type Language = 'it' | 'en'


type Store = {

    language: Language,
    setLanguage: (language: Language) => void,
    
    size: Vector3,
    setSize: (v: Vector3) => void,

    containerSize: Vector3,
    setContainerSize: (v: Vector3) => void,

    visibleBlocks: number,
    setVisibleBlocks: (n: number) => void,

    showAllBlocks: boolean,
    setShowAllBlocks: (show: boolean) => void,

    orientation: Orientation,
    setOrientation: (orientation: Orientation) => void,

    cameraPosition: Vector3,
    setCameraPosition: (position: Vector3) => void,

    margin: number,
    setMargin: (n: number) => void,

    blockColor: string,
    setBlockColor: (color: string) => void,

    // requiredBlocks: number,
    // setRequiredBlocks: (n: number) => void,
}


// https://github.com/pmndrs/zustand#typescript-usage
export const useNestingStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                size: new Vector3(3, 4, 5),
                setSize: (size) => set({ size }),

                containerSize: new Vector3(35, 20, 18),
                setContainerSize: (containerSize) => set({ containerSize }),

                visibleBlocks: 1,
                setVisibleBlocks: (n) => set({ visibleBlocks: n }),

                showAllBlocks: true,
                setShowAllBlocks: (show) => set({ showAllBlocks: show }),

                orientation: "side_r",
                setOrientation: (orientation) => set({ orientation }),

                cameraPosition: new Vector3(30, 30, 40),
                setCameraPosition: (cameraPosition) => set({ cameraPosition }),

                margin: 0,
                setMargin: (margin) => set({ margin }),

                blockColor: "#1288d6",
                setBlockColor: (blockColor) => set({ blockColor }),

                language: 'en',
                setLanguage: (language) => set({ language }),

                // requiredBlocks: 1,
                // setRequiredBlocks: (n) => set({ requiredBlocks: n }),
            }),
            { name: "nesting-store" }
        )
    )
)
