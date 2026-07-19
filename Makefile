.PHONY: help install dev-up dev-down dev-logs test lint format clean docker-build docker-up docker-down

help:
	@echo "OpenBMC Firmware Research Platform - Development Commands"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  install         Install dependencies"
	@echo "  dev-up          Start development environment"
	@echo "  dev-down        Stop development environment"
	@echo "  dev-logs        View development logs"
	@echo "  test            Run test suite"
	@echo "  lint            Run code linter"
	@echo "  format          Format code"
	@echo "  clean           Clean build artifacts"
	@echo "  docker-build    Build Docker images"
	@echo "  docker-up       Start Docker containers"
	@echo "  docker-down     Stop Docker containers"
	@echo "  backend-install Install backend dependencies"
	@echo "  frontend-install Install frontend dependencies"
	@echo ""

install: backend-install frontend-install
	@echo "Dependencies installed successfully"

backend-install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	frontend-install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev-up:
	@echo "Starting development environment..."
	docker-compose -f docker/docker-compose.yml up -d
	@echo "Development environment started"
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "API Docs: http://localhost:8000/docs"

dev-down:
	@echo "Stopping development environment..."
	docker-compose -f docker/docker-compose.yml down
	@echo "Development environment stopped"

dev-logs:
	docker-compose -f docker/docker-compose.yml logs -f

test:
	@echo "Running test suite..."
	cd backend && pytest tests/ -v --cov=app --cov-report=html
	@echo "Test coverage report: backend/htmlcov/index.html"

lint:
	@echo "Running linter..."
	cd backend && pylint app/
	cd frontend && npm run lint

format:
	@echo "Formatting code..."
	cd backend && black app/ tests/
	cd backend && isort app/ tests/
	cd frontend && npm run format

clean:
	@echo "Cleaning build artifacts..."
	rm -rf backend/build backend/dist backend/*.egg-info
	rm -rf backend/__pycache__ backend/.pytest_cache backend/.coverage
	rm -rf frontend/build frontend/dist frontend/node_modules
	rm -rf frontend/.next
	@echo "Cleaned successfully"

docker-build:
	@echo "Building Docker images..."
	docker-compose -f docker/docker-compose.yml build
	@echo "Docker images built successfully"

docker-up:
	@echo "Starting Docker containers..."
	docker-compose -f docker/docker-compose.yml up -d
	@echo "Docker containers started"

do-down:
	@echo "Stopping Docker containers..."
	docker-compose -f docker/docker-compose.yml down
	@echo "Docker containers stopped"

.DEFAULT_GOAL := help