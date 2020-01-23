document.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    if (event.target.id === 'contact-form') {
        event.preventDefault();
        await handleContactFormSubmit(event)
    }
}

async function handleContactFormSubmit(event) {
    const form = event.target;
    const data = {};
    const inputs = [].slice.call(
        [
            ...form.getElementsByTagName('input'),
            ...form.getElementsByTagName('textarea')]
    );
    inputs.forEach(input => {
        data[input.name] = input.value;
    });

    if (validateForm(form, inputs)) {
        let response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data),
        });

        response = await response.json();

        if (response.success === true) {
            const success = `<div class="alert alert-success mt-5" >
                                Form Submitted Successfully
                             </div>`;
            const formParent = form.parentNode;
            formParent.innerHTML = success;
            const $contactUsLink = document.querySelector('#contact-us-link');
            $contactUsLink.removeAttribute('data-loaded');
            document.removeEventListener('submit', handleSubmit);
        } else {
            backendValidation(response)
        }
    }
}

function backendValidation(data) {
    for (let field in data) {
        if (data.hasOwnProperty(field)) {
            const $field = document.getElementById(field);
            $field.classList.add('is-invalid');
            $field.setCustomValidity(data[field]);
        }

    }
}

function validateForm(form, inputs) {
    form.classList.add('was-validated');
    return inputs.every(input => input.checkValidity());
}
