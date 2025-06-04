"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Keep Link as it's used in the component

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
}

interface BlogPageClientProps {
  blogPosts: BlogPost[];
}

const POSTS_PER_PAGE = 5; // Keep pagination logic

const BlogPageClient: React.FC<BlogPageClientProps> = ({ blogPosts }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = blogPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);

  const handlePreviousPage = () => {}; // Keep handlePreviousPage

  const handleNextPage = () => {
    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE); // Calculate totalPages based on the prop
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE; // Keep pagination logic
    const endIndex = startIndex + POSTS_PER_PAGE; // Keep pagination logic
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {post.excerpt || "No excerpt available."}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={`/blog/${post.slug}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {/* You could add individual page numbers here if desired */}
          <PaginationItem>
            Page {currentPage} of {totalPages}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BlogPageClient;
