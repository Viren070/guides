import React, {useState} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { sessionKeys } from ".";

export default function Catcher(): JSX.Element {
    const redirectUrl = useBaseUrl('/stremio/addons/stremio-gdrive#oauth-tool');
    const [message, setMessage] = useState<string>("");

    React.useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        let sessionStorageCheck = true;
        try {
            sessionStorage.setItem("test", "test");
            sessionStorage.removeItem("test");
            console.log("Session storage is available");
            sessionStorageCheck = true;
        } catch (e) {
            console.error("Session storage is not available: ", e);
            sessionStorage
            sessionStorageCheck = false;
        }

        if (code) {
            if (sessionStorageCheck) {
                sessionStorage.setItem(sessionKeys.authorisationCode, code);
                window.location.href = redirectUrl;
            } else {
                // prompt the user to copy the code
                try {
                    window.prompt("Copy the authorisation code and paste it into the OAuth tool", code);
                    window.location.href = redirectUrl;
                } catch (e) {
                    console.error("Failed to prompt the user to copy the authorisation code: ", e);
                    setMessage(`Copy the authorisation code below and paste it into the OAuth Tool: ${code}`);
                }
            }
        }
        if (error) {
            console.error("Google OAuth Error: ", error);
            if (sessionStorageCheck) {
                sessionStorage.setItem(sessionKeys.oauthError, error);
                window.location.href = redirectUrl;
            } else {
                try {
                    window.alert(`The OAuth flow could not be completed due to an error: ${error}`);
                    window.location.href = redirectUrl;
                } catch (e) {
                    console.error("Failed to alert the user of the OAuth error: ", e);
                }
                setMessage(`The OAuth flow could not be completed due to an error: ${error}`);
            }
        }
    }, [redirectUrl]);

    return (
        <div>
            {message}
        </div>
    );
}

export function CallBackUrl(): JSX.Element {
   const callbackPath = useBaseUrl('/stremio/addons/stremio-gdrive/callback');
   const [redirectUrl, setRedirectUrl] = useState<string>("");
   React.useEffect(() => {
         // set the redirect url to the current page
         setRedirectUrl(window.location.origin + callbackPath);
    }, []);

    return <>
        {redirectUrl}
    </>


}