import GDriveOAuthTool from "@site/src/components/GoogleOAuth";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import { getCallbackUrl } from "@site/src/components/GoogleOAuth/Callback";
import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import Translate from "@docusaurus/Translate";

export default function GDriveOAuth(): JSX.Element {
    return (
        <Layout
            title="Google OAuth"
            description="Tool to obtain the code for the Stremio GDrive addons."
        >
            <div className={styles.googleAuthPageContainer}>
                <GDriveOAuthTool />
                <div className={styles.googleAuthFAQContainer}>
                    <h2>
                        <Translate
                            id="oauthTool.faq.title"
                            description="FAQ title"
                        >
                            FAQ
                        </Translate>
                    </h2>

                    <h3>
                        <Translate
                            id="oauthTool.faq.whatIsThisTool"
                            description="FAQ question: What is this tool for?"
                        >
                            What is this tool for?
                        </Translate>
                    </h3>
                    <p>
                        <Translate
                            id="oauthTool.faq.whatIsThisTool.answer"
                            description="FAQ answer: What is this tool for?"
                        >
                            This tool is for obtaining the code required for the
                            various different Stremio GDrive addons.
                        </Translate>
                    </p>

                    <h3>
                        <Translate
                            id="oauthTool.faq.howToUse"
                            description="FAQ question: How do I use this tool?"
                        >
                            How do I use this tool?
                        </Translate>
                    </h3>
                    <p>
                        <Translate
                            id="oauthTool.faq.howToUse.answer"
                            description="FAQ answer: How do I use this tool?"
                            values={{
                                code: <code>Web application</code>,
                            }}
                        >
                            {`A prerequisite for using this tool is that your OAuth client must be of the {code} type. You must also add the following URL to the list of authorised redirect URIs in the Google Cloud Console`}
                        </Translate>:
                    </p>
                    
                    <div className={styles.googleAuthFAQCodeBlockContainer}>
                        <CodeBlock language="javascript">
                            {`${getCallbackUrl()}`}
                        </CodeBlock>
                    </div>
                    
                    <p>
                    <Translate
                        id="oauthTool.faq.howToUse.answer.continued"
                        description="The continuation of the answer to the question: How do I use this tool?"
                        values={{
                            here: (
                                <Link to="/stremio/addons/stremio-gdrive">
                                    <Translate
                                        id="oauthTool.faq.howToUse.answer.continued.linkTohere"
                                        description="Link to the Stremio GDrive addon guide"
                                    >
                                        here
                                    </Translate>
                                </Link>
                            )
                        }}
                        >
                   
                        {`You can find a more detailed guide on using this tool to setup a Stremio Google Drive addon {here}.`}
                       
                    </Translate>     
                    </p>    
                    <h3>
                        <Translate
                            id="oauthTool.faq.howDoesItWork"
                            description="FAQ question: How does this tool work?"
                        >
                            How does this tool work?
                        </Translate>
                    </h3>
                    <p>
                        <Translate
                            id="oauthTool.faq.howDoesItWork.answer"
                            description="FAQ answer: How does this tool work?"
                            values={{
                                generateCodeButton: <code>Generate Code</code>,
                            }}
                        >
                            {`Once you input your Client ID, the tool will construct an OAuth URL that allows you to authorise the client to access your Google Drive, using this tool as the redirect URI. Once you authorise the client, Google will redirect you back to this tool with an authorisation code, that is automatically extracted and filled in for you. Then, you can click the {generateCodeButton} button which uses the authorisation code to obtain a new refresh token and access token. You then choose your format depending on the addon you are using, and it is displayed for you to copy.`}
                        </Translate>
                    </p>

                    <h3>
                        <Translate
                            id="oauthTool.faq.isThisSafe"
                            description="FAQ question: Is this safe?"
                        >
                            Is this safe?
                        </Translate>
                    </h3>
                    <p>
                        <Translate
                            id="oauthTool.faq.isThisSafe.answer1"
                            description="FAQ answer: Is this safe? Part 1"
                        >
                            Everything is run on your device, and no data is
                            sent anywhere.
                        </Translate>
                    </p>
                    <p>
                        <Translate
                            id="oauthTool.faq.isThisSafe.answer2"
                            description="FAQ answer: Is this safe? Part 2"
                        >
                            The client ID and client secret are stored in your
                            browser's session storage, which is cleared upon
                            closing the tab. The authorisation code is also
                            stored in the session storage to allow the tool to
                            transfer it from the callback URL back to the tool
                            to automatically fill it in for you.
                        </Translate>

                    </p>
                    <p>
                        <Translate
                            id="oauthTool.faq.isThisSafe.answer3"
                            description="FAQ answer: Is this safe? Part 3"
                        >
                            As long as your device isn't already compromised,
                            this tool is safe to use.
                        </Translate>
                    </p>
                    <p>
                        <Translate
                            id="oauthTool.faq.isThisSafe.answer4"
                            description="FAQ answer: Is this safe? Part 4"
                            values={{
                                link: (
                                    <Link to="https://github.com/Viren070/guides/blob/main/src/components/GoogleOAuth/index.tsx">
                                        on GitHub
                                    </Link>
                                ),
                            }}
                        >
                            {`You can view the source code for this tool {link}.`}
                        </Translate>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
