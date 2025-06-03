import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Define custom components to be used within MDX
const components = {
  // Add any custom components you want to use in your MDX files
  // For example:
  // MyCustomComponent: () => <div>This is a custom component!</div>,
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const postFilePath = path.join(process.cwd(), 'src', 'app', 'blog', `${slug}.mdx`);

  if (!fs.existsSync(postFilePath)) {
    notFound();
  }

  const source = fs.readFileSync(postFilePath, 'utf-8');
  const { content, data } = matter(source);

  // You can access frontmatter data here if needed, e.g., data.title, data.description
  const { title } = data;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 lg:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h1>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            {/* Render MDX content */}
            <MDXRemote source={content} components={components} />
          </div>
        </div>
      </article>

    </div>
  );
}

// Optional: Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src', 'app', 'blog');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => ({
      slug: filename.replace(/\.mdx$/, ''),
    }));
}