import psycopg2

from .DatabaseConfig import DatabaseConfig


class DatabaseConnection:

    def create_connection(self):
        """
        Method that creates and initializes a connection with postgres
        database
        """

        self.conn = psycopg2.connect(
            host=DatabaseConfig.HOST,
            dbname=DatabaseConfig.DATABASE,
            user=DatabaseConfig.USER,
            password=DatabaseConfig.PASSWORD,
            port=DatabaseConfig.PORT_NUM
        )
        self.cursor = self.conn.cursor()

    def close_connection(self):
        """
        Method that closes the connection with postgres database
        """

        self.cursor.close()
        self.conn.close()
