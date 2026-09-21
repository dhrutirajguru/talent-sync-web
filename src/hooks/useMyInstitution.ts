import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations";

/**
 * Demo-scope shortcut: there's no endpoint returning the logged-in
 * academician's own institution_id, and only one institution exists in the
 * seed data, so this takes the first INSTITUTION org from the public list.
 * Fine for one seeded institution; if multiple institutions are added later,
 * add a real `GET /academicians/me` endpoint backed by academician_profiles
 * instead of this lookup.
 */
export function useMyInstitution() {
  return useQuery({
    queryKey: ["my-institution"],
    queryFn: async () => {
      const orgs = await organizationsApi.list("INSTITUTION");
      return orgs[0] ?? null;
    },
  });
}