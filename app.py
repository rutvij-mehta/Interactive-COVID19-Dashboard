import json
from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
import numpy as np
import requests as rs
import pickle

app = Flask(__name__)


@app.route("/", methods=['POST', 'GET'])
def index():
    return render_template("index.html")


@app.route("/data", methods=['POST', 'GET'])
def data():
    return jsonify({'dataframe_world': COVID_world, 'dataframe_US': COVID_19_data_US, 'map': map_polygon})


if __name__ == "__main__":
    COVID_19_data_US = []
    COVID_19_data_world_summary = []
    try:
        COVID_19_data_US = rs.get(
            'https://finnhub.io/api/v1/covid19/us?token=bqgepu7rh5rfe17ncedg').json()
        COVID_19_data_world_summary = rs.get(
            'https://api.covid19api.com/summary').json()['Countries']
    except:
        print(
            rs.get('https://finnhub.io/api/v1/covid19/us?token=bqgepu7rh5rfe17ncedg').text)
    with open('map.json') as f:
        map_polygon = json.load(f)
    with open('sampledic.pickle', 'rb') as f:
        sample_dic = pickle.load(f)
    COVID_world = pd.json_normalize(COVID_19_data_world_summary)
    COVID_world["Country Code"] = COVID_world["Country"].apply(
        lambda x: sample_dic[x] if x in sample_dic else "No Code")
    COVID_world = COVID_world.drop(
        columns='CountryCode').to_json(orient='records')
    app.run(debug=True)
