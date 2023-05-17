from psycopg2.errors import UniqueViolation, NotNullViolation


class CategoryDAO():
    """
    Data Access Object class for Category Table
    """

    def __init__(self, db_connection):
        self.table_name = 'car_shop_category'
        self.db_connection = db_connection

    def insert(self, category_name: str):
        """
        Method for inserting a category name into category table of database
        """

        script = f'''INSERT INTO {self.table_name}(name)
            VALUES ('{category_name.lower()}')
            RETURNING id
        '''

        try:
            self.db_connection.cursor.execute(script)
            self.db_connection.conn.commit()
            advertisment_id = self.db_connection.cursor.fetchone()[0]
            return advertisment_id

        except (UniqueViolation, NotNullViolation):
            self.db_connection.conn.rollback()

    def get_id_by_category_name(self, category_name: str):

        script = f''' SELECT id FROM {self.table_name}
        WHERE name='{category_name.lower()}'
        '''

        self.db_connection.cursor.execute(script)
        category_id = self.db_connection.cursor.fetchone()
        return category_id
