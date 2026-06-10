import { createFromSource } from "fumadocs-core/search/server";

import { blog } from "@/lib/source";

export const revalidate = false;

export const { staticGET: GET } = createFromSource(blog);
