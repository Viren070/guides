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

export default function (props: Props): JSX.Element {
  const { name, debrid, torrent, usenet, http, flag } = props;
  // state to store the addon component
  const [AddonComponent, setAddonComponent] = useState<React.ComponentType | null>(null);
  // state to track if import is in progress
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const addonId = name.toLowerCase().replace(/ /g, '-').replace(/\+/g, '-plus');
    setLoading(true);
    import(`@site/docs/stremio/addons/${addonId}.mdx`)
      .then(module => {
        setAddonComponent(() => module.default);
        setLoading(false);
      })
      .catch(() => {
        setAddonComponent(null);
        setLoading(false);
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
      {loading ? <p>Loading...</p> : AddonComponent ? <AddonComponent /> : <p>Addon not found</p>}
    </Details>
  );
}