# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `matchday`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/matchday/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetRestaurantsByCity*](#getrestaurantsbycity)
  - [*GetActivePromotionsByRestaurant*](#getactivepromotionsbyrestaurant)
  - [*GetActiveHappyHoursNow*](#getactivehappyhoursnow)
  - [*GetPendingApprovalRestaurants*](#getpendingapprovalrestaurants)
  - [*GetPendingApprovalPromotions*](#getpendingapprovalpromotions)
  - [*GetRestaurantAnalytics*](#getrestaurantanalytics)
- [**Mutations**](#mutations)
  - [*CreateRestaurant*](#createrestaurant)
  - [*UpdateRestaurant*](#updaterestaurant)
  - [*CreatePromotion*](#createpromotion)
  - [*UpdatePromotion*](#updatepromotion)
  - [*TogglePromotionActive*](#togglepromotionactive)
  - [*RecordVenueView*](#recordvenueview)
  - [*SaveVenue*](#savevenue)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `matchday`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `matchday`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/matchday';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/matchday';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `matchday` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetRestaurantsByCity
You can execute the `GetRestaurantsByCity` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetRestaurantsByCity(dc: DataConnect, vars: GetRestaurantsByCityVariables, options?: useDataConnectQueryOptions<GetRestaurantsByCityData>): UseDataConnectQueryResult<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetRestaurantsByCity(vars: GetRestaurantsByCityVariables, options?: useDataConnectQueryOptions<GetRestaurantsByCityData>): UseDataConnectQueryResult<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
```

### Variables
The `GetRestaurantsByCity` Query requires an argument of type `GetRestaurantsByCityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetRestaurantsByCityVariables {
  city: City;
}
```
### Return Type
Recall that calling the `GetRestaurantsByCity` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetRestaurantsByCity` Query is of type `GetRestaurantsByCityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetRestaurantsByCityData {
  restaurants: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    city: City;
    neighborhood?: string | null;
    address?: string | null;
    cuisineType?: string | null;
    phoneNumber?: string | null;
    website?: string | null;
    googleMapsUrl?: string | null;
    photoUrls?: string | null;
    boostTier: BoostTier;
    isVerified: boolean;
  } & Restaurant_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetRestaurantsByCity`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetRestaurantsByCityVariables } from '@dataconnect/matchday';
import { useGetRestaurantsByCity } from '@dataconnect/matchday/react'

export default function GetRestaurantsByCityComponent() {
  // The `useGetRestaurantsByCity` Query hook requires an argument of type `GetRestaurantsByCityVariables`:
  const getRestaurantsByCityVars: GetRestaurantsByCityVariables = {
    city: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetRestaurantsByCity(getRestaurantsByCityVars);
  // Variables can be defined inline as well.
  const query = useGetRestaurantsByCity({ city: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetRestaurantsByCity(dataConnect, getRestaurantsByCityVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetRestaurantsByCity(getRestaurantsByCityVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetRestaurantsByCity(dataConnect, getRestaurantsByCityVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.restaurants);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetActivePromotionsByRestaurant
You can execute the `GetActivePromotionsByRestaurant` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetActivePromotionsByRestaurant(dc: DataConnect, vars: GetActivePromotionsByRestaurantVariables, options?: useDataConnectQueryOptions<GetActivePromotionsByRestaurantData>): UseDataConnectQueryResult<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetActivePromotionsByRestaurant(vars: GetActivePromotionsByRestaurantVariables, options?: useDataConnectQueryOptions<GetActivePromotionsByRestaurantData>): UseDataConnectQueryResult<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
```

### Variables
The `GetActivePromotionsByRestaurant` Query requires an argument of type `GetActivePromotionsByRestaurantVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetActivePromotionsByRestaurantVariables {
  restaurantId: UUIDString;
}
```
### Return Type
Recall that calling the `GetActivePromotionsByRestaurant` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetActivePromotionsByRestaurant` Query is of type `GetActivePromotionsByRestaurantData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetActivePromotionsByRestaurantData {
  promotions: ({
    id: UUIDString;
    name: string;
    description: string;
    dealType: DealType;
    daysOfWeek: string;
    startTime: string;
    endTime: string;
    source: PromotionSource;
  } & Promotion_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetActivePromotionsByRestaurant`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetActivePromotionsByRestaurantVariables } from '@dataconnect/matchday';
import { useGetActivePromotionsByRestaurant } from '@dataconnect/matchday/react'

export default function GetActivePromotionsByRestaurantComponent() {
  // The `useGetActivePromotionsByRestaurant` Query hook requires an argument of type `GetActivePromotionsByRestaurantVariables`:
  const getActivePromotionsByRestaurantVars: GetActivePromotionsByRestaurantVariables = {
    restaurantId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetActivePromotionsByRestaurant(getActivePromotionsByRestaurantVars);
  // Variables can be defined inline as well.
  const query = useGetActivePromotionsByRestaurant({ restaurantId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetActivePromotionsByRestaurant(dataConnect, getActivePromotionsByRestaurantVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetActivePromotionsByRestaurant(getActivePromotionsByRestaurantVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetActivePromotionsByRestaurant(dataConnect, getActivePromotionsByRestaurantVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.promotions);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetActiveHappyHoursNow
You can execute the `GetActiveHappyHoursNow` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetActiveHappyHoursNow(dc: DataConnect, vars: GetActiveHappyHoursNowVariables, options?: useDataConnectQueryOptions<GetActiveHappyHoursNowData>): UseDataConnectQueryResult<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetActiveHappyHoursNow(vars: GetActiveHappyHoursNowVariables, options?: useDataConnectQueryOptions<GetActiveHappyHoursNowData>): UseDataConnectQueryResult<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
```

### Variables
The `GetActiveHappyHoursNow` Query requires an argument of type `GetActiveHappyHoursNowVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetActiveHappyHoursNowVariables {
  city: City;
  currentDay: string;
  currentTime: string;
}
```
### Return Type
Recall that calling the `GetActiveHappyHoursNow` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetActiveHappyHoursNow` Query is of type `GetActiveHappyHoursNowData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetActiveHappyHoursNowData {
  promotions: ({
    id: UUIDString;
    name: string;
    description: string;
    dealType: DealType;
    startTime: string;
    endTime: string;
    daysOfWeek: string;
    restaurant: {
      id: UUIDString;
      name: string;
      address?: string | null;
      neighborhood?: string | null;
      city: City;
      boostTier: BoostTier;
      photoUrls?: string | null;
      googleMapsUrl?: string | null;
      isVerified: boolean;
    } & Restaurant_Key;
  } & Promotion_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetActiveHappyHoursNow`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetActiveHappyHoursNowVariables } from '@dataconnect/matchday';
import { useGetActiveHappyHoursNow } from '@dataconnect/matchday/react'

export default function GetActiveHappyHoursNowComponent() {
  // The `useGetActiveHappyHoursNow` Query hook requires an argument of type `GetActiveHappyHoursNowVariables`:
  const getActiveHappyHoursNowVars: GetActiveHappyHoursNowVariables = {
    city: ..., 
    currentDay: ..., 
    currentTime: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetActiveHappyHoursNow(getActiveHappyHoursNowVars);
  // Variables can be defined inline as well.
  const query = useGetActiveHappyHoursNow({ city: ..., currentDay: ..., currentTime: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetActiveHappyHoursNow(dataConnect, getActiveHappyHoursNowVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetActiveHappyHoursNow(getActiveHappyHoursNowVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetActiveHappyHoursNow(dataConnect, getActiveHappyHoursNowVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.promotions);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetPendingApprovalRestaurants
You can execute the `GetPendingApprovalRestaurants` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetPendingApprovalRestaurants(dc: DataConnect, options?: useDataConnectQueryOptions<GetPendingApprovalRestaurantsData>): UseDataConnectQueryResult<GetPendingApprovalRestaurantsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetPendingApprovalRestaurants(options?: useDataConnectQueryOptions<GetPendingApprovalRestaurantsData>): UseDataConnectQueryResult<GetPendingApprovalRestaurantsData, undefined>;
```

### Variables
The `GetPendingApprovalRestaurants` Query has no variables.
### Return Type
Recall that calling the `GetPendingApprovalRestaurants` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetPendingApprovalRestaurants` Query is of type `GetPendingApprovalRestaurantsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetPendingApprovalRestaurantsData {
  restaurants: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    city: City;
    neighborhood?: string | null;
    address?: string | null;
    cuisineType?: string | null;
    phoneNumber?: string | null;
    website?: string | null;
    ownerUserId: string;
    createdAt: TimestampString;
  } & Restaurant_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetPendingApprovalRestaurants`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/matchday';
import { useGetPendingApprovalRestaurants } from '@dataconnect/matchday/react'

export default function GetPendingApprovalRestaurantsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetPendingApprovalRestaurants();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetPendingApprovalRestaurants(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetPendingApprovalRestaurants(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetPendingApprovalRestaurants(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.restaurants);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetPendingApprovalPromotions
You can execute the `GetPendingApprovalPromotions` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetPendingApprovalPromotions(dc: DataConnect, options?: useDataConnectQueryOptions<GetPendingApprovalPromotionsData>): UseDataConnectQueryResult<GetPendingApprovalPromotionsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetPendingApprovalPromotions(options?: useDataConnectQueryOptions<GetPendingApprovalPromotionsData>): UseDataConnectQueryResult<GetPendingApprovalPromotionsData, undefined>;
```

### Variables
The `GetPendingApprovalPromotions` Query has no variables.
### Return Type
Recall that calling the `GetPendingApprovalPromotions` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetPendingApprovalPromotions` Query is of type `GetPendingApprovalPromotionsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetPendingApprovalPromotionsData {
  promotions: ({
    id: UUIDString;
    name: string;
    description: string;
    dealType: DealType;
    daysOfWeek: string;
    startTime: string;
    endTime: string;
    source: PromotionSource;
    submittedByUserId?: string | null;
    flagCount: number;
    createdAt: TimestampString;
    restaurant: {
      id: UUIDString;
      name: string;
      city: City;
      neighborhood?: string | null;
    } & Restaurant_Key;
  } & Promotion_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetPendingApprovalPromotions`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/matchday';
import { useGetPendingApprovalPromotions } from '@dataconnect/matchday/react'

export default function GetPendingApprovalPromotionsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetPendingApprovalPromotions();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetPendingApprovalPromotions(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetPendingApprovalPromotions(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetPendingApprovalPromotions(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.promotions);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetRestaurantAnalytics
You can execute the `GetRestaurantAnalytics` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetRestaurantAnalytics(dc: DataConnect, vars: GetRestaurantAnalyticsVariables, options?: useDataConnectQueryOptions<GetRestaurantAnalyticsData>): UseDataConnectQueryResult<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetRestaurantAnalytics(vars: GetRestaurantAnalyticsVariables, options?: useDataConnectQueryOptions<GetRestaurantAnalyticsData>): UseDataConnectQueryResult<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
```

### Variables
The `GetRestaurantAnalytics` Query requires an argument of type `GetRestaurantAnalyticsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetRestaurantAnalyticsVariables {
  restaurantId: UUIDString;
  startDate: TimestampString;
  endDate: TimestampString;
}
```
### Return Type
Recall that calling the `GetRestaurantAnalytics` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetRestaurantAnalytics` Query is of type `GetRestaurantAnalyticsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetRestaurantAnalyticsData {
  venueViews: ({
    id: UUIDString;
    viewType: ViewType;
    city: City;
    userId?: string | null;
    createdAt: TimestampString;
  } & VenueView_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetRestaurantAnalytics`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetRestaurantAnalyticsVariables } from '@dataconnect/matchday';
import { useGetRestaurantAnalytics } from '@dataconnect/matchday/react'

export default function GetRestaurantAnalyticsComponent() {
  // The `useGetRestaurantAnalytics` Query hook requires an argument of type `GetRestaurantAnalyticsVariables`:
  const getRestaurantAnalyticsVars: GetRestaurantAnalyticsVariables = {
    restaurantId: ..., 
    startDate: ..., 
    endDate: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetRestaurantAnalytics(getRestaurantAnalyticsVars);
  // Variables can be defined inline as well.
  const query = useGetRestaurantAnalytics({ restaurantId: ..., startDate: ..., endDate: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetRestaurantAnalytics(dataConnect, getRestaurantAnalyticsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetRestaurantAnalytics(getRestaurantAnalyticsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetRestaurantAnalytics(dataConnect, getRestaurantAnalyticsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.venueViews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `matchday` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateRestaurant
You can execute the `CreateRestaurant` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateRestaurant(options?: useDataConnectMutationOptions<CreateRestaurantData, FirebaseError, CreateRestaurantVariables>): UseDataConnectMutationResult<CreateRestaurantData, CreateRestaurantVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateRestaurant(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRestaurantData, FirebaseError, CreateRestaurantVariables>): UseDataConnectMutationResult<CreateRestaurantData, CreateRestaurantVariables>;
```

### Variables
The `CreateRestaurant` Mutation requires an argument of type `CreateRestaurantVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateRestaurantVariables {
  ownerUserId: string;
  name: string;
  description?: string | null;
  city: City;
  neighborhood?: string | null;
  address?: string | null;
  cuisineType?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
  photoUrls?: string | null;
}
```
### Return Type
Recall that calling the `CreateRestaurant` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateRestaurant` Mutation is of type `CreateRestaurantData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateRestaurantData {
  restaurant_insert: Restaurant_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateRestaurant`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateRestaurantVariables } from '@dataconnect/matchday';
import { useCreateRestaurant } from '@dataconnect/matchday/react'

export default function CreateRestaurantComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateRestaurant();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateRestaurant(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateRestaurant(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateRestaurant(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateRestaurant` Mutation requires an argument of type `CreateRestaurantVariables`:
  const createRestaurantVars: CreateRestaurantVariables = {
    ownerUserId: ..., 
    name: ..., 
    description: ..., // optional
    city: ..., 
    neighborhood: ..., // optional
    address: ..., // optional
    cuisineType: ..., // optional
    phoneNumber: ..., // optional
    website: ..., // optional
    googleMapsUrl: ..., // optional
    photoUrls: ..., // optional
  };
  mutation.mutate(createRestaurantVars);
  // Variables can be defined inline as well.
  mutation.mutate({ ownerUserId: ..., name: ..., description: ..., city: ..., neighborhood: ..., address: ..., cuisineType: ..., phoneNumber: ..., website: ..., googleMapsUrl: ..., photoUrls: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createRestaurantVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.restaurant_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateRestaurant
You can execute the `UpdateRestaurant` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateRestaurant(options?: useDataConnectMutationOptions<UpdateRestaurantData, FirebaseError, UpdateRestaurantVariables>): UseDataConnectMutationResult<UpdateRestaurantData, UpdateRestaurantVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateRestaurant(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRestaurantData, FirebaseError, UpdateRestaurantVariables>): UseDataConnectMutationResult<UpdateRestaurantData, UpdateRestaurantVariables>;
```

### Variables
The `UpdateRestaurant` Mutation requires an argument of type `UpdateRestaurantVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateRestaurantVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  neighborhood?: string | null;
  address?: string | null;
  cuisineType?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
  photoUrls?: string | null;
}
```
### Return Type
Recall that calling the `UpdateRestaurant` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateRestaurant` Mutation is of type `UpdateRestaurantData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateRestaurantData {
  restaurant_update?: Restaurant_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateRestaurant`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateRestaurantVariables } from '@dataconnect/matchday';
import { useUpdateRestaurant } from '@dataconnect/matchday/react'

export default function UpdateRestaurantComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateRestaurant();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateRestaurant(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRestaurant(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRestaurant(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateRestaurant` Mutation requires an argument of type `UpdateRestaurantVariables`:
  const updateRestaurantVars: UpdateRestaurantVariables = {
    id: ..., 
    name: ..., // optional
    description: ..., // optional
    neighborhood: ..., // optional
    address: ..., // optional
    cuisineType: ..., // optional
    phoneNumber: ..., // optional
    website: ..., // optional
    googleMapsUrl: ..., // optional
    photoUrls: ..., // optional
  };
  mutation.mutate(updateRestaurantVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., description: ..., neighborhood: ..., address: ..., cuisineType: ..., phoneNumber: ..., website: ..., googleMapsUrl: ..., photoUrls: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateRestaurantVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.restaurant_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreatePromotion
You can execute the `CreatePromotion` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreatePromotion(options?: useDataConnectMutationOptions<CreatePromotionData, FirebaseError, CreatePromotionVariables>): UseDataConnectMutationResult<CreatePromotionData, CreatePromotionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreatePromotion(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePromotionData, FirebaseError, CreatePromotionVariables>): UseDataConnectMutationResult<CreatePromotionData, CreatePromotionVariables>;
```

### Variables
The `CreatePromotion` Mutation requires an argument of type `CreatePromotionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreatePromotionVariables {
  restaurantId: UUIDString;
  name: string;
  description: string;
  dealType: DealType;
  daysOfWeek: string;
  startTime: string;
  endTime: string;
  source: PromotionSource;
  isApproved: boolean;
  submittedByUserId?: string | null;
}
```
### Return Type
Recall that calling the `CreatePromotion` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreatePromotion` Mutation is of type `CreatePromotionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreatePromotionData {
  promotion_insert: Promotion_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreatePromotion`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreatePromotionVariables } from '@dataconnect/matchday';
import { useCreatePromotion } from '@dataconnect/matchday/react'

export default function CreatePromotionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreatePromotion();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreatePromotion(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePromotion(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePromotion(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreatePromotion` Mutation requires an argument of type `CreatePromotionVariables`:
  const createPromotionVars: CreatePromotionVariables = {
    restaurantId: ..., 
    name: ..., 
    description: ..., 
    dealType: ..., 
    daysOfWeek: ..., 
    startTime: ..., 
    endTime: ..., 
    source: ..., 
    isApproved: ..., 
    submittedByUserId: ..., // optional
  };
  mutation.mutate(createPromotionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ restaurantId: ..., name: ..., description: ..., dealType: ..., daysOfWeek: ..., startTime: ..., endTime: ..., source: ..., isApproved: ..., submittedByUserId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createPromotionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.promotion_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdatePromotion
You can execute the `UpdatePromotion` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdatePromotion(options?: useDataConnectMutationOptions<UpdatePromotionData, FirebaseError, UpdatePromotionVariables>): UseDataConnectMutationResult<UpdatePromotionData, UpdatePromotionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdatePromotion(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePromotionData, FirebaseError, UpdatePromotionVariables>): UseDataConnectMutationResult<UpdatePromotionData, UpdatePromotionVariables>;
```

### Variables
The `UpdatePromotion` Mutation requires an argument of type `UpdatePromotionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdatePromotionVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  dealType?: DealType | null;
  daysOfWeek?: string | null;
  startTime?: string | null;
  endTime?: string | null;
}
```
### Return Type
Recall that calling the `UpdatePromotion` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdatePromotion` Mutation is of type `UpdatePromotionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdatePromotionData {
  promotion_update?: Promotion_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdatePromotion`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdatePromotionVariables } from '@dataconnect/matchday';
import { useUpdatePromotion } from '@dataconnect/matchday/react'

export default function UpdatePromotionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdatePromotion();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdatePromotion(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdatePromotion(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdatePromotion(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdatePromotion` Mutation requires an argument of type `UpdatePromotionVariables`:
  const updatePromotionVars: UpdatePromotionVariables = {
    id: ..., 
    name: ..., // optional
    description: ..., // optional
    dealType: ..., // optional
    daysOfWeek: ..., // optional
    startTime: ..., // optional
    endTime: ..., // optional
  };
  mutation.mutate(updatePromotionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., description: ..., dealType: ..., daysOfWeek: ..., startTime: ..., endTime: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updatePromotionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.promotion_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## TogglePromotionActive
You can execute the `TogglePromotionActive` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useTogglePromotionActive(options?: useDataConnectMutationOptions<TogglePromotionActiveData, FirebaseError, TogglePromotionActiveVariables>): UseDataConnectMutationResult<TogglePromotionActiveData, TogglePromotionActiveVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useTogglePromotionActive(dc: DataConnect, options?: useDataConnectMutationOptions<TogglePromotionActiveData, FirebaseError, TogglePromotionActiveVariables>): UseDataConnectMutationResult<TogglePromotionActiveData, TogglePromotionActiveVariables>;
```

### Variables
The `TogglePromotionActive` Mutation requires an argument of type `TogglePromotionActiveVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface TogglePromotionActiveVariables {
  id: UUIDString;
  isActive: boolean;
}
```
### Return Type
Recall that calling the `TogglePromotionActive` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `TogglePromotionActive` Mutation is of type `TogglePromotionActiveData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface TogglePromotionActiveData {
  promotion_update?: Promotion_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `TogglePromotionActive`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, TogglePromotionActiveVariables } from '@dataconnect/matchday';
import { useTogglePromotionActive } from '@dataconnect/matchday/react'

export default function TogglePromotionActiveComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useTogglePromotionActive();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useTogglePromotionActive(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useTogglePromotionActive(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useTogglePromotionActive(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useTogglePromotionActive` Mutation requires an argument of type `TogglePromotionActiveVariables`:
  const togglePromotionActiveVars: TogglePromotionActiveVariables = {
    id: ..., 
    isActive: ..., 
  };
  mutation.mutate(togglePromotionActiveVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., isActive: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(togglePromotionActiveVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.promotion_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## RecordVenueView
You can execute the `RecordVenueView` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRecordVenueView(options?: useDataConnectMutationOptions<RecordVenueViewData, FirebaseError, RecordVenueViewVariables>): UseDataConnectMutationResult<RecordVenueViewData, RecordVenueViewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRecordVenueView(dc: DataConnect, options?: useDataConnectMutationOptions<RecordVenueViewData, FirebaseError, RecordVenueViewVariables>): UseDataConnectMutationResult<RecordVenueViewData, RecordVenueViewVariables>;
```

### Variables
The `RecordVenueView` Mutation requires an argument of type `RecordVenueViewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface RecordVenueViewVariables {
  restaurantId: UUIDString;
  userId?: string | null;
  viewType: ViewType;
  city: City;
}
```
### Return Type
Recall that calling the `RecordVenueView` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `RecordVenueView` Mutation is of type `RecordVenueViewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RecordVenueViewData {
  venueView_insert: VenueView_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `RecordVenueView`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RecordVenueViewVariables } from '@dataconnect/matchday';
import { useRecordVenueView } from '@dataconnect/matchday/react'

export default function RecordVenueViewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRecordVenueView();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRecordVenueView(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRecordVenueView(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRecordVenueView(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRecordVenueView` Mutation requires an argument of type `RecordVenueViewVariables`:
  const recordVenueViewVars: RecordVenueViewVariables = {
    restaurantId: ..., 
    userId: ..., // optional
    viewType: ..., 
    city: ..., 
  };
  mutation.mutate(recordVenueViewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ restaurantId: ..., userId: ..., viewType: ..., city: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(recordVenueViewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.venueView_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SaveVenue
You can execute the `SaveVenue` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useSaveVenue(options?: useDataConnectMutationOptions<SaveVenueData, FirebaseError, SaveVenueVariables>): UseDataConnectMutationResult<SaveVenueData, SaveVenueVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useSaveVenue(dc: DataConnect, options?: useDataConnectMutationOptions<SaveVenueData, FirebaseError, SaveVenueVariables>): UseDataConnectMutationResult<SaveVenueData, SaveVenueVariables>;
```

### Variables
The `SaveVenue` Mutation requires an argument of type `SaveVenueVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SaveVenueVariables {
  restaurantId: UUIDString;
}
```
### Return Type
Recall that calling the `SaveVenue` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `SaveVenue` Mutation is of type `SaveVenueData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface SaveVenueData {
  userSavedVenue_insert: UserSavedVenue_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `SaveVenue`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SaveVenueVariables } from '@dataconnect/matchday';
import { useSaveVenue } from '@dataconnect/matchday/react'

export default function SaveVenueComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useSaveVenue();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useSaveVenue(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useSaveVenue(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useSaveVenue(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useSaveVenue` Mutation requires an argument of type `SaveVenueVariables`:
  const saveVenueVars: SaveVenueVariables = {
    restaurantId: ..., 
  };
  mutation.mutate(saveVenueVars);
  // Variables can be defined inline as well.
  mutation.mutate({ restaurantId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(saveVenueVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userSavedVenue_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

