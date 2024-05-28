import app from "./components/App";
// require('dotenv').config()
// const express=request('express')
// const axios = require('axios')
// const url = require('url')

// const port = process.env.PORT || 8000;
// const app = express();

// app.get('/api/discord_auth', async (req, res) => {
//     const { code } = req.query;

//     if (code) {
//         const formData = new url.URLSearchParams({
//             client_id: process.env.ClientID,
//             client_seceret: process.env.ClientSecret,
//             grant_type: 'authorization_code',
//             code: code.toString()
//             redirect_uri: 'http://localhost:8000/'
//         })

//         const output = await axios.post('https://discord.com/api/oauth2/token', formData, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//         });

//         if (output.data) {
//             const access = output.data.access_token;
//             const userinfo = await axios.get('https://discord.com/api/users/@me', {
//                 headers: {
//                     Authorization: `Bearer ${access}`,
//                 }
//         });
//             console.log(output.data, userInfo.data, refresh.data)
//         }
//     }
// });

// app.listen(port, () => {console.log(`Server is running on port ${port}`)});
