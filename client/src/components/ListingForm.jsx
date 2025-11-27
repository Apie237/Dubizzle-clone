import React, { useState, useEffect } from "react";

const ListingForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: { main: "", sub: "" },
    specs: {},
  });

  const [categoryFields, setCategoryFields] = useState([]);

  // Handle category change
  const handleCategoryChange = (key, val) => {
    setForm((prev) => ({
      ...prev,
      category: { ...prev.category, [key]: val },
      specs: {}, // reset specs when category changes
    }));
  };

  // Apply dynamic fields based on category
  useEffect(() => {
    const { main, sub } = form.category;

    if (main === "vehicles" && sub === "cars") {
      setCategoryFields([
        { name: "make", label: "Make", type: "text" },
        { name: "model", label: "Model", type: "text" },
        { name: "year", label: "Year", type: "number" },
        { name: "mileage", label: "Mileage", type: "number" },
        { name: "transmission", label: "Transmission", type: "text" },
      ]);
    } else if (main === "electronics" && sub === "phones") {
      setCategoryFields([
        { name: "brand", label: "Brand", type: "text" },
        { name: "model", label: "Model", type: "text" },
        { name: "storage", label: "Storage", type: "text" },
        { name: "color", label: "Color", type: "text" },
      ]);
    } else {
      setCategoryFields([]);
    }
  }, [form.category.main, form.category.sub]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // CLIENT-SIDE VALIDATION
    if (!form.title || !form.price || !form.category.main || !form.category.sub) {
      alert("Please complete all required fields.");
      return;
    }

    // Send valid data upward
    onSubmit(form);
  };

  return (
    <form className="p-6 bg-white shadow rounded space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />

      <input
        className="w-full p-2 border rounded"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        required
      />

      {/* MAIN CATEGORY */}
      <select
        className="w-full p-2 border rounded"
        value={form.category.main}
        onChange={(e) => handleCategoryChange("main", e.target.value)}
        required
      >
        <option value="">Select Main Category</option>
        <option value="vehicles">Vehicles</option>
        <option value="electronics">Electronics</option>
      </select>

      {/* SUB CATEGORY */}
      {form.category.main && (
        <select
          className="w-full p-2 border rounded"
          value={form.category.sub}
          onChange={(e) => handleCategoryChange("sub", e.target.value)}
          required
        >
          <option value="">Select Sub Category</option>

          {form.category.main === "vehicles" && (
            <>
              <option value="cars">Cars</option>
              <option value="motorcycles">Motorcycles</option>
            </>
          )}

          {form.category.main === "electronics" && (
            <>
              <option value="phones">Phones</option>
            </>
          )}
        </select>
      )}

      {/* Dynamic Specs */}
      {categoryFields.map((field) => (
        <input
          key={field.name}
          className="w-full p-2 border rounded"
          type={field.type}
          placeholder={field.label}
          value={form.specs[field.name] || ""}
          onChange={(e) =>
            setForm({
              ...form,
              specs: { ...form.specs, [field.name]: e.target.value },
            })
          }
        />
      ))}

      <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
        Submit Listing
      </button>
    </form>
  );
};

export default ListingForm;
