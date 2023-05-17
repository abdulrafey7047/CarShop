from django.utils.text import slugify

from db.DatabaseConnection import DatabaseConnection
from db.AdvertismentDAO import AdvertismentDAO
from db.ScrapedAdvertismentDAO import ScrapedAdvertismentDAO
from db.CategoryDAO import CategoryDAO


class CarShopPipeline:

    def __init__(self):

        self.db_connection = DatabaseConnection()
        self.db_connection.create_connection()

        self.category_dao = CategoryDAO(self.db_connection)
        self.advertisment_dao = AdvertismentDAO(self.db_connection)
        self.scraped_advertisment_dao = ScrapedAdvertismentDAO(self.db_connection)

    def __del__(self):

        self.db_connection.create_connection()

    def process_item(self, item, spider):

        category_id = self.category_dao.get_id_by_category_name(
            item['category'])
        if not category_id:
            category_id = self.category_dao.insert(item['category'])

        item['category'] = category_id
        item['slug'] = slugify(item['title'])

        advertisment_id = self.advertisment_dao.insert(item)
        if advertisment_id:
            self.scraped_advertisment_dao.insert(
                advertisment_id, item)

        return item
