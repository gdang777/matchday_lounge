# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `matchday`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
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

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `matchday`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/matchday` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/matchday';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/matchday';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `matchday` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetRestaurantsByCity
You can execute the `GetRestaurantsByCity` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRestaurantsByCity(vars: GetRestaurantsByCityVariables): QueryPromise<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;

interface GetRestaurantsByCityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRestaurantsByCityVariables): QueryRef<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
}
export const getRestaurantsByCityRef: GetRestaurantsByCityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRestaurantsByCity(dc: DataConnect, vars: GetRestaurantsByCityVariables): QueryPromise<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;

interface GetRestaurantsByCityRef {
  ...
  (dc: DataConnect, vars: GetRestaurantsByCityVariables): QueryRef<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
}
export const getRestaurantsByCityRef: GetRestaurantsByCityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRestaurantsByCityRef:
```typescript
const name = getRestaurantsByCityRef.operationName;
console.log(name);
```

### Variables
The `GetRestaurantsByCity` query requires an argument of type `GetRestaurantsByCityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRestaurantsByCityVariables {
  city: City;
}
```
### Return Type
Recall that executing the `GetRestaurantsByCity` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRestaurantsByCityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetRestaurantsByCity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRestaurantsByCity, GetRestaurantsByCityVariables } from '@dataconnect/matchday';

// The `GetRestaurantsByCity` query requires an argument of type `GetRestaurantsByCityVariables`:
const getRestaurantsByCityVars: GetRestaurantsByCityVariables = {
  city: ..., 
};

// Call the `getRestaurantsByCity()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRestaurantsByCity(getRestaurantsByCityVars);
// Variables can be defined inline as well.
const { data } = await getRestaurantsByCity({ city: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRestaurantsByCity(dataConnect, getRestaurantsByCityVars);

console.log(data.restaurants);

// Or, you can use the `Promise` API.
getRestaurantsByCity(getRestaurantsByCityVars).then((response) => {
  const data = response.data;
  console.log(data.restaurants);
});
```

### Using `GetRestaurantsByCity`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRestaurantsByCityRef, GetRestaurantsByCityVariables } from '@dataconnect/matchday';

// The `GetRestaurantsByCity` query requires an argument of type `GetRestaurantsByCityVariables`:
const getRestaurantsByCityVars: GetRestaurantsByCityVariables = {
  city: ..., 
};

// Call the `getRestaurantsByCityRef()` function to get a reference to the query.
const ref = getRestaurantsByCityRef(getRestaurantsByCityVars);
// Variables can be defined inline as well.
const ref = getRestaurantsByCityRef({ city: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRestaurantsByCityRef(dataConnect, getRestaurantsByCityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.restaurants);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.restaurants);
});
```

## GetActivePromotionsByRestaurant
You can execute the `GetActivePromotionsByRestaurant` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getActivePromotionsByRestaurant(vars: GetActivePromotionsByRestaurantVariables): QueryPromise<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;

interface GetActivePromotionsByRestaurantRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivePromotionsByRestaurantVariables): QueryRef<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
}
export const getActivePromotionsByRestaurantRef: GetActivePromotionsByRestaurantRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActivePromotionsByRestaurant(dc: DataConnect, vars: GetActivePromotionsByRestaurantVariables): QueryPromise<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;

interface GetActivePromotionsByRestaurantRef {
  ...
  (dc: DataConnect, vars: GetActivePromotionsByRestaurantVariables): QueryRef<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
}
export const getActivePromotionsByRestaurantRef: GetActivePromotionsByRestaurantRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActivePromotionsByRestaurantRef:
```typescript
const name = getActivePromotionsByRestaurantRef.operationName;
console.log(name);
```

