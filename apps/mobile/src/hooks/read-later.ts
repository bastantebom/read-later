import { createReadLaterHooks, createReadLaterMutations } from "shared-core";

import { API_URL } from "@/config/api";

export const { useArticles, useReadLater } = createReadLaterHooks(API_URL);

export const { useAddReadLaterItem, useRemoveReadLaterItem, useReadLaterBusy } =
  createReadLaterMutations(API_URL);
