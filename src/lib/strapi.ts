import axios from "axios";

const apiToken = 'ef227e766d5325e6b707beaa08705e31c1045eef9a4c11812352a3acd6b61a96aa2e80c66d0b8cc03b487c1b64acc387f4bed8f6fefecce6b2f4f03966d3a01535fd2dcf80555c5dc5c6649deadb1f162db0fd33e00da3b0526b9ae5e673eecc23e5bd9389415dc97ba852e03965ab66116fd6204c3a8ab259fb5f4bf72a4f5b'
export const HTTP = axios.create()
HTTP.interceptors.request.use(conf => {
    conf.headers["authorization"] = `Bearer ${apiToken}`;
    return conf;
})