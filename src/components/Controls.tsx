import { useState } from 'react'
import { css } from "@emotion/react"
import { Orientation, useNestingStore } from '../store/store'
import { Vector3 } from 'three'
import NumberInput from './NumberInput'
import { HexColorPicker } from "react-colorful"
// import { useThree } from '@react-three/fiber'




const icons: { [key in Orientation]: string } = {
    side:   "r1.png",
    flat:   "r2.png",
    up:     "r5.png",
    side_r: "r3.png",
    flat_r: "r4.png",
    up_r:   "r6.png",
}

/*
function getOrientation(x: number, y: number, z: number): [Orientation|null, number, number, number] {
    if(x >= y && y >= z) {
        return ["flat", x, y, z]
    }
    if(y >= x && x>= z) {
        return ["flat_r", y, x, z]
    }
    if(x >= y && z >= x) {
        return ["side", 
    }
    if(y >= x && x >= z) {
        return "side_r"
    }
    if(x >= y && z >= x) {
        return "up"
    }
    if(y >= x && z >= z) {
        return "up_r"
    }
    console.error("Orientation not recognized")
    return null
}
*/


function getSizeFromOrientation(x: number, y: number, z: number, orientation: Orientation): [number, number, number] {
    // Get thickness, width, and length (regardless of the input order)
    const [t,w,l] = [x,y,z].sort((a,b) => a-b)
    // console.log([l,w,t])
    
    if(orientation === "side") {
        return [l,t,w]
    }
    if(orientation === "side_r") {
        return [t,l,w]
    }
    if(orientation === "flat") {
        return [l,w,t]
    }
    if(orientation === "flat_r") {
        return [w,l,t]
    }
    if(orientation === "up") {
        return [w,t,l]
    }
    if(orientation === "up_r") {
        return [t,w,l]
    }
    console.error("Orientation not recognized: "+orientation)
    return [x,y,z]
}


function V3(v: { x:number, y: number, z:number }) {
    const { x, y, z } = v
    return new Vector3(x,y,z)
}

type Props = {
    boxCount: number,
    // blockSize: Vector3,
}

