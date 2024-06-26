#!/usr/bin/python3
"""Class BasicCache that inherits from BaseCaching and is a caching system."""


BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """Defins BasiCache"""

    def put(self, key, item):
        """ Assign to the dictionary."""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """ Return the value in self.cache_data linked to key."""
        if key is not:
            return None
        return self.cache_data.get(key)
