/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../../App";
import { toast } from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const ListProducts = ({ token }) => {
  const [productList, setProductLists] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProductLists = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/v1/admin/all-products`,
        {
          headers: {
            aToken: token,
          },
        }
      );

      if (data.success) {
        setProductLists(data.products || []);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setShowDeleteModal(false);
    setSelectedProductId(null);
  };

  const deleteProduct = async () => {
    if (!selectedProductId) return;

    try {
      setIsDeleting(true);

      const { data } = await axios.delete(
        `${backendUrl}/api/v1/admin/delete-product/${selectedProductId}`,
        {
          headers: { aToken: token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setProductLists((prev) =>
          prev.filter((item) => item._id !== selectedProductId)
        );
        closeDeleteModal();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProductLists();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-lg font-semibold">All Products</h1>

      <div className="flex flex-col gap-2">
        <p className="text-sm md:text-base font-medium text-gray-700">
          Total Products:{" "}
          <span className="font-semibold">{productList.length}</span>
        </p>

        <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_80px] items-center py-2 px-3 bg-gray-100 text-sm font-medium rounded">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {productList.length === 0 ? (
          <div className="border rounded p-6 text-center text-gray-500 bg-white">
            No products found.
          </div>
        ) : (
          productList.map((item, index) => (
            <div
              key={item._id || index}
              className="grid grid-cols-[80px_1fr] md:grid-cols-[80px_2fr_1fr_1fr_80px] items-center gap-3 py-2 px-3 border rounded bg-white"
            >
              <img
                src={item.image?.[0] || "/placeholder.png"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />

              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">{item.category}</p>

              <p className="text-sm font-medium">
                {currency} {Number(item.price).toLocaleString()}
              </p>

              <button
                onClick={() => openDeleteModal(item._id)}
                className="flex justify-center items-center text-red-500 hover:text-red-700 transition cursor-pointer"
                type="button"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Product
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                Cancel
              </button>

              <button
                onClick={deleteProduct}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListProducts;