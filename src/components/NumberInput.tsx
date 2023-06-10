import { useState, HTMLAttributes } from 'react'
import { css } from "@emotion/react"


type Props = {
    defaultValue: string,
    onValidChange: (num: number) => unknown,
} & HTMLAttributes<HTMLInputElement>

export default function NumberInput(props: Props) {

    const { defaultValue, onValidChange } = props

    const [textValue, setTextValue] = useState(defaultValue)

    // Update the size when the inputs change
    function handleInput(text: string) {

        setTextValue(text)

        const newValue = Number(text)

        if(newValue) {
            onValidChange(newValue)
        }
    }

    return (
        <div css={ style }>
            <input
                // { ...props }
                type="text"
                value={ textValue }
                onChange={ (e) => handleInput(e.target.value) }/>
        </div>
    )
}


const style = css`

`