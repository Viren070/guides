import React, {useState} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { sessionKeys } from ".";

export default function Catcher(): JSX.Element {
    const redirectUrl = useBaseUrl('/stremio/addons/stremio-gdrive#oauth-tool');
    const [sessionStorageAvailable, setSessionStorageAvailable] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    React.useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        
        try {
            sessionStorage.setItem("test", "test");
            sessionStorage.removeItem("test");
            setSessionStorageAvailable(true);
        } catch (e) {
            console.error("Session storage is not available: ", e);
            setSessionStorageAvailable(false);
        }

        if (code) {
            if (sessionStorageAvailable) {
                setMessage("You should be redirected to the OAuth Tool page.");
                sessionStorage.setItem(sessionKeys.authorisationCode, code);
                window.location.href = redirectUrl;
            } else {
                setMessage(`Please go to the OAuth Tool page and paste the code: ${code}`);
            }
        }

        if (error) {
            if (sessionStorageAvailable) {
                setMessage("You should be redirected to the OAuth Tool page.");
                console.error("Google OAuth Error: ", error);
                sessionStorage.setItem(sessionKeys.oauthError, error);
                window.location.href = redirectUrl;
            } else {
                setMessage(`Google OAuth Error: ${error}`);
            }
        }

    }, [redirectUrl, sessionStorageAvailable]);

    return (
        <div>
            {message}
        </div>
    )
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