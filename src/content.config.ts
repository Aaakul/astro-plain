import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { AVAILABLE_LANG } from "~/i18n";
import { BuiltInIcons, type BuiltInIcon } from "~/lib/starlight/components/Icons";

// Allowed icon keys for social links (excluding 'email' which is a separate field)
const optionalUrlSchema = z.string().check(z.url()).optional();

const iconKeySchema = z.enum(
  Object.keys(BuiltInIcons).filter((key) => key !== "email") as [
    Exclude<BuiltInIcon, "email">,
    ...Exclude<BuiltInIcon, "email">[],
  ],
);

/** Schema for author profiles in src/content/author */
const authorFrontmatterSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string().min(1),
    language: z.enum(AVAILABLE_LANG),
    avatar: image().optional(),
    occupation: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
    email: z.string().check(z.email()).optional(),
    link: z.record(iconKeySchema, optionalUrlSchema).optional(),
  });

/** Schema for blog articles in src/content/blog */
const blogFrontmatterSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().min(1),
    translationKey: z.string().min(1),
    date: z.coerce.date(),
    categories: z.array(z.string().min(1)).optional(),
    tags: z.array(z.string().min(1)).optional(),
    lastmod: z.coerce.date().optional(),
    summary: z.string().min(1).optional(),
    draft: z.boolean().default(false),
    authors: z.array(z.string()).default(["default"]),
    language: z.enum(AVAILABLE_LANG),
    isCanonical: z.boolean().default(false),
    enableComments: z.boolean().default(true),
    image: image().optional(),
  });

/** Schema for project items in src/content/project */
const projectFrontmatterSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string().min(1),
    image: image().optional(),
    language: z.enum(AVAILABLE_LANG),
    website: optionalUrlSchema,
    link: z.record(iconKeySchema, optionalUrlSchema).optional(),
  });

// Content collections using Astro Content Layer glob loader
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => blogFrontmatterSchema({ image }),
});

const author = defineCollection({
  loader: glob({ base: "./src/content/author", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => authorFrontmatterSchema({ image }),
});

const project = defineCollection({
  loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => projectFrontmatterSchema({ image }),
});

const mdx = defineCollection({
  loader: glob({ base: "./src/content/mdx", pattern: "**/*.{md,mdx}" }),
});

export type BlogFrontmatter = z.infer<ReturnType<typeof blogFrontmatterSchema>>;

export type AuthorFrontmatter = z.infer<ReturnType<typeof authorFrontmatterSchema>>;

export type ProjectFrontmatter = z.infer<ReturnType<typeof projectFrontmatterSchema>>;

export const collections = { blog, author, project, mdx };
