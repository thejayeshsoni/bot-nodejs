const axios = require("axios");


async function postReq() {
    let resp = await axios.post("http://localhost:3000/theatre/list",
        {
            "name": "Aditya",
            "age": "23"
        }
    )
    console.log(resp.data);
}
postReq()