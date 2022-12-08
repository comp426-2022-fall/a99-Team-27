
const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", logingin);

async function logingin(event){
    event.preventDefault();
    // console.log(event)
    var endpoint = "api/login/";
    var url = "http://localhost:8000/" + endpoint;
    // console.log(url)
    const formEvent = event.target;
    // console.log(formEvent);
    const formData = new FormData(formEvent);
    const loginResult = await sendData({formData, url})
    // console.log(loginResult)
    if(loginResult.status =="LOGIN"){
        document.getElementById("loginvalue").innerHTML = loginResult.user
        document.getElementById("yogavalue").innerHTML = loginResult.yoga
        document.getElementById("runvalue").innerHTML = loginResult.run
        document.getElementById("meditatevalue").innerHTML = loginResult.meditate
        document.getElementById("breathingvalue").innerHTML = loginResult.breathing
        document.getElementById("gymvalue").innerHTML = loginResult.gym
        document.getElementById("therapyvalue").innerHTML = loginResult.therapy
        document.getElementById("readvalue").innerHTML = loginResult.read
        // document.getElementById("totalvalue").innerHTML = loginResult.yoga + loginResult.run + loginResult.meditate 
        // + loginResult.breathing + loginResult.gym + loginResult.therapy + loginResult.read
    }else {
        document.getElementById("loginvalue").innerHTML=loginResult.status
    }
}


const registerForm = document.getElementById("register");
registerForm.addEventListener("submit", registering);

async function registering(event){
    // console.log(event)
    event.preventDefault();

    var endpoint = "api/user/";
    var url = "http://localhost:8000/" + endpoint;
    // console.log(url)
    const formEvent = event.target;
    // console.log(formEvent);
    const formData = new FormData(formEvent);
    const registerResult = await sendData({formData, url})
    document.getElementById("registervalue").innerHTML="You successfully registered!"
}


async function sendData({formData, url}) {
    console.log("in send data")
    const plainFormData  = Object.fromEntries(formData.entries());
    // console.log(plainFormData)
    const formDataJson = JSON.stringify(plainFormData);
    const options =  {
        method:"POST", 
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body:formDataJson
    };
    // console.log(url, options)
    const response = await fetch(url, options);
    return response.json()
}



// const goalsList = document.getElementById("goals");
// goalsList.addEventListener("submit", goalsTracker);

// async function goalsTracker(event){
//     // console.log(event)
//     var endpoint = "api/goals/";
//     var url = "http://localhost:8000/" + endpoint;
//     // console.log(url)
//     const formEvent = event.target;
//     // console.log(formEvent);
//     const formData = new FormData(formEvent);
//     const registerResult = await sendData({formData, url})
//     //document.getElementById("").innerHTML="Here are your goals:"
// }