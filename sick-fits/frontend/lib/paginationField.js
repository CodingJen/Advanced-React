import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });
      const { skip, first } = args;

      // read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items and there aren't enough to satisfy how many were requested
      // and we are on the last page
      // Then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we dont't have any items, we must go to the network to fetch them
        return false;
      }
      // if there are items return them from the cache
      if (items.length) {
        // console.log(`there are ${items.length} going to send them to apollo`);
        return items;
      }

      return false;
      // First thing it does is asks the read function for the items
      // do either
      // first return the items because they are already in the cache
      // the other thing is to return false from here, network request
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the apollo client comes back from the network with our products
      // console.log(`merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log('merged', merged);

      return merged;
    },
  };
}
