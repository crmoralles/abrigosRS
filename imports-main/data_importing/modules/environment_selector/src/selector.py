import ipywidgets as widgets
from IPython.display import display
import os
from dotenv import load_dotenv, set_key, dotenv_values


def environment_selector():
    base_path = os.getenv("SOSRS_BASEPATH")
    if not base_path:
        raise EnvironmentError("SOSRS_BASEPATH environment variable is not set.")

    selector = widgets.Dropdown(
        options=["development", "production", "Selecione um ambiente"],
        value="Selecione um ambiente",
        description="Environment: ",
    )

    def on_change(change):
        if change["type"] == "change" and change["name"] == "value":
            environment = change["new"]
            if environment == "production":
                dotenv_path = os.path.join(base_path, ".env.production")
            elif environment == "development":
                dotenv_path = os.path.join(base_path, ".env.development")
            else:
                dotenv_path = ""

            if os.path.exists(dotenv_path):
                load_dotenv(dotenv_path, override=True)
                print(f"Basepath: {base_path}")
                print(f"env file: {dotenv_path}")

                message = f"Environment changed to {environment}. Variables loaded from {dotenv_path}"
            else:
                message = f"Failed to load .env file from {dotenv_path}"

            if environment == "Selecione um ambiente":
                message = "No environment selected."

            print(message)

    selector.observe(on_change)
    display(selector)
