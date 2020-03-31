import os

LOCK_FILE_NAME = '/tmp/amo-crawler.lock'


def acquire():
    try:
        return os.open(LOCK_FILE_NAME, os.O_CREAT | os.O_EXCL | os.O_RDWR)
    except Exception:
        print("Fail to acquire lock")
        raise


def ignore_acquire():
    return open(LOCK_FILE_NAME, 'r')


def release(lock):
    os.close(lock)
    os.unlink(LOCK_FILE_NAME)
