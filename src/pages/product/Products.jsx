import { useEffect, useState } from "react";
import ProductTable from "../../components/ProductTable";
import ProductFormPanel from "../../components/ProductFormPanel";
import ViewProductPanel from "./ViewProductPannel";
import { disableProduct, getActiveProducts } from "../../services/ProductService";
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
  const [viewProduct, setViewProduct] = useState(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const name = product?.name?.toLowerCase?.() ?? "";
    const sku = product?.sku?.toLowerCase?.() ?? "";
    const category = product?.category?.toLowerCase?.() ?? "";
    return [name, sku, category].some((value) =>
      value.includes(normalizedSearch),
    );
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getActiveProducts();
      const productList = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];
      setProducts(productList);
      setError("");
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
    <div className="flex-1 bg-gray-50 dark:bg-[#0F172A] min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Products
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your inventory and stock items
          </p>
        </div>

        <div className="flex gap-4 items-center">
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 w-72 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-900 text-sm
                       focus:ring-2 focus:ring-yellow-400 outline-none transition"
          />

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setOpenForm(true);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg
                       font-semibold shadow-sm hover:shadow-md transition"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
                        rounded-xl p-12 text-center text-gray-500 dark:text-gray-400"
        >
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
          onView={(product) => {
            setViewProduct(product);
          }}
        />
      )}

      {/* Form Panel */}
      <ProductFormPanel
        open={openForm}
        product={selectedProduct}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        onSuccess={loadProducts}
      />

      {/* View Panel */}
      <ViewProductPanel
        open={Boolean(viewProduct)}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />

      {/* Disable Modal */}
      {disableTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 w-[420px] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-red-600 mb-3">
              Disable Product
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to disable{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {disableTarget.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDisableTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>

              <button
                disabled={disablingId === disableTarget.id}
                onClick={() => handleDisable(disableTarget.id)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white
                           font-medium transition disabled:opacity-50"
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
