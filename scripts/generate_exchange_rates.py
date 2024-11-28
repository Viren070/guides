#!/usr/bin/env python3

import argparse
import json
import logging
import requests
import os
import sys
import time

LOG_FORMAT = "[%(asctime)s] [%(levelname)s]: %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

API_KEY = os.getenv("EXCHANGE_RATE_API_KEY")
API_URL = 'https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{currency}'

CURRENCIES_TO_FETCH = ["USD", "EUR"]

logging.basicConfig(level=logging.INFO, format=LOG_FORMAT, datefmt=DATE_FORMAT)


def parse_args() -> argparse.Namespace:
    """Parse the arguments passed to the script

    Returns:
        argparse.Namespace: Object containing output_file, input_file and fields arguments
    """
    parser = argparse.ArgumentParser(description="Reduce the size of the titleDB JSON file by removing entries without a name and only keeping the specified fields.")
    parser.add_argument("-o", "--output_file", type=str, required=True, help="Path to the output file")
    return parser.parse_args()


def write_to_file(output_file: str, new_data: dict) -> None:
    """Write a dictionary to a file as JSON

    Args:
        output_file (str): path to the file to write to
        new_data (dict): data to write to the file
    """
    try:
        # write the new data to the output_file file
        logging.info(f"Writing data to {os.path.abspath(output_file)}")
        with open(output_file, "w") as f:
            json.dump(new_data, f, separators=(",", ":"))  # use separators to remove whitespaces
    except Exception as e:
        # if there is an error writing to the output_file file, log an error and exit
        logging.error(f"Error writing to {output_file}. {e}")
        sys.exit(1)


def fetch_currency_rates(currency):
    """Fetch the currency rates from the API

    Args:
        currency (str): The currency to fetch the rates for

    Returns:
        dict: The currency rates
    """
    try:
        logging.info(f"Fetching currency rates for {currency}")
        response = requests.get(API_URL.format(API_KEY=API_KEY, currency=currency))
        response.raise_for_status()
        data = response.json()
        if data["result"] != "success":
            logging.error(f"Failed to fetch currency rates for {currency}. {data["error-type"]}")
            sys.exit(1)
        logging.info(f"Fetched currency rates for {currency} last updated at: {data["time_last_update_utc"]}")
        logging.info(f"Conversion rates: {data["conversion_rates"]}")
        return data["conversion_rates"]
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch currency rates for {currency}. {e}")
        sys.exit(1)



if __name__ == "__main__":
    start_time = time.perf_counter()

    # parse the arguments
    args = parse_args()

    output_file = args.output_file

    currency_rates = {}
    for currency in CURRENCIES_TO_FETCH:
        currency_rates[currency] = fetch_currency_rates(currency)

    write_to_file(output_file, currency_rates)
