import React, { useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { showToast } from "@site/src/components/Toasts";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { oauthCallbackPath } from "./Callback";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";

const scopes = ["https://www.googleapis.com/auth/drive"];
const oauthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenUrl = "https://oauth2.googleapis.com/token";

export const sessionKeys = {
    clientId: "Viren070Guides_OAuthTool_clientId",
    clientSecret: "Viren070Guides_OAuthTool_clientSecret",
    authorisationCode: "Viren070Guides_OAuthTool_authorisationCode",
    oauthError: "Viren070Guides_OAuthTool_oauthError",
};

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

function fetchAddonCode(
    url: string,
    setCode: (code: string) => void,
    stringToStartFrom: string
) {
    fetch(url).then((res) => {
        if (res.ok) {
            res.text().then((data) => {
                let startIndex = data.indexOf(stringToStartFrom);
                let code = data.substring(startIndex);
                setCode(code);
            });
        } else {
            res.text().then((data) => {
                console.error(data);
            });
        }
    });
}

function parseError(data: string) {
    let error = JSON.parse(data);
    if (!error.error && !error.error_description) {
        return error;
    }

    switch (error.error) {
        case "invalid_client":
            switch (error.error_description) {
                case "Unauthorized":
                    return translate(
                        {
                            message: "The {field} is invalid",
                            id: "oauthTool.errors.invalidField",
                            description:
                                "Error message displayed when a field is invalid",
                        },
                        {
                            field: translate({
                                message: "Client Secret",
                                id: "oauthTool.fields.clientSecret",
                                description: "Client Secret field",
                            }),
                        }
                    );
                case "The OAuth client was not found.":
                    return translate(
                        {
                            message: "The {field} is invalid",
                            id: "oauthTool.errors.invalidField",
                            description:
                                "Error message displayed when a field is invalid",
                        },
                        {
                            field: translate({
                                message: "Client ID",
                                id: "oauthTool.fields.clientId",
                                description: "Client ID field",
                            }),
                        }
                    );
                default:
                    return error.error + ": " + error.error_description;
            }
        case "invalid_grant":
            return translate(
                {
                    message: "The {field} is invalid",
                    id: "oauthTool.errors.invalidField",
                    description:
                        "Error message displayed when a field is invalid",
                },
                {
                    field: translate({
                        message: "Authorisation Code",
                        id: "oauthTool.fields.authorisationCode",
                        description: "Authorisation Code field",
                    }),
                }
            );

        default:
            return error.error + ": " + error.error_description;
    }
}

export default function CodeGenerator(): JSX.Element {
    const [clientId, setClientId] = useState<string>("");
    const [clientSecret, setClientSecret] = useState<string>("");
    const [authorisationCode, setAuthorisationCode] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [redirectUrl, setRedirectUrl] = useState<string>("");
    const [ShuvamJaswalCFCode, setShuvamJaswalCFCode] = useState<string>("");
    const [Viren070CFCode, setViren070CFCode] = useState<string>("");
    const [sessionStorageAvailable, setSessionStorageAvailable] =
        useState<boolean>(true);

    const callbackPath = useBaseUrl(oauthCallbackPath);
    React.useEffect(() => {
        // set the redirect url to the current page
        setRedirectUrl(window.location.origin + callbackPath);

        try {
            sessionStorage.setItem("test", "test");
            sessionStorage.removeItem("test");
            setSessionStorageAvailable(true);
        } catch (e) {
            console.error("Session storage is not available: ", e);
            setSessionStorageAvailable(false);
            return;
        }

        if (!sessionStorageAvailable) {
            return;
        }

        const storedClientId = sessionStorage.getItem(sessionKeys.clientId);
        const storedClientSecret = sessionStorage.getItem(
            sessionKeys.clientSecret
        );
        const storedAuthorisationCode = sessionStorage.getItem(
            sessionKeys.authorisationCode
        );
        const storedOAuthError = sessionStorage.getItem(sessionKeys.oauthError);
        if (storedOAuthError) {
            showToast(storedOAuthError, "error");
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
            showToast(
                translate({
                    message:
                        "Authorisation code obtained successfully. Click 'Get Addon Code' to complete the process",
                    id: "oauthTool.toasts.authorisationCodeObtained",
                    description:
                        "Toast message displayed when the authorisation code is obtained successfully from the callback URL",
                }),
                "success"
            );
        }
    }, [sessionStorageAvailable, redirectUrl, callbackPath]);

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClientId(value);
        // reset the authorisation code, refresh token and access token since they are no longer valid if the client ID changes
        setAuthorisationCode("");
        setRefreshToken("");
        setAccessToken("");
        try {
            sessionStorage.setItem(sessionKeys.clientId, value);
            sessionStorage.removeItem(sessionKeys.authorisationCode);
        } catch (e) {
            console.error("Error accessing session storage: ", e);
        }
    };

    const handleClientSecretChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setClientSecret(value);
        // reset the authorisation code, refresh token and access token since they are no longer valid if the client secret changes
        setAuthorisationCode("");
        setRefreshToken("");
        setAccessToken("");
        try {
            sessionStorage.setItem(sessionKeys.clientSecret, value);
            sessionStorage.removeItem(sessionKeys.authorisationCode);
        } catch (e) {
            console.error("Error accessing session storage: ", e);
        }
    };

    const getAddonCode = () => {
        if (!clientId || clientId.length === 0) {
            showToast(
                translate(
                    {
                        message: "{field} is required",
                        id: "oauthTool.toasts.missingField",
                        description:
                            "Toast message displayed when a required field is empty",
                    },
                    {
                        field: translate({
                            message: "Client ID",
                            id: "oauthTool.fields.clientId",
                            description: "Client ID field",
                        }),
                    }
                ),
                "error"
            );
            return;
        }

        if (!clientSecret || clientSecret.length === 0) {
            showToast(
                translate(
                    {
                        message: "{field} is required",
                        id: "oauthTool.toasts.missingField",
                        description:
                            "Toast message displayed when a required field is empty",
                    },
                    {
                        field: translate({
                            message: "Client Secret",
                            id: "oauthTool.fields.clientSecret",
                            description: "Client Secret field",
                        }),
                    }
                ),
                "error"
            );
            return;
        }

        if (!authorisationCode || authorisationCode.length === 0) {
            showToast(
                translate(
                    {
                        message: "{field} is required",
                        id: "oauthTool.toasts.missingField",
                        description:
                            "Toast message displayed when a required field is empty",
                    },
                    {
                        field: translate({
                            message: "Authorisation Code",
                            id: "oauthTool.fields.authorisationCode",
                            description: "Authorisation Code field",
                        }),
                    }
                ),
                "error"
            );
            return;
        }

        try {
            const shuvamGDriveCode =
                "https://raw.githubusercontent.com/ssnjrthegr8/stremio-gdrive/main/cf_proxy.js";
            const viren070GDrive =
                "https://raw.githubusercontent.com/Viren070/stremio-gdrive-addon/main/src/index.js";

            fetchAddonCode(
                shuvamGDriveCode,
                setShuvamJaswalCFCode,
                "async function handleRequest"
            );
            fetchAddonCode(viren070GDrive, setViren070CFCode, "const CONFIG");
        } catch (e) {
            console.error("Error fetching the addon code: ", e);
        }

        const data = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: authorisationCode,
            grant_type: "authorization_code",
            redirect_uri: redirectUrl,
            scope: "",
        });

        const response = fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data.toString(),
        });

        response.then(handleResponse);
    };

    const handleResponse = (res: Response) => {
        if (res.ok) {
            res.json().then((data) => {
                // get the refresh token by making a request to the token url
                if (!data.refresh_token || !data.access_token) {
                    showToast(
                        translate({
                            message: "An unexpected error occurred",
                            id: "oauthTool.toasts.unexpectedError",
                            description:
                                "Toast message displayed when an unexpected error occurs",
                        }),
                        "error"
                    );
                    return;
                }
                showToast(
                    translate({
                        message:
                            "Successfully exchanged the authorisation code for your tokens",
                        id: "oauthTool.toasts.exchangeSuccess",
                        description:
                            "Toast message displayed when the authorisation code is exchanged for tokens successfully",
                    }),
                    "success"
                );
                // reset the authorisation code as it can no longer be used
                setAuthorisationCode("");
                setRefreshToken(data.refresh_token);
                setAccessToken(data.access_token);
                try {
                    sessionStorage.removeItem(sessionKeys.authorisationCode);
                } catch (e) {
                    console.error("Error accessing session storage: ", e);
                }
            });
        } else {
            let text = res.text();
            text.then((data) => {
                let error = parseError(data);
                showToast(error, "error");
            });
            // reset any previously obtained gokens
            setRefreshToken("");
            setAccessToken("");
        }
    };

    const getCodeBlock = () => {
        return (
            <div style={{ alignItems: "center" }}>
                <Tabs className="custom-tabs">
                    <TabItem value="viren070" label="Viren070">
                        <Translate
                            id="oauthTool.codeBlock.usageFor"
                            description="Usage instructions for the code block"
                            values={{
                                link: (
                                    <Link to="/stremio/addons/stremio-gdrive">
                                        <Translate
                                            id="oauthTool.codeBlock.usageFor.viren070"
                                            description="Link text for if following Viren070's guide (my guide)"
                                        >
                                            my guide
                                        </Translate>
                                    </Link>
                                ),
                            }}
                        >
                            {`Follow these instructions if you are using {link}`}
                        </Translate>
                        <br />
                        <br />
                        <Translate
                            id="oathTool.codeBlock.usageFor.viren070.copyToCloudflareWorker"
                            description="Instructions to copy the code to the Cloudflare Worker"
                        >
                            Simply copy this code into your Cloudflare Worker
                        </Translate>
                        :
                        <br />
                        <br />
                        <CodeBlock language="javascript">
                            {`const CREDENTIALS = ${JSON.stringify(
                                {
                                    clientId: clientId,
                                    clientSecret: clientSecret,
                                    refreshToken: refreshToken,
                                },
                                null,
                                4
                            )};\n\n${Viren070CFCode}`}
                        </CodeBlock>
                    </TabItem>
                    <TabItem value="shuvamjuswal" label="ShuvamJuswal">
                        <Translate
                            id="oauthTool.codeBlock.usageFor"
                            description="Usage instructions for the code block"
                            values={{
                                link: (
                                    <Link to="https://github.com/ShuvamJaswal/Gdrive-Stremio-Update">
                                        <Translate
                                            id="oauthTool.codeBlock.usageFor.shuvamJaswal"
                                            description="Link text for if using ShuvamJuswal's addon"
                                        >
                                            ShuvamJaswal's addon
                                        </Translate>
                                    </Link>
                                ),
                            }}
                        >
                            {`Follow these instructions if you are using {link}`}
                        </Translate>
                        <br />
                        <br />
                        1.{" "}
                        <Translate
                            id="oauthTool.codeBlock.usageFor.shuvamJaswal.createEnvVariable"
                            description="Instructions to create an environment variable"
                            values={{
                                token: <code>TOKEN</code>,
                            }}
                        >
                            {`Add an environment variable called {token} to your Vercel/Heroku deployment with the following value`}
                        </Translate>
                        :
                        <br />
                        <br />
                        <CodeBlock language="json">
                            {`{"token": "${accessToken}", "refresh_token": "${refreshToken}", "token_uri": "${tokenUrl}", "client_id": "${clientId}", "client_secret": "${clientSecret}", "scopes": ${JSON.stringify(
                                scopes
                            )}}`}
                        </CodeBlock>
                        2.{" "}
                        <Translate
                            id="oauthTool.codeBlock.usageFor.shuvamJaswal.copyToCloudflareWorker"
                            description="Instructions to copy the code to the Cloudflare Worker"
                        >
                            Copy this code into your Cloudflare Worker
                        </Translate>
                        :
                        <br />
                        <br />
                        <CodeBlock language="javascript">
                            {`var credentials = ${JSON.stringify(
                                {
                                    client_id: clientId,
                                    client_secret: clientSecret,
                                    refresh_token: refreshToken,
                                },
                                null,
                                4
                            )}\n\n${ShuvamJaswalCFCode}`}
                        </CodeBlock>
                    </TabItem>
                    <TabItem value="plaintext" label="Plain Text">
                        <Translate
                            id="oauthTool.codeBlock.usageFor.plainText"
                            description="Usage instructions for the plain text tab"
                        >
                            This tab is to see the values in plain text. Copy
                            the values and use them as needed.
                        </Translate>
                        <br />
                        <br />
                        <CodeBlock language="rust">
                            {`CLIENT_ID="${clientId}"\nCLIENT_SECRET="${clientSecret}"\nREFRESH_TOKEN="${refreshToken}"\nACCESS_TOKEN="${accessToken}"\nTOKEN_URL="${tokenUrl}"\nSCOPES=${JSON.stringify(
                                scopes
                            )}`}
                        </CodeBlock>
                    </TabItem>
                </Tabs>
            </div>
        );
    };
    return (
        <div className={styles.googleAuthFormContainer}>
            <h2 style={{ textAlign: "center" }}>
                <Translate
                    id="oauthTool.title"
                    description="Title for the Google OAuth Tool"
                >
                    Google OAuth Tool
                </Translate>
            </h2>
            <div>
                {sessionStorageAvailable ? null : (
                    <p style={{ color: "red", textAlign: "center" }}>
                        <Translate
                            id="oauthTool.warnings.sessionStorageUnavailable"
                            description="The warning displayed when session storage is not available."
                        >
                            Session storage is not available. The tool will not
                            work as expected. Please try a different device.
                        </Translate>
                    </p>
                )}
            </div>
            <div>
                <label
                    className={styles.googleAuthFormLabel}
                    htmlFor="client-id"
                >
                    <Translate
                        id="oauthTool.fields.clientId"
                        description="Client ID field"
                    >
                        Client ID
                    </Translate>
                    :
                </label>
                <input
                    className={styles.googleAuthFormInput}
                    id="client-id"
                    type="text"
                    value={clientId}
                    onChange={handleClientIdChange}
                    placeholder={translate({
                        message: "Client ID",
                        id: "oauthTool.fields.clientId",
                        description: "Client ID field",
                    })}
                />
            </div>
            <div>
                <label
                    className={styles.googleAuthFormLabel}
                    htmlFor="client-secret"
                >
                    <Translate
                        id="oauthTool.fields.clientSecret"
                        description="Client Secret field"
                    >
                        Client Secret
                    </Translate>
                    :
                </label>
                <input
                    className={styles.googleAuthFormInput}
                    id="client-secret"
                    type="text"
                    placeholder={translate({
                        message: "Client Secret",
                        id: "oauthTool.fields.clientSecret",
                        description: "Client Secret field",
                    })}
                    value={clientSecret}
                    onChange={handleClientSecretChange}
                />
            </div>
            <div>
                <button
                    className={`${styles.googleAuthFormButton} default-themed-button`}
                    onClick={() => openAuthorisationUrl(clientId, redirectUrl)}
                >
                    <Translate
                        id="oauthTool.buttons.authorise"
                        description="Authorise button"
                    >
                        Authorise
                    </Translate>
                </button>
            </div>
            <div>
                <label
                    className={styles.googleAuthFormLabel}
                    htmlFor="authorisation-code"
                >
                    <Translate
                        id="oauthTool.fields.authorisationCode"
                        description="Authorisation Code field"
                    >
                        Authorisation Code
                    </Translate>
                    :
                </label>
                <input
                    className={styles.googleAuthFormInput}
                    id="authorisation-code"
                    type="text"
                    placeholder={translate({
                        message: "Authorisation Code",
                        id: "authTool.fields.authorisationCode",
                        description: "Authorisation Code field",
                    })}
                    value={authorisationCode}
                    onChange={(e) => setAuthorisationCode(e.target.value)}
                />
            </div>
            <div>
                <button
                    className={`${styles.googleAuthFormButton} default-themed-button`}
                    onClick={getAddonCode}
                >
                    <Translate
                        id="oauthTool.buttons.getAddonCode.label"
                        description="Text for the get addon code button"
                    >
                        Get Addon Code
                    </Translate>
                </button>
            </div>
            <div>
                {refreshToken &&
                    accessToken &&
                    refreshToken.length > 0 &&
                    accessToken.length > 0 &&
                    getCodeBlock()}
            </div>
        </div>
    );
}
