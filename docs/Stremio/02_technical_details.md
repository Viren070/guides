# Technical Details

### Stremio Addons

As mentioned before, Stremio itself provides no content and is simply a media player. This is to avoid legal issues. The way Stremio is able to become one of the best on-demand video players is through the addon system. 

Stremio's "addons" aren't locally installed code that alter the way Stremio works, but simple web services that provide information on request. The type of information is defined by Stremio's addon framework. This makes them simple and safe, but limits what they're capable of doing.

Stremio provides an [addon SDK](https://github.com/Stremio/stremio-addon-sdk) that can be used by the community to create addons. An addon can provide one of the following to Stremio:

- Video sources - This is the actual content
- Catalogues - These addons are what will fill your home screen with content but they do not provide sources
- Subtitles - These addons will use the metadata of what you’re watching and provide subtitles for them
- Metadata - These addons will provide the metadata (name, actors, genre, runtime etc. ) of content.

### Stream Providers

There are many addons that provide streams. Each addon either provides HTTP streams or torrent streams. 

Addons that use HTTP streams are safe to use and will not get you flagged by your ISP. However, these addons are largely unreliable and prone to breakage quite often. These streams may also buffer too. HTTP addons will scrape specific sources (dependent on the addon) using the metadata for the selected content to provide a stream to you.

Torrent addons, will scrape torrents from available sources on the web and provide these torrents to Stremio. Streaming torrents is generally more reliable as torrents download pieces from multiple sources simultaneously, which can result in faster and more consistent streaming compared to single-source HTTP streams. However, torrenting carries the risk of your IP being shown to the trackers on the torrent. This means that your ISP will be flagged about your online activities. Furthermore, the speed of a torrent stream is heavily reliant on the number of seeders for that torrent. If a torrent has a small number of low speed seeders, you will encounter a lot of buffering. 

One solution to the above is using a VPN. However, this can further slow your streaming speed down if you are not using a fast VPN and the issue of reliance on seeders still remains. The recommended solution is a debrid service. Read below to find out why.

### Debrid Services

Debrid services cache torrents on their servers, which has a vast amount of sources to stream from with consistent stream performance that is reliant on your internet speed rather than torrent seeding. It is a much more consistent experience and does not require a VPN. It's also much cheaper per month than any other streaming service by itself but you basically get the streaming speeds of first-party streaming services (often with higher bitrates) and all their catalogues.

With a debrid service, you are unrestricted by speed limits and streaming 4K Remuxes becomes possible as long as you have a fast enough internet speed and as you are streaming through HTTP, it is impossible for your ISP to know what you are watching or for your activity to be deemed illegal. With torrenting, you were technically distributing pirated content. This is not the case anymore.

An additional benefit of setting up a debrid service, is that it can be used for other purposes too, not just streaming torrents. It can be used for any torrent file, such as games, music etc.

Its more general use is to generate a direct download link when given a torrent link.

### **How does torrenting work on a Debrid service?**

When a debrid service is provided with a torrent to download, it first downloads the torrent to its servers. A direct HTTP link is then given to the user to download or stream this torrent. For this reason, only a web interface is needed, no app.

If a torrent has already been downloaded by other users, it will be instantly available for you to download as well, no need to wait for the Debrid service to download it first. This is known as Cached Torrents.

For a torrent that has not been “cached”, the debrid service will need to download the torrent first. Although this is also reliant on the number of seeders for a torrent, once at least one person has cached the torrent, the speeds will be much faster. 

### **When downloading torrents, why use this instead of a [VPN](https://en.wikipedia.org/wiki/Virtual_private_network)?**

- It's (usually) cheaper compared to most VPNs
- You don't need to install anything. Just paste the links on the service and it will generate a download link for you
- It is accessible to any device with a web browser
- You don't need to worry about the following:
    - IP address leaking
    - Checking if ISP is torrent-friendly
    - Configuring torrent clients
    - Setting up kill switches
    - Setting up the network to allow torrent downloading
    - Threatening letters from big corporations

### How is the Debrid service used for Stremio.

As I mentioned before, Stremio has 2 types of stream providers, HTTP and torrent. Most Torrent addons can be configured to use the Debrid service instead of streaming the actual torrent. The addon can be configured to only show streams that are cached and this eliminates the risk of accidentally torrenting. 

The way these addons work is that when looking for torrents, they will lookup the torrent on the Debrid service using their API and if the addon is configured to show debrid links then it will provide the link to the file on the debrid service’s servers which allows Stremio to play that torrent file through HTTP on the Debrid providers servers. Your ISP will not be able to see what you are streaming.