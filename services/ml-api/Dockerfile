FROM python:3.12.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /workspace

COPY services/ml-api/requirements.txt ./services/ml-api/requirements.txt
RUN python -m pip install --no-cache-dir -r services/ml-api/requirements.txt

COPY services/ml-api/train_model.py ./services/ml-api/train_model.py
COPY data ./data

RUN python services/ml-api/train_model.py

COPY services/ml-api/app ./services/ml-api/app

WORKDIR /workspace/services/ml-api

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]