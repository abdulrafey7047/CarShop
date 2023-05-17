from scrapy import Request, Spider

from ..items import AdvertismentItem
from ..utilities import parse_price_from_string, parse_date_from_string


default_img_path = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVDq1sdEyMO5_GDX89YrK1SJzsIDKEMClCdMB5h8KUg4cMYYDzx5DZTenbU6kY1ZRc_ao&usqp=CAU"


class CarMandeeSpider(Spider):

    name = 'car_mandee_spider'
    start_urls = ['https://carmandee.com/']

    def parse(self, response):

        categories = response.css('.popular-body-type-title::text').getall()
        for category in categories:
            category_url = 'https://carmandee.com/cars/used?bodyType={}'.format(
                category)
            yield Request(category_url,
                          callback=self.parse_car_adds,
                          cb_kwargs=dict(category=category))

    def parse_car_adds(self, response, category: str):

        car_add_urls = response.css('.vehicle-info::attr(href)').getall()
        for car_add_url in car_add_urls:
            car_add_url = f'https://carmandee.com{car_add_url}'
            yield Request(car_add_url,
                          callback=self.parse_car_add,
                          cb_kwargs=dict(category=category))

        current_page = int(response.css(
            '.ant-pagination-simple-pager > input::attr(value)').get())
        if current_page and current_page < 5:
            next_page_url = 'https://carmandee.com/cars/used?bodyType={}&page={}'.format(
                category, current_page)
            yield Request(next_page_url,
                          callback=self.parse_car_add,
                          cb_kwargs=dict(category=category))

    def parse_car_add(self, response, category: str):

        add_item = AdvertismentItem()
        add_item['title'] = response.css('.vehicle-page-h1::text').get()
        add_item['description'] = self.generate_add_description(response)
        add_item['source'] = 'CarMandee'
        add_item['price'] = parse_price_from_string(''.join(response.css('.vehicle-page-price::text').getall()))
        add_item['advertisment_url'] = response.url
        add_item['image_url'] = response.css('.image-gallery-image').get() or default_img_path
        add_item['category'] = category.lower()
        add_item['publish_date'] = parse_date_from_string(''.join(response.css('.vehicle-page-posted::text').getall()))

        yield add_item

    def generate_add_description(self, response) -> str:

        description = ''
        specs = response.css('.mobile-vehicle-page-spec-label::text').getall()
        values = response.css('.mobile-vehicle-page-spec-name::text').getall()
        for spec, value in zip(specs, values):
            if spec and value:
                description += f'{spec}: {value}\n'

        description += f'Source: CarMandee\n'
        seller_comments = response.css(
            '.vehicle-page-description-content::text').get()
        description += f"Seller's Comments: {seller_comments}"

        return description