### Variables
The `GetActivePromotionsByRestaurant` query requires an argument of type `GetActivePromotionsByRestaurantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActivePromotionsByRestaurantVariables {
  restaurantId: UUIDString;
}
```
### Return Type
Recall that executing the `GetActivePromotionsByRestaurant` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActivePromotionsByRestaurantData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetActivePromotionsByRestaurant`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActivePromotionsByRestaurant, GetActivePromotionsByRestaurantVariables } from '@dataconnect/matchday';

// The `GetActivePromotionsByRestaurant` query requires an argument of type `GetActivePromotionsByRestaurantVariables`:
const getActivePromotionsByRestaurantVars: GetActivePromotionsByRestaurantVariables = {
  restaurantId: ..., 
};

// Call the `getActivePromotionsByRestaurant()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActivePromotionsByRestaurant(getActivePromotionsByRestaurantVars);
// Variables can be defined inline as well.
const { data } = await getActivePromotionsByRestaurant({ restaurantId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActivePromotionsByRestaurant(dataConnect, getActivePromotionsByRestaurantVars);

console.log(data.promotions);

// Or, you can use the `Promise` API.
getActivePromotionsByRestaurant(getActivePromotionsByRestaurantVars).then((response) => {
  const data = response.data;
  console.log(data.promotions);
});
```

### Using `GetActivePromotionsByRestaurant`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActivePromotionsByRestaurantRef, GetActivePromotionsByRestaurantVariables } from '@dataconnect/matchday';

// The `GetActivePromotionsByRestaurant` query requires an argument of type `GetActivePromotionsByRestaurantVariables`:
const getActivePromotionsByRestaurantVars: GetActivePromotionsByRestaurantVariables = {
  restaurantId: ..., 
};

// Call the `getActivePromotionsByRestaurantRef()` function to get a reference to the query.
const ref = getActivePromotionsByRestaurantRef(getActivePromotionsByRestaurantVars);
// Variables can be defined inline as well.
const ref = getActivePromotionsByRestaurantRef({ restaurantId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActivePromotionsByRestaurantRef(dataConnect, getActivePromotionsByRestaurantVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.promotions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.promotions);
});
```

## GetActiveHappyHoursNow
You can execute the `GetActiveHappyHoursNow` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getActiveHappyHoursNow(vars: GetActiveHappyHoursNowVariables): QueryPromise<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;

interface GetActiveHappyHoursNowRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveHappyHoursNowVariables): QueryRef<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
}
export const getActiveHappyHoursNowRef: GetActiveHappyHoursNowRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveHappyHoursNow(dc: DataConnect, vars: GetActiveHappyHoursNowVariables): QueryPromise<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;

interface GetActiveHappyHoursNowRef {
  ...
  (dc: DataConnect, vars: GetActiveHappyHoursNowVariables): QueryRef<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
}
export const getActiveHappyHoursNowRef: GetActiveHappyHoursNowRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveHappyHoursNowRef:
```typescript
const name = getActiveHappyHoursNowRef.operationName;
console.log(name);
```

