from psycopg2.errors import UniqueViolation, NotNullViolation


class ScrapedAdvertismentDAO():
    """
    Data Access Object class for Scraped Advertisment Table
    """

    def __init__(self, db_connection):
        self.table_name = 'car_shop_scraped_advertisment'
        self.db_connection = db_connection

    def insert(self, advertisment_id, scraped_advertisment):
        """
        Method for inserting a advertisment into advertisment table of database
        """

        script = f'''INSERT INTO {self.table_name} (source, image_url,
            advertisment_url, advertisment_id)
            VALUES (%s, %s, %s, %s)
        '''
        insert_values = (scraped_advertisment['source'], scraped_advertisment['image_url'],
                         scraped_advertisment['advertisment_url'], advertisment_id
                        )

        try:
            self.db_connection.cursor.execute(script, insert_values)
            self.db_connection.conn.commit()
        except (UniqueViolation, NotNullViolation):
            self.db_connection.conn.rollback()

