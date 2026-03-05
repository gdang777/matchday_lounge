import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from './AuthContext';

type SavedVenueId = string;

type SavedVenuesContextValue = {
    savedIds: Set<SavedVenueId>;
    isLoading: boolean;
    save: (restaurantId: string) => void;
    unsave: (restaurantId: string) => void;
};

const SavedVenuesContext = createContext<SavedVenuesContextValue>({
    savedIds: new Set(),
    isLoading: false,
    save: () => { },
    unsave: () => { },
});

type SavedVenue = { id: string;[key: string]: unknown };

export function SavedVenuesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: venues = [], isLoading } = useQuery<SavedVenue[]>({
        queryKey: ['saved-venues'],
        queryFn: async () => {
            const res = await api.get<SavedVenue[]>('/api/users/saved-venues');
            return res.data;
        },
        enabled: !!user,
        staleTime: 60_000,
    });

    const savedIds = new Set(venues.map(v => v.id));

    const saveMutation = useMutation({
        mutationFn: (restaurantId: string) =>
            api.post(`/api/users/saved-venues/${restaurantId}`),
        onMutate: async (restaurantId) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['saved-venues'] });
            const prev = queryClient.getQueryData<SavedVenue[]>(['saved-venues']) ?? [];
            queryClient.setQueryData<SavedVenue[]>(['saved-venues'], [
                ...prev,
                { id: restaurantId } as SavedVenue,
            ]);
            return { prev };
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(['saved-venues'], ctx.prev);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['saved-venues'] }),
    });

    const unsaveMutation = useMutation({
        mutationFn: (restaurantId: string) =>
            api.delete(`/api/users/saved-venues/${restaurantId}`),
        onMutate: async (restaurantId) => {
            await queryClient.cancelQueries({ queryKey: ['saved-venues'] });
            const prev = queryClient.getQueryData<SavedVenue[]>(['saved-venues']) ?? [];
            queryClient.setQueryData<SavedVenue[]>(
                ['saved-venues'],
                prev.filter(v => v.id !== restaurantId),
            );
            return { prev };
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.prev) queryClient.setQueryData(['saved-venues'], ctx.prev);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['saved-venues'] }),
    });

    return (
        <SavedVenuesContext.Provider
            value={{
                savedIds,
                isLoading,
                save: (id) => saveMutation.mutate(id),
                unsave: (id) => unsaveMutation.mutate(id),
            }}
        >
            {children}
        </SavedVenuesContext.Provider>
    );
}

export function useSavedVenues() {
    return useContext(SavedVenuesContext);
}
