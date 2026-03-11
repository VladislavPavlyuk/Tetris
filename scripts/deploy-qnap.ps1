# Deploy Tetris to QNAP NAS (TS-233) at http://192.168.0.213:9090/
# Requires: Docker Desktop with buildx (for arm64), OpenSSH (scp/ssh)
# On QNAP: enable SSH in Control Panel -> Terminal & SNMP

param(
    [string]$NasHost = "192.168.0.213",
    [string]$NasUser = "admin",
    [string]$NasPath = "/share/CACHEDEV1_DATA/Public/tetris",
    [switch]$BuildOnly,
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$ImageTag = "tetris-app:latest"
$TarName = "tetris-app.tar"
$TarPath = Join-Path $ProjectRoot $TarName

# Build Docker image for QNAP (ARM64)
function Build-Image {
    Write-Host "Building Docker image for linux/arm64..."
    docker buildx build --platform linux/arm64 -t $ImageTag --load .
    if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }
}

# Save image to tar
function Save-Tar {
    if (Test-Path $TarPath) { Remove-Item $TarPath -Force }
    Write-Host "Saving image to $TarName..."
    docker save $ImageTag -o $TarPath
    if ($LASTEXITCODE -ne 0) { throw "Docker save failed" }
    $size = (Get-Item $TarPath).Length / 1MB
    Write-Host "Created $TarName ($([math]::Round($size, 1)) MB)"
}

# Copy to NAS and load + start
function Deploy-ToNas {
    $remoteDir = $NasPath.TrimEnd("/")
    Write-Host "Creating $remoteDir on NAS..."
    ssh "${NasUser}@${NasHost}" "mkdir -p $remoteDir"
    Write-Host "Copying $TarName and docker-compose.nas.yml..."
    scp $TarPath "${NasUser}@${NasHost}:${remoteDir}/"
    scp (Join-Path $ProjectRoot "docker-compose.nas.yml") "${NasUser}@${NasHost}:${remoteDir}/"
    Write-Host "Loading image and starting containers on NAS..."
    ssh "${NasUser}@${NasHost}" "cd $remoteDir && docker load -i $TarName && docker compose -f docker-compose.nas.yml up -d"
    Write-Host "Done. App: http://${NasHost}:9090/"
}

if ($BuildOnly) {
    Build-Image
    Save-Tar
    Write-Host "Build complete. Copy $TarName and docker-compose.nas.yml to NAS and run:"
    Write-Host "  docker load -i $TarName"
    Write-Host "  docker compose -f docker-compose.nas.yml up -d"
    exit 0
}

if (-not $SkipBuild) {
    Build-Image
    Save-Tar
}

Deploy-ToNas
