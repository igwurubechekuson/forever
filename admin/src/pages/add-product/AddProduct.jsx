import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/admin_assets/assets";
import { backendUrl } from "../../App";

const AddProduct = ({ token }) => {
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    sizes: [],
    bestseller: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const validateForm = () => {
    const newErrors = {};

    const hasAtLeastOneImage = Object.values(images).some((image) => image);

    if (!hasAtLeastOneImage) {
      newErrors.images = "Please upload at least one product image";
      toast.error("At least one image is needed");
    }

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Product description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.subCategory) {
      newErrors.subCategory = "Please select a subcategory";
    }

    if (!formData.price) {
      newErrors.price = "Product price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Product price must be greater than 0";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "Please select at least one size";
      toast.error("At least one size is needed");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const onImageChangeHandler = (e) => {
    const { id, files } = e.target;

    if (files && files[0]) {
      setImages((prev) => ({
        ...prev,
        [id]: files[0],
      }));

      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  const onSizeToggle = (size) => {
    setFormData((prev) => {
      const alreadySelected = prev.sizes.includes(size);

      return {
        ...prev,
        sizes: alreadySelected
          ? prev.sizes.filter((item) => item !== size)
          : [...prev.sizes, size],
      };
    });

    setErrors((prev) => ({
      ...prev,
      sizes: "",
    }));
  };

  const resetForm = () => {
    setImages({
      image1: null,
      image2: null,
      image3: null,
      image4: null,
    });

    setFormData({
      name: "",
      description: "",
      category: "",
      subCategory: "",
      price: "",
      sizes: [],
      bestseller: false,
    });

    setErrors({});
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const submitData = new FormData();

      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("category", formData.category);
      submitData.append("subCategory", formData.subCategory);
      submitData.append("price", formData.price);
      submitData.append("sizes", JSON.stringify(formData.sizes));
      submitData.append("bestseller", formData.bestseller);

      if (images.image1) submitData.append("image1", images.image1);
      if (images.image2) submitData.append("image2", images.image2);
      if (images.image3) submitData.append("image3", images.image3);
      if (images.image4) submitData.append("image4", images.image4);

      const { data } = await axios.post(
        `${backendUrl}/api/v1/admin/add-product`,
        submitData,
        {
          headers: {
            aToken: token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error(error.message || "Unable to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `outline-none md:py-2.5 py-2 px-3 rounded border ${
      errors[field] ? "border-red-500" : "border-gray-500/40"
    }`;

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div>
          <p className="text-base font-medium">Product Images</p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {["image1", "image2", "image3", "image4"].map((imageKey) => (
              <label key={imageKey} htmlFor={imageKey}>
                <input
                  accept="image/*"
                  type="file"
                  id={imageKey}
                  hidden
                  onChange={onImageChangeHandler}
                />
                <img
                  className="w-24 h-24 object-cover border rounded cursor-pointer"
                  src={
                    images[imageKey]
                      ? URL.createObjectURL(images[imageKey])
                      : assets.upload_area
                  }
                  alt={imageKey}
                />
              </label>
            ))}
          </div>

          {errors.images && (
            <p className="text-sm text-red-500 mt-2">{errors.images}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={onChangeHandler}
            className={inputClass("name")}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="description">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={onChangeHandler}
            className={`${inputClass("description")} resize-none`}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChangeHandler}
            className={inputClass("category")}
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="subCategory">
            Subcategory
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={onChangeHandler}
            className={inputClass("subCategory")}
          >
            <option value="">Select Subcategory</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
          {errors.subCategory && (
            <p className="text-sm text-red-500">{errors.subCategory}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">Product Sizes</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const selected = formData.sizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeToggle(size)}
                  className={`px-4 py-2 rounded border text-sm font-medium cursor-pointer transition ${
                    selected
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {errors.sizes && (
            <p className="text-sm text-red-500">{errors.sizes}</p>
          )}
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="price">
              Product Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="0"
              value={formData.price}
              onChange={onChangeHandler}
              className={inputClass("price")}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="bestseller"
            name="bestseller"
            type="checkbox"
            checked={formData.bestseller}
            onChange={onChangeHandler}
            className="w-4 h-4 cursor-pointer"
          />
          <label
            htmlFor="bestseller"
            className="text-base font-medium cursor-pointer"
          >
            Add to Bestseller
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-black text-white font-medium rounded cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? "ADDING..." : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
