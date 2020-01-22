const http = require('http');
const fs = require('fs');
const url = require('url');

const form = {
    containerSelector: '#form-wrapper',
    id: 'contact-form',
    action: 'contact_form',
    novalidate: true,
    fields: [
        {
            label: 'First name',
            id: 'first-name',
            type: 'text',
            pattern: '^[A-Z].+',
            required: true,
            maxlength: 15
        },
        {
            label: 'Last name',
            id: 'last-name',
            type: 'text',
            pattern: '^[A-Z].+',
            required: true,
            maxlength: 15
        },
        {
            label: 'Your email',
            id: 'email',
            type: 'email',
            pattern: '',
            required: true,
            maxlength: 40
        },
        {
            label: 'Subject',
            id: 'subject',
            type: 'text',
            pattern: '',
            required: true,
            maxlength: 40
        },
        {
            label: 'Your message',
            id: 'message',
            type: 'textarea',
            pattern: '',
            required: true,
            maxlength: 250
        }
    ],
    btns: [
        {
            id: 'submit-btn',
            text: 'Submit',
            type: 'submit'
        }
    ],
    assets: [
        {
            type: 'js',
            includeType: 'link',
            path: '/assets/contact-form.js'
        }
    ]
};

function validateFormJson(formData) {
    const fieldsConfigs = form.fields;
    const errors = {};

    for (let fieldName in formData) {
        if (formData.hasOwnProperty(fieldName)) {
            const fieldValue = formData[fieldName];
            const fieldConfig = fieldsConfigs.find(f => f.id === fieldName);

            if (fieldConfig.required && fieldValue.length === 0) {
                errors[fieldName] = 'Field is invalid'
            }

            if (fieldValue.length > fieldConfig.maxlengh) {
                errors[fieldName] = 'Field is invalid'
            }

            if (!fieldConfig.pattern) {
                continue
            }
            const regex = new RegExp(fieldConfig.pattern);
            if (!regex.test(fieldValue)) {
                errors[fieldName] = 'Field is invalid'
            }

        }
    }

    if (Object.keys(errors).length) {
        return errors;
    }

    return {
        success: true
    }
}

http.createServer(function (request, response) {

    const path = url.parse(request.url).pathname;
    const method = request.method;

    if (method === 'GET' && path.endsWith('.js')) {
        const file = fs.readFileSync(__dirname + request.url);

        response.writeHead(200);
        response.write(file);
        response.end();
    }

    if (method === 'GET' && path === '/') {
        const html = fs.readFileSync('./templates/index.html');
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    }

    if (method === 'GET' && path === '/get-form') {
        response.writeHeader(200, { "Content-Type": "application/json" });

        response.write(JSON.stringify(form));
        response.end();
    }

    if (method === 'POST' && path === '/contact_form') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            const formData = JSON.parse(body);
            console.log(formData);

            response.writeHeader(200, { "Content-Type": "application/json" });
            let respData = validateFormJson(formData);
            response.end(JSON.stringify(respData));

        });

    }

}).listen(3030);

