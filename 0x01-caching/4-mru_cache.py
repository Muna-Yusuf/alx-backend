#!/usr/bin/env python3
"""MRU-Cache class that inherits from BaseCaching"""
BaseCaching = __import__('base_caching').BaseCaching


class MRUCache(BaseCaching):
    """ Defines MRU-Cache """

    def __init__(self):
        """ Init MRU-Cache """
        self.stack = []
        super().__init__()

    def put(self, key, item):
        """ Assign to the dictionary """
        if key and item:
            if self.cache_data.get(key):
                self.stack.remove(key)
            while len(self.stack) >= self.MAX_ITEMS:
                delete = self.stack.pop()
                self.cache_data.pop(delete)
                print('DISCARD: {}'.format(delete))
            self.stack.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """ Return the value in self.cache_data linked to key."""
        if self.cache_data.get(key):
            self.stack.remove(key)
            self.stack.append(key)
        return self.cache_data.get(key)
