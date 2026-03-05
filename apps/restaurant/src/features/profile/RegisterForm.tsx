// First-time restaurant registration form.
// On submit calls POST /api/restaurants, then notifies parent to refetch.

import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';

type Props = { onSuccess: () => void };


export default function RegisterForm({ onSuccess }: Props) {
  const [name, setName]               = useState('');
  const [city, setCity]               = useState('VANCOUVER');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress]         = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite]         = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/restaurants', {
        name, city, description: description || null,
        neighborhood: neighborhood || null,
        address: address || null,
        cuisineType: cuisineType || null,
        phoneNumber: phoneNumber || null,
        website: website || null,
        googleMapsUrl: googleMapsUrl || null,
      });
    },
    onSuccess,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      {mutation.isError && (
        <div className="alert alert-error">
          {(mutation.error as Error)?.message || 'Submission failed. Please try again.'}
        </div>
      )}

      <div className="form-section">
        <h3>Basic Information</h3>

        <div className="form-group">
          <label htmlFor="r-name">Restaurant Name <span className="required">*</span></label>
          <input
            id="r-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={200}
            required
            placeholder="e.g. The Granville Sports Bar"
          />
        </div>

        <div className="form-group">
          <label htmlFor="r-city">City <span className="required">*</span></label>
          <select id="r-city" value={city} onChange={e => setCity(e.target.value)}>
            <option value="VANCOUVER">Vancouver</option>
            <option value="TORONTO">Toronto</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="r-desc">Description</label>
          <textarea
            id="r-desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Tell fans what makes your venue great for World Cup viewing…"
          />
          <span className="char-count">{description.length}/1000</span>
        </div>
      </div>

      <div className="form-section">
        <h3>Location &amp; Contact</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="r-neighborhood">Neighbourhood</label>
            <input
              id="r-neighborhood"
              type="text"
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
              placeholder="e.g. Gastown"
            />
          </div>
          <div className="form-group">
            <label htmlFor="r-cuisine">Cuisine Type</label>
            <input
              id="r-cuisine"
              type="text"
              value={cuisineType}
              onChange={e => setCuisineType(e.target.value)}
              placeholder="e.g. Canadian, Pub Food"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="r-address">Street Address</label>
          <input
            id="r-address"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="123 Main St, Vancouver, BC"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="r-phone">Phone Number</label>
            <input
              id="r-phone"
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+1 604-555-0100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="r-website">Website URL</label>
            <input
              id="r-website"
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yourrestaurant.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="r-maps">Google Maps URL</label>
          <input
            id="r-maps"
            type="url"
            value={googleMapsUrl}
            onChange={e => setGoogleMapsUrl(e.target.value)}
            placeholder="https://maps.google.com/…"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={mutation.isPending || !name.trim()}
        >
          {mutation.isPending ? 'Submitting…' : 'Submit for Approval'}
        </button>
        <p className="text-muted form-note">
          Your listing will be reviewed by our team and go live within 1–2 business days.
        </p>
      </div>

      {/* unused DAYS import suppressor */}
      {DAYS.length === 0 && null}
    </form>
  );
}
