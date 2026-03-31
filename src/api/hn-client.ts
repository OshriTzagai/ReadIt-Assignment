import type { HNItem } from '@/utils/types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const PAGE_SIZE = 20;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HN API ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchTopStoryIds(): Promise<number[]> {
  return get<number[]>('/topstories.json');
}

export function fetchItem(id: number): Promise<HNItem> {
  return get<HNItem>(`/item/${id}.json`);
}

export async function fetchPageItems(
  ids: number[],
  page: number,
): Promise<HNItem[]> {
  const slice = ids.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const results = await Promise.allSettled(slice.map(fetchItem));
  return results
    .filter(
      (r): r is PromiseFulfilledResult<HNItem> =>
        r.status === 'fulfilled' && r.value != null,
    )
    .map((r) => r.value);
}