"use client";

export default function EstimatorForm() {

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const house = {
      square_footage: Number(formData.get("square_footage")),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      year_built: Number(formData.get("year_built")),
      lot_size: Number(formData.get("lot_size")),
      distance_to_city_center: Number(
        formData.get("distance_to_city_center"),
      ),
      school_rating: Number(formData.get("school_rating")),
    };

    console.log({
      houses: [house],
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="square_footage">Square Footage</label>

        <input
          id="square_footage"
          name="square_footage"
          type="number"
          min="1"
          required
        />
      </div>

      <div>
      <label htmlFor="bedrooms">Bedrooms</label>
      <input
          id="bedrooms"
          name="bedrooms"
          type="number"
          min="1"
          step="1"
          required
      />
      </div>

      <div>
      <label htmlFor="bathrooms">Bathrooms</label>
      <input
          id="bathrooms"
          name="bathrooms"
          type="number"
          min="0.5"
          step="0.5"
          required
      />
      </div>

      <div>
      <label htmlFor="year_built">Year Built</label>
      <input
          id="year_built"
          name="year_built"
          type="number"
          min="1800"
          max="2026"
          step="1"
          required
      />
      </div>

      <div>
      <label htmlFor="lot_size">Lot Size</label>
      <input
          id="lot_size"
          name="lot_size"
          type="number"
          min="1"
          required
      />
      </div>

      <div>
      <label htmlFor="distance_to_city_center">
          Distance to City Center
      </label>
      <input
          id="distance_to_city_center"
          name="distance_to_city_center"
          type="number"
          min="0"
          step="0.1"
          required
      />
      </div>

      <div>
      <label htmlFor="school_rating">School Rating</label>
      <input
          id="school_rating"
          name="school_rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          required
      />
      </div>

      <button type="submit">Estimate Value</button>
    </form>
  );
}