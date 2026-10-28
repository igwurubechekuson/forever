/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/frontend_assets/assets";
import RelatedProducts from "../../components/related-products/RelatedProducts";
import { toast } from "react-hot-toast";

const Product = () => {
  const { productId } = useParams();

  const {
    products,
    currency,
    addToCart,
    getProductReviews,
    addProductReview,
    deleteProductReview,
    token,
    navigate,
  } = useContext(AppContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    rating: 0,
    reviewCount: 0,
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const foundProduct = products.find((item) => item._id === productId);

    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image?.[0] || "");
      setSize("");
    } else {
      setProductData(null);
      setImage("");
      setSize("");
    }
  }, [productId, products]);

  const fetchReviews = async () => {
    if (!productId) return;

    setReviewLoading(true);
    const result = await getProductReviews(productId);

    setReviews(result?.reviews || []);
    setReviewStats(
      result?.stats || {
        rating: 0,
        reviewCount: 0,
      }
    );
    setReviewLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    addToCart(productData._id, size);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to leave a review");
      navigate("/login");
      return;
    }

    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      toast.error("Please select a valid rating");
      return;
    }

    if (!commentInput.trim()) {
      toast.error("Please enter your review comment");
      return;
    }

    setSubmittingReview(true);

    const response = await addProductReview({
      productId,
      rating: ratingInput,
      comment: commentInput.trim(),
    });

    if (response?.success) {
      setCommentInput("");
      setRatingInput(5);
      await fetchReviews();
    }

    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) return;

    const response = await deleteProductReview(reviewId);

    if (response?.success) {
      await fetchReviews();
    }
  };

  const averageRating = useMemo(() => {
    if (typeof reviewStats?.rating === "number") return reviewStats.rating;
    if (typeof productData?.rating === "number") return productData.rating;
    return 0;
  }, [reviewStats, productData]);

  const totalReviews = useMemo(() => {
    if (typeof reviewStats?.reviewCount === "number") {
      return reviewStats.reviewCount;
    }
    if (typeof productData?.reviewCount === "number") {
      return productData.reviewCount;
    }
    return 0;
  }, [reviewStats, productData]);

  const renderStars = (ratingValue) => {
    const rounded = Math.round(ratingValue || 0);

    return [...Array(5)].map((_, index) => (
      <img
        key={index}
        className="w-4 h-4"
        src={index < rounded ? assets.star_icon : assets.star_dull_icon}
        alt="star"
      />
    ));
  };

  if (!productData) {
    return <div className="pt-10 text-center">Product not found.</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-10 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[18.7%] w-full gap-3">
            {productData.image?.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer border ${
                  image === item ? "border-orange-500" : "border-gray-200"
                }`}
                alt={productData.name}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto object-cover"
              src={image}
              alt={productData.name}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl md:text-3xl mt-2 text-gray-900">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            {renderStars(averageRating)}
            <p className="pl-2 text-sm text-gray-600">
              ({totalReviews} review{totalReviews === 1 ? "" : "s"})
            </p>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Average rating: {Number(averageRating || 0).toFixed(1)} / 5
          </p>

          <p className="mt-5 text-3xl font-semibold text-gray-900">
            {currency}
            {productData.price.toLocaleString()}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5 leading-7">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium text-gray-800">Select Size</p>

            <div className="flex flex-wrap gap-3">
              {productData.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border px-4 py-2 text-sm rounded-sm transition-all duration-200 cursor-pointer ${
                    size === item
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 rounded-sm cursor-pointer"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex flex-wrap">
          <button
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "description"
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`border border-l-0 px-5 py-3 text-sm ${
              activeTab === "reviews"
                ? "bg-black text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Reviews ({totalReviews})
          </button>
        </div>

        <div className="border px-6 py-6 text-sm text-gray-500 leading-7">
          {activeTab === "description" ? (
            <div className="flex flex-col gap-4">
              <p>{productData.description}</p>
              <p>
                This product is crafted for comfort, durability, and everyday
                style.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Review Form */}
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Write a Review
                </h3>

                {!token && (
                  <p className="text-sm text-red-500 mb-3">
                    Please login to leave a review.
                  </p>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>

                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRatingInput(value)}
                          className={`px-4 py-2 border rounded-md text-sm ${
                            ratingInput === value
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {value} Star{value > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>

                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      placeholder="Share your experience with this product"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-black text-white px-6 py-3 rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Customer Reviews
                </h3>

                {reviewLoading ? (
                  <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border rounded-md p-4 bg-white"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.userName}
                            </p>

                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.rating)}
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          {token && (
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        <p className="mt-3 text-sm text-gray-600 leading-6">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductId={productData._id}
      />
    </div>
  );
};

export default Product;