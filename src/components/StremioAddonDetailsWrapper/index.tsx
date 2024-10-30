import React, { useState, useEffect } from 'react';
import Details from '@theme/Details';

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
}

function NotFound (props: { name?: string }): JSX.Element {
  const { name } = props;
  return (
    // center the content
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1>Oops!</h1>
      <p>An unexpected error occured and the documentation for {name} could not be found.</p>
      <p>Please report this issue on <a href="https://github.com/Viren070/guides">GitHub</a>.</p>
    </div>
  );
}

export default function (props: Props): JSX.Element {
  const { name, debrid, torrent, usenet, http, flag } = props;
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