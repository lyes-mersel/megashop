import NavBar from "@/components/layout/store/CatalogHeader/NavBar";

const CatalogHeader = () => {
  return (
    <header
      className="sticky top-0 bg-white z-20"
      style={{ boxShadow: "0 2px 4px 0 #f2f0f1" }}
    >
      <NavBar />
    </header>
  );
};

export default CatalogHeader;
