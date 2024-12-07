import React, {useState} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { sessionKeys } from ".";

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