import os


class FileLock:
    LOCK_FILE_NAME = '/var/tmp/amo-crawler.lock'

    def __init__(self):
        self.fd = None

    def acquire(self):
        self.fd = os.open(self.LOCK_FILE_NAME, os.O_CREAT | os.O_EXCL | os.O_RDWR)

    def ignore_acquire(self):
        self.fd = os.open(self.LOCK_FILE_NAME, os.O_RDWR)

    def release(self):
        if self.fd is not None:
            os.close(self.fd)
        if os.path.exists(self.LOCK_FILE_NAME):
            os.unlink(self.LOCK_FILE_NAME)
