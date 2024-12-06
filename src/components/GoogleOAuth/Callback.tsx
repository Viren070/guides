// this component is used to catch responses from google OAuth. Upon load, we check if the 
// Url contains the code parameter. if it does we extract the code, and open 
// the /stremio/addons/stremio-gdrive/ page with the code as a query parameter.

import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { sessionKeys } from ".";
import { showToast } from "../Toasts";

export default function Catcher(): JSX.Element {
    const redirectUrl = useBaseUrl('/stremio/addons/stremio-gdrive#oauth-tool');
    React.useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
            sessionStorage.setItem(sessionKeys.authorisationCode, code);
            window.location.href = redirectUrl;
        }   
        const error = url.searchParams.get("error");
        if (error) {
            console.error("Google OAuth Error: ", error);
            sessionStorage.setItem(sessionKeys.oauthError, error);
            window.location.href = redirectUrl;
        }
    }, []);

    return <></>;
}