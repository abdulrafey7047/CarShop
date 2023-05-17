import datetime
from dateutil.relativedelta import relativedelta

str_price_to_int = {
    'lacs': 100000,
    'crore': 10000000,
}

def parse_price_from_string(price_str: str) -> float:

    price_data = price_str.split()
    try:
        price = float(price_data[1]) * str_price_to_int[price_data[2]]
    except (ValueError, IndexError):
        price = None

    return price


def parse_date_from_string(date_str: str) -> datetime.date:

    date_data = date_str.split()
    today = datetime.datetime.today()

    try:
        num = date_data[1]
        interval = date_data[2]

        if interval.startswith('day'):
            time_diff = relativedelta(days=int(num))
        elif interval.startswith('month'):
            time_diff = relativedelta(months=int(num))
        elif interval.startswith('year'):
            time_diff = relativedelta(years=int(num))

        date =  (today - time_diff).date()
    except (ValueError, IndexError):
        date = datetime.date.today()
    
    return date
