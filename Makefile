SYSTEM_PYTHON := python3.12
VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python

ML_SERVICE_DIR := services/ml-api
ML_IMAGE_NAME := housing-price-api

PORTAL_DIR := apps/portal

PROPERTY_SERVICE_DIR := services/property-api

.PHONY: venv ml-install ml-train ml-run ml-docker-build ml-docker-run portal-install portal-run portal-build portal-lint property-install property-run

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
