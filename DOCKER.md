# Docker Deployment Guide

## Overview

This guide explains how to build and run the Kojo Stack application using Docker.

## Files

- **Dockerfile**: Multi-stage build configuration for the Angular application
- **nginx.conf**: Nginx web server configuration for serving the SPA
- **docker-compose.yml**: Docker Compose configuration for local development/testing
- **.dockerignore**: Files/folders excluded from Docker build context

## Building the Docker Image

### Using Docker CLI

```bash
# Build the image
docker build -t kojo-stack:latest .

# Build with custom tag
docker build -t kojo-stack:2026.1.0 .
```

### Using Docker Compose

```bash
# Build the image
docker-compose build

# Build without cache
docker-compose build --no-cache
```

## Running the Container

### Using Docker CLI

```bash
# Run with default settings (port 8080 → 80)
docker run -p 8080:80 kojo-stack:latest

# Run with custom port mapping
docker run -p 3000:80 kojo-stack:latest

# Run in detached mode
docker run -d -p 8080:80 --name kojo-app kojo-stack:latest

# Run with restart policy
docker run -d -p 8080:80 --restart unless-stopped kojo-stack:latest
```

### Using Docker Compose

```bash
# Start the application
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build
```

## Accessing the Application

After starting the container, access the application at:
- **Local**: http://localhost:8080
- **Custom port**: http://localhost:PORT (where PORT is your mapped port)

## Health Check

The application includes a built-in health check endpoint:

```bash
curl http://localhost:8080/health
# Returns: OK
```

## Docker Commands Reference

### Image Management

```bash
# List images
docker images | grep kojo-stack

# Remove image
docker rmi kojo-stack:latest

# Tag image
docker tag kojo-stack:latest kojo-stack:2026.1.0
```

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View container logs
docker logs container-id

# View logs in real-time
docker logs -f container-id

# Stop container
docker stop container-id

# Start container
docker start container-id

# Remove container
docker rm container-id

# View container stats
docker stats container-id
```

### Debugging

```bash
# Execute command in running container
docker exec -it container-id bash

# View detailed container info
docker inspect container-id

# View port mappings
docker port container-id
```

## Multi-Architecture Builds

To build images for multiple architectures (ARM64, AMD64):

```bash
# Enable buildx for multi-architecture builds
docker buildx create --name multi-arch

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t kojo-stack:latest .
```

## Environment Variables

Currently, the application runs with default settings. To add custom environment variables:

```bash
# Via docker run
docker run -e NODE_ENV=production -p 8080:80 kojo-stack:latest

# Via docker-compose (update docker-compose.yml environment section)
```

## Optimization Tips

### Reduce Image Size

The current image uses:
- **Node 20 Alpine** for building (smallest Node image available)
- **Nginx Alpine** for serving (minimal web server)
- Multi-stage build to exclude build dependencies from final image

Current estimated image size: ~50-80 MB

### Performance

- Gzip compression enabled for all text-based assets
- Browser caching enabled for static assets (1-year expiration)
- Security headers configured
- Health check configured

## Production Deployment

For production deployments, consider:

1. **Image Registry**: Push to Docker Hub, AWS ECR, or private registry
   ```bash
   docker tag kojo-stack:latest your-registry/kojo-stack:2026.1.0
   docker push your-registry/kojo-stack:2026.1.0
   ```

2. **Kubernetes**: Use with Kubernetes orchestration
   - Create Deployment, Service, and Ingress manifests
   - Configure resource limits and requests
   - Setup auto-scaling policies

3. **Docker Swarm**: Deploy as a service
   ```bash
   docker service create -p 80:80 --name kojo-stack kojo-stack:latest
   ```

4. **Reverse Proxy**: Use behind Nginx or Traefik
   - SSL/TLS termination
   - Load balancing
   - Request routing

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs container-id

# Verify image exists
docker images

# Rebuild image
docker build --no-cache -t kojo-stack:latest .
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 PID

# Use different port
docker run -p 9000:80 kojo-stack:latest
```

### Health Check Failing

```bash
# Check container status
docker ps

# View detailed logs
docker logs container-id

# Manually test endpoint
docker exec container-id wget http://localhost/health
```

## Security Considerations

The Dockerfile and Nginx configuration include:

- ✅ Non-root user execution (Nginx runs as unprivileged user)
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ Health check endpoint
- ✅ .dockerignore to reduce attack surface
- ✅ Minimal base images (Alpine Linux)

For additional security:

1. Scan images for vulnerabilities
   ```bash
   docker scan kojo-stack:latest
   ```

2. Use private registry with authentication
3. Sign images with Docker Content Trust
4. Implement network policies in orchestration platform

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
