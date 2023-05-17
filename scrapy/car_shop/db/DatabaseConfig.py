import os


class DatabaseConfig:

    PORT_NUM: int = os.environ.get('POSTGRES_PORT_NUM')
    HOST: str = os.environ.get('POSTGRES_DATABASE_HOST')
    DATABASE: str = os.environ.get('CAR_SHOP_DB_NAME')
    USER: str = os.environ.get('POSTGRES_USER_NAME')
    PASSWORD: str = os.environ.get('POSTGRESS_USER_PASSWORD')
