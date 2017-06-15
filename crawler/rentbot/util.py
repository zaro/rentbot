# -*- coding: utf-8 -*-
import re

LOCATIONS = {
    'Sofia': 'София',
    'Bulgaria': 'България',
}

MONTHS = {
    u"декември": 'dec',
    u"ноември": "nov",
    u"октомври": "oct",
    u"септември": "sep",
    u"август": "aug",
    u"юли": "jul",
    u"юни": "jun",
    u"май": "may",
    u"април": "apr",
    u"март": "mar",
    u"февруари": "feb",
    u"януари": "jan",
}


def normalizeLocationName(loc):
    loc = loc.strip()
    for l, cl in LOCATIONS.items():
        loc = loc.replace(l, cl)
    return loc


def normalizeMonths(timeText):
    for cm, em in MONTHS.items():
        timeText = timeText.replace(cm, em)
    return timeText


def normalizePrice(price):
    if not price:
        return None
    if price.upper().strip() == 'FREE':
        return None
    price = re.sub(r'\s+', ' ', price.strip())
    price = re.sub(r'(?!\d),(?=\d)', '', price)
    price = re.sub(r'€\s*(\d+)', '\\1 EUR', price)
    price = price.replace('€', 'EUR')
    price = re.sub(r'\$\s*(\d+)', '\\1 USD', price)
    price = re.sub(r'(\d+)\s*\$', '\\1 USD', price)
    price = price.replace('лв.', 'BGN')
    price = price.replace('лв', 'BGN')
    return price


def priceInEuro(price):
    if not price:
        return None
    BGN_FOR_EUR = 1.95583
    USD_FOR_EUR = 1.35
    if 'EUR' in price:
        amount = price.split(" ", 2)[0]
        return amount
    if 'BGN' in price:
        amount = price.split(" ", 2)[0]
        return str(round(float(amount) / BGN_FOR_EUR))
    if 'USD' in price:
        amount = price.split(" ", 2)[0]
        return str(round(float(amount) / USD_FOR_EUR))
    raise Exception('Invalid price:' + price)
