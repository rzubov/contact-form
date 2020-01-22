function processField(field) {
    switch (field.type) {
        case 'email':
        case 'text':
            return ` <div class="form-group">
                      <label for="first-name">${field.label}</label>
                      <input type="${field.type}" 
                          id="${field.id}"
                          name="${field.id}"
                          ${field.pattern ? `pattern=${field.pattern}` : ''}
                          ${field.required ? 'required' : ''}
                          ${field.maxlength ? `maxlength=${field.maxlength}` : ''}
                          class="form-control" >
                          <div class="invalid-feedback">
                            Please provide a valid value.
                          </div>
                    </div>`;
        case 'textarea':
            return `<div class="form-group">
                      <label for="${field.id}">${field.label}</label>
                      <textarea 
                      id="${field.id}"
                      name="${field.id}"
                      ${field.pattern ? `pattern=${field.pattern}` : ''}
                      ${field.required ? 'required' : ''}
                      ${field.maxlength ? `maxlength=${field.maxlength}` : ''}
                      class="form-control"
                      rows="3"></textarea>
                    </div>`;
        case 'submit':
            return ` <button id="${field.id}" type="${field.type}" class="btn btn-primary">${field.text}</button>`
        default:
            console.warn('not supported field type:', field.type);
            return '';
    }
}

function getElementsHTML(elms) {
    return elms.reduce((acc, el) => {
        return acc + processField(el)
    }, '');
}

function attachJsAsset(asset) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    switch (asset.includeType) {
        case 'link':
            script.src = asset.path;
            break;
        case 'text':
            script.text = asset.text;
    }

    document.head.appendChild(script)
}

function attachCssAsset(asset) {
    console.log('not implemented yet!')
}

function attachAssets(assets) {
    assets.forEach(asset => {
        switch (asset.type) {
            case 'js':
                attachJsAsset(asset);
                break;
            case 'css':
                attachCssAsset(asset);
                break;
            default:
                console.warn('Unsupported asset type:', asset.type);

        }
    });
}

function processFormJson(form) {
    const fields = getElementsHTML(form.fields);
    const btns = getElementsHTML(form.btns);

    attachAssets(form.assets);

    let formHTML = `
    <form id="${form.id}" action="${form.action}" ${form.novalidate ? 'novalidate' : ''}>
      ${fields}
      ${btns}
    </form>
    `.trim();
    const formWrapper = document.querySelector(form.containerSelector);
    formWrapper.innerHTML = formHTML;

}

document.addEventListener("DOMContentLoaded", () => {
    const $contactUsLink = document.querySelector('#contact-us-link');
    $contactUsLink.addEventListener('click', async function () {
        if (!$contactUsLink.getAttribute('data-loaded')) {
            $contactUsLink.setAttribute('data-loaded', 'true');
            try {
                const response = await fetch('/get-form');
                processFormJson(await response.json());
            } catch (e) {
                console.warn('Failed to render the form:', e);
            }
        }
    })
});
