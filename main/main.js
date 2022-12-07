const { application } = require("express");


async function sendData({formData, url}) {
    const plainFormData  = Object.fromEntries(formData.entries());

    const formDataJson = Json.stringify(plainFormData);
    const options =  {
        method:"POST", 
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body:formDataJson
    };
    const response = await fetch(url, options);
    return response.json()
}