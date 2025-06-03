import { getBlogPosts } from '~/utils/blog';
import BlogPageClient from '~/components/BlogPageClient';

export default async function BlogIndexPage() {
  const blogPosts = getBlogPosts();

  return (
    <BlogPageClient blogPosts={blogPosts} />
  );
}