# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateRestaurant, useUpdateRestaurant, useCreatePromotion, useUpdatePromotion, useTogglePromotionActive, useRecordVenueView, useSaveVenue, useGetRestaurantsByCity, useGetActivePromotionsByRestaurant, useGetActiveHappyHoursNow } from '@dataconnect/matchday/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateRestaurant(createRestaurantVars);

const { data, isPending, isSuccess, isError, error } = useUpdateRestaurant(updateRestaurantVars);

const { data, isPending, isSuccess, isError, error } = useCreatePromotion(createPromotionVars);

const { data, isPending, isSuccess, isError, error } = useUpdatePromotion(updatePromotionVars);

const { data, isPending, isSuccess, isError, error } = useTogglePromotionActive(togglePromotionActiveVars);

const { data, isPending, isSuccess, isError, error } = useRecordVenueView(recordVenueViewVars);

const { data, isPending, isSuccess, isError, error } = useSaveVenue(saveVenueVars);

const { data, isPending, isSuccess, isError, error } = useGetRestaurantsByCity(getRestaurantsByCityVars);

const { data, isPending, isSuccess, isError, error } = useGetActivePromotionsByRestaurant(getActivePromotionsByRestaurantVars);

const { data, isPending, isSuccess, isError, error } = useGetActiveHappyHoursNow(getActiveHappyHoursNowVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createRestaurant, updateRestaurant, createPromotion, updatePromotion, togglePromotionActive, recordVenueView, saveVenue, getRestaurantsByCity, getActivePromotionsByRestaurant, getActiveHappyHoursNow } from '@dataconnect/matchday';


// Operation CreateRestaurant:  For variables, look at type CreateRestaurantVars in ../index.d.ts
const { data } = await CreateRestaurant(dataConnect, createRestaurantVars);

// Operation UpdateRestaurant:  For variables, look at type UpdateRestaurantVars in ../index.d.ts
const { data } = await UpdateRestaurant(dataConnect, updateRestaurantVars);

// Operation CreatePromotion:  For variables, look at type CreatePromotionVars in ../index.d.ts
const { data } = await CreatePromotion(dataConnect, createPromotionVars);

// Operation UpdatePromotion:  For variables, look at type UpdatePromotionVars in ../index.d.ts
const { data } = await UpdatePromotion(dataConnect, updatePromotionVars);

// Operation TogglePromotionActive:  For variables, look at type TogglePromotionActiveVars in ../index.d.ts
const { data } = await TogglePromotionActive(dataConnect, togglePromotionActiveVars);

// Operation RecordVenueView:  For variables, look at type RecordVenueViewVars in ../index.d.ts
const { data } = await RecordVenueView(dataConnect, recordVenueViewVars);

// Operation SaveVenue:  For variables, look at type SaveVenueVars in ../index.d.ts
const { data } = await SaveVenue(dataConnect, saveVenueVars);

// Operation GetRestaurantsByCity:  For variables, look at type GetRestaurantsByCityVars in ../index.d.ts
const { data } = await GetRestaurantsByCity(dataConnect, getRestaurantsByCityVars);

// Operation GetActivePromotionsByRestaurant:  For variables, look at type GetActivePromotionsByRestaurantVars in ../index.d.ts
const { data } = await GetActivePromotionsByRestaurant(dataConnect, getActivePromotionsByRestaurantVars);

// Operation GetActiveHappyHoursNow:  For variables, look at type GetActiveHappyHoursNowVars in ../index.d.ts
const { data } = await GetActiveHappyHoursNow(dataConnect, getActiveHappyHoursNowVars);


```