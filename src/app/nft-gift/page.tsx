"use client";

import { Toaster, toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Simple mock component for an NFT card
const NFTCard = ({ id }: { id: number }) => {
  return (
    <div className="rounded-md border p-2 text-center text-sm">
      <div className="mb-2 flex h-16 w-full items-center justify-center bg-gray-200">
        NFT {id}
      </div>
      NFT ID: {id}
    </div>
  );
};

// Simple API function to fetch mock NFTs
const fetchMockNFTs = async () => {
  // Simulate an API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }));
};

const NftGiftPage = () => {
  const [nftsLeft] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const nftsPerPage = 10;

  // Generate mock NFTs
  const {
    data: mockNFTs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mockNFTs"],
    queryFn: fetchMockNFTs,
  });

  // Get current NFTs for the page
  const indexOfLastNft = currentPage * nftsPerPage;
  const indexOfFirstNft = indexOfLastNft - nftsPerPage;
  const currentNFTs = mockNFTs?.slice(indexOfFirstNft, indexOfLastNft) || [];

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil((mockNFTs?.length || 0) / nftsPerPage);

  const handleJoinQueue = () => {
    toast("coming soon");
  };

  return (
    <div className="container mx-auto mt-16 py-8">
      <h1 className="mb-6 text-3xl font-bold">NFT Gift</h1>

      {/* Minting Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Minting</h2>
        <p className="mb-4">NFTs left for today: {nftsLeft}</p>
        <button
          onClick={handleJoinQueue}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Join the queue
        </button>
      </section>

      {/* NFT List Section */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">NFT List</h2>

        {isLoading && <p>Loading NFTs...</p>}
        {isError && <p>Error loading NFTs.</p>}

        {!isLoading && !isError && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {currentNFTs.map((nft) => (
                <NFTCard key={nft.id} id={nft.id} />
              ))}
            </div>

            {/* Pagination */}
            {mockNFTs && mockNFTs.length > 0 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`rounded-md border px-3 py-1 ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <Toaster />
      </section>
    </div>
  );
};

export default NftGiftPage;
