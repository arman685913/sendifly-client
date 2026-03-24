import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import warehouses from "../../assets/warehouses.json";

// leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Coverage = () => {

  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const [search, setSearch] = useState("");

  const center = [23.685, 90.3563];

  const handleSearch = (e) => {

    const value = e.target.value;
    setSearch(value);

    if (!mapRef.current) return;

    const found = warehouses.find((districts) =>
      districts.district.toLowerCase().includes(value.toLowerCase())
    );

    if (found) {

      mapRef.current.flyTo(
        [found.latitude, found.longitude],
        12,
        { duration: 1.5 }
      );

      const marker = markerRefs.current[found.district];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="py-16 px-4">

      <h1 className="text-4xl font-bold text-center mb-8">
        We are available in 64 districts
      </h1>

      {/* SEARCH BOX */}

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search your district..."
          className="input input-bordered w-full"
        />
      </div>

      {/* MAP */}

      <div className="max-w-6xl mx-auto h-[550px] rounded-xl overflow-hidden shadow-lg">

        <MapContainer
          center={center}
          zoom={7}
          scrollWheelZoom={true}
          className="w-full h-full"
          ref={mapRef}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* MARKERS */}

          {warehouses.map((location, index) => (

            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              ref={(ref) => {
                markerRefs.current[location.district] = ref;
              }}
            >

              <Popup>

                <div className="space-y-1">

                  <h2 className="font-bold text-lg">
                    {location.district}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Region: {location.region}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    Covered Areas
                  </p>

                  <ul className="list-disc ml-4 text-sm">
                    {location.covered_area.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>

                </div>

              </Popup>

            </Marker>

          ))}

        </MapContainer>

      </div>

    </div>
  );
};

export default Coverage;