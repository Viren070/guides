import React, { useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { showToast } from "../Toasts";
import './styles.css';
import useBaseUrl from "@docusaurus/useBaseUrl";

const scopes = ['https://www.googleapis.com/auth/drive'];
const oauthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenUrl = "https://oauth2.googleapis.com/token";

export const sessionKeys = {
    clientId: "Viren070Guides_OAuthTool_clientId",
    clientSecret: "Viren070Guides_OAuthTool_clientSecret",
    authorisationCode: "Viren070Guides_OAuthTool_authorisationCode",
    oauthError: "Viren070Guides_OAuthTool_oauthError"
};
// https://accounts.google.com/o/oauth2/v2/auth?client_id=113852005442-335efquhgv3q9qa6kv1rg50j27ema3l4.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fstremio%2Faddons%2Fstremio-gdrive%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&prompt=consent
// Function to obtain the refresh token
const openAuthorisationUrl = (clientId: string, redirectUrl: string) => {

    if (clientId.length === 0) {
        showToast("Client ID is required", "error");
        return;
    }

    const url = new URL(oauthUrl);
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("redirect_uri", redirectUrl);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", scopes.join(" "));
    url.searchParams.append("prompt", "consent");
    url.searchParams.append("access_type", "offline");
    // open the url in current tab
    console.log("Opening URL: ", url.toString());
    window.open(url.toString(), "_self");

};





export default function CodeGenerator(): JSX.Element {
    const [clientId, setClientId] = useState<string>("");
    const [clientSecret, setClientSecret] = useState<string>("");
    const [authorisationCode, setAuthorisationCode] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    const [redirectUrl, setRedirectUrl] = useState<string>("");
   
    const callbackPath = useBaseUrl('/stremio/addons/stremio-gdrive/callback');
    React.useEffect(() => {
        // set the redirect url to the current page
        setRedirectUrl(window.location.origin + callbackPath);
        console.log("Redirect URL: ", redirectUrl);
        // load the stored values from session storage if they exist

        const storedClientId = sessionStorage.getItem(sessionKeys.clientId);
        const storedClientSecret = sessionStorage.getItem(sessionKeys.clientSecret);
        const storedAuthorisationCode = sessionStorage.getItem(sessionKeys.authorisationCode);
        const storedOauthError = sessionStorage.getItem(sessionKeys.oauthError);
        if (storedOauthError) {
            showToast(`Google OAuth Error: ${storedOauthError}`, "error");
            sessionStorage.removeItem(sessionKeys.oauthError);
        }
        if (storedClientId) {
            setClientId(storedClientId);
        }
        if (storedClientSecret) {
            setClientSecret(storedClientSecret);
        }
        if (storedAuthorisationCode) {
            setAuthorisationCode(storedAuthorisationCode);
            sessionStorage.removeItem(sessionKeys.authorisationCode);
            showToast("Authorisation code obtained successfully. Click `Get Credentials` to complete the process", "success");
        }              
    }, []);

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClientId(value);
        sessionStorage.setItem(sessionKeys.clientId, value);
        // reset the authorisation code since its no longer valid with different client id
        setAuthorisationCode("");
        sessionStorage.removeItem(sessionKeys.authorisationCode);
    };

    const handleClientSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClientSecret(value);
        sessionStorage.setItem(sessionKeys.clientSecret, value);
        // reset the authorisation code since its no longer valid with different client secret
        setAuthorisationCode("");
        sessionStorage.removeItem(sessionKeys.authorisationCode);
    };

    const getRefreshCode = () => {
        if (!clientId || clientId.length === 0) {
            showToast("Client ID is required", "error");
            return;
        }

        if (!clientSecret || clientSecret.length === 0) {
            showToast("Client Secret is required", "error");
            return;
        }

        if (!authorisationCode || authorisationCode.length === 0) {
            showToast("Authorisation Code is required", "error");
            return;
        }
        
        const data = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: authorisationCode,
            grant_type: "authorization_code",
            redirect_uri: redirectUrl,
            scope: ''
        });

        console.log("Requesting refresh token with data: ", data.toString());
        const response = fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data.toString()
        });

        response.then(handleResponse);
    }

    const handleResponse = (res: Response) => {
        
        if (res.ok) {
            res.json().then((data) => {
                console.log(data);
                // get the refresh token by making a request to the token url
                if (!data.refresh_token) {
                    showToast("An unexpected error occurred", "error");
                    return;
                }
                showToast("Refresh token obtained successfully. Copy the code and paste it into your script.", "success");
                // reset the authorisation code as it can no longer be used 
                setAuthorisationCode("");
                sessionStorage.removeItem(sessionKeys.authorisationCode);
                setRefreshToken(data.refresh_token);
            });
        } else {
            let text = res.text();
            text.then((data) => {
                showToast(`Error getting the refresh token:${data}`, "error");
            });
            // reset any previously obtained refresh token
            setRefreshToken("");
        }
    };
    
    const getCodeBlock = () => {
        return (
            <CodeBlock language="jsx">
{
`var credentials = {
    "client_id": "${clientId}",
    "client_secret": "${clientSecret}",
    "refresh_token": "${refreshToken}"
};`
}
            </CodeBlock>
        );
    };
        

    return (
        
        <div className="google-auth-form-container">
            <div>
                
            </div>
            <div>
                <label className="google-auth-form-label" htmlFor="client-id">Client ID: </label>
                <input className="google-auth-form-input" id="client-id" type="text" placeholder="Client ID" value={clientId} onChange={handleClientIdChange} />
            </div>
            <div>
                <label className="google-auth-form-label" htmlFor="client-secret">Client Secret: </label>
                <input className="google-auth-form-input" type="text" placeholder="Client Secret" value={clientSecret} onChange={handleClientSecretChange} />
            </div>
            <div>

                <button className="default-themed-button google-auth-form-button" onClick={() => openAuthorisationUrl(clientId, redirectUrl)}>Get Authorisation Code</button>
            </div>
            <div>

                <label className="google-auth-form-label" htmlFor="authorisation-code">Authorisation Code: </label>
                <input className="google-auth-form-input" type="text" placeholder="Authorisation Code" value={authorisationCode} onChange={(e) => setAuthorisationCode(e.target.value)} />
            </div>
            <div>
                <button className="google-auth-form-button default-themed-button" onClick={getRefreshCode}>Get Credentials</button>
            </div>
            <div>
                {refreshToken.length > 0 && getCodeBlock()}
            </div>
            <div>
                <p style={{"textAlign": "center", "fontWeight": "inherit", "marginTop": "20px"}}>
                    View the <a href="https://github.com/Viren070/guides/blob/main/src/components/GoogleOAuth/index.tsx" target="_blank" rel="noreferrer">source code</a> for this tool
                </p>
            </div>
        </ div>
    );
}