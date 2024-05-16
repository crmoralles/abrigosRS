# Define the execution policy for this session
Set-ExecutionPolicy RemoteSigned -Scope Process

# Capture the directory from which the script is executed
$rootPath = Get-Location

# Variables for environment and requirements file
$envName = ".venv.abrigosrs"
$envPath = "$rootPath\$envName"
$requirementsPath = "$rootPath\requirements.txt"
$libDir = "$rootPath\modules"

# Check if the virtual environment already exists
if (Test-Path $envPath) {
    Write-Host "The virtual environment already exists."
}
else {
    Write-Host "Creating the virtual environment..."
    & python -m venv $envPath
}

# Function to activate the virtual environment and install requirements
Function Activate-Environment {
    Write-Host "Activating the virtual environment..."
    $env:Path = "$envPath\Scripts;" + $env:Path
    $env:VIRTUAL_ENV = $envPath
    [Environment]::SetEnvironmentVariable("PYTHONHOME", $null, "User")

    Write-Host "Virtual environment '$envName' is now active."

    # Install packages from requirements.txt if the file exists
    Write-Host "Path to requirements.txt: $requirementsPath"
    if (Test-Path $requirementsPath) {
        Write-Host "Installing dependencies from $requirementsPath"
        & "$envPath\Scripts\pip.exe" install -r $requirementsPath
    }
    else {
        Write-Host "No requirements.txt file found at $requirementsPath"
    }

    # Install the virtual environment as a kernel for Jupyter
    $kernelDir = "$env:APPDATA\jupyter\kernels"

    # Check if the kernel is already installed
    if (Test-Path "$kernelDir\$envName") {
        Write-Output "The kernel '$envName' is already installed."
    }
    else {
        Write-Output "The kernel '$envName' is not installed. Installing..."
        & python -m ipykernel install --user --name=$envName --display-name="Python ($envName)"
    }
}

# Invoke the function to activate environment and install requirements
Activate-Environment

# Install the local modules
Get-ChildItem -Path $libDir -Filter 'setup.py' -Recurse | ForEach-Object {
    Push-Location $_.DirectoryName
    Write-Host "Installing module in $_.DirectoryName"
    $scriptPath = Join-Path -Path $envPath -ChildPath "Scripts\pip.exe"
    & $scriptPath install -e .  
    Pop-Location
}


Write-Host "Activated environment: '$env:VIRTUAL_ENV'"
Write-Host "Environment setup and package installation complete."
