import psycopg2
from psycopg2.extras import RealDictCursor


def get_conn():
    return psycopg2.connect(
        host="localhost",
        port=54321,
        database="travel_agency",
        user="system",
        password="123456789",
        cursor_factory=RealDictCursor
    )