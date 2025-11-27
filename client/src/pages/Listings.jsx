import React, { useEffect, useState } from "react";
import api from "../api";

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.get("/listings").then((res) => setListings(res.data));
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing._id}
          className="bg-white shadow rounded-lg p-4"
        >
          <h2 className="font-bold text-xl">{listing.title}</h2>
          <p className="text-gray-700">Price: ${listing.price}</p>

          <div className="mt-3">
            <h4 className="font-semibold">Specifications:</h4>
            <ul className="text-sm text-gray-600">
              {Object.entries(listing.specs).map(([key, val]) => (
                <li key={key}>
                  <strong>{key}: </strong>{val}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-gray-500 mt-3">
            {listing.category.main} / {listing.category.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Listings;
