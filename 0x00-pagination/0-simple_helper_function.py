#!/usr/bin/env python3
"""Define pagination range based on page number and page size."""


def index_range(page, page_size):
    """Function returns a tuple with start and end indexes for pagination."""

    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return (start_index, end_index)
