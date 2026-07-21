PYTHON := .venv/bin/python

.PHONY: install train run

install:
	$(PYTHON) -m pip install -r requirements.txt

train:
	$(PYTHON) train_model.py

run:
	$(PYTHON) -m uvicorn app.main:app --reload
