#!/bin/bash

# Define a execução padrão para o script
set -e

# Captura o diretório a partir do qual o script é executado
rootPath=$(pwd)

# Variáveis para o ambiente e o arquivo de requisitos
envName=".venv.abrigosrs"
envPath="$rootPath/$envName"
requirementsPath="$rootPath/requirements.txt"
libDir="$rootPath/modules"

# Verifica se o ambiente virtual já existe
if [ -d "$envPath" ]; then
    echo "The virtual environment already exists."
else
    echo "Creating the virtual environment..."

    # Tenta criar o ambiente e captura erro se falhar
    if ! python3 -m venv $envPath; then
        echo "Falha ao criar o ambiente virtual. Por favor, instale o pacote python3-venv. Para Ubuntu/Debian, use: sudo apt-get update && sudo apt-get install python3-venv"
        exit 1
    fi
fi

# Função para ativar o ambiente virtual e instalar os requisitos
activate_environment() {
    echo "Activating the virtual environment..."

    # Detecta o shell usado e ativa o ambiente virtual de acordo
    if [[ $SHELL == *zsh ]]; then
        # Zsh
        source $envPath/bin/activate
    elif [[ $SHELL == *bash ]]; then
        # Bash
        source $envPath/bin/activate
    elif [[ $SHELL == *fish ]]; then
        # Fish
        source $envPath/bin/activate.fish
    elif [[ $SHELL == *csh ]]; then
        # Csh ou Tcsh
        source $envPath/bin/activate.csh
    else
        echo "Shell não suportado. Por favor, ative o ambiente manualmente."
        exit 1
    fi
    echo "Virtual environment '$envName' is now active."

    # Instala pacotes do requirements.txt se o arquivo existir
    echo "Path to requirements.txt: $requirementsPath"
    if [ -f "$requirementsPath" ]; then
        echo "Installing dependencies from $requirementsPath"
        pip install -r $requirementsPath
    else
        echo "No requirements.txt file found at $requirementsPath"
    fi

    # Instala o ambiente virtual como um kernel para o Jupyter
    kernelDir="$HOME/.local/share/jupyter/kernels"

    # Verifica se o kernel já está instalado
    if [ -d "$kernelDir/$envName" ]; then
        echo "The kernel '$envName' is already installed."
    else
        echo "The kernel '$envName' is not installed. Installing..."
        python3 -m ipykernel install --user --name=$envName --display-name="Python ($envName)"
    fi
}

# Invoca a função para ativar o ambiente e instalar os requisitos
activate_environment

# Instala os módulos locais
find $libDir -name 'setup.py' | while read setupFile; do
    dir=$(dirname "$setupFile")
    echo "Installing module in $dir"
    pushd $dir
    pip install -e .
    popd
done

# Verifica se a extensão runtools está habilitada
extensionCheck=$(jupyter nbextension list | grep 'runtools/main')
if [ "$extensionCheck" ]; then
    echo "Extensão runtools está habilitada."
else
    echo "Extensão runtools não está habilitada."
fi

echo "Activated environment: '$VIRTUAL_ENV'"
echo "Environment setup and package installation complete."
