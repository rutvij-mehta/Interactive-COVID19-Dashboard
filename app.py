import json
from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
import numpy as np
import requests as rs
import pickle
from datetime import datetime
import seaborn as sns

app = Flask(__name__)


@app.route("/", methods=['POST', 'GET'])
def index():
    return render_template("index.html")


@app.route("/data", methods=['POST', 'GET'])
def data():
    return jsonify({'dataframe_world': COVID_world, 'dataframe_US': COVID_19_data_US, 'map': map_polygon, 'us': us, 'timeseries': COVID_19_time_series, 'dates': dates})


def get_map_data():
    with open('map.json') as f:
        map_polygon = json.load(f)

    with open('us-states.json') as f:
        us = json.load(f)
    return map_polygon, us


def get_county():
    data = []
    try:
        data = rs.get('https://covid19-us-api.herokuapp.com/county').json()
    except:
        print('Error')
    print(data)


def get_COVID_world_data():
    d = []
    try:
        d = rs.get(
            'https://api.covid19api.com/summary').json()['Countries']
    except:
        print('Data Not found')
    COVID_world = pd.json_normalize(d)
    COVID_world["Country Code"] = COVID_world["Country"].apply(
        lambda x: sample_dic[x] if x in sample_dic else "No Code")
    Countries = COVID_world['Country']
    temp = COVID_world
    COVID_world = COVID_world.drop(
        columns='CountryCode').to_json(orient='records')
    temp.drop(columns=['Slug', 'Date', 'CountryCode'], inplace=True)

    return COVID_world, Countries, temp


def get_US_data():
    d = []
    try:
        d = rs.get(
            'https://finnhub.io/api/v1/covid19/us?token=bqgepu7rh5rfe17ncedg').json()
    except:
        print(
            rs.get('https://finnhub.io/api/v1/covid19/us?token=bqgepu7rh5rfe17ncedg').text)

    return d


def get_time_series():
    d = []
    d = rs.get(
        'https://pomber.github.io/covid19/timeseries.json').json()
    countries = list(d.keys())
    dates = pd.json_normalize(d[countries[0]])[
        'date']
    dates = dates.to_json(orient='split')
    COVID_19_time_series, mapping = preprocessing(d, countries)
    return COVID_19_time_series, dates, mapping


def preprocessing(COVID_19_time_series, countries):
    with open('sampledic.pickle', 'rb') as f:
        sample_dic = pickle.load(f)
    mapping = {a: sample_dic[a] for a in countries if a in sample_dic}
    mapping['US'] = 'USA'
    mapping['South Sudan'] = 'SDN'
    mapping['Taiwan*'] = 'TWN'
    mapping['Russia'] = 'RUS'
    mapping['Holy See'] = 'VAT'
    mapping['Syria'] = 'SYR'
    mapping['Iran'] = 'IRN'
    mapping['Venezuela'] = 'VEN'
    mapping['Tanzania'] = 'TZA'
    mapping['West Bank and Gaza'] = 'PSE'
    mapping['Burma'] = 'MMR'
    mapping["Cote d'Ivoire"] = 'CIV'
    mapping['Korea, South'] = 'KOR'
    mapping['Cabo Verde'] = 'CPV'
    mapping['Brunei'] = 'BRN'
    mapping['North Macedonia'] = 'MKD'
    mapping['Czechia'] = 'CZE'
    mapping['Saint Vincent and the Grenadines'] = 'VCT'
    mapping['Vietnam'] = 'VNM'
    mapping['Laos'] = 'LAO'
    mapping['Kosovo'] = 'XK'
    mapping['Eswatini'] = 'SWZ'
    mapping['United States'] = 'USA'
    mapping['Congo'] = 'COD'
    mapping['DR Congo'] = 'COG'
    mapping['South Korea'] = 'KOR'
    mapping['North Korea'] = 'PRK'
    mapping['Taiwan'] = 'TWN'
    mapping['Czech Republic (Czechia)'] = 'CZE'
    mapping['State of Palestine'] = 'PSE'
    mapping['Hong Kong'] = 'HKG'
    mapping['Macao'] = 'MAC'
    mapping['Micronesia'] = 'FSM'
    mapping['St. Vincent & Grenadines'] = 'VCT'
    mapping['Sao Tome & Principe'] = 'STP'
    mapping['Sint Maarten'] = 'MAF'
    mapping['Saint Martin'] = 'MAF'
    mapping['Saint Kitts & Nevis'] = 'KNA'
    mapping['Saint Barthelemy'] = 'BLM'
    mapping['U.S. Virgin Islands'] = 'VIR'
    mapping['Turks and Caicos'] = 'TCA'
    mapping['Wallis & Futuna'] = 'WLF'
    mapping['Falkland Islands'] = 'FLK'
    mapping['Faeroe Islands'] = 'FRO'
    mapping['Saint Pierre & Miquelon'] = 'SPM'

    conts = set(COVID_19_time_series)-set(mapping)

    for c in COVID_19_time_series:
        if c in mapping:
            COVID_19_time_series[c].append({'CountryCode': mapping[c]})
    COVID_19_time_series.pop('Diamond Princess')
    COVID_19_time_series.pop('MS Zaandam')
    return COVID_19_time_series, mapping


if __name__ == "__main__":
    with open('sampledic.pickle', 'rb') as f:
        sample_dic = pickle.load(f)

    COVID_19_data_US = get_US_data()
    COVID_world, Countries, temp = get_COVID_world_data()
    COVID_19_time_series, dates, mapping = get_time_series()
    population = pd.read_csv('pop.csv')
    population = population.rename(
        {'Country (or dependency)': 'Country', 'Population (2020)': 'Population'}, axis='columns')
    combined_mapping = {**mapping, **sample_dic}
    population["Country Code"] = population["Country"].apply(
        lambda x: combined_mapping[x] if x in combined_mapping else None)

    cases_map = temp[['Country Code', 'TotalConfirmed']]
    death_map = temp[['Country Code', 'TotalDeaths']]
    recovered_map = temp[['Country Code', 'TotalRecovered']]
    cases_map = pd.Series(cases_map['TotalConfirmed'].values,
                          index=cases_map['Country Code']).to_dict()

    death_map = pd.Series(death_map['TotalDeaths'].values,
                          index=death_map['Country Code']).to_dict()
    recovered_map = pd.Series(recovered_map['TotalRecovered'].values,
                              index=recovered_map['Country Code']).to_dict()

    population["Cases"] = population["Country Code"].apply(
        lambda x: cases_map[x] if x in cases_map else None)

    population["Recovered"] = population["Country Code"].apply(
        lambda x: recovered_map[x] if x in recovered_map else None)

    population["Deaths"] = population["Country Code"].apply(
        lambda x: death_map[x] if x in death_map else None)
    population = population.dropna(
        subset=['Country Code', 'Cases', 'Recovered', 'Deaths'])

    map_polygon, us = get_map_data()
    app.run(debug=True)
