
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const news = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/news",
    }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        summary: z.string(),
        type: z.enum(["story", "event", "memo"]),
        image: z.string(),
        publishedAt: z.string(),
        status: z.enum(["draft", "published"]).default("draft"),
        featured: z.boolean().default(false),
        eventDate: z.string().optional(),
        eventTime: z.string().optional(),
        venue: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

const homepage = defineCollection({
    loader: glob({
        pattern: "homepage.md",
        base: "./src/content/settings",
    }),
    schema: z.object({
        seasonBadge: z.string(),
        welcomeText: z.string(),
        heroTitle: z.string(),
        heroSubtitle: z.string(),
        heroMotto: z.string(),
        heroDescription: z.string(),
        heroImage: z.string(),
        heroButtons: z.array(
            z.object({
                label: z.string(),
                url: z.string(),
                icon: z.string(),
            })
        ),
        venueName: z.string(),
        venueAddress: z.string(),
        standingsLeague: z.string().default("Thika League"),
        standingsSeason: z.string().default("2026/27"),
        showNewsSection: z.boolean().default(true),
        newsSectionTitle: z.string().default("LATEST NEWS & UPDATES"),
        newsSectionLimit: z.number().int().min(1).max(6).default(3),
    }),
});

const matches = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/matches",
    }),
    schema: z.object({
        title: z.string(),
        matchDate: z.string(),
        kickoffTime: z.string(),
        homeTeam: z.string(),
        awayTeam: z.string(),
        homeScore: z.number().int().min(0).optional(),
        awayScore: z.number().int().min(0).optional(),
        competition: z.string(),
        venue: z.string(),
        matchStatus: z.enum([
            "upcoming",
            "completed",
            "postponed",
            "cancelled",
        ]).default("upcoming"),
        featured: z.boolean().default(false),
        reportUrl: z.string().optional(),
    }),
});


const standings = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/standings",
    }),
    schema: z.object({
        title: z.string(),
        league: z.string(),
        season: z.string(),
        team: z.string(),
        position: z.number().int().min(1),
        played: z.number().int().min(0),
        wins: z.number().int().min(0),
        draws: z.number().int().min(0),
        losses: z.number().int().min(0),
        goalsFor: z.number().int().min(0),
        goalsAgainst: z.number().int().min(0),
        points: z.number().int().min(0),
        
    }),
});


const products = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/products",
    }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        image: z.string(),
        price: z.number().positive(),
        category: z.enum([
            "Jerseys",
            "Training Wear",
            "Accessories",
            "Other",
        ]),
        status: z.enum(["draft", "published"]).default("draft"),
        stockStatus: z.enum(["in-stock", "out-of-stock"]).default("in-stock"),
        featured: z.boolean().default(false),
        sortOrder: z.number().int().min(0).default(0),
    }),
});


const fanShop = defineCollection({
    loader: glob({
        pattern: "fan-shop.md",
        base: "./src/content/settings",
    }),
    schema: z.object({
        heroEyebrow: z.string().default("WEAR THE BADGE"),
        heroTitle: z.string().default("Homecity FC"),
        heroHighlight: z.string().default("Fan Shop"),
        heroDescription: z.string().default(
            "Official club gear for the people behind the badge. Pick your gear and show your colours."
        ),
        heroButtonText: z.string().default("Shop the collection"),
        heroButtonUrl: z.string().default("#shop-products"),

        collectionEyebrow: z.string().default("THE CLUB COLLECTION"),
        collectionTitle: z.string().default("Find your Homecity gear"),
        collectionDescription: z.string().default(
            "Browse the official Homecity FC collection."
        ),

        showOrderingNotice: z.boolean().default(true),
        orderingNotice: z.string().default(
            "Online ordering will be available soon."
        ),

        emptyProductsMessage: z.string().default(
            "No products are available yet."
        ),
    }),
});


export const collections = {
    news,
    homepage,
    matches,
    standings,
    products,
    fanShop,
};
