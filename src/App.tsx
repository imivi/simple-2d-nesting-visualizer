import { css } from "@emotion/react"
import Scene from "./components/Scene"
import Controls from "./components/Controls"

export default function App() {
    // const [count, setCount] = useState(0)

    return (
        <>
            <main css={ style }>
                {/* <h1>Nester</h1> */}
                <Controls/>
                <Scene/>
            </main>
        </>
    )
}

const style = css`
    outline: 1px solid dodgerblue;
    width: 100%;
    height: 100%;
    background-color: #444;
    color: #eee;
    position: relative;

    h1 {
        position: fixed;
        top: 0;
        left: 0;
    }
`