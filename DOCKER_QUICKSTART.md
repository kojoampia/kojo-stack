# Docker Quick Start Guide

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose 2.0+ (optional but recommended)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone/navigate to project directory
cd kojo-stack

# Build and start the application
docker-compose up --build

# Open browser to http://localhost:4200
```

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t kojo-stack:latest .

# Run the container
docker run -d -p 8080:80 --name kojo-app kojo-stack:latest

# Open browser to http://localhost:8080

# View logs
docker logs -f kojo-app

# Stop the container
docker stop kojo-app
```

## Common Commands

```bash
# Rebuild without cache (useful if dependencies changed)
docker-compose up --build --no-cache

# Stop and remove all containers
docker-compose down

# View application logs
docker-compose logs -f

# Access container shell (for debugging)
docker exec -it kojo-stack-app /bin/sh

# Check container status
docker-compose ps
```

## Health Check

```bash
# Test if application is running
curl http://localhost:8080/health

# Expected response: OK
```

## Troubleshooting

### Application not accessible at localhost:8080

1. Check if container is running:
   ```bash
   docker-compose ps
   ```

2. Check logs for errors:
   ```bash
   docker-compose logs
   ```

3. Try different port:
   ```bash
   docker run -p 9000:80 kojo-stack:latest
   # Then access at http://localhost:9000
   ```

### Port 8080 already in use

```bash
# Option 1: Use different port in docker-compose.yml
# Edit the ports line: "9000:80"

# Option 2: Kill existing service
lsof -i :8080
kill -9 <PID>

# Option 3: Use Docker CLI with different port
docker run -p 9000:80 kojo-stack:latest
```

### Slow build time

```bash
# The first build takes ~2-3 minutes (installing node_modules)
# Subsequent builds are cached and much faster
# To force rebuild without cache:
docker-compose build --no-cache
```

## Additional Information

For detailed documentation, see [DOCKER.md](DOCKER.md)

## Support

For issues or questions:
1. Check [DOCKER.md](DOCKER.md) troubleshooting section
2. Review Docker logs: `docker-compose logs`
3. Verify Docker installation: `docker --version && docker-compose --version`