### Variables
The `GetActiveHappyHoursNow` query requires an argument of type `GetActiveHappyHoursNowVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActiveHappyHoursNowVariables {
  city: City;
  currentDay: string;
  currentTime: string;
}
```
### Return Type
Recall that executing the `GetActiveHappyHoursNow` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveHappyHoursNowData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetActiveHappyHoursNow`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveHappyHoursNow, GetActiveHappyHoursNowVariables } from '@dataconnect/matchday';

// The `GetActiveHappyHoursNow` query requires an argument of type `GetActiveHappyHoursNowVariables`:
const getActiveHappyHoursNowVars: GetActiveHappyHoursNowVariables = {
  city: ..., 
  currentDay: ..., 
  currentTime: ..., 
};

// Call the `getActiveHappyHoursNow()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveHappyHoursNow(getActiveHappyHoursNowVars);
// Variables can be defined inline as well.
const { data } = await getActiveHappyHoursNow({ city: ..., currentDay: ..., currentTime: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveHappyHoursNow(dataConnect, getActiveHappyHoursNowVars);

console.log(data.promotions);

// Or, you can use the `Promise` API.
getActiveHappyHoursNow(getActiveHappyHoursNowVars).then((response) => {
  const data = response.data;
  console.log(data.promotions);
});
```

### Using `GetActiveHappyHoursNow`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveHappyHoursNowRef, GetActiveHappyHoursNowVariables } from '@dataconnect/matchday';

// The `GetActiveHappyHoursNow` query requires an argument of type `GetActiveHappyHoursNowVariables`:
const getActiveHappyHoursNowVars: GetActiveHappyHoursNowVariables = {
  city: ..., 
  currentDay: ..., 
  currentTime: ..., 
};

// Call the `getActiveHappyHoursNowRef()` function to get a reference to the query.
const ref = getActiveHappyHoursNowRef(getActiveHappyHoursNowVars);
// Variables can be defined inline as well.
const ref = getActiveHappyHoursNowRef({ city: ..., currentDay: ..., currentTime: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveHappyHoursNowRef(dataConnect, getActiveHappyHoursNowVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.promotions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.promotions);
});
```

## GetPendingApprovalRestaurants
You can execute the `GetPendingApprovalRestaurants` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPendingApprovalRestaurants(): QueryPromise<GetPendingApprovalRestaurantsData, undefined>;

interface GetPendingApprovalRestaurantsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPendingApprovalRestaurantsData, undefined>;
}
export const getPendingApprovalRestaurantsRef: GetPendingApprovalRestaurantsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPendingApprovalRestaurants(dc: DataConnect): QueryPromise<GetPendingApprovalRestaurantsData, undefined>;

interface GetPendingApprovalRestaurantsRef {
  ...
  (dc: DataConnect): QueryRef<GetPendingApprovalRestaurantsData, undefined>;
}
export const getPendingApprovalRestaurantsRef: GetPendingApprovalRestaurantsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPendingApprovalRestaurantsRef:
```typescript
const name = getPendingApprovalRestaurantsRef.operationName;
console.log(name);
```

### Variables
The `GetPendingApprovalRestaurants` query has no variables.
### Return Type
Recall that executing the `GetPendingApprovalRestaurants` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPendingApprovalRestaurantsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetPendingApprovalRestaurants`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPendingApprovalRestaurants } from '@dataconnect/matchday';


// Call the `getPendingApprovalRestaurants()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPendingApprovalRestaurants();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPendingApprovalRestaurants(dataConnect);

console.log(data.restaurants);

// Or, you can use the `Promise` API.
getPendingApprovalRestaurants().then((response) => {
  const data = response.data;
  console.log(data.restaurants);
});
```

### Using `GetPendingApprovalRestaurants`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPendingApprovalRestaurantsRef } from '@dataconnect/matchday';


// Call the `getPendingApprovalRestaurantsRef()` function to get a reference to the query.
const ref = getPendingApprovalRestaurantsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPendingApprovalRestaurantsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.restaurants);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.restaurants);
});
```

## GetPendingApprovalPromotions
You can execute the `GetPendingApprovalPromotions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPendingApprovalPromotions(): QueryPromise<GetPendingApprovalPromotionsData, undefined>;

interface GetPendingApprovalPromotionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPendingApprovalPromotionsData, undefined>;
}
export const getPendingApprovalPromotionsRef: GetPendingApprovalPromotionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPendingApprovalPromotions(dc: DataConnect): QueryPromise<GetPendingApprovalPromotionsData, undefined>;

interface GetPendingApprovalPromotionsRef {
  ...
  (dc: DataConnect): QueryRef<GetPendingApprovalPromotionsData, undefined>;
}
export const getPendingApprovalPromotionsRef: GetPendingApprovalPromotionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPendingApprovalPromotionsRef:
```typescript
const name = getPendingApprovalPromotionsRef.operationName;
console.log(name);
```

### Variables
The `GetPendingApprovalPromotions` query has no variables.
### Return Type
Recall that executing the `GetPendingApprovalPromotions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPendingApprovalPromotionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetPendingApprovalPromotions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPendingApprovalPromotions } from '@dataconnect/matchday';


// Call the `getPendingApprovalPromotions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPendingApprovalPromotions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPendingApprovalPromotions(dataConnect);

console.log(data.promotions);

// Or, you can use the `Promise` API.
getPendingApprovalPromotions().then((response) => {
  const data = response.data;
  console.log(data.promotions);
});
```

### Using `GetPendingApprovalPromotions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPendingApprovalPromotionsRef } from '@dataconnect/matchday';


