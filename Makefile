PYTHON := .venv/bin/python
IMAGE_NAME := housing-price-api

.PHONY: install train run docker-build docker-run

install:
	$(PYTHON) -m pip install -r requirements.txt

train:
	$(PYTHON) train_model.py

run:
	$(PYTHON) -m uvicorn app.main:app --reload

# make sure docker desktop or orbstack is running before executing the following commands
docker-build:
	docker build -t $(IMAGE_NAME) .

docker-run:
	docker run --rm -p 8000:8000 $(IMAGE_NAME)
