function createDOMElement(tag, classNames = [], attributes = {}, children = []) {
    // ... (helper function)
}

export default function billReady({ code }) {
    const element = createDOMElement('div', ['bill-ready-container']);

    // ... (programmatic creation of the entire bill ready screen from Screen 4 design)

    return element;
}
