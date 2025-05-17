const IsLoading = () => {
  return (
    <div className="min-h-[calc(100dvh-300px)] flex items-center justify-center text-center py-12">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

export default IsLoading;
