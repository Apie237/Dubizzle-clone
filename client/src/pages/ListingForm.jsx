import React, { useState, useEffect } from "react";
import api from "../utils/api";

const ListingForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: { main: "", sub: "", type: "" },
    specs: {},
  });

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);

  // Fetch main categories
  useEffect(() => {
    api.get("/categories").then((res) => setMainCategories(res.data));
  }, []);

  // Fetch subcategories when main changes
  useEffect(() => {
    if (!form.category.main) return setSubCategories([]);

    api.get(`/categories/${form.category.main}/children`)
      .then((res) => setSubCategories(res.data));

    setForm(prev => ({ ...prev, category: { ...prev.category, sub: "", type: "" } }));
    setDynamicFields([]);
    setForm(prev => ({ ...prev, specs: {} }));
  }, [form.category.main]);

  // Fetch dynamic fields when subcategory changes
  useEffect(() => {
    if (!form.category.sub) return setDynamicFields([]);

    api.get(`/categories/${form.category.sub}/fields`)
      .then((res) => setDynamicFields(res.data));
    
    setForm(prev => ({ ...prev, specs: {} }));
  }, [form.category.sub]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category.main || !form.category.sub) {
      alert("Please complete required fields.");
      return;
    }

    // Normalize payload
    const payload = {
      ...form,
      price: Number(form.price),
      category: {
        main: form.category.main,
        sub: form.category.sub,
        type: form.category.type || "",
      },
      specs: Object.fromEntries(
        Object.entries(form.specs).map(([k,v]) => [k, isNaN(v) ? v : Number(v)])
      )
    };

    onSubmit(payload);
  };

  return (
    <form className="p-6 bg-white shadow rounded space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      {/* Main category */}
      <select
        className="w-full p-2 border rounded"
        value={form.category.main}
        onChange={(e) => setForm({...form, category: {...form.category, main: e.target.value}})}
      >
        <option value="">Select Category</option>
        {mainCategories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {/* Subcategory */}
      {subCategories.length > 0 && (
        <select
          className="w-full p-2 border rounded"
          value={form.category.sub}
          onChange={(e) => setForm({...form, category: {...form.category, sub: e.target.value}})}
        >
          <option value="">Select Subcategory</option>
          {subCategories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      )}

      {/* Dynamic fields */}
      {dynamicFields.map(field => (
        <input
          key={field.name}
          className="w-full p-2 border rounded"
          type={field.type}
          placeholder={field.label}
          value={form.specs[field.name] || ""}
          onChange={(e) => setForm({
            ...form,
            specs: {...form.specs, [field.name]: e.target.value}
          })}
        />
      ))}

      <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit Listing
      </button>
    </form>
  );
};

export default ListingForm;
