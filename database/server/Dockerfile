FROM python:3.9
WORKDIR /server
COPY server.py .
RUN pip install mysql-connector-python fastapi uvicorn
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
