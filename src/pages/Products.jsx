import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import ProductTable from "../components/ProductTable";
import ProductFormPanel from "../components/ProductFormPanel";
import { disableProduct, getActiveProducts } from "../services/ProductService";
import toast from "react-hot-toast";

export default function Products() {
  const [openForm, setOpenForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [disableTarget, setDisableTarget] = useState(null);
  const [disablingId, setDisablingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("disableTarget", disableTarget);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getActiveProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDisable = async (id) => {
    setDisablingId(id);
    try {
      await disableProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDisableTarget(null);
      toast.success("Product disabled successfully");
    } catch {
      toast.error("Failed to disable product");
    } finally {
      setDisablingId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
  

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name, SKU, category"
              className="px-3 py-2 border rounded-md w-64 focus:ring-2 focus:ring-yellow-500"
            />

            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium"
              onClick={() => setOpenForm(true)}
            >
              + Add Product
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white p-4 rounded shadow text-gray-500">
            Loading products...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No products found
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={(product) => {
              setSelectedProduct(product);
              setOpenForm(true);
            }}
            onDisable={(product) => {
              setDisableTarget(product);
            }}
          />
        )}
      </div>

      {/* Right Panel */}
      <ProductFormPanel
        open={openForm}
        product={selectedProduct}
        onClose={() => setOpenForm(false)}
        onSuccess={loadProducts}
      />

      {/*alert modal*/}
      {disableTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-100">
            <h3 className="text-lg font-semibold mb-3 text-red-600">
              Disable Product
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to disable
              <b> {disableTarget.name}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDisableTarget(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                disabled={disablingId === disableTarget.id}
                onClick={() => handleDisable(disableTarget.id)}
                className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              >
                {disablingId === disableTarget.id ? "Disabling..." : "Disable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
