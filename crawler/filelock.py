import os

LOCK_FILE_NAME = '/var/tmp/amo-crawler.lock'

def acquire():
    try:
        return os.open(LOCK_FILE_NAME, os.O_CREAT | os.O_EXCL | os.O_RDWR)
    except Exception:
        raise

def ignore_acquire():
    return os.open(LOCK_FILE_NAME, os.O_RDWR)

def release(lock):
    os.close(lock)
    os.unlink(LOCK_FILE_NAME)
