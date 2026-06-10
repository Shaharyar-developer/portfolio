import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { blogPosts } from "../.source/server";

export const blog = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogPosts, []),
});

export type PostPage = ReturnType<typeof blog.getPages>[number];

export function isVisiblePost(post: PostPage) {
  return process.env.NODE_ENV !== "production" || !post.data.draft;
}

export function getPosts() {
  return blog
    .getPages()
    .filter(isVisiblePost)
    .sort((left, right) => {
      return getTime(right.data.date) - getTime(left.data.date);
    });
}

function getTime(value: string | Date) {
  return (value instanceof Date ? value : new Date(value)).getTime();
}
