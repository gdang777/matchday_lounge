// ProfileTab — view and edit the restaurant's listing details.

import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import type { Restaurant } from '../../pages/DashboardPage';

type Props = {
  restaurant: Restaurant;
  onSaved: () => void;
};

export default function ProfileTab({ restaurant, onSaved }: Props) {
  const [editing, setEditing] = useState(false);

  const [name, setName]               = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description ?? '');
  const [neighborhood, setNeighborhood] = useState(restaurant.neighborhood ?? '');
  const [address, setAddress]         = useState(restaurant.address ?? '');
  const [cuisineType, setCuisineType] = useState(restaurant.cuisineType ?? '');
  const [phoneNumber, setPhoneNumber] = useState(restaurant.phoneNumber ?? '');
  const [website, setWebsite]         = useState(restaurant.website ?? '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(restaurant.googleMapsUrl ?? '');

  const mutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/api/restaurants/${restaurant.id}`, {
        name:          name || null,
        description:   description || null,
        neighborhood:  neighborhood || null,
        address:       address || null,
        cuisineType:   cuisineType || null,
        phoneNumber:   phoneNumber || null,
        website:       website || null,
        googleMapsUrl: googleMapsUrl || null,
      });
    },
    onSuccess: () => {
      setEditing(false);
      onSaved();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  function handleCancel() {
    setEditing(false);
    setName(restaurant.name);
    setDescription(restaurant.description ?? '');
    setNeighborhood(restaurant.neighborhood ?? '');
    setAddress(restaurant.address ?? '');
    setCuisineType(restaurant.cuisineType ?? '');
    setPhoneNumber(restaurant.phoneNumber ?? '');
    setWebsite(restaurant.website ?? '');
    setGoogleMapsUrl(restaurant.googleMapsUrl ?? '');
  }

  if (!editing) {
    return (
      <div className="dashboard-section">
        <div className="page-header">
          <h2>My Listing</h2>
          <button className="btn btn-secondary" onClick={() => setEditing(true)}>
            Edit Details
          </button>
        </div>

        <div className="info-grid">
          <InfoRow label="Restaurant Name"  value={restaurant.name} />
          <InfoRow label="City"             value={restaurant.city === 'VANCOUVER' ? 'Vancouver' : 'Toronto'} />
          <InfoRow label="Neighbourhood"    value={restaurant.neighborhood} />
          <InfoRow label="Address"          value={restaurant.address} />
          <InfoRow label="Cuisine Type"     value={restaurant.cuisineType} />
          <InfoRow label="Phone"            value={restaurant.phoneNumber} />
          <InfoRow label="Website"          value={restaurant.website} link />
          <InfoRow label="Google Maps"      value={restaurant.googleMapsUrl} link />
          <InfoRow label="Description"      value={restaurant.description} multiline />
          <InfoRow label="Boost Tier"       value={restaurant.boostTier} />
          <InfoRow label="Verified"         value={restaurant.isVerified ? 'Yes ✓' : 'Not yet'} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="page-header">
        <h2>Edit Listing</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {mutation.isError && (
          <div className="alert alert-error">
            {(mutation.error as Error)?.message || 'Update failed. Please try again.'}
          </div>
        )}

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="p-name">Restaurant Name <span className="required">*</span></label>
            <input
              id="p-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="p-desc">Description</label>
            <textarea
              id="p-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={1000}
              rows={4}
            />
            <span className="char-count">{description.length}/1000</span>
          </div>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="p-neighborhood">Neighbourhood</label>
              <input
                id="p-neighborhood"
                type="text"
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="p-cuisine">Cuisine Type</label>
              <input
                id="p-cuisine"
                type="text"
                value={cuisineType}
                onChange={e => setCuisineType(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="p-address">Address</label>
            <input
              id="p-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="p-phone">Phone</label>
              <input
                id="p-phone"
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="p-website">Website</label>
              <input
                id="p-website"
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="p-maps">Google Maps URL</label>
            <input
              id="p-maps"
              type="url"
              value={googleMapsUrl}
              onChange={e => setGoogleMapsUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function InfoRow({
  label,
  value,
  link = false,
  multiline = false,
}: {
  label: string;
  value: string | null | undefined;
  link?: boolean;
  multiline?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="info-value link">
          {value}
        </a>
      ) : multiline ? (
        <p className="info-value multiline">{value}</p>
      ) : (
        <span className="info-value">{value}</span>
      )}
    </div>
  );
}
