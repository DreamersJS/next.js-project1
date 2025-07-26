# Testing Firebase Integration with Jest
# Difference Between Mock File, jest.mock, and jest.spyOn

This document explains how to test Firebase-related code using Jest, focusing on mocking strategies: `jest.mock` vs `jest.spyOn`.

---

## Mocking Firebase Modules

### Using `jest.mock`

We mock the entire Firebase module before importing any code that uses it. This allows us to provide controlled implementations of Firebase functions:

```js
jest.mock('@/services/firebase', () => ({
  getDatabase: jest.fn(() => mockDb),
  ref: jest.fn(() => mockUserRef),
  child: jest.fn(() => mockWhiteboardsRef),
  get: jest.fn(() => Promise.resolve({ exists: () => true, val: () => ({}) })),
  // mock other Firebase functions as needed
}));
```
### Why use jest.mock?

-    Replace the entire module with mocks.
-    Control all Firebase calls in your tests.
-    Avoid side effects or network calls.
-    Simplifies testing components depending on Firebase.
  
##  Using jest.spyOn
### What is jest.spyOn?

jest.spyOn wraps an existing function and allows you to:

-    Track calls to the function (number of calls, arguments, etc.).
-    Replace its implementation temporarily.

### When to use jest.spyOn?

-    When you want to test some functions from a real module without mocking the entire module.

-    When you want to verify function calls while keeping the original implementation or mocking partially.

    For example:
```js
    import * as firebaseDb from 'firebase/database';

test('calls getDatabase', () => {
  const spy = jest.spyOn(firebaseDb, 'getDatabase').mockReturnValue(mockDb);

  // run your code that calls getDatabase...

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});
```

 ## Important Notes


- Do not use jest.mock and jest.spyOn on the same module simultaneously, as they can conflict.
- jest.spyOn cannot mock functions that are non-configurable or read-only exports.
- Prefer jest.mock for full control and to avoid issues with module internals.
- Use jest.spyOn if you only need to monitor or mock a few functions from a real module.
  

1. Manual Mock File (__mocks__/firebase.js)

    A manual mock is a standalone mock implementation stored in a __mocks__ directory next to the real module.

    Jest automatically uses this file whenever you call jest.mock('firebase') (or your path).

    It replaces the entire module with your mock implementations from the file.

    Helps organize complex mocks separately, keeping test files cleaner.

    Useful when the mocked module is large or reused in multiple test files.

Pros

    Central place for the mock; easy to reuse.

    Avoids clutter in test files.

    Can mock complex module behaviors in detail.

Cons

 -   Can cause confusing errors if not perfectly aligned with the real API. 
(like Error fetching user whiteboards: TypeError: Cannot read properties of undefined (reading '_path') mock of ref() is not returning an object structured properly for Firebase’s internal child() call.
Firebase's real ref() object has internal properties like _path, and it has methods like .child() that return another reference.)

 -   Requires all functions to be mocked appropriately (missing mocks cause errors).

 -   If your mock is outdated, tests might behave unexpectedly.
  
  2. Inline jest.mock() with Manual Implementation in Test File

Example:

jest.mock('@/services/firebase', () => ({
  getDatabase: jest.fn(() => mockDb),
  ref: jest.fn(() => mockUserRef),
  get: jest.fn(() => Promise.resolve({ exists: () => true, val: () => ({}) })),
  // ... other mocks
}));

    This is mocking the module inline directly inside the test file.

    Overrides the module just for that test file.

    Great for smaller mocks or when you want quick per-test variations.

    You can customize behavior per test file or even per test run.

Pros

    Easy to see and change mocks in the test file.

    Allows test-specific mock customizations.

    No need to maintain separate mock files.

Cons

    Can clutter test files if mocks are complex.

    Duplicates mock logic if shared across multiple test files.

3. jest.spyOn

    spyOn wraps an existing function in the imported real module.

    Allows partial mocking: you can replace behavior or just observe calls.

    Keeps the rest of the module intact.

    Cannot mock a whole module, only existing exported functions.

    Requires the original module to be loaded (not mocked fully).

Pros

    Perfect for partial mocks or to verify function calls.

    Minimal interference with the module.

    Useful for testing integration and side-effects.

Cons

    Can't mock functions that are read-only or non-configurable.

    Not useful if you want to fully replace the module.

    Can throw errors if the module is already mocked or if functions are not configurable.

Why Your Manual Mock File May Cause Errors

    If your mock file (__mocks__/firebase.js) doesn't exactly match the real module's shape, your app code can crash (e.g., missing functions, unexpected return types).

    Firebase's SDK often exports named functions and objects that are sometimes non-configurable or have complex internal structure — this can make spying or mocking tricky.

    Jest tries to redefine properties or spies on functions that may be frozen or non-configurable — causing errors like:

TypeError: Cannot redefine property: getDatabase

The manual mock file approach requires you to mock every Firebase function or object your app uses. If you miss one or mock it incorrectly, it leads to runtime errors.


When to Use What

    Use manual mock files when you have a complex Firebase mock reused across many tests.

    Use inline jest.mock for quick, test-specific mocks or when mocking small parts.

    Use jest.spyOn when you want to observe or mock specific Firebase function calls without mocking the whole module.

