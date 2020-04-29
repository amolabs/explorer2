# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :
"""
file-based lock
"""
import os


class FileLock:
    PREFIX = '/var/tmp/amo-crawler-'

    def __init__(self, name):
        self.fd = None
        self.lockfile = self.PREFIX + name + '.lock'

    def acquire(self):
        self.fd = os.open(self.lockfile, os.O_CREAT | os.O_EXCL | os.O_RDWR)

    def force_acquire(self):
        self.fd = os.open(self.lockfile, os.O_RDWR)

    def release(self):
        if self.fd is not None:
            os.close(self.fd)
        if os.path.exists(self.lockfile):
            os.unlink(self.lockfile)
