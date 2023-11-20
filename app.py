from flask import Flask, request, jsonify, render_template, make_response, request
import sys, json, os

app = Flask(__name__) 
currentUserInfo = ""

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/signup')
def signup():
    return render_template('signup.html'); 

@app.route("/userdashboard")
def userdashboard():
    return render_template('userdashboard.html')

@app.route("/coachdashboard")
def coachdashboard():
    return render_template('coachdashboard.html')

@app.route("/fixturelist")
def fixturelist(): 
    return render_template('fixturelist.html')

@app.route('/resultslist')
def resultslist(): 
    return render_template('resultslist.html')

app.route('/trainingschedule')
def trainingschedule(): 
    return render_template('trainingschedule.html')

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

@app.route('/api/set-current-user', methods=['PUT'])
def setCurrentUser(): 
    print('setting current user') 
    
    messageOK = jsonify(message="Jokes Uploaded")
    messageFAIL = jsonify(message="Jokes Not Uploaded, issue in the API")

    if request.is_json:
        req = request.get_json()
        global currentUserInfo
        currentUserInfo = req
        print(currentUserInfo)

        return messageOK, 200
    else:
        return messageFAIL, 400

@app.route('/api/get-current-user')
def getCurrentUser(): 
    global currentUserInfo
    return jsonify(currentUserInfo)

if __name__ == "__main__":
    app.run() 