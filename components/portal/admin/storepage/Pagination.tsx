interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="mt-8 flex justify-center gap-2 flex-wrap">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          disabled={currentPage === i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md ${
            currentPage === i + 1
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
