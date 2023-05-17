import scrapy


class AdvertismentItem(scrapy.Item):
    
    title = scrapy.Field()
    slug = scrapy.Field()
    description = scrapy.Field()
    price = scrapy.Field()
    source = scrapy.Field()
    category = scrapy.Field()
    publish_date = scrapy.Field()
    image_url = scrapy.Field()
    advertisment_url = scrapy.Field()
