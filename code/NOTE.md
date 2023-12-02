# How to Initialize a New Microservice

## 0. Make sure you have `poetry` installed

```bash
poetry --version
```

If you don't have it ready. Get yours [here](https://python-poetry.org/docs/#installation).

## 1. Create a new directory for the microservice

```bash
mkdir <microservice-name>
```

## 2. `cd` into the new directory

```bash
cd <microservice-name>
```

## 3. Initialize Poetry in the new directory and follow the instructions

```bash
poetry init
```

## 4. Install the virtual environment for the new microservice

```bash
poetry install --no-root
```

## 5. Find your freshly baked virtual environment

```bash
poetry env list --full-path  # to get the Path to the virtual environment (useful for VSCode)
# or
poetry env info -e  # get the Path to the interpreter (useful for PyCharm)
```

## 6. Activate the virtual environment

```bash
poetry shell
```

## 7. Add dependencies

```bash
poetry add <dependency-name>  # add a application dependency
# or 
poetry add --group dev <dependency-name>  # add a development dependency
```