export default function Controls({ boxCount }: Props) {

    
    const size = useNestingStore(store => store.size)
    const setSize = useNestingStore(store => store.setSize)

    const margin = useNestingStore(store => store.margin)
    const setMargin = useNestingStore(store => store.setMargin)

    const [a, setA] = useState(size.x.toString())
    const [b, setB] = useState(size.z.toString())
    const [c, setC] = useState(size.y.toString())

    // const [orientation, setOrientation] = useState<Orientation>("side_r")
    const orientation      = useNestingStore(store => store.orientation)
    const setOrientation   = useNestingStore(store => store.setOrientation)

    const showAllBlocks    = useNestingStore(store => store.showAllBlocks)
    const setShowAllBlocks = useNestingStore(store => store.setShowAllBlocks)

    const containerSize    = useNestingStore(store => store.containerSize)
    const setContainerSize = useNestingStore(store => store.setContainerSize)

    const visibleBlocks    = useNestingStore(store => store.visibleBlocks)
    const setVisibleBlocks = useNestingStore(store => store.setVisibleBlocks)

    const blockColor    = useNestingStore(store => store.blockColor)
    const setBlockColor = useNestingStore(store => store.setBlockColor)

    // const requiredBlocks    = useNestingStore(store => store.requiredBlocks)
    // const setRequiredBlocks = useNestingStore(store => store.setRequiredBlocks)

    // const orientation = getOrientation(Number(a), Number(b), Number(c))


    // On mount, load the size into the inputs
    // useEffect(() => {
    //     const [x,y,z] = size
    //     setA(x.toString())
    //     setB(y.toString())
    //     setC(z.toString())
    // }, [size, setA, setB, setC])


    // Update the size when the inputs change
    function handleInput(text: string, dim: "x"|"y"|"z") {
        // const { x, y, z } = size

        switch (dim) {
            case "x": setA(text); break;
            case "y": setB(text); break;
            case "z": setC(text); break;
            default: break;
        }
        
        const newValue = Number(text)

        const newSize = {
            x: Number(a) || 1,
            y: Number(b) || 1,
            z: Number(c) || 1,
            [dim]: newValue || 1,
        }
        
        const sorted_size = getSizeFromOrientation(newSize.x, newSize.y, newSize.z, orientation)
        // console.log(sorted_size)
        setSize(new Vector3(...sorted_size))
    }

    
    function handleSetOrientation(new_orientation: Orientation) {
        // const [x,y,z] = [a,b,c].map(n => Number(n) || 1)
        // const { x,y,z } = size
        const [ x, y, z ] = getSizeFromOrientation(size.x, size.y, size.z, new_orientation)
        setSize(new Vector3(x,y,z))
        // const { orientation, x, y, z } = getOrientation
        setOrientation(new_orientation)
    }

    return (
        <div css={ style }>
            <h2>Simple 2D nesting</h2>

            {/* <label>
                <span>Required block number</span>
                <NumberInput defaultValue={ 1 } onValidChange={ (n) => setRequiredBlocks(n) }/>
            </label> */}

            <div className="inputs">
                <label>Container</label>
                <NumberInput defaultValue={ containerSize.x } onValidChange={ (n) => setContainerSize(V3({ ...containerSize, x: n })) }/>
                <span>x</span>
                <NumberInput defaultValue={ containerSize.z } onValidChange={ (n) => setContainerSize(V3({ ...containerSize, z: n })) }/>
                <span>x</span>
                <NumberInput defaultValue={ containerSize.y } onValidChange={ (n) => setContainerSize(V3({ ...containerSize, y: n })) }/>

                <label>Block</label>
                <input type="text" value={ a } onChange={ (e) => handleInput(e.target.value, "x") }/>
                <span>x</span>
                <input type="text" value={ b } onChange={ (e) => handleInput(e.target.value, "y") }/>
                <span>x</span>
                <input type="text" value={ c } onChange={ (e) => handleInput(e.target.value, "z") }/>
            </div>

            <label>
                <span>Margin</span>
                <NumberInput defaultValue={ margin } onValidChange={ (n) => setMargin(n) }/>
            </label>

            <HexColorPicker color={ blockColor } onChange={ setBlockColor }/>

            <div className="rotate-icons">
                {
                    Object.entries(icons).map(([icon_orientation,url]) => (
                        <div key={ url }>
                            <img
                                onClick={ () => handleSetOrientation(icon_orientation as Orientation) }
                                src={ "icons/"+url }
                                alt={ url }
                                data-active={ orientation === icon_orientation }
                            />
                            { orientation === icon_orientation && <span className='icon-selected'>✓</span> }
                        </div>
                    ))
                }
            </div>

            
            {/* Slider to select visible blocks */}
            <div>
                <div>Block limit: { showAllBlocks ? boxCount : Math.min(visibleBlocks,boxCount) } / { boxCount }</div>
                <input
                    type="range"
                    min={ 1 }
                    max={ boxCount }
                    value={ showAllBlocks ? boxCount : Math.min(visibleBlocks,boxCount) }
                    onChange={ (e) => { setVisibleBlocks(Number(e.target.value)); setShowAllBlocks(false) } }
                />
                <label className='show-all-blocks'>
                    <input type="checkbox" checked={ showAllBlocks } onChange={ () => setShowAllBlocks(!showAllBlocks) } />
                    <span>show all blocks</span>
                </label>
            </div>

            {/* <div>margin: { margin }</div> */}
            {/* <div>blockSize: { [blockSize.x, blockSize.y, blockSize.z].join(" x ") }</div> */}

            {/* <p>Orientation: { orientation }</p>
            <p>store.size: { [size.x, size.y, size.z].join(" x ") }</p> */}

        </div>
    )
}


const style = css`
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1;
    background-color: #333;
    padding: 1rem;
    border-radius: 10px;
    /* border: 1px solid #222; */
    box-shadow: 0 5px 10px 5px rgba(0,0,0, 0.1);
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .inputs {
        /* display: flex; */
        gap: 10px;
        place-items: center;
        display: grid;
        grid-template-columns: 1fr 1fr auto 1fr auto 1fr;
        row-gap: 1rem;
    }

    label {
        display: flex;
        gap: 5px;
        place-items: center;
    }

    label.show-all-blocks {

        input[type=checkbox] {
            display: inline-block;
            width: 1rem;
        }
    }

    input {
        display: inline-block;
        width: 100%;
        font-family: inherit;
        font-size: inherit;
        padding: .3em .5em;
        border: 1px solid #ccc;
        outline: none;
        border-radius: 5px;
        text-align: center;
        color: dodgerblue;
        font-weight: bold;
    }

    .rotate-icons {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;

        & > div {
            position: relative;
        }

        .icon-selected {
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            z-index: 10;
            background-color: white;
            color: black;
            display: flex;
            place-content: center;
            place-items: center;
            border-radius: 50%;
        }

        img {
            aspect-ratio: 1;
            width: 100%;
            height: 100%;
            background-color: #ccc;
            border-radius: 5px;
            transition: background-color 50ms;
            position: relative;
            cursor: pointer;
            border: 2px solid transparent;

            /* &[data-active=true]::after {
                content: "✓aaaa";
                position: absolute;
                bottom: 0;
                right: 0;
                width: 10rem;
                height: 10rem;
                z-index: 10;
                background-color: white;
            } */

            &[data-active=true],
            &:hover {
                background-color: #9cbae2;
                border-color: dodgerblue;
            }
            &:active {
                background-color: #ddd;
            }
        }
    }
`