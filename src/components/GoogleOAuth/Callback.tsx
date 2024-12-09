import React, { useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { sessionKeys } from "./";
import { translate } from "@docusaurus/Translate";

export const oauthPath = "/oauth/google";
export const oauthCallbackPath = oauthPath + "/callback";

export default function Catcher(): JSX.Element {
    const redirectUrl = useBaseUrl(oauthPath);

    React.useEffect(() => {
        if (!redirectUrl) {
            console.error("Redirect URL not found");
            return;
        }
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        let error = url.searchParams.get("error");

        let sessionStorageCheck = true;
        try {
            sessionStorage.setItem("test", "test");
            sessionStorage.removeItem("test");
            console.log("Session storage is available");
            sessionStorageCheck = true;
        } catch (e) {
            console.error("Session storage is not available: ", e);
            sessionStorageCheck = false;
        }

        if (!code && !error) {
            error = translate(
                {
                    id: "oauthTool.errors.missingResponse",
                    message:
                        "The {authorisationCode} or error parameter is missing from the response",
                    description:
                        "Error message displayed when an unknown error occurs",
                },
                {
                    authorisationCode: translate({
                        id: "oauthTool.fields.authorisationCode",
                        message: "Authorisation Code",
                        description: "Authorisation Code field",
                    }),
                }
            );
            console.error("Google OAuth Error: ", error);
            if (sessionStorageCheck) {
                console.log("Setting error in session storage");
                sessionStorage.setItem(sessionKeys.oauthError, error);
            } else {
                try {
                    window.alert(error);
                } catch (e) {
                    console.error(
                        "Failed to alert the user of the OAuth error: ",
                        e
                    );
                }
            }
            window.location.href = redirectUrl;
        }

        if (code) {
            if (sessionStorageCheck) {
                sessionStorage.setItem(sessionKeys.authorisationCode, code);
                window.location.href = redirectUrl;
            } else {
                let message = translate({
                    id: "oauthTool.prompts.copyCode",
                    message:
                        "Copy the authorisation code and paste it into the OAuth tool",
                    description:
                        "Prompt message displayed to the user to copy the authorisation code",
                });
                try {
                    window.prompt(message, code);
                    window.location.href = redirectUrl;
                } catch (e) {
                    console.error(
                        "Failed to prompt the user to copy the authorisation code: ",
                        e
                    );
                }
            }
        } else if (!code && sessionStorageCheck) {
            sessionStorage.setItem(sessionKeys.authorisationCode, "");
        }

        if (error) {
            console.error("Google OAuth Error: ", error);
            error = parseError(error);
            if (sessionStorageCheck) {
                sessionStorage.setItem(sessionKeys.oauthError, error);
                window.location.href = redirectUrl;
            } else {
                try {
                    window.alert(error);
                    window.location.href = redirectUrl;
                } catch (e) {
                    console.error(
                        "Failed to alert the user of the OAuth error: ",
                        e
                    );
                }
            }
        } else if (!error && sessionStorageCheck) {
            sessionStorage.setItem(sessionKeys.oauthError, "");
        }
    }, [redirectUrl]);

    return <></>;
}

function parseError(error: string): string {
    if (error === "access_denied") {
        return translate({
            id: "oauthTool.errors.accessDenied",
            message: "You denied the authorisation request",
            description:
                "Error message displayed when the user denies the authorisation request",
        });
    }
    return error;
}

export function getCallbackUrl(): string {
    const callbackPath = useBaseUrl(oauthCallbackPath);
    
    const [callbackUrl, setCallbackUrl] = useState<string>("");

    React.useEffect(() => {
        setCallbackUrl(window.location.origin + callbackPath);
    }, []);

    return callbackUrl;
}

export function CallBackUrl(): JSX.Element {
    const callbackPath = useBaseUrl(oauthCallbackPath);
    const [redirectUrl, setRedirectUrl] = useState<string>("");
    React.useEffect(() => {
        // set the redirect url to the current page
        setRedirectUrl(window.location.origin + callbackPath);
    }, []);

    return <>{redirectUrl}</>;
}
