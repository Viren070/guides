import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	guides: [
		"index",
		{
			type: "category",
			label: "Gaming",
			link: {
				type: "generated-index",
				title: "Games / Emulation",
				description: "Guides on downloading and setting up games / emulators",
				keywords: ["games", "free", "download"],
			},
			items: [
				{
					type: "category",
					label: "Minecraft",
					link: {
						type: "doc",
						id: "minecraft/index",
					},
					items: [
						{
							type: "category",
							label: "Java",
							link: { type: "doc", id: "minecraft/java/index" },
							items: [],
						},
						{
							type: "category",
							label: "Bedrock",
							link: { type: "doc", id: "minecraft/bedrock/index" },
							items: ["minecraft/bedrock/windows", "minecraft/bedrock/android"],
						},
					],
				},
				"plutonium/index",
			],
		},
		{
			type: "category",
			label: "Streaming",
			link: {
				type: "generated-index",
				title: "Movies / TV / Anime",
				description:
					"Guides on using apps that can be used to stream movies / tv shows / anime",
				keywords: ["movies", "download"],
			},
			items: [
				{
					type: "category",
					label: "Stremio",
					link: {
						type: "doc",
						id: "stremio/index",
					},
					items: [
						"stremio/intro",
						"stremio/technical-details",
						"stremio/setup",
						{
							type: "category",
							label: "Extras",
							link: {
								type: "doc",
								id: "stremio/extras/index",
							},
							items: [
								"stremio/extras/trakt/index", 
								"stremio/extras/account-bootstrapper",
								"stremio/extras/addon-manager", 
								"stremio/extras/debrid-media-manager", 
								"stremio/extras/open-in-stremio",
								"stremio/extras/discord-integration",
								"stremio/extras/pimp-my-stremio",
								"stremio/extras/stremio-downloader"
							]
							
						},
						"stremio/faq",
						"stremio/troubleshooting",
						"stremio/credits",
					],
				},
				{
					type: "category",
					label: "Aniyomi",
					link: {
						type: "doc",
						id: "aniyomi/index",
					},
					items: [
						"aniyomi/intro",
						"aniyomi/setup",
						"aniyomi/forks",
					],
				},
				
			],
		},
		{
			type: "category",
			label: "Reading",
			link: {
				type: "generated-index",
				title: "Reading",
				description: "Guides on downloading and reading books / comics",
				keywords: ["books", "comics", "download"],
			},
			items: []
		}
	],
};

export default sidebars;
