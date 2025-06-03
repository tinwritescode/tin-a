"use client";

import { Toaster, toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Simple mock component for an NFT card
const NFTCard = ({ id }: { id: number }) => {
  return (
    <div className="border p-2 rounded-md text-center text-sm">
      <div className="w-full h-16 bg-gray-200 mb-2 flex items-center justify-center">
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
  const { data: mockNFTs, isLoading, isError } = useQuery({
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
    <div className="container mx-auto py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">NFT Gift</h1>

      {/* Minting Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Minting</h2>
        <p className="mb-4">NFTs left for today: {nftsLeft}</p>
        <button
          onClick={handleJoinQueue}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Join the queue
        </button>
      </section>

      {/* NFT List Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">NFT List</h2>

        {isLoading && <p>Loading NFTs...</p>}
        {isError && <p>Error loading NFTs.</p>}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
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
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>)}
            </>)}
        <Toaster />
      </section>
    </div>
  );
};

export default NftGiftPage;