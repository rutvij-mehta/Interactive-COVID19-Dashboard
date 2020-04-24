from flask import Flask, render_template, jsonify, request
import visualize as vis
from visualize import visualize
import json
import pandas as pd
import matplotlib.pyplot as plt
import sklearn.cluster

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

# write urls for GET, POST data for the front end

if __name__ == '__main__':

    filename = r"C:\Users\rutvi\Desktop\Visualization_HW2\data\train_clean.csv"
    v = visualize(filename)
    
    app.run(debug=True, use_reloader=False)