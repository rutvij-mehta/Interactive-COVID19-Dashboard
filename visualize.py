import pandas as pd
import sklearn.cluster
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import pairwise_distances
from sklearn import preprocessing
import matplotlib.pyplot as plt

class visualize():

    def __init__(self, filename):
        self.data = pd.read_csv(filename, usecols = ['LotFrontage', 'YearBuilt', 'BsmtFinSF1', 'BsmtUnfSF', 'GrLivArea', 'BsmtFullBath',
            'GarageYrBlt', 'GarageCars', 'GarageArea', 'EnclosedPorch', 
            'OverallQual', 'OverallCond','MSZoning', 'HouseStyle', 'Foundation', 'SaleType', 'SaleCondition'])

    def getData(self):
        return self.data

    def getChoroplethData():
        pass
    
    # write methods to return the required data
