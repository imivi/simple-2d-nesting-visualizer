import { useNestingStore } from "../store/store";


const translations = {
    title: [
        "Simple 2D nesting",
        "Simulatore 2D",
    ],
    container: [
        "Container",
        "Contenitore",
    ],
    block: [
        "Block",
        "Oggetto",
    ],
    margin: [
        "Margin",
        "Margini",
    ],
    block_limit: [
        "Block limit",
        "Numero massimo di oggetti",
    ],
    show_all_blocks: [
        "Show all blocks",
        "Mostra tutti gli oggetti",
    ],
    blocks: [
        "blocks",
        "oggetti",
    ],
    layers: [
        "layers",
        "livelli",
    ],
}


export function useTranslate() {

    const language = useNestingStore(store => store.language)
    const languages = ["en","it"]

    function translate(key: keyof typeof translations) {
        return translations[key][languages.indexOf(language)]
    }

    return {
        language,
        translate,
    }
}