import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const initialAddressForm = {
  label: "Home",
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: "",
};

const MyProfile = () => {
  const { backendUrl, token, navigate } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [profile, setProfile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [addressForm, setAddressForm] = useState(initialAddressForm);

  const initials = useMemo(() => {
    if (!profileForm.name?.trim()) return "U";
    return profileForm.name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }, [profileForm.name]);

  const fetchProfile = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/v1/user/get-profile`, {
        headers: { token },
      });

      if (data.success) {
        const user = data.user;
        setProfile(user);
        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          avatar: user.avatar || "",
        });
        setAddressForm((prev) => ({
          ...prev,
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      } else {
        toast.error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("fetchProfile error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateProfileForm = () => {
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (profileForm.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return false;
    }

    if (profileForm.phone && profileForm.phone.trim().length < 7) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const validateAddressForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];

    for (const field of requiredFields) {
      if (!addressForm[field]?.trim()) {
        toast.error("All address fields are required");
        return false;
      }
    }

    return true;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    try {
      setSavingProfile(true);

      const { data } = await axios.put(
        `${backendUrl}/api/v1/user/update-profile`,
        {
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim(),
          avatar: profileForm.avatar.trim(),
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        setProfile(data.user);
        setProfileForm({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          avatar: data.user.avatar || "",
        });
        toast.success(data.message || "Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("update profile error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!validateAddressForm()) return;

    try {
      setSavingAddress(true);

      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/address/add`,
        {
          ...addressForm,
          label: addressForm.label.trim(),
          firstName: addressForm.firstName.trim(),
          lastName: addressForm.lastName.trim(),
          email: addressForm.email.trim(),
          street: addressForm.street.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          zipcode: addressForm.zipcode.trim(),
          country: addressForm.country.trim(),
          phone: addressForm.phone.trim(),
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          addresses: data.addresses,
          defaultAddressId: data.defaultAddressId,
        }));
        setAddressForm(initialAddressForm);
        toast.success(data.message || "Address added successfully");
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("add address error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/v1/user/address/${addressId}`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          addresses: data.addresses,
          defaultAddressId: data.defaultAddressId,
        }));
        toast.success(data.message || "Address deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("delete address error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/v1/user/address/default/${addressId}`,
        {},
        {
          headers: { token },
        }
      );

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          addresses: data.addresses,
          defaultAddressId: data.defaultAddressId,
        }));
        toast.success(data.message || "Default address updated");
      } else {
        toast.error(data.message || "Failed to set default address");
      }
    } catch (error) {
      console.error("set default address error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="border-t min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          <p className="mt-4 text-sm text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t bg-gray-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your personal details and saved addresses.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {profileForm.avatar ? (
                  <img
                    src={profileForm.avatar}
                    alt={profileForm.name}
                    className="h-24 w-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold">
                    {initials}
                  </div>
                )}

                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {profile?.name || "User"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {profile?.email || "No email"}
                </p>

                <div className="mt-6 w-full space-y-3 text-left">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile?.phone || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Member since
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Saved addresses
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {profile?.addresses?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your profile details.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      readOnly
                      className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      name="avatar"
                      value={profileForm.avatar}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                      placeholder="Paste image URL"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>

            {/* Address book */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Address Book
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add and manage your delivery addresses.
                </p>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                      placeholder="Home, Office"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={addressForm.firstName}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={addressForm.lastName}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={addressForm.email}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zipcode
                    </label>
                    <input
                      type="text"
                      name="zipcode"
                      value={addressForm.zipcode}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingAddress}
                  className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
                >
                  {savingAddress ? "Saving Address..." : "Add Address"}
                </button>
              </form>

              <div className="mt-8 space-y-4">
                {profile?.addresses?.length > 0 ? (
                  profile.addresses.map((address) => (
                    <div
                      key={address._id}
                      className="rounded-2xl border border-gray-200 p-4 sm:p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-900">
                              {address.label || "Address"}
                            </h3>
                            {address.isDefault && (
                              <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-gray-700">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{address.email}</p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="mt-2 text-sm text-gray-600">
                            {address.street}, {address.city}, {address.state},{" "}
                            {address.zipcode}, {address.country}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {!address.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(address._id)}
                              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Set Default
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(address._id)}
                            className="cursor-pointer rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    No saved addresses yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;