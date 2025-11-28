from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/login_form", methods=["POST"])
def login_Form():
    email = request.form.get("email")
    password = request.form.get("password")
    print(f"Email: {email}, Password: {password}", flush=True)
    return "OK"


if __name__ == "__main__":
    app.run(port=5000)
