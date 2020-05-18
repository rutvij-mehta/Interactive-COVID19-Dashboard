import json
from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
import numpy as np
import requests as rs
import pickle
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns


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

    date1 = '1/22/2020'
    date2 = '3/1/2020'
    weather = pd.read_csv('weather.csv')
    start = datetime.strptime(date1, '%m/%d/%Y')
    end = datetime.strptime(date2, '%m/%d/%Y')
    step = timedelta(days=1)
    dates = []
    while start <= end:
        dates.append(str(start.date().strftime('%-m/%-d/%Y'))[:-2])
        start += step

    pre_covid = weather[['Country/Region',
                         'weather_param']+dates].sum(axis=1)/len(dates)
    post_covid = weather[list(set(list(weather))-set(dates))
                         ].sum(axis=1)/len(list(set(list(weather))-set(dates)))
    weather1 = weather[['Country/Region',
                        'weather_param']]
    weather1['pre_covid'] = pre_covid
    weather1['post_covid'] = post_covid
    weather1["Country Code"] = weather1["Country/Region"].apply(
        lambda x: combined_mapping[x] if x in combined_mapping else None)
    maxtemp = weather1[weather1['weather_param'] ==
                       'maxtempC'][['Country Code', 'pre_covid', 'post_covid']]
    mintemp = weather1[weather1['weather_param'] ==
                       'mintempC'][['Country Code', 'pre_covid', 'post_covid']]
    humidity = weather1[weather1['weather_param'] == 'humidity'][[
        'Country Code', 'pre_covid', 'post_covid']]
    max_temp_pre_covid = pd.Series(
        maxtemp['pre_covid'].values, index=maxtemp['Country Code']).to_dict()
    min_temp_pre_covid = pd.Series(
        mintemp['pre_covid'].values, index=mintemp['Country Code']).to_dict()
    humidity_pre_covid = pd.Series(
        humidity['pre_covid'].values, index=humidity['Country Code']).to_dict()
    max_temp_post_covid = pd.Series(
        maxtemp['post_covid'].values, index=maxtemp['Country Code']).to_dict()
    min_temp_post_covid = pd.Series(
        mintemp['post_covid'].values, index=mintemp['Country Code']).to_dict()
    humidity_post_covid = pd.Series(
        humidity['post_covid'].values, index=humidity['Country Code']).to_dict()
    population['max_temp_pre_covid'] = population['Country Code'].apply(
        lambda x: max_temp_pre_covid[x] if x in max_temp_post_covid else None)
    population['min_temp_pre_covid'] = population['Country Code'].apply(
        lambda x: min_temp_pre_covid[x] if x in max_temp_post_covid else None)
    population['humidity_pre_covid'] = population['Country Code'].apply(
        lambda x: min_temp_pre_covid[x] if x in max_temp_post_covid else None)
    population['max_temp_post_covid'] = population['Country Code'].apply(
        lambda x: max_temp_post_covid[x] if x in max_temp_post_covid else None)
    population['min_temp_post_covid'] = population['Country Code'].apply(
        lambda x: min_temp_post_covid[x] if x in max_temp_post_covid else None)
    population['humidity_post_covid'] = population['Country Code'].apply(
        lambda x: min_temp_post_covid[x] if x in max_temp_post_covid else None)
    population.dropna(inplace=True)
