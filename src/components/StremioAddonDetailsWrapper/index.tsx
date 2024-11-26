import React, { useState, useEffect } from 'react';
import Details from '@theme/Details';
import Translate from '@docusaurus/Translate';

const flagEmojis = {
  "France": "🇫🇷",
  "Italy": "🇮🇹",
  "Spain": "🇪🇸",
  "Argentina": "🇦🇷"
};

interface Props {
  name: string;
  debrid?: boolean;
  torrent?: boolean;
  usenet?: boolean;
  http?: boolean;
  flag?: string;
  deprecated?: boolean;
}

function NotFound (props: { name?: string }): JSX.Element {
  const { name } = props;
  return (
    // center the content
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1>
        <Translate 
          id='stremio.addonNotFound.title'
          description='Heading for the content of the section when the addon documentation is not found'
        >
          Oops!
        </Translate>
      </h1>
      <Translate 
        id='stremio.addonNotFound.description'
        description='The content of the section when the addon documentation is not found that tells the user what happened and to report the issue on GitHub'
        values={{"name": ({name})}}
      >
        {"The addon documentation for {name} could not be found. Please report this issue on GitHub. "}

      </Translate>
    </div>
  );
}

export default function (props: Props): JSX.Element {
  const { name, debrid, torrent, usenet, http, flag, deprecated } = props;
  // state to store the addon component
  const [AddonComponent, setAddonComponent] = useState<React.ComponentType|null>(null);

  useEffect(() => {
    const addonId = name.toLowerCase().replace(/ /g, '-').replace(/\+/g, '-plus');
    import(`@site/docs/stremio/addons/${addonId}.mdx`)
      .then(module => {
        setAddonComponent(() => module.default);
      })
      .catch(() => {
        setAddonComponent(null);
      });
  }, [name]);

  const addonSummary = [
    name,
    deprecated && '⚠️',
    torrent && '👥',
    http && '🌐',
    debrid && '☁️',
    usenet && '📰',
    flag && flagEmojis[flag],
  ].filter(Boolean).join(' ');

  return (
    <Details summary={addonSummary}>
      {AddonComponent ? <AddonComponent /> : <NotFound name={name}/>}
    </Details>
  );
}