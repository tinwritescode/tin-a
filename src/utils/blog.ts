import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
}

export function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "src/app/blog");
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames
    .filter(
      (fileName) =>
        fileName.endsWith(".mdx") &&
        fileName !== "layout.tsx" &&
        fileName !== "[slug].tsx",
    )
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse frontmatter
      const { data, content } = matter(fileContents);

      // Extract title from frontmatter or first H1 tag
      const title =
        data.title || content.match(/^#\s+(.*)/m)?.[1] || "Untitled";

      // Extract excerpt from frontmatter or first paragraph
      const excerpt =
        data.excerpt ||
        (
          content
            .split("\n")
            .find((line) => line.trim() !== "" && !line.startsWith("#")) || ""
        ).substring(0, 150) + "...";

      return {
        slug,
        title,
        excerpt,
      };
    });

  return allPostsData;
}
