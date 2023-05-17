from datetime import datetime

from scrapy import Request
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders.crawl import CrawlSpider, Rule

from ..items import AdvertismentItem
from ..utilities import parse_price_from_string


class PakWheelsSpider(CrawlSpider):

    name = 'pak_wheels_spider'
    start_urls = ['https://www.pakwheels.com/']

    listing_css = ['.browse-listing > .col-sm-2']

    rules = [
        Rule(LinkExtractor(restrict_css=listing_css), callback='parse')
    ]

    def parse(self, response):

        car_add_urls = response.css('.page-').css(
            '.search-title').css('.car-name::attr(href)').getall()

        for car_add_url in car_add_urls:
            car_add_url = f'https://www.pakwheels.com{car_add_url}'
            yield Request(car_add_url,
                          callback=self.parse_car_add,
                          cb_kwargs=dict(advertisment_url=car_add_url))

        current_page_num = int(response.css(
            '.pagination').css('.page.active > a::text').get())
        if current_page_num < 5:
            next_page_url = 'https://www.pakwheels.com{}'.format(
                response.css('.pagination').css(
                    '.page.active > a::attr(href)').get())
            yield response.follow(next_page_url, self.parse)

    def parse_car_add(self, response,
                      advertisment_url: str) -> AdvertismentItem:

        add_item = AdvertismentItem()
        add_item['title'] = response.css('h1::text').get()
        add_item['description'] = self.generate_add_description(response)
        add_item['source'] = 'Pak Wheels'
        add_item['price'] = self.generate_add_price(response)
        add_item['advertisment_url'] = advertisment_url

        add_item['image_url'] = response.xpath(
            "//*[contains(@alt,'Image-1')]/@src").get()
        add_item['category'] = response.xpath(
            "//*[contains(text(),'Body Type')]/following-sibling::li").css(
                'a::text').get().lower()

        date = response.xpath(
            "//li[contains(text(),'Last Updated')]" +
            "/following-sibling::li[1]/text()"
            ).get()
        if date:
            date = datetime.strptime(date, '%b %d, %Y').date()
        add_item['publish_date'] = date

        yield add_item

    def generate_add_description(self, response) -> str:
        model_year = response.css('.engine-icon.year + p > a::text').get()
        millage = response.css('.engine-icon.millage + p::text').get()
        fuel_type = response.css('.engine-icon.type + p > a::text').get()
        transmisson_type = response.css(
            '.engine-icon.transmission + p > a::text').get()
        seller_comments = self.generate_seller_comments(response)

        description = "Model Year: {}\nMillage: {}\nFuel Type: {}\nTransmission Type: {}\nSource: PakWheels\nSeller's Comments: {}\n".format(
            model_year, millage, fuel_type, transmisson_type, seller_comments)

        return description

    def generate_seller_comments(self, response):

        seller_comments = response.xpath(
            "//*[contains(text(),'Comments')]" +
            "/following-sibling::div[1]//text()"
        )
        comments = ''
        for seller_comments in seller_comments:
            comments += seller_comments.get()

        return comments

    def generate_add_price(self, response) -> str:

        price = response.css('.price-box > .generic-green::text').get()
        suffix = response.css('.price-box > .generic-green > span::text').get()

        # if price and suffix:
        #     price = parse_price_from_string(price + suffix)
        # else:
        #     price = None

        price = parse_price_from_string(price + suffix)
        return price
