#!/usr/bin/python3
"""LIFO Cache class that inherits from BaseCaching"""
BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """ Defines LIFOCache """

    def __init__(self):
        """ Init LIFOCache """
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
        return self.cache_data.get(key)