// Call the `getPendingApprovalPromotionsRef()` function to get a reference to the query.
const ref = getPendingApprovalPromotionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPendingApprovalPromotionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.promotions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.promotions);
});
```

## GetRestaurantAnalytics
You can execute the `GetRestaurantAnalytics` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRestaurantAnalytics(vars: GetRestaurantAnalyticsVariables): QueryPromise<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;

interface GetRestaurantAnalyticsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRestaurantAnalyticsVariables): QueryRef<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
}
export const getRestaurantAnalyticsRef: GetRestaurantAnalyticsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRestaurantAnalytics(dc: DataConnect, vars: GetRestaurantAnalyticsVariables): QueryPromise<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;

interface GetRestaurantAnalyticsRef {
  ...
  (dc: DataConnect, vars: GetRestaurantAnalyticsVariables): QueryRef<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
}
export const getRestaurantAnalyticsRef: GetRestaurantAnalyticsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRestaurantAnalyticsRef:
```typescript
const name = getRestaurantAnalyticsRef.operationName;
console.log(name);
```

### Variables
The `GetRestaurantAnalytics` query requires an argument of type `GetRestaurantAnalyticsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRestaurantAnalyticsVariables {
  restaurantId: UUIDString;
  startDate: TimestampString;
  endDate: TimestampString;
}
```
### Return Type
Recall that executing the `GetRestaurantAnalytics` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRestaurantAnalyticsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetRestaurantAnalytics`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRestaurantAnalytics, GetRestaurantAnalyticsVariables } from '@dataconnect/matchday';

