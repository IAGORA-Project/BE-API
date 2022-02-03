const { Axios } = require("axios");
const fetch = require('node-fetch')

// async function upload_ktp() {
//     return new Promise(async(resolve, reject) => {
//         const sess = await get_auth();
//         const fd = new FormData()
//         fd.append('file', fs.createReadStream('./GETS/GET_API/img.png'))
//         Axios({
//              method: 'POST',
//              withCredentials: true,
//              url: 'http://localhost:5050/api/v1/upload/wingman/ktp',
//              data: fd,
//              headers: {  
//                'content-type': `multipart/form-data; boundary=${fd._boundary}`,
//                'client-type': 'wingman',
//                cookie: 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTAzMWRhZDVlZTM1NTcxYzlhYWE0NCIsImlhdCI6MTY0MjA4Mjc3OCwiZXhwIjoxNjQyMDg2Mzc4fQ.-YvA2oQFjehx6h3XrdmUfxH5Eu5jYY0VRDIEUy9eWK0', 
//                'sessid': sess,
//              },
//         }).then(({ data }) => {
//             resolve(data)
//         }).catch(reject)
//     })
// }

function tokens() {
    return new Promise(async(resolve, reject) => {
        try {
            fetch(`http://iagora.id/api/v1/auth/get-token`, {
                headers: {
                    auth: `ini rahasia`
                }
            }).then(res => {
                resolve(res.headers.get('sessid'))
            })
        } catch (error) {
            reject(error)
        }
    })
}

tokens()
.then(console.log)
.catch(console.log)