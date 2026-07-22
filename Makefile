SYSTEM_PYTHON := python3.12
VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python

ML_SERVICE_DIR := services/ml-api
ML_IMAGE_NAME := housing-price-api

PORTAL_DIR := apps/portal

PROPERTY_SERVICE_DIR := services/property-api

MARKET_SERVICE_DIR := services/market-api

MARKET_IMAGE_NAME := property-market-api

.PHONY: venv ml-install ml-train ml-run ml-docker-build ml-docker-run portal-install portal-run portal-build portal-lint property-install property-run market-compile market-run market-docker-build market-docker-run compose-up compose-down

venv: $(PYTHON)

$(PYTHON):
	$(SYSTEM_PYTHON) -m venv $(VENV_DIR)

ml-install: $(PYTHON)
	$(PYTHON) -m pip install -r $(ML_SERVICE_DIR)/requirements.txt

ml-train: $(PYTHON)
	$(PYTHON) $(ML_SERVICE_DIR)/train_model.py

ml-run: $(PYTHON)
	$(PYTHON) -m uvicorn app.main:app \
		--app-dir $(ML_SERVICE_DIR) \
		--reload

# Docker Desktop or OrbStack must be running for these targets.
ml-docker-build:
	docker build \
		-f $(ML_SERVICE_DIR)/Dockerfile \
		-t $(ML_IMAGE_NAME) \
		.

ml-docker-run:
	docker run --rm -p 8000:8000 $(ML_IMAGE_NAME)

# Portal app targets
portal-install:
	npm --prefix $(PORTAL_DIR) install

portal-run:
	npm --prefix $(PORTAL_DIR) run dev

portal-build:
	npm --prefix $(PORTAL_DIR) run build

portal-lint:
	npm --prefix $(PORTAL_DIR) run lint

# property-api targets
property-install: $(PYTHON)
	$(PYTHON) -m pip install -r $(PROPERTY_SERVICE_DIR)/requirements.txt

property-run: $(PYTHON)
	$(PYTHON) -m uvicorn app.main:app \
		--app-dir $(PROPERTY_SERVICE_DIR) \
		--reload \
		--port 8001

# market-api targets
market-compile:
	mvn -f $(MARKET_SERVICE_DIR)/pom.xml clean compile

market-run:
	mvn -f $(MARKET_SERVICE_DIR)/pom.xml spring-boot:run

# market-analysis docker build
market-docker-build:
	docker build \
		-f $(MARKET_SERVICE_DIR)/Dockerfile \
		-t $(MARKET_IMAGE_NAME) \
		.

market-docker-run:
	docker run --rm \
		-p 8002:8002 \
		-e ML_API_URL=http://host.docker.internal:8000 \
		$(MARKET_IMAGE_NAME)

compose-up:
	docker compose up --build

compose-down:
	docker compose down