// The `GetRestaurantAnalytics` query requires an argument of type `GetRestaurantAnalyticsVariables`:
const getRestaurantAnalyticsVars: GetRestaurantAnalyticsVariables = {
  restaurantId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `getRestaurantAnalytics()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRestaurantAnalytics(getRestaurantAnalyticsVars);
// Variables can be defined inline as well.
const { data } = await getRestaurantAnalytics({ restaurantId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRestaurantAnalytics(dataConnect, getRestaurantAnalyticsVars);

console.log(data.venueViews);

// Or, you can use the `Promise` API.
getRestaurantAnalytics(getRestaurantAnalyticsVars).then((response) => {
  const data = response.data;
  console.log(data.venueViews);
});
```

### Using `GetRestaurantAnalytics`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRestaurantAnalyticsRef, GetRestaurantAnalyticsVariables } from '@dataconnect/matchday';

// The `GetRestaurantAnalytics` query requires an argument of type `GetRestaurantAnalyticsVariables`:
const getRestaurantAnalyticsVars: GetRestaurantAnalyticsVariables = {
  restaurantId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `getRestaurantAnalyticsRef()` function to get a reference to the query.
const ref = getRestaurantAnalyticsRef(getRestaurantAnalyticsVars);
// Variables can be defined inline as well.
const ref = getRestaurantAnalyticsRef({ restaurantId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRestaurantAnalyticsRef(dataConnect, getRestaurantAnalyticsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.venueViews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.venueViews);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `matchday` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateRestaurant
You can execute the `CreateRestaurant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createRestaurant(vars: CreateRestaurantVariables): MutationPromise<CreateRestaurantData, CreateRestaurantVariables>;

interface CreateRestaurantRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRestaurantVariables): MutationRef<CreateRestaurantData, CreateRestaurantVariables>;
}
export const createRestaurantRef: CreateRestaurantRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRestaurant(dc: DataConnect, vars: CreateRestaurantVariables): MutationPromise<CreateRestaurantData, CreateRestaurantVariables>;

interface CreateRestaurantRef {
  ...
  (dc: DataConnect, vars: CreateRestaurantVariables): MutationRef<CreateRestaurantData, CreateRestaurantVariables>;
}
export const createRestaurantRef: CreateRestaurantRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRestaurantRef:
```typescript
const name = createRestaurantRef.operationName;
console.log(name);
```

### Variables
The `CreateRestaurant` mutation requires an argument of type `CreateRestaurantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreateRestaurant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRestaurantData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRestaurantData {
  restaurant_insert: Restaurant_Key;
}
```
### Using `CreateRestaurant`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRestaurant, CreateRestaurantVariables } from '@dataconnect/matchday';

// The `CreateRestaurant` mutation requires an argument of type `CreateRestaurantVariables`:
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

// Call the `createRestaurant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRestaurant(createRestaurantVars);
// Variables can be defined inline as well.
const { data } = await createRestaurant({ ownerUserId: ..., name: ..., description: ..., city: ..., neighborhood: ..., address: ..., cuisineType: ..., phoneNumber: ..., website: ..., googleMapsUrl: ..., photoUrls: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRestaurant(dataConnect, createRestaurantVars);

console.log(data.restaurant_insert);

// Or, you can use the `Promise` API.
createRestaurant(createRestaurantVars).then((response) => {
  const data = response.data;
  console.log(data.restaurant_insert);
});
```

### Using `CreateRestaurant`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRestaurantRef, CreateRestaurantVariables } from '@dataconnect/matchday';

// The `CreateRestaurant` mutation requires an argument of type `CreateRestaurantVariables`:
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

// Call the `createRestaurantRef()` function to get a reference to the mutation.
const ref = createRestaurantRef(createRestaurantVars);
// Variables can be defined inline as well.
const ref = createRestaurantRef({ ownerUserId: ..., name: ..., description: ..., city: ..., neighborhood: ..., address: ..., cuisineType: ..., phoneNumber: ..., website: ..., googleMapsUrl: ..., photoUrls: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRestaurantRef(dataConnect, createRestaurantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.restaurant_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.restaurant_insert);
});
```

## UpdateRestaurant
You can execute the `UpdateRestaurant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateRestaurant(vars: UpdateRestaurantVariables): MutationPromise<UpdateRestaurantData, UpdateRestaurantVariables>;

interface UpdateRestaurantRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRestaurantVariables): MutationRef<UpdateRestaurantData, UpdateRestaurantVariables>;
}
export const updateRestaurantRef: UpdateRestaurantRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRestaurant(dc: DataConnect, vars: UpdateRestaurantVariables): MutationPromise<UpdateRestaurantData, UpdateRestaurantVariables>;

interface UpdateRestaurantRef {
  ...
  (dc: DataConnect, vars: UpdateRestaurantVariables): MutationRef<UpdateRestaurantData, UpdateRestaurantVariables>;
}
export const updateRestaurantRef: UpdateRestaurantRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRestaurantRef:
```typescript
const name = updateRestaurantRef.operationName;
console.log(name);
```

### Variables
The `UpdateRestaurant` mutation requires an argument of type `UpdateRestaurantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpdateRestaurant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRestaurantData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRestaurantData {
  restaurant_update?: Restaurant_Key | null;
}
```
### Using `UpdateRestaurant`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRestaurant, UpdateRestaurantVariables } from '@dataconnect/matchday';

// The `UpdateRestaurant` mutation requires an argument of type `UpdateRestaurantVariables`:
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

// Call the `updateRestaurant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRestaurant(updateRestaurantVars);
// Variables can be defined inline as well.
const { data } = await updateRestaurant({ id: ..., name: ..., description: ..., neighborhood: ..., address: ..., cuisineType: ..., phoneNumber: ..., website: ..., googleMapsUrl: ..., photoUrls: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRestaurant(dataConnect, updateRestaurantVars);

console.log(data.restaurant_update);

// Or, you can use the `Promise` API.
updateRestaurant(updateRestaurantVars).then((response) => {
  const data = response.data;
  console.log(data.restaurant_update);
});
```

### Using `UpdateRestaurant`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRestaurantRef, UpdateRestaurantVariables } from '@dataconnect/matchday';

// The `UpdateRestaurant` mutation requires an argument of type `UpdateRestaurantVariables`:
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

// Call the `updateRestaurantRef()` function to get a reference to the mutation.
const ref = updateRestaurantRef(updateRestaurantVars);
// Variables can be defined inline as well.
const ref = updateRestaurantRef({ id: ..., name: ..., description: ..., neighborhood: ..., address: ..., cuisineType: ..., phoneNumber: ..., website: ..., googleMapsUrl: ..., photoUrls: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRestaurantRef(dataConnect, updateRestaurantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.restaurant_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.restaurant_update);
});
```

## CreatePromotion
You can execute the `CreatePromotion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPromotion(vars: CreatePromotionVariables): MutationPromise<CreatePromotionData, CreatePromotionVariables>;

interface CreatePromotionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePromotionVariables): MutationRef<CreatePromotionData, CreatePromotionVariables>;
}
export const createPromotionRef: CreatePromotionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPromotion(dc: DataConnect, vars: CreatePromotionVariables): MutationPromise<CreatePromotionData, CreatePromotionVariables>;

interface CreatePromotionRef {
  ...
  (dc: DataConnect, vars: CreatePromotionVariables): MutationRef<CreatePromotionData, CreatePromotionVariables>;
}
export const createPromotionRef: CreatePromotionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPromotionRef:
```typescript
const name = createPromotionRef.operationName;
console.log(name);
```

### Variables
The `CreatePromotion` mutation requires an argument of type `CreatePromotionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreatePromotion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePromotionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePromotionData {
  promotion_insert: Promotion_Key;
}
```
### Using `CreatePromotion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPromotion, CreatePromotionVariables } from '@dataconnect/matchday';

// The `CreatePromotion` mutation requires an argument of type `CreatePromotionVariables`:
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

// Call the `createPromotion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPromotion(createPromotionVars);
// Variables can be defined inline as well.
const { data } = await createPromotion({ restaurantId: ..., name: ..., description: ..., dealType: ..., daysOfWeek: ..., startTime: ..., endTime: ..., source: ..., isApproved: ..., submittedByUserId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPromotion(dataConnect, createPromotionVars);

console.log(data.promotion_insert);

// Or, you can use the `Promise` API.
createPromotion(createPromotionVars).then((response) => {
  const data = response.data;
  console.log(data.promotion_insert);
});
```

### Using `CreatePromotion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPromotionRef, CreatePromotionVariables } from '@dataconnect/matchday';

// The `CreatePromotion` mutation requires an argument of type `CreatePromotionVariables`:
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

// Call the `createPromotionRef()` function to get a reference to the mutation.
const ref = createPromotionRef(createPromotionVars);
// Variables can be defined inline as well.
const ref = createPromotionRef({ restaurantId: ..., name: ..., description: ..., dealType: ..., daysOfWeek: ..., startTime: ..., endTime: ..., source: ..., isApproved: ..., submittedByUserId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPromotionRef(dataConnect, createPromotionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.promotion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.promotion_insert);
});
```

## UpdatePromotion
You can execute the `UpdatePromotion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePromotion(vars: UpdatePromotionVariables): MutationPromise<UpdatePromotionData, UpdatePromotionVariables>;

interface UpdatePromotionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePromotionVariables): MutationRef<UpdatePromotionData, UpdatePromotionVariables>;
}
export const updatePromotionRef: UpdatePromotionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePromotion(dc: DataConnect, vars: UpdatePromotionVariables): MutationPromise<UpdatePromotionData, UpdatePromotionVariables>;

interface UpdatePromotionRef {
  ...
  (dc: DataConnect, vars: UpdatePromotionVariables): MutationRef<UpdatePromotionData, UpdatePromotionVariables>;
}
export const updatePromotionRef: UpdatePromotionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePromotionRef:
```typescript
const name = updatePromotionRef.operationName;
console.log(name);
```

### Variables
The `UpdatePromotion` mutation requires an argument of type `UpdatePromotionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpdatePromotion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePromotionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePromotionData {
  promotion_update?: Promotion_Key | null;
}
```
### Using `UpdatePromotion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePromotion, UpdatePromotionVariables } from '@dataconnect/matchday';

// The `UpdatePromotion` mutation requires an argument of type `UpdatePromotionVariables`:
const updatePromotionVars: UpdatePromotionVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  dealType: ..., // optional
  daysOfWeek: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
};

// Call the `updatePromotion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePromotion(updatePromotionVars);
// Variables can be defined inline as well.
const { data } = await updatePromotion({ id: ..., name: ..., description: ..., dealType: ..., daysOfWeek: ..., startTime: ..., endTime: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePromotion(dataConnect, updatePromotionVars);

console.log(data.promotion_update);

// Or, you can use the `Promise` API.
updatePromotion(updatePromotionVars).then((response) => {
  const data = response.data;
  console.log(data.promotion_update);
});
```

### Using `UpdatePromotion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePromotionRef, UpdatePromotionVariables } from '@dataconnect/matchday';

// The `UpdatePromotion` mutation requires an argument of type `UpdatePromotionVariables`:
const updatePromotionVars: UpdatePromotionVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  dealType: ..., // optional
  daysOfWeek: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
};

// Call the `updatePromotionRef()` function to get a reference to the mutation.
const ref = updatePromotionRef(updatePromotionVars);
// Variables can be defined inline as well.
const ref = updatePromotionRef({ id: ..., name: ..., description: ..., dealType: ..., daysOfWeek: ..., startTime: ..., endTime: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePromotionRef(dataConnect, updatePromotionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.promotion_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.promotion_update);
});
```

## TogglePromotionActive
You can execute the `TogglePromotionActive` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
togglePromotionActive(vars: TogglePromotionActiveVariables): MutationPromise<TogglePromotionActiveData, TogglePromotionActiveVariables>;

interface TogglePromotionActiveRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: TogglePromotionActiveVariables): MutationRef<TogglePromotionActiveData, TogglePromotionActiveVariables>;
}
export const togglePromotionActiveRef: TogglePromotionActiveRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
togglePromotionActive(dc: DataConnect, vars: TogglePromotionActiveVariables): MutationPromise<TogglePromotionActiveData, TogglePromotionActiveVariables>;

interface TogglePromotionActiveRef {
  ...
  (dc: DataConnect, vars: TogglePromotionActiveVariables): MutationRef<TogglePromotionActiveData, TogglePromotionActiveVariables>;
}
export const togglePromotionActiveRef: TogglePromotionActiveRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the togglePromotionActiveRef:
```typescript
const name = togglePromotionActiveRef.operationName;
console.log(name);
```

### Variables
The `TogglePromotionActive` mutation requires an argument of type `TogglePromotionActiveVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface TogglePromotionActiveVariables {
  id: UUIDString;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `TogglePromotionActive` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TogglePromotionActiveData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TogglePromotionActiveData {
  promotion_update?: Promotion_Key | null;
}
```
### Using `TogglePromotionActive`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, togglePromotionActive, TogglePromotionActiveVariables } from '@dataconnect/matchday';

// The `TogglePromotionActive` mutation requires an argument of type `TogglePromotionActiveVariables`:
const togglePromotionActiveVars: TogglePromotionActiveVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `togglePromotionActive()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await togglePromotionActive(togglePromotionActiveVars);
// Variables can be defined inline as well.
const { data } = await togglePromotionActive({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await togglePromotionActive(dataConnect, togglePromotionActiveVars);

console.log(data.promotion_update);

// Or, you can use the `Promise` API.
togglePromotionActive(togglePromotionActiveVars).then((response) => {
  const data = response.data;
  console.log(data.promotion_update);
});
```

### Using `TogglePromotionActive`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, togglePromotionActiveRef, TogglePromotionActiveVariables } from '@dataconnect/matchday';

// The `TogglePromotionActive` mutation requires an argument of type `TogglePromotionActiveVariables`:
const togglePromotionActiveVars: TogglePromotionActiveVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `togglePromotionActiveRef()` function to get a reference to the mutation.
const ref = togglePromotionActiveRef(togglePromotionActiveVars);
// Variables can be defined inline as well.
const ref = togglePromotionActiveRef({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = togglePromotionActiveRef(dataConnect, togglePromotionActiveVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.promotion_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.promotion_update);
});
```

## RecordVenueView
You can execute the `RecordVenueView` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordVenueView(vars: RecordVenueViewVariables): MutationPromise<RecordVenueViewData, RecordVenueViewVariables>;

interface RecordVenueViewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordVenueViewVariables): MutationRef<RecordVenueViewData, RecordVenueViewVariables>;
}
export const recordVenueViewRef: RecordVenueViewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordVenueView(dc: DataConnect, vars: RecordVenueViewVariables): MutationPromise<RecordVenueViewData, RecordVenueViewVariables>;

interface RecordVenueViewRef {
  ...
  (dc: DataConnect, vars: RecordVenueViewVariables): MutationRef<RecordVenueViewData, RecordVenueViewVariables>;
}
export const recordVenueViewRef: RecordVenueViewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordVenueViewRef:
```typescript
const name = recordVenueViewRef.operationName;
console.log(name);
```

### Variables
The `RecordVenueView` mutation requires an argument of type `RecordVenueViewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordVenueViewVariables {
  restaurantId: UUIDString;
  userId?: string | null;
  viewType: ViewType;
  city: City;
}
```
### Return Type
Recall that executing the `RecordVenueView` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordVenueViewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordVenueViewData {
  venueView_insert: VenueView_Key;
}
```
### Using `RecordVenueView`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordVenueView, RecordVenueViewVariables } from '@dataconnect/matchday';

// The `RecordVenueView` mutation requires an argument of type `RecordVenueViewVariables`:
const recordVenueViewVars: RecordVenueViewVariables = {
  restaurantId: ..., 
  userId: ..., // optional
  viewType: ..., 
  city: ..., 
};

// Call the `recordVenueView()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordVenueView(recordVenueViewVars);
// Variables can be defined inline as well.
const { data } = await recordVenueView({ restaurantId: ..., userId: ..., viewType: ..., city: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordVenueView(dataConnect, recordVenueViewVars);

console.log(data.venueView_insert);

// Or, you can use the `Promise` API.
recordVenueView(recordVenueViewVars).then((response) => {
  const data = response.data;
  console.log(data.venueView_insert);
});
```

### Using `RecordVenueView`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordVenueViewRef, RecordVenueViewVariables } from '@dataconnect/matchday';

// The `RecordVenueView` mutation requires an argument of type `RecordVenueViewVariables`:
const recordVenueViewVars: RecordVenueViewVariables = {
  restaurantId: ..., 
  userId: ..., // optional
  viewType: ..., 
  city: ..., 
};

// Call the `recordVenueViewRef()` function to get a reference to the mutation.
const ref = recordVenueViewRef(recordVenueViewVars);
// Variables can be defined inline as well.
const ref = recordVenueViewRef({ restaurantId: ..., userId: ..., viewType: ..., city: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordVenueViewRef(dataConnect, recordVenueViewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.venueView_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.venueView_insert);
});
```

## SaveVenue
You can execute the `SaveVenue` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
saveVenue(vars: SaveVenueVariables): MutationPromise<SaveVenueData, SaveVenueVariables>;

interface SaveVenueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveVenueVariables): MutationRef<SaveVenueData, SaveVenueVariables>;
}
export const saveVenueRef: SaveVenueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveVenue(dc: DataConnect, vars: SaveVenueVariables): MutationPromise<SaveVenueData, SaveVenueVariables>;

interface SaveVenueRef {
  ...
  (dc: DataConnect, vars: SaveVenueVariables): MutationRef<SaveVenueData, SaveVenueVariables>;
}
export const saveVenueRef: SaveVenueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveVenueRef:
```typescript
const name = saveVenueRef.operationName;
console.log(name);
```

### Variables
The `SaveVenue` mutation requires an argument of type `SaveVenueVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SaveVenueVariables {
  restaurantId: UUIDString;
}
```
### Return Type
Recall that executing the `SaveVenue` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveVenueData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveVenueData {
  userSavedVenue_insert: UserSavedVenue_Key;
}
```
### Using `SaveVenue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveVenue, SaveVenueVariables } from '@dataconnect/matchday';

// The `SaveVenue` mutation requires an argument of type `SaveVenueVariables`:
const saveVenueVars: SaveVenueVariables = {
  restaurantId: ..., 
};

// Call the `saveVenue()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveVenue(saveVenueVars);
// Variables can be defined inline as well.
const { data } = await saveVenue({ restaurantId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveVenue(dataConnect, saveVenueVars);

console.log(data.userSavedVenue_insert);

// Or, you can use the `Promise` API.
saveVenue(saveVenueVars).then((response) => {
  const data = response.data;
  console.log(data.userSavedVenue_insert);
});
```

### Using `SaveVenue`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveVenueRef, SaveVenueVariables } from '@dataconnect/matchday';

// The `SaveVenue` mutation requires an argument of type `SaveVenueVariables`:
const saveVenueVars: SaveVenueVariables = {
  restaurantId: ..., 
};

// Call the `saveVenueRef()` function to get a reference to the mutation.
const ref = saveVenueRef(saveVenueVars);
// Variables can be defined inline as well.
const ref = saveVenueRef({ restaurantId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveVenueRef(dataConnect, saveVenueVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSavedVenue_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSavedVenue_insert);
});
```

