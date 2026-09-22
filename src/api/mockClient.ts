/**
 * Wraps static mock data as a Promise with a simulated delay, so mock-backed
 * pages behave exactly like real API calls (loading states, etc. all work
 * the same way). When a real endpoint ships, replace the body of the
 * specific api function that uses this — page components never change,
 * since they only ever call e.g. `notificationsApi.list()`.
 */
export function mockResponse<T>(data: T, delayMs = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delayMs));
}