from flask import Flask, request, jsonify, render_template, make_response, redirect, url_for
import sys, json, os

app = Flask(__name__) 

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/userdashboard")
def userdashboard():
    return render_template('userdashboard.html')

@app.route("/coachdashboard")
def coachdashboard():
    return render_template('coachdashboard.html')

@app.route('/api/users')
def returnUsers(): 
    
    #JSON file path 
    json_url = "data/data.json"

    with open(json_url, "r") as file:
        json_object = json.load(file)

    response = make_response(
        json_object,
        200,
    )
    response.headers["Content-Type"] = "application/json"

    return response

@app.route('/user-dashboard', methods=['GET'])
def userDashboard(): 
    #Doesn't actually need to return this template, this is done with the other route
    #in the login.js file, and is done by assigning a new url to the path. 
    return render_template('userdashboard.html')

if __name__ == "__main__":
    app.run() 