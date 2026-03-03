const { LRUCache } = require("lru-cache");

/**
 * Shared LRU cache for autocomplete responses.
 * Avoids redundant upstream requests for recently typed queries.
 *
 * - max: up to 500 unique entries
 * - ttl: entries expire after 5 minutes
 */
const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,
});

module.exports = cache;