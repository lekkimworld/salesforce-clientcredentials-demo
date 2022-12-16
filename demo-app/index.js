const fetch = require("node-fetch");
const {config} = require("dotenv");
config();

const {
    SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET,
    SALESFORCE_LOGIN_URL
} = process.env;

const run = async () => {
    // use client_credentials flow to get access token
    const loginResp = await fetch(`${SALESFORCE_LOGIN_URL}/services/oauth2/token`, {
        method: "post",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `grant_type=client_credentials&client_id=${SALESFORCE_CLIENT_ID}&client_secret=${SALESFORCE_CLIENT_SECRET}`
    });
    const loginBody = await loginResp.json();
    const access_token = loginBody.access_token;
    console.log(`Authenticated...\naccess_token <${access_token}>\ninstance_url <${loginBody.instance_url}>\n`);

    // get the userinfo
    const userinfo = (await (await fetch(`${SALESFORCE_LOGIN_URL}/services/oauth2/userinfo`, {
        headers: {authorization: `Bearer ${access_token}`}
    })).json());
    console.log(`Retrieved userinfo...\norgId <${userinfo.organization_id}>\nusername <${userinfo.preferred_username}>`);
    
}

run();
