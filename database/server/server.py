import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD") or os.getenv("MYSQL_PASSWORD"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        host=os.getenv("MYSQL_HOST")
    )

@app.on_event("startup")
async def startup_event():
    # Insert admin user if not exists
    admin_email = os.getenv("ADMIN_EMAIL", "loise.fenoll@ynov.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "PvdrTAzTeR247sDnAZBr")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM utilisateurs WHERE email = %s", (admin_email,))
        admin = cursor.fetchone()
        if not admin:
            sql = """
            INSERT INTO utilisateurs (prenom, nom, email, date_naissance, ville, code_postal, password, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            val = ("Admin", "System", admin_email, "1990-01-01", "Paris", "75000", admin_password, "admin")
            cursor.execute(sql, val)
            conn.commit()
        conn.close()
    except Exception as e:
        print("Error initializing admin:", e)

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    birthdate: str
    city: str
    zipcode: str

class LoginRequest(BaseModel):
    pseudo: str
    password: str

@app.post("/login")
async def login(req: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateurs WHERE email = %s AND password = %s", (req.pseudo, req.password))
    user = cursor.fetchone()
    conn.close()
    if user:
        return {"role": user["role"]}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/users")
async def create_user(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
    INSERT INTO utilisateurs (prenom, nom, email, date_naissance, ville, code_postal, role)
    VALUES (%s, %s, %s, %s, %s, %s, 'casu')
    """
    val = (user.firstName, user.lastName, user.email, user.birthdate, user.city, user.zipcode)
    try:
        cursor.execute(sql, val)
        conn.commit()
    except mysql.connector.Error as err:
        conn.close()
        raise HTTPException(status_code=400, detail=str(err))
    
    user_id = cursor.lastrowid
    conn.close()
    return {"id": user_id, "message": "User created successfully"}

@app.get("/users")
async def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateurs")
    records = cursor.fetchall()
    conn.close()
    return {"utilisateurs": records}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM utilisateurs WHERE id = %s", (user_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
