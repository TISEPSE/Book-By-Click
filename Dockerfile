# =====================
# FRONT (dev)
# =====================
FROM node:20-alpine AS frontend
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


# =====================
# BACK (dev)
# =====================
FROM python:3.11-slim AS backend
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY Backend/src /app/src
ENV PYTHONPATH=/app

EXPOSE 8000

# ⚠️ Si ton backend n'est pas FastAPI/uvicorn, remplace cette ligne par ta commande réelle.
CMD ["flask", "--app", "src.app:create_app", "run", "--host=0.0.0.0", "--port=5000"]