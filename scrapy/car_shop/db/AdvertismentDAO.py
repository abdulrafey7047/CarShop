from psycopg2.errors import UniqueViolation, NotNullViolation


class AdvertismentDAO():
    """
    Data Access Object class for Advertisment Table
    """

    def __init__(self, db_connection):
        self.table_name = 'car_shop_advertisment'
        self.db_connection = db_connection

    def insert(self, add_item):
        """
        Method for inserting a advertisment into advertisment table of database
        """

        script = f'''INSERT INTO {self.table_name} (title, description, price,
            publish_date, slug, category_id)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        '''
        insert_values = (add_item['title'], add_item['description'],
                         add_item['price'], add_item['publish_date'],
                         add_item['slug'], add_item['category']
                        )

        try:
            self.db_connection.cursor.execute(script, insert_values)
            self.db_connection.conn.commit()
            advertisment_id = self.db_connection.cursor.fetchone()[0]
            return advertisment_id

        except (UniqueViolation, NotNullViolation):
            self.db_connection.conn.rollback()
