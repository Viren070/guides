import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	guides: [
		"intro",
		{
			type: "category",
			label: "Games / Emulation",
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
							label: "Java Edition",
							link: { type: "doc", id: "minecraft/java/index" },
							items: [],
						},
						{
							type: "category",
							label: "Bedrock Edition",
							link: { type: "doc", id: "minecraft/bedrock/index" },
							items: ["minecraft/bedrock/windows", "minecraft/bedrock/android"],
						},
					],
				},
				{
					type: "category",
					label: "Plutonium",
					link: {
						type: "doc",
						id: "plutonium/index",
					},
					items: [
						"plutonium/intro",
						"plutonium/setting-up-launcher",
						"plutonium/downloading-base-game",
						"plutonium/setting-up-on-plutonium",
						"plutonium/credits",
					],
				},
			],
		},
		{
			type: "category",
			label: "Movies / TV / Anime",
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
						"stremio/guide",
						"stremio/extras",
						"stremio/faq",
						"stremio/troubleshooting",
						"stremio/credits",
					],
				},
				{
					type: "category",
					label: "Kodi",
					link: {
						type: "doc",
						id: "kodi/index",
					},
					items: [],
				},
			],
		},
	],
};

export default sidebars;
