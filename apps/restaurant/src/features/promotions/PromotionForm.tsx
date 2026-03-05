// Form for creating a new promotion. Calls POST /api/restaurants/:id/promotions.

import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';

type Props = {
  restaurantId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
type Day = (typeof DAYS)[number];

const DAY_LABELS: Record<Day, string> = {
  MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu',
  FRI: 'Fri', SAT: 'Sat', SUN: 'Sun',
};

export default function PromotionForm({ restaurantId, onSuccess, onCancel }: Props) {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [dealType, setDealType]       = useState('DRINKS');
  const [selectedDays, setSelectedDays] = useState<Set<Day>>(new Set());
  const [startTime, setStartTime]     = useState('');
  const [endTime, setEndTime]         = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/api/restaurants/${restaurantId}/promotions`, {
        name,
        description,
        dealType,
        daysOfWeek: [...selectedDays].join(','),
        startTime,
        endTime,
      });
    },
    onSuccess,
  });

  function toggleDay(day: Day) {
    setSelectedDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (selectedDays.size === 0) return;
    mutation.mutate();
  }

  const isValid = name.trim() && description.trim() && selectedDays.size > 0 && startTime && endTime;

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>New Promotion</h3>

      {mutation.isError && (
        <div className="alert alert-error">
          {(mutation.error as Error)?.message || 'Failed to create promotion.'}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="promo-name">Promotion Name <span className="required">*</span></label>
        <input
          id="promo-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={200}
          required
          placeholder="e.g. World Cup Happy Hour"
        />
      </div>

      <div className="form-group">
        <label htmlFor="promo-desc">
          Description <span className="required">*</span>
          <span className="char-count">{description.length}/500</span>
        </label>
        <textarea
          id="promo-desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          required
          placeholder="Describe the deal — shown to fans on the app…"
        />
      </div>

      <div className="form-group">
        <label htmlFor="promo-type">Deal Type <span className="required">*</span></label>
        <select id="promo-type" value={dealType} onChange={e => setDealType(e.target.value)}>
          <option value="DRINKS">Drinks</option>
          <option value="FOOD">Food</option>
          <option value="BOTH">Drinks &amp; Food</option>
        </select>
      </div>

      <div className="form-group">
        <label>Days of Week <span className="required">*</span></label>
        <div className="day-picker">
          {DAYS.map(day => (
            <button
              key={day}
              type="button"
              className={`day-btn ${selectedDays.has(day) ? 'selected' : ''}`}
              onClick={() => toggleDay(day)}
            >
              {DAY_LABELS[day]}
            </button>
          ))}
        </div>
        {selectedDays.size === 0 && <span className="field-hint">Select at least one day</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="promo-start">Start Time <span className="required">*</span></label>
          <input
            id="promo-start"
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="promo-end">End Time <span className="required">*</span></label>
          <input
            id="promo-end"
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending || !isValid}>
          {mutation.isPending ? 'Creating…' : 'Create Promotion'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
