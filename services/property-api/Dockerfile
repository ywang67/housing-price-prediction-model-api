FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY services/property-api/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY services/property-api/app ./app

RUN addgroup --system app && adduser --system --ingroup app app && chown -R app:app /app

ENV ML_API_URL=http://ml-api:8000

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8001/health').read()" || exit 1

USER app

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
