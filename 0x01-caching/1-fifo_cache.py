#!/usr/bin/python3
"""FIFO-Cache class that inherits from BaseCaching"""
BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """ Defines FIFOCache """

    def __init__(self):
        """ Init FIFOCache """
        self.queue = []
        super().__init__()

    def put(self, key, item):
        """ Assign to the dictionary """
        if key and item:
            if self.cache_data.get(key):
                self.queue.remove(key)
            self.queue.append(key)
            self.cache_data[key] = item
            if len(self.queue) > self.MAX_ITEMS:
                delete = self.queue.pop(0)
                self.cache_data.pop(delete)
                print('DISCARD: {}'.format(delete))

    def get(self, key):
        """Return the value in self.cache_data linked to key."""
        return self.cache_data.get(key)
