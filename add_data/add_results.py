import csv
import os
import requests

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'stream_marks2.csv')

with open(my_file, 'r') as f:
    reader = csv.DictReader(f, delimiter=';')

    for r in reader:
        requests.post('http://localhost:1234/add-result', json=r)
        print(r)
